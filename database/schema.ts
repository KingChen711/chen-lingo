import { relations } from 'drizzle-orm'
import { integer, pgTable, serial, text } from 'drizzle-orm/pg-core'

export const courses = pgTable('courses', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  imageSrc: text('image_src').notNull()
})

export const coursesRelations = relations(courses, ({ many }) => ({
  userProgresses: many(userProgresses)
}))

export const userProgresses = pgTable('user_progresses', {
  userId: text('user_id').primaryKey(),
  userName: text('user_name').notNull().default('User'),
  userImageSrc: text('user_image_src').notNull().default('/mascot.svg'),
  activeCourseId: integer('active_course_id').references(() => courses.id, { onDelete: 'restrict' }),
  hearts: integer('hearts').notNull().default(5),
  points: integer('points').notNull().default(0)
})

export const userProgressesRelations = relations(userProgresses, ({ one }) => ({
  activeCourse: one(courses, {
    fields: [userProgresses.activeCourseId],
    references: [courses.id]
  })
}))
