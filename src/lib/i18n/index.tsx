import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Import locale files
import enTranslations from './locales/en.json';
import esTranslations from './locales/es.json';

export type Locale = 'en' | 'es';

export interface I18nState {
  locale: Locale;
  translations: typeof enTranslations;
  setLocale: (locale: Locale) => void;
  t: (key: string, params?: Record<string, any>) => string;
}

const locales = {
  en: enTranslations,
  es: esTranslations
} as const;

export const supportedLocales: { value: Locale; label: string; flag: string }[] = [
  { value: 'en', label: 'English', flag: '🇺🇸' },
  { value: 'es', label: 'Español', flag: '🇪🇸' }
];

// Helper function to get nested translation value
function getNestedValue(obj: any, path: string): string | undefined {
  return path.split('.').reduce((current, key) => current?.[key], obj);
}

// Helper function to interpolate params in translation string
function interpolate(str: string, params: Record<string, any>): string {
  return str.replace(/\{\{(\w+)\}\}/g, (match, key) => {
    return params[key]?.toString() || match;
  });
}

export const useI18n = create<I18nState>()(
  persist(
    (set, get) => ({
      locale: 'en',
      translations: enTranslations,
      
      setLocale: (locale: Locale) => {
        const translations = locales[locale];
        if (translations) {
          set({ locale, translations });
          // Update document language only on client
          if (typeof document !== 'undefined') {
            document.documentElement.lang = locale;
          }
        }
      },
      
      t: (key: string, params?: Record<string, any>) => {
        const { translations, locale } = get();
        let value = getNestedValue(translations, key);
        
        // Fallback to English if translation not found
        if (!value && locale !== 'en') {
          value = getNestedValue(enTranslations, key);
        }
        
        // If still not found, return the key
        if (!value) {
          console.warn(`Translation missing for key: ${key}`);
          return key;
        }
        
        // Interpolate params if provided
        if (params) {
          return interpolate(value, params);
        }
        
        return value;
      }
    }),
    {
      name: 'i18n-storage',
      partialize: (state) => ({ locale: state.locale })
    }
  )
);

// Hook for using translations
export const useTranslation = () => {
  const { t, locale, setLocale } = useI18n();
  
  return {
    t,
    locale,
    setLocale,
    locales: supportedLocales
  };
};

// HOC for wrapping components with translation context
export function withTranslation<P extends object>(
  Component: React.ComponentType<P & { t: (key: string, params?: Record<string, any>) => string }>
) {
  return function WithTranslationComponent(props: P) {
    const { t } = useTranslation();
    return <Component {...props} t={t} />;
  };
}

// Utility function for formatting dates based on locale
export function formatDate(date: Date | string, locale: Locale, options?: Intl.DateTimeFormatOptions): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options
  };
  
  return new Intl.DateTimeFormat(locale, defaultOptions).format(dateObj);
}

// Utility function for formatting numbers based on locale
export function formatNumber(num: number, locale: Locale, options?: Intl.NumberFormatOptions): string {
  return new Intl.NumberFormat(locale, options).format(num);
}

// Utility function for formatting currency based on locale
export function formatCurrency(amount: number, locale: Locale, currency: string = 'USD'): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency
  }).format(amount);
}

// Utility function for relative time formatting
export function formatRelativeTime(date: Date | string, locale: Locale): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - dateObj.getTime()) / 1000);
  
  const { t } = useI18n.getState();
  
  if (diffInSeconds < 60) {
    return t('time.justNow');
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return t('time.minutesAgo', { count: minutes });
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return t('time.hoursAgo', { count: hours });
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return t('time.daysAgo', { count: days });
  } else if (diffInSeconds < 2592000) {
    const weeks = Math.floor(diffInSeconds / 604800);
    return t('time.weeksAgo', { count: weeks });
  } else {
    const months = Math.floor(diffInSeconds / 2592000);
    return t('time.monthsAgo', { count: months });
  }
}

// Initialize locale from stored preference or browser language
export function initializeI18n() {
  // Only run on client
  if (typeof window === 'undefined') {
    return;
  }
  
  const storedLocale = localStorage.getItem('i18n-storage');
  if (storedLocale) {
    try {
      const { state } = JSON.parse(storedLocale);
      if (state?.locale && locales[state.locale as Locale]) {
        useI18n.getState().setLocale(state.locale);
        return;
      }
    } catch (error) {
      console.error('Failed to parse stored locale:', error);
    }
  }
  
  // Fallback to browser language
  const browserLang = navigator.language.split('-')[0];
  if (browserLang === 'es') {
    useI18n.getState().setLocale('es');
  }
}