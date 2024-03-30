import { relations } from 'drizzle-orm'
import { boolean, integer, pgEnum, pgTable, primaryKey, serial, text } from 'drizzle-orm/pg-core'

export const challengeProgresses = pgTable(
  'challenge_progresses',
  {
    userId: text('user_id')
      .references(() => userProgresses.userId, { onDelete: 'cascade' })
      .notNull(),
    challengeId: integer('challenge_id')
      .references(() => challenges.id, { onDelete: 'cascade' })
      .notNull(),
    completed: boolean('completed').notNull().default(false)
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.userId, table.challengeId] })
    }
  }
)

export const challengeProgressesRelations = relations(challengeProgresses, ({ one }) => ({
  challenge: one(challenges, {
    fields: [challengeProgresses.challengeId],
    references: [challenges.id]
  }),
  user: one(userProgresses, {
    fields: [challengeProgresses.userId],
    references: [userProgresses.userId]
  })
}))

export const challengeTypes = pgEnum('challenge_type', ['SELECT', 'ASSIST'])

export const challengeOptions = pgTable('challenge_options', {
  id: serial('id').primaryKey(),
  challengeId: integer('challenge_id')
    .references(() => challenges.id, { onDelete: 'cascade' })
    .notNull(),
  text: text('text').notNull(),
  correct: boolean('correct').notNull(),
  imageSrc: text('image_src'),
  audioSrc: text('audio_src')
})

export const challengeOptionsRelations = relations(challengeOptions, ({ one }) => ({
  challenge: one(challenges, {
    fields: [challengeOptions.challengeId],
    references: [challenges.id]
  })
}))

export const challenges = pgTable('challenges', {
  id: serial('id').primaryKey(),
  lessonId: integer('lesson_id')
    .references(() => lessons.id, { onDelete: 'cascade' })
    .notNull(),
  type: challengeTypes('challenge_type').notNull(),
  question: text('question').notNull(),
  order: integer('order').notNull()
})

export const challengesRelations = relations(challenges, ({ one, many }) => ({
  lesson: one(lessons, {
    fields: [challenges.lessonId],
    references: [lessons.id]
  }),
  challengeProgresses: many(challengeProgresses),
  challengeOptions: many(challengeOptions)
}))

export const lessons = pgTable('lessons', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  unitId: integer('unit_id')
    .references(() => units.id, { onDelete: 'cascade' })
    .notNull(),
  order: integer('order').notNull()
})

export const lessonsRelations = relations(lessons, ({ one, many }) => ({
  unit: one(units, {
    fields: [lessons.unitId],
    references: [units.id]
  }),
  challenges: many(challenges)
}))

export const units = pgTable('units', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(), //Unit 1
  description: text('description').notNull(), // Learn the basics of english
  courseId: integer('course_id')
    .references(() => courses.id, { onDelete: 'cascade' })
    .notNull(),
  order: integer('order').notNull()
})

export const unitsRelations = relations(units, ({ one, many }) => ({
  course: one(courses, {
    fields: [units.courseId],
    references: [courses.id]
  }),
  lessons: many(lessons)
}))

export const courses = pgTable('courses', {
  id: serial('id').primaryKey(),
  title: text('title').notNull(),
  imageSrc: text('image_src').notNull()
})

export const coursesRelations = relations(courses, ({ many }) => ({
  userProgresses: many(userProgresses),
  units: many(units)
}))

export const userProgresses = pgTable('user_progresses', {
  userId: text('user_id').primaryKey(),
  userName: text('user_name').notNull().default('User'),
  userImageSrc: text('user_image_src').notNull().default('/mascot.svg'),
  activeCourseId: integer('active_course_id').references(() => courses.id, { onDelete: 'set null' }),
  hearts: integer('hearts').notNull().default(5),
  points: integer('points').notNull().default(0)
})

export const userProgressesRelations = relations(userProgresses, ({ one, many }) => ({
  activeCourse: one(courses, {
    fields: [userProgresses.activeCourseId],
    references: [courses.id]
  }),
  challengeProgresses: many(challengeProgresses)
}))
