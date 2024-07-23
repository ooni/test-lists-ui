/** @type {import('next').NextConfig} */

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
})

const webpack = require('webpack')
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

module.exports = withBundleAnalyzer({
  output: 'standalone',
  reactStrictMode: true,
  swcMinify: true,
  i18n: {
    locales: getSupportedLanguages(),
    defaultLocale: DEFAULT_LOCALE,
  },
  compiler: {
    // see https://styled-components.com/docs/tooling#babel-plugin for more info on the options.
    styledComponents: {
      ssr: true,
    },
  },
  webpack: (config, options) => {
    config.plugins.push(
      new options.webpack.DefinePlugin({
        'process.env.DEFAULT_LOCALE': DEFAULT_LOCALE,
        'process.env.LOCALES': JSON.stringify(getSupportedLanguages()),
      }),
    )

    return config
  },
})
