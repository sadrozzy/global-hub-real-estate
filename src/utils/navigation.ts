import { redirect } from 'next/navigation';

/**
 * Redirect to the locale home page
 * @param locale - The locale to redirect to (e.g., 'en', 'es')
 */
export function redirectToLocaleHome(locale: string) {
  redirect(`/${locale}`);
}

/**
 * Get the current locale from the pathname
 * @param pathname - The current pathname
 * @returns The current locale or 'en' as default
 */
export function getCurrentLocale(pathname: string): string {
  const segments = pathname.split('/');
  return segments[1] || 'en';
}

/**
 * Navigate to a specific page within the current locale
 * @param locale - The current locale
 * @param page - The page path (without leading slash)
 * @returns The full path with locale
 */
export function getLocalePath(locale: string, page: string = ''): string {
  return `/${locale}${page ? `/${page}` : ''}`;
}



/**
 * Navigate back in browser history (client-side only)
 */
export function goBack() {
  if (typeof window !== 'undefined') {
    window.history.back();
  }
}