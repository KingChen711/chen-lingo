'use client'

import { courses, userProgresses } from '@/database/schema'
import React, { useTransition } from 'react'
import Card from './card'
import { useRouter } from 'next/navigation'
import { upsertUserProgress } from '@/actions/user-progress.action'
import { toast } from 'sonner'

type Props = {
  courses: (typeof courses.$inferSelect)[]
  activeCourseId: typeof userProgresses.$inferSelect.activeCourseId
}

function List({ courses, activeCourseId }: Props) {
  const router = useRouter()
  const [pending, startTransition] = useTransition()

  const handleClickCard = (courseId: number) => {
    if (pending) return //guard against reentrancy technique

    if (courseId === activeCourseId) {
      return router.push('/learn')
    }

    startTransition(() => {
      upsertUserProgress(courseId).catch(() => toast.error('Something went wrong!'))
    })
  }

  return (
    <div className='pt-6 grid grid-cols-2 lg:grid-cols-[repeat(auto-fill,minmax(210px,1fr))] gap-4'>
      {courses.map((course) => (
        <Card
          key={course.id}
          id={course.id}
          title={course.title}
          imageSrc={course.imageSrc}
          onClick={handleClickCard}
          disabled={pending}
          active={course.id === activeCourseId}
        />
      ))}
    </div>
  )
}

export default List
