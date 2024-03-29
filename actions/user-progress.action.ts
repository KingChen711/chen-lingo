'use server'

import db from '@/database/drizzle'
import { getCourseById, getUserProgress } from '@/database/queries'
import { userProgresses } from '@/database/schema'
import { auth, currentUser } from '@clerk/nextjs'
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'

export const upsertUserProgress = async (courseId: number) => {
  const { userId } = await auth()
  const user = await currentUser()

  if (!userId || !user) {
    throw new Error('Unauthorized')
  }

  const course = await getCourseById(courseId)

  if (!course) {
    throw new Error('Course not found')
  }

  //TODO: enable once units and lessons are added
  //   if(!course.units.length || !course.units[0].lessons.length)
  //   {
  //     throw new Error("Course is empty")
  //   }

  const existingUserProgress = await getUserProgress()

  if (existingUserProgress) {
    await db.update(userProgresses).set({
      activeCourseId: courseId
    })
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
