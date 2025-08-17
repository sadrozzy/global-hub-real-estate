import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { authConfig } from './lib/auth/config'
import createIntlMiddleware from 'next-intl/middleware'
import { routing } from './i18n/routing'

const intlMiddleware = createIntlMiddleware(routing)

export async function middleware(request: NextRequest) {
	const intlResponse = intlMiddleware(request)
	if (intlResponse) return intlResponse

	const { pathname } = request.nextUrl
	const accessToken = request.cookies.get(authConfig.accessTokenName)?.value
	const refreshToken = request.cookies.get(authConfig.refreshTokenName)?.value

	// Пропускаем публичные маршруты
	if (authConfig.publicRoutes.includes(pathname)) {
		return NextResponse.next()
	}

	// Если пользователь авторизован и пытается попасть на auth route
	if (
		authConfig.authRoutes.includes(pathname) &&
		(accessToken || refreshToken)
	) {
		return NextResponse.redirect(new URL('/profile', request.url))
	}

	// Если пользователь не авторизован и пытается попасть на protected route
	if (authConfig.protectedRoutes.some(route => pathname.startsWith(route))) {
		if (!accessToken && !refreshToken) {
			return NextResponse.redirect(new URL('/login', request.url))
		}

		// Проверяем валидность access токена
		// if (accessToken) {
		// 	const verifyResponse = await fetch(
		// 		`${authConfig.backendUrl}/auth/verify/`,
		// 		{
		// 			headers: { Authorization: `Bearer ${accessToken}` }
		// 		}
		// 	)

		// 	if (verifyResponse.ok) {
		// 		return NextResponse.next()
		// 	}
		// }

		// Пробуем обновить токен
		if (refreshToken) {
			const refreshResponse = await fetch(
				`${authConfig.backendUrl}/auth/jwt/create/`,
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ refresh: refreshToken })
				}
			)

			if (refreshResponse.ok) {
				const { access } = await refreshResponse.json()
				const response = NextResponse.next()

				response.cookies.set({
					name: authConfig.accessTokenName,
					value: access,
					httpOnly: true,
					secure: process.env.NODE_ENV === 'production',
					maxAge: Number(authConfig.accessTokenMaxAge),
					path: '/'
				})

				return response
			}
		}

		// Если ничего не сработало - редирект на логин
		const response = NextResponse.redirect(new URL('/login', request.url))
		response.cookies.delete(authConfig.accessTokenName)
		response.cookies.delete(authConfig.refreshTokenName)
		return response
	}

	return NextResponse.next()
}

export const config = {
	// Match only internationalized pathnames
	matcher: ['/', '/(en|es)/:path*']
}
