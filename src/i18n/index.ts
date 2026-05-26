import { es } from './es';
import { en } from './en';
import type { TranslationKey } from './es';

export type Lang = 'es' | 'en';

const translations = { es, en } as const;

export function getLangFromUrl(url: URL): Lang {
  const [, lang] = url.pathname.split('/');
  if (lang === 'en') return 'en';
  return 'es';
}

export function useTranslations(lang: Lang) {
  return function t(key: TranslationKey): string {
    return (translations[lang][key] ?? translations['es'][key] ?? key) as string;
  };
}

export { es, en };
