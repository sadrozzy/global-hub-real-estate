'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { authConfig } from './config'
import { LoginResponse, RegisterResponse, User } from './types'

// Базовый запрос к API
async function authFetch(endpoint: string, options?: RequestInit) {
	const url = `${authConfig.backendUrl}${endpoint}`
	return fetch(url, {
		...options,
		headers: {
			'Content-Type': 'application/json',
			...options?.headers
		}
	})
}

// Регистрация
export async function registerAction(
	formData: FormData
): Promise<{ error?: string }> {
	const userData = {
		first_name: formData.get('first_name') as string,
		last_name: formData.get('last_name') as string,
		email: formData.get('email') as string,
		password: formData.get('password') as string
	}

	try {
		const response = await authFetch('/auth/users/', {
			method: 'POST',
			body: JSON.stringify(userData)
		})

		if (!response.ok) {
			const error = await response.json()
			return { error: error.detail || 'Registration failed' }
		}

		const data: RegisterResponse = await response.json()

		return await loginAction(formData)
	} catch (error) {
		return { error: 'Network error' }
	}
}

// Логин
export async function loginAction(
	formData: FormData
): Promise<{ error?: string }> {
	const credentials = {
		email: formData.get('email') as string,
		password: formData.get('password') as string
	}

	try {
		const response = await authFetch('/auth/jwt/create/', {
			method: 'POST',
			body: JSON.stringify(credentials)
		})

		if (!response.ok) {
			const error = await response.json()
			return { error: error.detail || 'Login failed' }
		}

		const { access, refresh }: LoginResponse = await response.json()

		// Сохраняем токены в cookies
		const cookieStore = await cookies()
		cookieStore.set({
			name: authConfig.accessTokenName,
			value: access,
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			maxAge: Number(authConfig.accessTokenMaxAge),
			path: '/'
		})

		cookieStore.set({
			name: authConfig.refreshTokenName,
			value: refresh,
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			maxAge: Number(authConfig.refreshTokenMaxAge),
			path: '/'
		})
	} catch (error) {
		return { error: 'Network error' }
	}

	redirect('/profile')
}

export async function logOutAction() {
	const cookieStore = await cookies()
	cookieStore.delete(authConfig.accessTokenName)
	cookieStore.delete(authConfig.refreshTokenName)
	redirect('/login')
}

// Получение текущей сессии
export async function getSession(): Promise<User | null> {
	const cookieStore = await cookies()
	const accessToken = cookieStore.get(authConfig.accessTokenName)?.value

	// Пытаемся получить данные с access токеном
	if (accessToken) {
		try {
			const response = await authFetch('/auth/user/', {
				headers: { Authorization: `Bearer ${accessToken}` }
			})

			if (response.ok) return await response.json()
		} catch (error) {
			console.error('Failed to fetch user with access token', error)
		}
	}

	// Если access токен невалиден, пробуем обновить с refresh токеном
	return await refreshSession()
}

async function refreshSession(): Promise<User | null> {
	const cookieStore = await cookies()
	const refreshToken = cookieStore.get(authConfig.refreshTokenName)?.value
	if (!refreshToken) return null

	try {
		const response = await authFetch('/auth/refresh/', {
			method: 'POST',
			body: JSON.stringify({ refresh: refreshToken })
		})

		if (!response.ok) {
			cookieStore.delete(authConfig.accessTokenName)
			cookieStore.delete(authConfig.refreshTokenName)
			return null
		}

		const { access }: { access: string } = await response.json()

		// Сохраняем новый access токен
		cookieStore.set({
			name: authConfig.accessTokenName,
			value: access,
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			maxAge: Number(authConfig.accessTokenMaxAge),
			path: '/'
		})

		// Получаем данные пользователя с новым токеном
		const userResponse = await authFetch('/auth/user/', {
			headers: { Authorization: `Bearer ${access}` }
		})

		return userResponse.ok ? await userResponse.json() : null
	} catch (error) {
		console.error('Failed to refresh token', error)
		return null
	}
}
