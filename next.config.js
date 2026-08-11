/** @type {import('next').NextConfig} */

const glob = require('glob')
const { basename } = require('node:path')

const LANG_DIR = './public/static/lang/'
const DEFAULT_LOCALE = 'en'

function getSupportedLanguages() {
  const supportedLanguages = new Set()
  supportedLanguages.add(DEFAULT_LOCALE) // at least 1 supported language
  // biome-ignore lint/complexity/noForEach: <explanation>
  glob
    .sync(`${LANG_DIR}/**/*.json`)
    .forEach((f) => supportedLanguages.add(basename(f, '.json')))
  return [...supportedLanguages]
}

module.exports = {
  output: 'standalone',
  reactStrictMode: true,
  env: {
    LOCALES: JSON.stringify(getSupportedLanguages()),
  },
  i18n: {
    locales: getSupportedLanguages(),
    defaultLocale: DEFAULT_LOCALE,
  },
}
