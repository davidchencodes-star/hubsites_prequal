import {getRequestConfig} from 'next-intl/server';
import {headers} from 'next/headers';
import { logError } from '@/lib/logger';

export default getRequestConfig(async () => {
  // Get the request headers
  const headersList = await headers();
  const fullUrl = headersList.get('x-url') || '';

  // Parse locale from URL query parameter
  let locale = 'en'; // default locale

  try {
    if (fullUrl) {
      const url = new URL(fullUrl);
      const localeParam = url.searchParams.get('lang');
      
      // Validate locale parameter
      if (localeParam && ['en', 'es'].includes(localeParam)) {
        locale = localeParam;
      }
    }
  } catch (error) {
    logError('Error parsing locale from URL:', error);
  }

  return {
    locale,
    messages: (await import(`../../messages/${locale}.json`)).default
  };
});

