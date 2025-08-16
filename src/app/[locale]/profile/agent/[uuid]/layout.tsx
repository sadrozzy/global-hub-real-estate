import { NextIntlClientProvider } from 'next-intl'
import { notFound } from 'next/navigation'
import '../../../../../styles/globals.scss'

export default async function AgentProfileLayout({
	children,
	params
}: {
	children: React.ReactNode
	params: Promise<{ locale: string; uuid: string }>
}) {
	const { locale } = await params
	let messages = {}
	try {
		const common = (
			await import(`../../../../../../messages/common/${locale}.json`)
		).default
		const agentProfile = (
			await import(
				`../../../../../../messages/agent-profile/${locale}.json`
			)
		).default
		const listProperty = (
			await import(
				`../../../../../../messages/list-property/${locale}.json`
			)
		).default
		messages = { ...common, ...agentProfile, ...listProperty }
	} catch (error) {
		notFound()
	}

	return (
		<NextIntlClientProvider locale={locale} messages={messages}>
			{children}
		</NextIntlClientProvider>
	)
}
