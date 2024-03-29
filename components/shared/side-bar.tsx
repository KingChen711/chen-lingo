import { cn } from '@/lib/utils'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import SideBarItem from './side-bar-item'
import { ClerkLoaded, ClerkLoading, UserButton } from '@clerk/nextjs'
import { Loader } from 'lucide-react'

type Props = {
  className?: string
}

function SideBar({ className }: Props) {
  return (
    <div className={cn('h-screen w-full overflow-y-auto lg:w-[256px] border-r-2 flex-col px-4', className)}>
      <Link href='/learn' className='pt-8 pl-4 pb-7 flex items-center gap-x-3'>
        <div className='flex items-center gap-1'>
          <Image alt='logo' src='/site-logo.png' height={40} width={40} />

          <p className='text-[24px] font-extrabold tracking-wide leading-[31.2px] max-sm:hidden'>
            Chen<span className='text-green-500 font-extrabold tracking-wide'>Lingo</span>
          </p>
        </div>
      </Link>

      <div className='flex flex-col gap-y-2 flex-1'>
        <SideBarItem href='/learn' iconSrc='/learn.svg' label='Learn' />

        <SideBarItem href='/leader-board' iconSrc='/leader-board.svg' label='Leader Board' />

        <SideBarItem href='/quests' iconSrc='/quests.svg' label='Quests' />

        <SideBarItem href='/shop' iconSrc='/shop.svg' label='Shop' />
      </div>

      <div className='p-4'>
        <ClerkLoading>
          <Loader className='h-5 w-5 text-muted-foreground animate-spin' />
        </ClerkLoading>
        <ClerkLoaded>
          <UserButton afterSignOutUrl='/' />
        </ClerkLoaded>
      </div>
    </div>
  )
}

export default SideBar
