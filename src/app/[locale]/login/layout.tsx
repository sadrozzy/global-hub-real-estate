import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import '../../../styles/globals.scss';

export default async function LoginLayout({
  children,
  params
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  let messages = {};
  try {
    const common = (await import(`../../../../messages/common/${locale}.json`)).default;
    const login = (await import(`../../../../messages/login/${locale}.json`)).default;
    messages = { ...common, ...login };
  } catch (error) {
    notFound();
  }

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
