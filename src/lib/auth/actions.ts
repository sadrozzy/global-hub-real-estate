'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { authConfig } from './config'
import { LoginResponse, RegisterResponse, User } from './types'

// Базовый запрос к API
async function authFetch(endpoint: string, options?: RequestInit) {
	const url = `${authConfig.backendUrl}${endpoint}`
	console.log('Making request to:', url)
	console.log('Request options:', {
		method: options?.method || 'GET',
		headers: options?.headers,
		body: options?.body
	})

	try {
		const response = await fetch(url, {
			...options,
			headers: {
				'Content-Type': 'application/json',
				...options?.headers
			}
		})

		console.log('Response received:', {
			status: response.status,
			statusText: response.statusText,
			url: response.url
		})

		return response
	} catch (error) {
		console.error('Fetch error:', error)
		throw error
	}
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

	console.log('Sending registration data:', userData)

	try {
		const response = await authFetch('/auth/users/', {
			method: 'POST',
			body: JSON.stringify(userData)
		})

		console.log('Response status:', response.status)
		console.log(
			'Response headers:',
			Object.fromEntries(response.headers.entries())
		)

		// Получаем текст ответа для отладки
		const responseText = await response.text()
		console.log('Raw response:', responseText)

		if (!response.ok) {
			let errorMessage = 'Registration failed'

			try {
				// Пытаемся распарсить JSON ошибки
				const errorData = JSON.parse(responseText)
				console.log('Error data:', errorData)

				// Обрабатываем разные форматы ошибок
				if (errorData.error) {
					errorMessage = errorData.error
				} else if (errorData.detail) {
					errorMessage = errorData.detail
				} else if (errorData.message) {
					errorMessage = errorData.message
				} else if (typeof errorData === 'string') {
					errorMessage = errorData
				} else {
					errorMessage = JSON.stringify(errorData)
				}
			} catch (parseError) {
				console.error('Failed to parse error response:', parseError)
				errorMessage =
					responseText ||
					`HTTP ${response.status}: ${response.statusText}`
			}

			return { error: errorMessage }
		}

		// Пытаемся распарсить успешный ответ
		let data: RegisterResponse
		try {
			data = JSON.parse(responseText)
			console.log('Parsed response data:', data)
		} catch (parseError) {
			console.error('Failed to parse success response:', parseError)
			return { error: 'Invalid response format from server' }
		}

		// Проверяем, что получили необходимые данные
		if (!data || !data.id || !data.email) {
			console.error('Invalid user data received:', data)
			return { error: 'Invalid user data received from server' }
		}

		console.log('Registration successful, proceeding to login')
		return await loginAction(formData)
	} catch (error) {
		console.error('Registration network error:', error)
		return {
			error:
				'Network error: ' +
				(error instanceof Error ? error.message : 'Unknown error')
		}
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

	console.log('Attempting login with:', { email: credentials.email })

	try {
		const response = await authFetch('/auth/jwt/create/', {
			method: 'POST',
			body: JSON.stringify(credentials)
		})

		console.log('Login response status:', response.status)

		if (!response.ok) {
			const responseText = await response.text()
			console.log('Login error response:', responseText)

			let errorMessage = 'Login failed'
			try {
				const errorData = JSON.parse(responseText)
				if (errorData.error) {
					errorMessage = errorData.error
				} else if (errorData.detail) {
					errorMessage = errorData.detail
				} else if (errorData.message) {
					errorMessage = errorData.message
				} else {
					errorMessage = JSON.stringify(errorData)
				}
			} catch (parseError) {
				errorMessage =
					responseText ||
					`HTTP ${response.status}: ${response.statusText}`
			}

			return { error: errorMessage }
		}

		const responseText = await response.text()
		console.log('Login success response:', responseText)

		let loginData: LoginResponse
		try {
			loginData = JSON.parse(responseText)
		} catch (parseError) {
			console.error('Failed to parse login response:', parseError)
			return { error: 'Invalid login response format' }
		}

		const { access, refresh } = loginData

		if (!access || !refresh) {
			console.error('Missing tokens in login response:', loginData)
			return { error: 'Missing authentication tokens' }
		}

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

		console.log('Login successful, tokens saved')
	} catch (error) {
		console.error('Login network error:', error)
		return {
			error:
				'Network error: ' +
				(error instanceof Error ? error.message : 'Unknown error')
		}
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
		const response = await authFetch('/auth/jwt/refresh/', {
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
