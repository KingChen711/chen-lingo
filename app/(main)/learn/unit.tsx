import React from 'react'
import { lessons } from '@/database/schema'
import UnitBanner from './unit-banner'
import LessonButton from './lesson-button'

type Props = {
  id: number
  order: number
  description: string
  title: string
  lessons: (typeof lessons.$inferSelect & { completed: boolean })[]
  activeLesson: typeof lessons.$inferSelect
  activeLessonPercentage: number
}

function Unit({ activeLesson, activeLessonPercentage, description, id, lessons, order, title }: Props) {
  return (
    <>
      <UnitBanner title={title} description={description} />

      <div className='flex items-center flex-col relative mt-6'>
        {lessons.map((lesson, index) => {
          const isCurrent = lesson.id === activeLesson?.id
          const isLocked = !lesson.completed && !isCurrent

          return (
            <LessonButton
              key={lesson.id}
              id={lesson.id}
              index={index}
              totalCount={lessons.length - 1}
              completed={lesson.completed}
              current={isCurrent}
              locked={isLocked}
              percentage={activeLessonPercentage}
            />
          )
        })}
      </div>
    </>
  )
}

export default Unit
