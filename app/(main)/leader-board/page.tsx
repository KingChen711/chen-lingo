import FeedWrapper from '@/components/shared/feed-wrapper'
import StickyWrapper from '@/components/shared/sticky-wrapper'
import UserProgress from '@/components/shared/user-progress'
import { getTopTenUsers, getUserProgress, getUserSubscription } from '@/database/queries'
import Image from 'next/image'
import { redirect } from 'next/navigation'
import { Separator } from '@/components/ui/separator'

import React from 'react'

import { Avatar, AvatarImage } from '@/components/ui/avatar'

type Props = {}

async function LeaderBoardPage({}: Props) {
  const userProgressData = getUserProgress()
  const userSubscriptionData = getUserSubscription()
  const topTenUsersData = getTopTenUsers()

  const [userProgress, userSubscription, topTenUsers] = await Promise.all([
    userProgressData,
    userSubscriptionData,
    topTenUsersData
  ])

  if (!userProgress || !userProgress.activeCourse) {
    redirect('/courses')
  }

  const isPro = !!userSubscription?.isActive

  return (
    <div className='flex flex-row-reverse gap-[48px] px-6'>
      <StickyWrapper>
        <UserProgress
          activeCourse={userProgress.activeCourse}
          hearts={userProgress.hearts}
          points={userProgress.points}
          hasActiveSubscription={isPro}
        />
      </StickyWrapper>
      <FeedWrapper>
        <div className='w-full flex flex-col items-center'>
          <Image src='/leader-board.svg' alt='leader board' height={90} width={90} />

          <h1 className='text-center font-bold text-neutral-800 text-2xl my-6'>Leader Board</h1>

          <p className='text-muted-foreground text-center text-lg mb-6'>
            See where you stand among other leaners in the community
          </p>
          <Separator className='mb-4 h-0.5 rounded-full' />
          {topTenUsers.map((user, index) => {
            return (
              <div key={user.userId} className='flex items-center w-full p-2 px-4 rounded-xl hover:bg-gray-200/50'>
                <p className='font-bold text-lime-700 mr-4'>{index + 1}</p>
                <Avatar className='border bg-green-500 h-12 w-12 ml-3 mr-6'>
                  <AvatarImage className='object-cover' src={userProgress.userImageSrc} />
                </Avatar>
                <p className='font-bold text-neutral-800 flex-1'>{userProgress.userName}</p>
                <p className='text-muted-foreground'>{userProgress.points} XP</p>
              </div>
            )
          })}
        </div>
      </FeedWrapper>
    </div>
  )
}

export default LeaderBoardPage
