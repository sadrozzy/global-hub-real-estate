import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import '../../../styles/globals.scss';

export default async function RegisterLayout({
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
    const register = (await import(`../../../../messages/register/${locale}.json`)).default;
    messages = { ...common, ...register };
  } catch (error) {
    notFound();
  }

  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  );
}
