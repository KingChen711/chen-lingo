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
  const { userId } = auth()

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
          (challenge) => challenge.challengeProgresses.length === 1 && challenge.challengeProgresses[0].completed //user have 0 or 1 relationship with a challenge progress
        )

      return { ...lesson, completed: allCompletedChallenges }
    })

    return { ...unit, lessons: lessonsWithCompletedStatus }
  })

  return normalizedData
})

export const getCourseProgress = cache(async () => {
  const userProgress = await getUserProgress()

  if (!userProgress || !userProgress?.activeCourseId) {
    return null
  }

  const unitsInActiveCourse = await db.query.units.findMany({
    where: eq(units.courseId, userProgress.activeCourseId),
    orderBy: (units, { asc }) => [asc(units.order)],
    with: {
      lessons: {
        orderBy: (lessons, { asc }) => [asc(lessons.order)],
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

  const firstUncompletedLesson = unitsInActiveCourse
    .flatMap((unit) => unit.lessons)
    .find((lesson) => {
      return (
        lesson.challenges.length === 0 || //!If lesson have no any challenges, it always uncompleted
        lesson.challenges.some((challenge) => {
          return challenge.challengeProgresses.length !== 1 || !challenge.challengeProgresses[0].completed
        })
      )
    })

  return {
    activeLessonId: firstUncompletedLesson?.id,
    activeLesson: firstUncompletedLesson
  }
})

export const getLesson = cache(async (id?: number) => {
  const { userId } = auth()

  if (!userId) {
    return null
  }

  const lessonId = id || (await getCourseProgress())?.activeLessonId

  if (!lessonId) {
    return null
  }

  const lesson = await db.query.lessons.findFirst({
    where: eq(lessons.id, lessonId),
    with: {
      challenges: {
        orderBy: (challenges, { asc }) => [asc(challenges.order)],
        with: {
          challengeOptions: true,
          challengeProgresses: {
            where: eq(challengeProgresses.userId, userId)
          }
        }
      }
    }
  })

  if (!lesson || !lesson.challenges) {
    return null
  }

  const normalizedChallenges = lesson.challenges.map((challenge) => {
    const completed = challenge.challengeProgresses.length === 1 && challenge.challengeProgresses[0].completed
    return { ...challenge, completed }
  })

  return { ...lesson, challenges: normalizedChallenges }
})

export const getLessonPercentage = cache(async () => {
  const courseProgress = await getCourseProgress()

  if (!courseProgress?.activeLessonId) {
    return 0
  }

  const lesson = await getLesson(courseProgress.activeLessonId)

  if (!lesson) {
    return 0
  }

  return Math.floor(
    (lesson.challenges.filter((challenge) => challenge.completed).length / lesson.challenges.length) * 100
  )
})
