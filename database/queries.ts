import { cache } from 'react'
import db from '@/database/drizzle'
import { auth } from '@clerk/nextjs'
import { courses, userProgresses } from './schema'
import { eq } from 'drizzle-orm'

export const getCourses = cache(async () => {
  return await db.query.courses.findMany()
})

export const getCourseById = cache(async (courseId: number) => {
  return await db.query.courses.findFirst({
    where: eq(courses.id, courseId)
    //TODO: populate units and lessons
  })
})

export const getUserProgress = cache(async () => {
  const { userId } = await auth()

  if (!userId) {
    return null
  }

  return await db.query.userProgresses.findFirst({
    where: eq(userProgresses.userId, userId),
    with: {
      activeCourse: true
    }
  })
})
