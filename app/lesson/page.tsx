import { getLesson, getUserProgress } from '@/database/queries'
import { challenges } from '@/database/schema'
import { redirect } from 'next/navigation'
import React from 'react'
import Quiz from './quiz'

async function LessonPage() {
  const lessonData = getLesson()
  const userProgressData = getUserProgress()

  const [lesson, userProgress] = await Promise.all([lessonData, userProgressData])

  if (!lesson || !userProgress) {
    redirect('/learn')
  }

  const initialPercentage = Math.floor(
    (lesson.challenges.filter((challenge) => challenge.completed).length / lesson.challenges.length) * 100
  )

  return (
    <Quiz
      initialLessonId={lesson.id}
      initialPercentage={initialPercentage}
      initialLessonChallenges={lesson.challenges}
      initialHearts={userProgress.hearts}
      userSubscription={null}
    />
  )
}

export default LessonPage
