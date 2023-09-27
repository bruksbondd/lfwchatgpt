import { User } from '@/lib/session'
import React, { useEffect, useState } from 'react'

export default function useUser() {
  const [user, setUser] = useState<User>(null)

  useEffect(() => {
    const getUser = async () => {
      const res = await fetch('/api/user')
      const data = await res.json()
      setUser(data)
    }
    getUser()
  }, [])

  return { user }
}
