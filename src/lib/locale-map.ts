/**
 * WordPress → react-day-picker Locale Mapper
 *
 * Maps WordPress locale codes (e.g. "fr_FR", "ar", "zh_CN") to the
 * corresponding locale identifier exported from `react-day-picker/locale`
 * (which re-exports date-fns v4 locales plus DayPicker-specific labels).
 *
 * Usage:
 *   import { fr } from "react-day-picker/locale";
 *   import { wpLocaleToDayPickerKey } from "@wedevs/plugin-ui";
 *   // key = "fr"
 *
 *   Or use the helper hook:
 *   const locale = useWordPressLocale(); // returns a live Locale object
 */

export type DayPickerLocaleKey =
  | "af" | "ar" | "arDZ" | "arEG" | "arMA" | "arSA" | "arTN"
  | "az" | "be" | "beTarask" | "bg" | "bn" | "bs" | "ca" | "ckb"
  | "cs" | "cy" | "da" | "de" | "deAT" | "el"
  | "enAU" | "enCA" | "enGB" | "enIE" | "enIN" | "enNZ" | "enUS" | "enZA"
  | "eo" | "es" | "et" | "eu" | "faIR" | "fi" | "fr" | "frCA" | "frCH"
  | "fy" | "gd" | "gl" | "gu" | "he" | "hi" | "hr" | "hu" | "hy"
  | "id" | "is" | "it" | "ja" | "ka" | "kk" | "km" | "kn" | "ko"
  | "lt" | "lv" | "mk" | "mn" | "ms" | "nb" | "nl" | "nlBE" | "nn"
  | "pl" | "pt" | "ptBR" | "ro" | "ru" | "sk" | "sl" | "sq" | "sr"
  | "sv" | "ta" | "te" | "th" | "tr" | "uk" | "uz" | "vi"
  | "zhCN" | "zhHK" | "zhTW";

/**
 * Full map of WordPress locale codes → react-day-picker/locale identifiers.
 *
 * WordPress locale codes: https://make.wordpress.org/polyglots/teams/
 * react-day-picker locales: https://daypicker.dev/docs/translation
 */
