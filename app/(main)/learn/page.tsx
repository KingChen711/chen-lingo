import FeedWrapper from '@/components/shared/feed-wrapper'
import StickyWrapper from '@/components/shared/sticky-wrapper'
import React from 'react'
import Header from './header'
import UserProgress from '@/components/shared/user-progress'
import { getUnits, getUserProgress } from '@/database/queries'
import { redirect } from 'next/navigation'

async function LearnPage() {
  const userProgressData = getUserProgress()
  const unitsData = getUnits()

  const [userProgress, units] = await Promise.all([userProgressData, unitsData])

  if (!userProgress || !userProgress.activeCourse) {
    redirect('/courses')
  }

  return (
    <div className='flex flex-row-reverse gap-[48px] px-6'>
      <StickyWrapper>
        <UserProgress
          activeCourse={userProgress.activeCourse}
          hearts={userProgress.hearts}
          points={userProgress.points}
          hasActiveSubscription={false}
        />
      </StickyWrapper>
      <FeedWrapper>
        <Header title={userProgress.activeCourse.title} />
        {units.map(unit=>(
          <div key={unit.id} className='mb-10'>
              {JSON.stringify(unit)}
          </div>
        ))}
        <div className='space-y-4'>
          <div className='h-[700px] bg-blue-500 w-full' />
          <div className='h-[700px] bg-blue-500 w-full' />
          <div className='h-[700px] bg-blue-500 w-full' />
          <div className='h-[700px] bg-blue-500 w-full' />
          <div className='h-[700px] bg-blue-500 w-full' />
        </div>
      </FeedWrapper>
    </div>
  )
}

export default LearnPage
