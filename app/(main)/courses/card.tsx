import { cn } from '@/lib/utils'
import { Check } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

type Props = {
  id: number
  title: string
  imageSrc: string
  onClick: (courseId: number) => void
  disabled: boolean
  active: boolean
}

function Card({ active, disabled, id, imageSrc, onClick, title }: Props) {
  return (
    <div
      onClick={() => onClick(id)}
      className={cn(
        'h-full border-2 rounded-xl border-b-4 hover:bg-black-5 cursor-pointer active:border-b-2 flex flex-col items-center justify-between p-3 pb-6 min-h-[217px] min-w-[200px]',
        disabled && 'pointer-events-none opacity-50'
      )}
    >
      <div className='min-[24px] w-full flex items-center justify-end'>
        {active && (
          <div className='rounded-md bg-green-600 flex items-center justify-center p-1.5'>
            <Check className='text-white stroke-[4] size-4' />
          </div>
        )}
      </div>

      <Image
        alt={title.toLowerCase()}
        src={imageSrc}
        height={70}
        width={93.33}
        className='rounded-lg drop-shadow-md border object-cover'
      />
      <p className='text-neutral-700 text-center'>{title}</p>
    </div>
  )
}

export default Card
