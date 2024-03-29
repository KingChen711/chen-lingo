'use client'

import React from 'react'
import { Button } from '../ui/button'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'

type Props = {
  label: string
  iconSrc: string
  href: string
}

function SideBarItem({ label, iconSrc, href }: Props) {
  const pathname = usePathname()
  const active = pathname === href

  return (
    <Button variant={active ? 'side-bar-outline' : 'side-bar'} asChild className='justify-start h-[52px]'>
      <Link href={href}>
        <Image alt={label.toLowerCase()} src={iconSrc} width={32} height={32} className='mr-5' />
        {label}
      </Link>
    </Button>
  )
}

export default SideBarItem
