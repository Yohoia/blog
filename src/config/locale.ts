export const localeMetadata = {
  zh: { language: "zh-CN", dateLocale: "zh-CN", ogLocale: "zh_CN" },
  en: { language: "en", dateLocale: "en-US", ogLocale: "en_US" },
} as const;
export type Locale = keyof typeof localeMetadata;
