import db from '@/database/drizzle'
import { lessons } from '@/database/schema'
import { isAdmin } from '@/lib/admin'
import { NextResponse } from 'next/server'

export const GET = async () => {
  if (!isAdmin()) {
    return new NextResponse('Unauthorized', { status: 403 })
  }

  const data = await db.query.lessons.findMany()
  return NextResponse.json(data)
}

export const POST = async (req: Request) => {
  if (!isAdmin()) {
    return new NextResponse('Unauthorized', { status: 403 })
  }

  const body = await req.json()

  const data = await db
    .insert(lessons)
    .values({
      ...body
    })
    .returning()

  return NextResponse.json(data[0])
}