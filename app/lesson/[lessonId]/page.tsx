import { getLesson, getUserProgress, getUserSubscription } from '@/database/queries'
import { redirect } from 'next/navigation'
import React from 'react'
import Quiz from '../quiz'

type Props = {
  params: {
    lessonId: number
  }
}

async function LessonIdPage({ params }: Props) {
  const lessonData = getLesson(params.lessonId)
  const userProgressData = getUserProgress()
  const userSubscriptionData = getUserSubscription()

  const [lesson, userProgress, userSubscription] = await Promise.all([
    lessonData,
    userProgressData,
    userSubscriptionData
  ])

  if (!lesson || !userProgress) {
    redirect('/learn')
  }

  const isPro = !!userSubscription?.isActive

  const initialPercentage =
    (lesson.challenges.filter((challenge) => challenge.completed).length / lesson.challenges.length) * 100

  return (
    <Quiz
      initialLessonId={lesson.id}
      initialPercentage={initialPercentage}
      initialLessonChallenges={lesson.challenges}
      initialHearts={userProgress.hearts}
      isPro={isPro}
    />
  )
}

export default LessonIdPage
