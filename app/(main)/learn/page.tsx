import FeedWrapper from '@/components/shared/feed-wrapper'
import StickyWrapper from '@/components/shared/sticky-wrapper'
import React from 'react'
import Header from './header'
import UserProgress from '@/components/shared/user-progress'
import { getUserProgress } from '@/database/queries'

async function LearnPage() {
  const userProgress = await getUserProgress()

  return (
    <div className='flex flex-row-reverse gap-[48px] px-6'>
      <StickyWrapper>
        <UserProgress
          activeCourse={{ title: 'Spanish', imageSrc: '/es.svg' }}
          hearts={5}
          points={100}
          hasActiveSubscription={false}
        />
      </StickyWrapper>
      <FeedWrapper>
        <Header title='Spanish' />
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
