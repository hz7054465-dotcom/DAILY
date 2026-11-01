import { useCallback } from 'react';
import { useSettings } from '@/hooks/useSettings';
import { TKey, TParams, translate } from '@/constants/i18n';

export function useI18n() {
  const { settings } = useSettings();
  const lang = settings.language;
  const t = useCallback((key: TKey, params?: TParams) => translate(lang, key, params), [lang]);
  return { t, lang, isRTL: lang === 'ar', locale: lang === 'ar' ? 'ar-EG' : 'en-US' };
}
