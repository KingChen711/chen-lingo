'use server'

import db from '@/database/drizzle'
import { getUserProgress } from '@/database/queries'
import { challengeProgresses, challenges, userProgresses } from '@/database/schema'
import { auth } from '@clerk/nextjs'
import { and, eq } from 'drizzle-orm'
import { revalidatePath } from 'next/cache'

export const upsertChallengeProgress = async (challengeId: number) => {
  const userProgress = await getUserProgress()

  if (!userProgress) {
    throw new Error('UserId is required')
  }

  //TODO:handle subscription

  const challenge = await db.query.challenges.findFirst({
    where: eq(challenges.id, challengeId),
    with: {
      challengeOptions: true,
      challengeProgresses: {
        where: eq(challengeProgresses.userId, userProgress.userId)
      }
    }
  })

  if (!challenge) {
    throw new Error('Not found challenge')
  }

  const existChallengeProgress = challenge.challengeProgresses.length === 1 ? challenge.challengeProgresses[0] : null

  const isPractice = !!existChallengeProgress //do lesson again

  //TODO: check subscription later
  if (userProgress.hearts === 0 && !isPractice) {
    return { error: 'hearts' }
  }

  if (isPractice) {
    await db
      .update(challengeProgresses)
      .set({
        completed: true
      })
      .where(
        and(
          eq(challengeProgresses.userId, existChallengeProgress.userId),
          eq(challengeProgresses.challengeId, existChallengeProgress.challengeId)
        )
      )

    await db
      .update(userProgresses)
      .set({
        hearts: Math.min(userProgress.hearts + 1, 5) // not exceed 5
      })
      .where(eq(userProgresses.userId, userProgress.userId))
  } else {
    await db.insert(challengeProgresses).values({
      challengeId,
      userId: userProgress.userId,
      completed: true
    })

    await db
      .update(userProgresses)
      .set({
        points: userProgress.points + 10
      })
      .where(eq(userProgresses.userId, userProgress.userId))
  }

  revalidatePath('/learn')
  revalidatePath('/lesson')
  revalidatePath('/quests')
  revalidatePath('/leader-board')
  revalidatePath(`/lessons/${challenge.lessonId}`)
}
