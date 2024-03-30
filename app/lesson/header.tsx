'use client'

import { Progress } from '@/components/ui/progress'
import { useExitModal } from '@/store/use-exit-modal'
import { InfinityIcon, X } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

type Props = {
  hearts: number
  percentages: number
  hasActiveSubscription: boolean
}

function Header({ hasActiveSubscription, hearts, percentages }: Props) {
  const { open } = useExitModal()

  return (
    <header className='lg:pt-[50px] pt-[20px] px-10 flex gap-x-7 items-center justify-between max-w-[1140px] mx-auto w-full'>
      {/* //TODO:Add onclick exist */}
      <X onClick={open} className='text-slate-500 hover:opacity-75 transition cursor-pointer' />
      <Progress value={percentages} />
      <div className='text-rose-500 flex items-center font-bold'>
        <Image alt='heart' src='/heart.svg' height={28} width={28} className='mr-2' />
        {hasActiveSubscription ? <InfinityIcon /> : hearts}
      </div>
    </header>
  )
}

export default Header
