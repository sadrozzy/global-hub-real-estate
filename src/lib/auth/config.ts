export const authConfig = {
	accessTokenName: 'access_token',
	refreshTokenName: 'refresh_token',
	protectedRoutes: ['/profile'],
	authRoutes: ['/login', '/register'],
	publicRoutes: ['/'],
	backendUrl: process.env.BACKEND_API_URL || 'http://localhost:8000',
	accessTokenMaxAge: process.env.ACCESS_TOKEN_MAX_AGE || 60 * 60,
	refreshTokenMaxAge: process.env.REFRESH_TOKEN_MAX_AGE || 60 * 60 * 24 * 7
}

// Логируем конфигурацию для отладки
console.log('Auth config loaded:', {
	backendUrl: authConfig.backendUrl,
	accessTokenMaxAge: authConfig.accessTokenMaxAge,
	refreshTokenMaxAge: authConfig.refreshTokenMaxAge,
	env: process.env.NODE_ENV
})
