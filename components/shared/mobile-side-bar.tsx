import React from 'react'
import { Sheet, SheetContent, SheetTrigger } from '../ui/sheet'
import { Menu } from 'lucide-react'
import SideBar from './side-bar'

function MobileSideBar() {
  return (
    <Sheet>
      <SheetTrigger>
        <Menu className='text-white' />
      </SheetTrigger>
      <SheetContent className='p-0 z-[100]' side='left'>
        <SideBar />
      </SheetContent>
    </Sheet>
  )
}

export default MobileSideBar
