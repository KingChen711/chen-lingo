import { auth } from '@clerk/nextjs'

const adminIds = ['user_2eJeEXSZQxHgYD6XzwXOpCVuzPw']

export const isAdmin = () => {
  const { userId } = auth()

  if (!userId) return false

  return adminIds.includes(userId)
}
