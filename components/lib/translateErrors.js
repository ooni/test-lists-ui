/*
  'context': [
    ['regex to match with rawMessage', 'Pretty Message']
  ]
*/

const commonErrorsMap = [
  [/is duplicate$/, 'This URL is already part of this list.'],
  [/Invalid URL$/, 'The URL is not in a valid format. Here is an example of a valid one: http://ooni.org/']
]

const errorsMap = {
  add: [
    ...commonErrorsMap,
  ],
  edit: [
    ...commonErrorsMap,
  ]
}

export const getPrettyErrorMessage = (rawErrorMessage, context) => {
  if (context in errorsMap) {
    return errorsMap[context].find(([regex, prettyMessage]) => regex.test(rawErrorMessage))?.[1] ?? rawErrorMessage
  }
  return rawErrorMessage
}
