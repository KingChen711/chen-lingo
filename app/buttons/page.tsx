import { Button } from '@/components/ui/button'
import React from 'react'

function ButtonPages() {
  return (
    <div className='flex flex-wrap gap-4'>
      <Button>Default</Button>
      <Button variant='primary'>Primary</Button>
      <Button variant='primary-outline'>Primary Outline</Button>
      <Button variant='secondary'>Secondary</Button>
      <Button variant='secondary-outline'>Secondary Outline</Button>
      <Button variant='danger'>Danger</Button>
      <Button variant='danger-outline'>Danger Outline</Button>
      <Button variant='super'>Super</Button>
      <Button variant='super-outline'>Super Outline</Button>
      <Button variant='ghost'>Ghost</Button>\<Button variant='side-bar'>Sidebar</Button>
      <Button variant='side-bar-outline'>Sidebar Outline</Button>
    </div>
  )
}

export default ButtonPages
