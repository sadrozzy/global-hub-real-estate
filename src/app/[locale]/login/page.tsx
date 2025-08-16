'use client'

import { use } from 'react'
import { useTranslations } from 'next-intl'
import Header from '@/components/Header/Header'
import Footer from '@/components/Footer/Footer'
import LoginForm from '@/components/LoginForm/LoginForm'
import './page.scss'

export default function LoginPage({
	params
}: {
	params: Promise<{ locale: string }>
}) {
	const { locale } = use(params)
	const t = useTranslations('Login')

	return (
		<div className='login-page'>
			<Header locale={locale} />
			<main className='login-page__main'>
				<div className='login-page__container'>
					<div className='login-page__content'>
						<div className='login-page__header'>
							<h1 className='login-page__title'>{t('title')}</h1>
							<p className='login-page__subtitle'>
								{t('subtitle')}
							</p>
						</div>
						<LoginForm />
					</div>
				</div>
			</main>
			<Footer locale={locale} />
		</div>
	)
}
