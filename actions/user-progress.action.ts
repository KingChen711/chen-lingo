'use server'

import { POINTS_TO_REFILL } from '@/constants'
import db from '@/database/drizzle'
import { getCourseById, getUserProgress, getUserSubscription } from '@/database/queries'
import { challengeOptions, challengeProgresses, challenges, userProgresses } from '@/database/schema'
import { auth, currentUser } from '@clerk/nextjs'
import { and, eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export const upsertUserProgress = async (courseId: number) => {
  const { userId } = auth()
  const user = await currentUser()

  if (!userId || !user) {
    throw new Error('Unauthorized')
  }

  const course = await getCourseById(courseId)

  if (!course) {
    throw new Error('Course not found')
  }

  if (!course.units.length || !course.units[0].lessons.length) {
    throw new Error('Course is empty')
  }

  const existingUserProgress = await getUserProgress()

  if (existingUserProgress) {
    await db
      .update(userProgresses)
      .set({
        activeCourseId: courseId
      })
      .where(eq(userProgresses.userId, userId))
  } else {
    await db.insert(userProgresses).values({
      userId,
      activeCourseId: courseId,
      userName: `${user.firstName} ${user.lastName}` || userProgresses.userName.default,
      userImageSrc: user.imageUrl || userProgresses.userImageSrc.default
    })
  }

  revalidatePath('/courses')
  revalidatePath('/learn')
  redirect('/learn')
}

export const reduceHearts = async (challengeId: number) => {
  const userProgress = await getUserProgress()

  if (!userProgress) {
    throw new Error('Not found user progress')
  }

  const challenge = await db.query.challenges.findFirst({
    where: eq(challenges.id, challengeId)
  })

  if (!challenge) {
    throw new Error('Not found challenge')
  }

  const existingChallengeProgress = await db.query.challengeProgresses.findFirst({
    where: and(eq(challengeProgresses.challengeId, challengeId), eq(challengeProgresses.userId, userProgress.userId))
  })

  const isPractice = !!existingChallengeProgress
  const isPro = !!(await getUserSubscription())?.isActive

  if (isPractice) {
    return { error: 'practice' }
  }

  if (isPro) {
    return { error: 'subscription' }
  }

  if (userProgress.hearts <= 0) {
    return { error: 'hearts' }
  }

  await db
    .update(userProgresses)
    .set({
      hearts: Math.max(userProgress.hearts - 1, 0)
    })
    .where(eq(userProgresses.userId, userProgress.userId))

  revalidatePath('/shop')
  revalidatePath('/learn')
  revalidatePath('/quests')
  revalidatePath('/leader-board')
  revalidatePath(`/lesson/${challenge.lessonId}`)
}

export const refillHearts = async () => {
  const userProgress = await getUserProgress()

  if (!userProgress) {
    throw new Error('Not found user progress')
  }

  if (userProgress.hearts === 5) {
    throw new Error('Hearts are already full')
  }

  if (userProgress.points < POINTS_TO_REFILL) {
    throw new Error('Not enough points to refill')
  }

  await db
    .update(userProgresses)
    .set({
      hearts: 5,
      points: userProgress.points - POINTS_TO_REFILL
    })
    .where(eq(userProgresses.userId, userProgress.userId))

  revalidatePath('/shop')
  revalidatePath('/learn')
  revalidatePath('/quests')
  revalidatePath('/leader-board')
}
