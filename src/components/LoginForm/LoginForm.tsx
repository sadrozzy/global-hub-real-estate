'use client'

import { useState } from 'react'
import { useLocale, useTranslations } from 'next-intl'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { loginAction } from '@/lib/auth/actions'
import './LoginForm.scss'

const createLoginSchema = (t: (key: string) => string) =>
	z.object({
		email: z
			.string()
			.min(1, t('errors.emailRequired'))
			.email(t('errors.emailInvalid')),
		password: z
			.string()
			.min(1, t('errors.passwordRequired'))
			.min(6, t('errors.passwordMinLength'))
	})

export default function LoginForm() {
	const t = useTranslations('Login')
	const locale = useLocale()
	const router = useRouter()
	const [showPassword, setShowPassword] = useState(false)
	const [isLoading, setIsLoading] = useState(false)
	const [serverError, setServerError] = useState<string>('')

	type LoginFormData = z.infer<ReturnType<typeof createLoginSchema>>
	const loginSchema = createLoginSchema(t)

	const {
		register,
		handleSubmit,
		formState: { errors },
		reset
	} = useForm<LoginFormData>({
		resolver: zodResolver(loginSchema),
		mode: 'all'
	})

	const onSubmit = async (data: LoginFormData) => {
		setIsLoading(true)
		setServerError('')

		try {
			const formDataObj = new FormData()
			formDataObj.append('email', data.email)
			formDataObj.append('password', data.password)

			console.log('Submitting login form...')
			const result = await loginAction({
				email: data.email,
				password: data.password
			})

			if (result?.error) {
				setServerError(result.error)
			} else if (result?.success) {
				router.push(`/${locale}/profile/agent/me`)
			}
		} catch (error) {
			// setServerError(tErrors('loginFailed'))
		} finally {
			setIsLoading(false)
		}
	}

	const handleGoogleSignIn = () => {
		// TODO: Implement Google OAuth
		console.log('Google sign in clicked')
		alert(t('googleComingSoon'))
	}

	return (
		<div className='login-form'>
			<form
				onSubmit={handleSubmit(onSubmit)}
				className='login-form__form'
			>
				{/* Email Field */}
				<div className='login-form__field'>
					<label htmlFor='email' className='login-form__label'>
						{t('email')}*
					</label>
					<input
						{...register('email')}
						type='email'
						id='email'
						placeholder={t('emailPlaceholder')}
						className={`login-form__input ${
							errors.email ? 'login-form__input--error' : ''
						}`}
						autoComplete='off'
					/>
					{errors.email && (
						<p className='login-form__error-message'>
							{errors.email.message}
						</p>
					)}
				</div>

				{/* Password Field */}
				<div className='login-form__field'>
					<label htmlFor='password' className='login-form__label'>
						{t('password')}*
					</label>
					<div className='login-form__password-wrapper'>
						<input
							{...register('password')}
							type={showPassword ? 'text' : 'password'}
							id='password'
							placeholder={t('passwordPlaceholder')}
							className={`login-form__input ${
								errors.password
									? 'login-form__input--error'
									: ''
							}`}
							autoComplete='off'
						/>
						<button
							type='button'
							className='login-form__password-toggle'
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
						<p className='login-form__error-message'>
							{errors.password.message}
						</p>
					)}
				</div>

				{/* Forgot Password Link */}
				<div className='login-form__forgot-password'>
					<Link
						href={`/${locale}/forgot-password`}
						className='login-form__link'
					>
						{t('forgotPassword')}
					</Link>
				</div>

				{/* Divider */}
				<div className='login-form__divider'>
					<span className='login-form__divider-text'>{t('or')}</span>
				</div>

				{/* Google Sign In Button */}
				<button
					type='button'
					onClick={handleGoogleSignIn}
					className='login-form__google-btn'
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
					{t('signInWithGoogle')}
				</button>

				{/* Submit Button */}
				<button
					type='submit'
					disabled={isLoading}
					className='login-form__submit-btn'
				>
					{isLoading ? t('signingIn') : t('signIn')}
				</button>

				{/* Server Error Display */}
				{serverError && (
					<div className='login-form__server-error'>
						<p className='login-form__error-message'>
							{serverError}
						</p>
					</div>
				)}

				{/* Sign Up Link */}
				<p className='login-form__signup-link'>
					{t('dontHaveAccount')}{' '}
					<Link
						href={`/${locale}/register`}
						className='login-form__link'
					>
						{t('signUpNow')}
					</Link>
				</p>
			</form>
		</div>
	)
}
