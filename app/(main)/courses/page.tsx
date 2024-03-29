import { getCourses, getUserProgress } from '@/database/queries'
import React from 'react'
import List from './list'

async function CoursesPage() {
  const coursesData = await getCourses()
  const userProgressData = await getUserProgress()

  const [courses, userProgress] = await Promise.all([coursesData, userProgressData])

  return (
    <div className='h-full max-w-[912px] px-3 mx-auto'>
      <h1 className='text-2xl font-bold text-neutral-700'>CoursesPage</h1>

      <List courses={courses} activeCourseId={userProgress?.activeCourseId || null} />
    </div>
  )
}

export default CoursesPage
