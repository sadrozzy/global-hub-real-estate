'use client'

import { useEffect, useState } from 'react'
import { User } from '@/lib/auth/types'
import { getSession } from '@/lib/auth/actions'

export function useAuth() {
	const [user, setUser] = useState<User | null>(null)
	const [loading, setLoading] = useState(true)

	useEffect(() => {
		const fetchUser = async () => {
			const session = await getSession()
			setUser(session)
			setLoading(false)
		}

		fetchUser()
	}, [])

	return { user, loading }
}
