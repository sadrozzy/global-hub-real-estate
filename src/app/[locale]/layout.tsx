import '@/styles/globals.scss';
import { NextIntlClientProvider } from 'next-intl';
import { notFound } from 'next/navigation';
import { ReactNode } from 'react';

export function generateStaticParams() {
  return [{ locale: 'en' }, { locale: 'es' }];
}

export default async function LocaleLayout({
  children,
  params
}: {
  children: ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  let messages = {};
  try {
    // Load common messages and home messages for the main layout
    const common = (await import(`../../../messages/common/${locale}.json`)).default;
    const home = (await import(`../../../messages/home/${locale}.json`)).default;
    
    // Try to load search messages if they exist
    let search = {};
    try {
      search = (await import(`../../../messages/search/${locale}.json`)).default;
    } catch (searchError) {
      // Search messages are optional, continue without them
    }
    
    messages = { ...common, ...home, ...search };
  } catch (error) {
    notFound();
  }

  return (
    <html lang={locale} className="scroll-smooth">
      <body className="font-sans antialiased min-h-screen">
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}