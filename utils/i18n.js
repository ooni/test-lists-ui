export const getLocale = (locale) => {
  if (locale === 'zh-CN') return 'zh-Hans'
  if (locale === 'pt-BR') return 'pt'
  return locale
}

export const getLocalisedRegionName = (regionCode, locale) => {
  const l = getLocale(locale)
  try {
    return new Intl.DisplayNames([l], { type: 'region' }).of(String(regionCode))
  } catch (e) {
    return regionCode
  }
}

export const getLocalisedLanguageName = (regionCode, locale) => {
  const l = getLocale(locale)

  try {
    return new Intl.DisplayNames([l], { type: 'language' }).of(
      String(regionCode),
    )
  } catch (e) {
    return regionCode
  }
}
