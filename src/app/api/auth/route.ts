import { NextResponse } from 'next/server'
import { authConfig } from '@/lib/auth/config'
import { getSession } from '@/lib/auth/actions'

export async function GET() {
	const session = await getSession()

	if (!session) {
		return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
	}

	return NextResponse.json({ user: session })
}