export const WP_TO_DAY_PICKER_LOCALE: Record<string, DayPickerLocaleKey> = {
  // English variants
  en_US: "enUS",
  en_GB: "enGB",
  en_AU: "enAU",
  en_CA: "enCA",
  en_NZ: "enNZ",
  en_ZA: "enZA",
  en_IE: "enIE",
  en_IN: "enIN",

  // French
  fr_FR: "fr",
  fr_BE: "fr",
  fr_CA: "frCA",
  fr_CH: "frCH",
  fr_LU: "fr",

  // German
  de_DE: "de",
  de_AT: "deAT",
  de_CH: "de",
  de_BE: "de",
  de_LU: "de",

  // Spanish
  es_ES: "es",
  es_AR: "es",
  es_MX: "es",
  es_CL: "es",
  es_CO: "es",
  es_PE: "es",
  es_VE: "es",
  es_CR: "es",
  es_EC: "es",
  es_GT: "es",
  es_HN: "es",
  es_NI: "es",
  es_PA: "es",
  es_PR: "es",
  es_UY: "es",
  es_BO: "es",
  es_DO: "es",
  es_PY: "es",
  es_SV: "es",

  // Italian
  it_IT: "it",
  it_CH: "it",

  // Portuguese
  pt_BR: "ptBR",
  pt_PT: "pt",

  // Dutch
  nl_NL: "nl",
  nl_BE: "nlBE",

  // Russian
  ru_RU: "ru",
  ru: "ru",

  // Polish
  pl_PL: "pl",
  pl: "pl",

  // Japanese
  ja: "ja",
  ja_JP: "ja",

  // Chinese
  zh_CN: "zhCN",
  zh_TW: "zhTW",
  zh_HK: "zhHK",
  zh_SG: "zhCN",

  // Korean
  ko_KR: "ko",
  ko: "ko",

  // Arabic
  ar: "ar",
  ar_SA: "arSA",
  ar_EG: "arEG",
  ar_DZ: "arDZ",
  ar_MA: "arMA",
  ar_TN: "arTN",
  ar_AE: "ar",
  ar_BH: "ar",
  ar_IQ: "ar",
  ar_JO: "ar",
  ar_KW: "ar",
  ar_LB: "ar",
  ar_LY: "ar",
  ar_OM: "ar",
  ar_QA: "ar",
  ar_SY: "ar",
  ar_YE: "ar",

  // Hebrew
  he_IL: "he",
  he: "he",

  // Persian / Farsi
  fa_IR: "faIR",
  fa: "faIR",

  // Kurdish (Sorani)
  ckb: "ckb",

  // Turkish
  tr_TR: "tr",
  tr: "tr",

  // Swedish
  sv_SE: "sv",
  sv: "sv",

  // Norwegian
  nb_NO: "nb",
  nb: "nb",
  nn_NO: "nn",
  nn: "nn",

  // Danish
  da_DK: "da",
  da: "da",

  // Finnish
  fi: "fi",
  fi_FI: "fi",

  // Hungarian
  hu_HU: "hu",
  hu: "hu",

  // Czech
  cs_CZ: "cs",
  cs: "cs",

  // Slovak
  sk_SK: "sk",
  sk: "sk",

  // Romanian
  ro_RO: "ro",
  ro: "ro",

  // Bulgarian
  bg_BG: "bg",
  bg: "bg",

  // Croatian
  hr_HR: "hr",
  hr: "hr",

  // Ukrainian
  uk: "uk",
  uk_UA: "uk",

  // Greek
  el_GR: "el",
  el: "el",

  // Indonesian
  id_ID: "id",
  id: "id",

  // Malay
  ms_MY: "ms",
  ms: "ms",

  // Thai
  th: "th",
  th_TH: "th",

  // Vietnamese
  vi: "vi",
  vi_VN: "vi",

  // Bengali
  bn_BD: "bn",
  bn: "bn",

  // Serbian
  sr_RS: "sr",
  sr: "sr",

  // Catalan
  ca: "ca",

  // Welsh
  cy: "cy",

  // Basque
  eu: "eu",

  // Galician
  gl_ES: "gl",
  gl: "gl",

  // Lithuanian
  lt_LT: "lt",
  lt: "lt",

  // Latvian
  lv: "lv",
  lv_LV: "lv",

  // Estonian
  et_EE: "et",
  et: "et",

  // Slovenian
  sl_SI: "sl",
  sl: "sl",

  // Afrikaans
  af: "af",

  // Azerbaijani
  az: "az",
  az_AZ: "az",

  // Belarusian
  be: "be",
  be_BY: "be",

  // Bosnian
  bs_BA: "bs",
  bs: "bs",

  // Macedonian
  mk_MK: "mk",
  mk: "mk",

  // Mongolian
  mn: "mn",

  // Albanian
  sq: "sq",
  sq_AL: "sq",

  // Armenian
  hy: "hy",
  hy_AM: "hy",

  // Uzbek
  uz_UZ: "uz",
  uz: "uz",

  // Georgian
  ka_GE: "ka",
  ka: "ka",

  // Hindi
  hi_IN: "hi",
  hi: "hi",

  // Gujarati
  gu: "gu",

  // Kazakh
  kk: "kk",

  // Khmer
  km: "km",

  // Kannada
  kn: "kn",

  // Icelandic
  is_IS: "is",
  is: "is",

  // Tamil
  ta: "ta",
  ta_IN: "ta",

  // Telugu
  te: "te",

  // Esperanto
  eo: "eo",
};

/**
 * RTL WordPress locales.
 * Used to auto-set `dir="rtl"` on the calendar.
 */
export const RTL_WP_LOCALES = new Set<string>([
  "ar", "ar_SA", "ar_EG", "ar_DZ", "ar_MA", "ar_TN",
  "ar_AE", "ar_BH", "ar_IQ", "ar_JO", "ar_KW", "ar_LB",
  "ar_LY", "ar_OM", "ar_QA", "ar_SY", "ar_YE",
  "he", "he_IL",
  "fa", "fa_IR",
  "ckb",
  "ur", "ur_PK",
]);

/**
 * Converts a WordPress locale code to a react-day-picker locale key.
 *
 * @example
 *   wpLocaleToDayPickerKey("fr_FR") // → "fr"
 *   wpLocaleToDayPickerKey("zh_CN") // → "zhCN"
 *   wpLocaleToDayPickerKey("unknown") // → "enUS" (fallback)
 */
export function wpLocaleToDayPickerKey(wpLocale: string): DayPickerLocaleKey {
  if (WP_TO_DAY_PICKER_LOCALE[wpLocale]) {
    return WP_TO_DAY_PICKER_LOCALE[wpLocale];
  }

  // Try matching by base language code (e.g., "fr" from "fr_BE_extra")
  const langCode = wpLocale.split("_")[0].toLowerCase();
  const entry = Object.entries(WP_TO_DAY_PICKER_LOCALE).find(
    ([key]) => key.toLowerCase() === langCode
  );
  if (entry) return entry[1];

  return "enUS";
}

/**
 * Returns true if the given WordPress locale is RTL.
 */
export function isWpLocaleRtl(wpLocale: string): boolean {
  if (RTL_WP_LOCALES.has(wpLocale)) return true;
  const langCode = wpLocale.split("_")[0];
  return RTL_WP_LOCALES.has(langCode);
}
