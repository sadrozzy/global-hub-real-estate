export interface User {
	id: string
	first_name: string
	last_name: string
	email: string
	role: 'customer' | 'agent'
}

export interface LoginResponse {
	access: string
	refresh: string
}

export interface RegisterRequest {
	first_name: string
	last_name: string
	email: string
	password: string
	re_password: string
	role: 'customer' | 'agent'
}

export interface RegisterResponse extends User {}
