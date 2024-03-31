import { Loader } from 'lucide-react'
import React from 'react'

function LeaderBoardPageLoading() {
  return (
    <div className='size-full flex items-center justify-center'>
      <Loader className='size-6 text-muted animate-spin' />
    </div>
  )
}

export default LeaderBoardPageLoading
