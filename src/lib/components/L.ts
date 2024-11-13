import { setLocale } from '../../i18n/i18n-svelte';
import { loadAllLocales } from '../../i18n/i18n-util.sync';
import { baseLocale, i18n, isLocale } from '../../i18n/i18n-util';

loadAllLocales();

const rawLocale = navigator.language;
const parsedLocale = rawLocale?.split('-')[0] || baseLocale;
const locale = isLocale(parsedLocale) ? parsedLocale : baseLocale;

setLocale(locale);
const L = i18n();

export default L[locale];
