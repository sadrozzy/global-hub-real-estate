'use server'

import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { authConfig } from './config'
import { LoginResponse, RegisterResponse, User } from './types'

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
		console.log('Fetch error:', error)
		throw error
	}
}

export async function registerAction(userData: {
	first_name: string
	last_name: string
	email: string
	password: string
	re_password: string
	role: string
}): Promise<{ error?: string; success?: boolean }> {
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

				// Обрабатываем ошибки с вложенными массивами
				if (typeof errorData === 'object' && errorData !== null) {
					const errorMessages: string[] = []

					// Проходим по всем полям с ошибками
					for (const [field, errors] of Object.entries(errorData)) {
						if (Array.isArray(errors)) {
							// Добавляем каждую ошибку для поля
							errors.forEach((error: string) => {
								errorMessages.push(`${field}: ${error}`)
							})
						} else if (typeof errors === 'string') {
							errorMessages.push(`${field}: ${errors}`)
						}
					}

					if (errorMessages.length > 0) {
						errorMessage = errorMessages.join(', ')
					} else if (errorData.error) {
						errorMessage = errorData.error
					} else if (errorData.detail) {
						errorMessage = errorData.detail
					} else if (errorData.message) {
						errorMessage = errorData.message
					}
				} else if (typeof errorData === 'string') {
					errorMessage = errorData
				} else {
					errorMessage = JSON.stringify(errorData)
				}
			} catch (parseError) {
				console.log('Failed to parse error response:', parseError)
				errorMessage =
					responseText ||
					`HTTP ${response.status}: ${response.statusText}`
			}

			return { error: errorMessage }
		}

		let data: RegisterResponse
		try {
			data = JSON.parse(responseText)
			console.log('Parsed response data:', data)
		} catch (parseError) {
			console.log('Failed to parse success response:', parseError)
			return { error: 'Invalid response format from server' }
		}

		if (!data || !data.id || !data.email) {
			console.log('Invalid user data received:', data)
			return { error: 'Invalid user data received from server' }
		}

		console.log('Registration successful, proceeding to login')

		const loginResult = await loginAction({
			email: userData.email,
			password: userData.password
		})

		if (loginResult.error) {
			return {
				error: `Registration successful but login failed: ${loginResult.error}`
			}
		}

		return { success: true }
	} catch (error) {
		console.log('Registration network error:', error)
		return {
			error:
				'Network error: ' +
				(error instanceof Error ? error.message : 'Unknown error')
		}
	}
}

export async function loginAction(formData: {
	email: string
	password: string
}): Promise<{ error?: string; success?: boolean }> {
	const credentials = {
		email: formData.email,
		password: formData.password
	}

	try {
		const response = await authFetch('/auth/jwt/create/', {
			method: 'POST',
			body: JSON.stringify(credentials)
		})

		if (!response.ok) {
			const responseText = await response.text()

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
			console.log('Failed to parse login response:', parseError)
			return { error: 'Invalid login response format' }
		}

		const { access, refresh } = loginData

		if (!access || !refresh) {
			console.log('Missing tokens in login response:', loginData)
			return { error: 'Missing authentication tokens' }
		}

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
		return { success: true }
	} catch (error) {
		console.log('Login network error:', error)
		return {
			error:
				'Network error: ' +
				(error instanceof Error ? error.message : 'Unknown error')
		}
	}
}

export async function logOutAction() {
	const cookieStore = await cookies()
	cookieStore.delete(authConfig.accessTokenName)
	cookieStore.delete(authConfig.refreshTokenName)
	redirect('/login')
}

export async function getSession(): Promise<User | null> {
	const cookieStore = await cookies()
	const accessToken = cookieStore.get(authConfig.accessTokenName)?.value

	if (accessToken) {
		try {
			const response = await authFetch('/auth/user/', {
				headers: { Authorization: `Bearer ${accessToken}` }
			})

			if (response.ok) return await response.json()
		} catch (error) {
			console.log('Failed to fetch user with access token', error)
		}
	}

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

		cookieStore.set({
			name: authConfig.accessTokenName,
			value: access,
			httpOnly: true,
			secure: process.env.NODE_ENV === 'production',
			maxAge: Number(authConfig.accessTokenMaxAge),
			path: '/'
		})

		const userResponse = await authFetch('/auth/user/', {
			headers: { Authorization: `Bearer ${access}` }
		})

		return userResponse.ok ? await userResponse.json() : null
	} catch (error) {
		console.log('Failed to refresh token', error)
		return null
	}
}
