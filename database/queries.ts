import { cache } from 'react'
import db from '@/database/drizzle'
import { auth } from '@clerk/nextjs'
import { challengeProgresses, challenges, courses, lessons, units, userProgresses } from './schema'
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

export const getUnits = cache(async () => {
  const userProgress = await getUserProgress()

  if (!userProgress || !userProgress?.activeCourseId) {
    return []
  }

  const data = await db.query.units.findMany({
    where: eq(units.courseId, userProgress.activeCourseId),
    with: {
      lessons: {
        with: {
          challenges: {
            with: {
              challengeProgresses: {
                where: eq(challengeProgresses.userId, userProgress.userId)
              }
            }
          }
        }
      }
    }
  })

  const normalizedData = data.map((unit) => {
    const lessonsWithCompletedStatus = unit.lessons.map((lesson) => {
      const allCompletedChallenges =
        lesson.challenges.length > 0 &&
        lesson.challenges.every(
          (challenge) => challenge.challengeProgresses.length === 1 && challenge.challengeProgresses[0].completed //use have 0 or 1 relationship with a challenge progress
        )

      return { ...lesson, completed: allCompletedChallenges }
    })

    return { ...unit, lessons: lessonsWithCompletedStatus }
  })

  return normalizedData
})
