import 'dotenv/config'
import { drizzle } from 'drizzle-orm/neon-http'
import { neon } from '@neondatabase/serverless'

import * as schema from '../database/schema'

const sql = neon(process.env.DATABASE_URL!)
const db = drizzle(sql, { schema })

const main = async () => {
  try {
    console.log('Seeding database')

    await db.delete(schema.courses)
    await db.delete(schema.userProgresses)

    await db.insert(schema.courses).values([
      {
        id: 1,
        title: 'Spanish',
        imageSrc: '/es.svg'
      },
      {
        id: 2,
        title: 'French',
        imageSrc: '/fr.svg'
      },
      {
        id: 3,
        title: 'English',
        imageSrc: '/us.svg'
      },
      {
        id: 4,
        title: 'Italian',
        imageSrc: '/it.svg'
      }
    ])

    await db.insert(schema.units).values([
      {
        id: 1,
        courseId: 1,
        title: 'Unit 1',
        description: 'Learning basic of Spanish',
        order: 1
      }
    ])

    await db.insert(schema.lessons).values([
      {
        id: 1,
        unitId: 1,
        title: 'Nouns',
        order: 1
      },
      {
        id: 2,
        unitId: 1,
        title: 'Verbs',
        order: 2
      },
      {
        id: 3,
        unitId: 1,
        title: 'Verbs',
        order: 3
      },
      {
        id: 4,
        unitId: 1,
        title: 'Verbs',
        order: 4
      },
      {
        id: 5,
        unitId: 1,
        title: 'Verbs',
        order: 5
      }
    ])

    await db.insert(schema.challenges).values([
      {
        id: 1,
        lessonId: 1,
        type: 'SELECT',
        order: 1,
        question: 'Which one of these is the "the man"?'
      },
      {
        id: 2,
        lessonId: 1,
        type: 'ASSIST',
        order: 2,
        question: '"the man"?'
      },
      {
        id: 3,
        lessonId: 1,
        type: 'SELECT',
        order: 3,
        question: 'Which one of these is the "the robot"?'
      }
    ])

    await db.insert(schema.challengeOptions).values([
      {
        challengeId: 1,
        imageSrc: '/man.svg',
        correct: true,
        text: 'el hombre',
        audioSrc: '/sounds/es_man.mp3'
      },
      {
        challengeId: 1,
        imageSrc: '/woman.svg',
        correct: false,
        text: 'la mujer',
        audioSrc: '/sounds/es_woman.mp3'
      },
      {
        challengeId: 1,
        imageSrc: '/robot.svg',
        correct: false,
        text: 'el robot',
        audioSrc: '/sounds/es_robot.mp3'
      }
    ])

    await db.insert(schema.challengeOptions).values([
      {
        challengeId: 2,
        correct: true,
        text: 'el hombre',
        audioSrc: '/sounds/es_man.mp3'
      },
      {
        challengeId: 2,
        correct: false,
        text: 'la mujer',
        audioSrc: '/sounds/es_woman.mp3'
      },
      {
        challengeId: 2,
        correct: false,
        text: 'el robot',
        audioSrc: '/sounds/es_robot.mp3'
      }
    ])

    await db.insert(schema.challengeOptions).values([
      {
        challengeId: 3,
        correct: false,
        text: 'el hombre',
        audioSrc: '/sounds/es_man.mp3'
      },
      {
        challengeId: 3,
        correct: false,
        text: 'la mujer',
        audioSrc: '/sounds/es_woman.mp3'
      },
      {
        challengeId: 3,
        correct: true,
        text: 'el robot',
        audioSrc: '/sounds/es_robot.mp3'
      }
    ])

    console.log('Seeding finish!')
  } catch (error) {
    console.error(error)
    throw new Error('Failed to seed the database')
  }
}

main()
