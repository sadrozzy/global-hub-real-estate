'use client'

import { useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { registerAction } from '@/lib/auth/actions'

import './RegisterForm.scss'

const createRegisterSchema = (t: (key: string) => string) =>
	z
		.object({
			fullName: z
				.string()
				.min(1, t('errors.fullNameRequired'))
				.refine(name => name.trim().split(' ').length >= 2, {
					message: t('errors.fullNameMinWords')
				}),
			email: z
				.string()
				.min(1, t('errors.emailRequired'))
				.email(t('errors.emailInvalid')),
			password: z
				.string()
				.min(1, t('errors.passwordRequired'))
				.min(6, t('errors.passwordMinLength')),
			re_password: z.string().min(1, t('errors.confirmPasswordRequired')),
			role: z.enum(['customer', 'agent'])
		})
		.refine(data => data.password === data.re_password, {
			message: t('errors.passwordsDoNotMatch'),
			path: ['re_password']
		})

export default function RegisterForm() {
	const locale = useLocale()
	const t = useTranslations('Register')
	const router = useRouter()
	const [showPassword, setShowPassword] = useState(false)
	const [showRePassword, setShowRePassword] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const [serverError, setServerError] = useState<string>('')

	const registerSchema = createRegisterSchema(t)
	type RegisterFormData = z.infer<typeof registerSchema>

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset,
		watch,
		setValue
	} = useForm<RegisterFormData>({
		resolver: zodResolver(registerSchema),
		mode: 'all',
		defaultValues: {
			role: 'agent'
		}
	})

	const watchedRole = watch('role')

	const handleUserTypeChange = (type: 'customer' | 'agent') => {
		setValue('role', type)
	}

	const onSubmit = async (data: RegisterFormData) => {
		setIsLoading(true)
		setServerError('') // Очищаем предыдущие ошибки

		try {
			console.log('Form data:', data)

			const nameParts = data.fullName.trim().split(' ')
			const firstName = nameParts[0] || ''
			const lastName = nameParts.slice(1).join(' ') || ''

			const result = await registerAction({
				first_name: firstName,
				last_name: lastName,
				email: data.email,
				password: data.password,
				re_password: data.re_password,
				role: data.role
			})

			if (result?.error) {
				console.log(JSON.stringify(result.error))
				setServerError(result.error)
			} else if (result?.success) {
				console.log(
					'Registration successful, redirecting to profile...'
				)
				reset()
				// Редирект на страницу профиля
				router.push(`/${locale}/profile/agent/me`)
			}
		} catch (error) {
			console.log('Registration error:', error)
			setServerError(
				`Ошибка регистрации: ${
					error instanceof Error
						? error.message
						: 'Неизвестная ошибка'
				}`
			)
		} finally {
			setIsLoading(false)
		}
	}

	const handleGoogleSignUp = () => {
		// TODO: Implement Google OAuth
		console.log('Google sign up clicked')
		console.log(t('googleComingSoon'))
	}

	return (
		<div className='register-form'>
			{/* User Type Toggle */}
			<div className='register-form__user-type'>
				<button
					type='button'
					className={`register-form__user-type-btn ${
						watchedRole === 'customer'
							? 'register-form__user-type-btn--active'
							: ''
					}`}
					onClick={() => handleUserTypeChange('customer')}
				>
					{t('customer')}
				</button>
				<button
					type='button'
					className={`register-form__user-type-btn ${
						watchedRole === 'agent'
							? 'register-form__user-type-btn--active'
							: ''
					}`}
					onClick={() => handleUserTypeChange('agent')}
				>
					{t('agent')}
				</button>
			</div>
			{errors.role && (
				<p className='register-form__error-message'>
					{errors.role.message}
				</p>
			)}

			<form
				onSubmit={handleSubmit(onSubmit)}
				className='register-form__form'
			>
				{/* Hidden role field */}
				<input
					{...register('role')}
					type='hidden'
					value={watchedRole}
				/>

				{/* Full Name Field */}
				<div className='register-form__field'>
					<label htmlFor='fullName' className='register-form__label'>
						{t('fullName')}*
					</label>
					<input
						{...register('fullName')}
						type='text'
						id='fullName'
						placeholder={t('fullNamePlaceholder')}
						className={`register-form__input ${
							errors.fullName ? 'register-form__input--error' : ''
						}`}
						autoComplete='off'
					/>
					{errors.fullName && (
						<p className='register-form__error-message'>
							{errors.fullName.message}
						</p>
					)}
				</div>

				{/* Email Field */}
				<div className='register-form__field'>
					<label htmlFor='email' className='register-form__label'>
						{t('email')}*
					</label>
					<input
						{...register('email')}
						type='email'
						id='email'
						placeholder={t('emailPlaceholder')}
						className={`register-form__input ${
							errors.email ? 'register-form__input--error' : ''
						}`}
						autoComplete='off'
					/>
					{errors.email && (
						<p className='register-form__error-message'>
							{errors.email.message}
						</p>
					)}
				</div>

				{/* Password Field */}
				<div className='register-form__field'>
					<label htmlFor='password' className='register-form__label'>
						{t('password')}*
					</label>
					<div className='register-form__password-wrapper'>
						<input
							{...register('password')}
							type={showPassword ? 'text' : 'password'}
							id='password'
							placeholder={t('passwordPlaceholder')}
							className={`register-form__input ${
								errors.password
									? 'register-form__input--error'
									: ''
							}`}
							autoComplete='off'
						/>
						<button
							type='button'
							className='register-form__password-toggle'
							onClick={() => setShowPassword(!showPassword)}
							aria-label={
								showPassword
									? t('hidePassword')
									: t('showPassword')
							}
						>
							{showPassword ? (
								<svg
									width='20'
									height='20'
									viewBox='0 0 24 24'
									fill='none'
									stroke='currentColor'
								>
									<path d='M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24' />
									<line x1='1' y1='1' x2='23' y2='23' />
								</svg>
							) : (
								<svg
									width='20'
									height='20'
									viewBox='0 0 24 24'
									fill='none'
									stroke='currentColor'
								>
									<path d='M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z' />
									<circle cx='12' cy='12' r='3' />
								</svg>
							)}
						</button>
					</div>
					{errors.password && (
						<p className='register-form__error-message'>
							{errors.password.message}
						</p>
					)}
				</div>

				{/* Confirm Password Field */}
				<div className='register-form__field'>
					<label
						htmlFor='re_password'
						className='register-form__label'
					>
						Подтвердите пароль*
					</label>
					<div className='register-form__password-wrapper'>
						<input
							{...register('re_password')}
							type={showRePassword ? 'text' : 'password'}
							id='re_password'
							placeholder='Повторите пароль'
							className={`register-form__input ${
								errors.re_password
									? 'register-form__input--error'
									: ''
							}`}
							autoComplete='off'
						/>
						<button
							type='button'
							className='register-form__password-toggle'
							onClick={() => setShowRePassword(!showRePassword)}
							aria-label={
								showRePassword
									? 'Скрыть пароль'
									: 'Показать пароль'
							}
						>
							{showRePassword ? (
								<svg
									width='20'
									height='20'
									viewBox='0 0 24 24'
									fill='none'
									stroke='currentColor'
								>
									<path d='M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24' />
									<line x1='1' y1='1' x2='23' y2='23' />
								</svg>
							) : (
								<svg
									width='20'
									height='20'
									viewBox='0 0 24 24'
									fill='none'
									stroke='currentColor'
								>
									<path d='M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z' />
									<circle cx='12' cy='12' r='3' />
								</svg>
							)}
						</button>
					</div>
					{errors.re_password && (
						<p className='register-form__error-message'>
							{errors.re_password.message}
						</p>
					)}
				</div>

				{/* Divider */}
				<div className='register-form__divider'>
					<span className='register-form__divider-text'>
						{t('or')}
					</span>
				</div>

				{/* Google Sign Up Button */}
				<button
					type='button'
					onClick={handleGoogleSignUp}
					className='register-form__google-btn'
				>
					<svg width='20' height='20' viewBox='0 0 24 24'>
						<path
							fill='#4285F4'
							d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
						/>
						<path
							fill='#34A853'
							d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
						/>
						<path
							fill='#FBBC05'
							d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
						/>
						<path
							fill='#EA4335'
							d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
						/>
					</svg>
					{t('signUpWithGoogle')}
				</button>

				{/* Submit Button */}
				<button
					type='submit'
					disabled={isLoading}
					className='register-form__submit-btn'
				>
					{isLoading ? t('signingUp') : t('signUp')}
				</button>

				{/* Sign In Link */}
				<p className='register-form__signin-link'>
					{t('alreadyHaveAccount')}{' '}
					<Link
						href={`/${locale}/login`}
						className='register-form__link'
					>
						{t('signInNow')}
					</Link>
				</p>
			</form>
		</div>
	)
}
