/*
  'context': [
    ['regex to match with rawMessage', 'Pretty Message']
  ]
*/

type PatternMessagePairs = Array<[RegExp, string]>

const commonErrorsMap: PatternMessagePairs = [
  [/is duplicate$/, 'This URL is already part of this list.'],
  [/Invalid URL$/, 'The URL is not in a valid format. Here is an example of a valid one: http://ooni.org/']
]

type ErrorsMapType = {
  [key: string]: PatternMessagePairs
}

const errorsMap: ErrorsMapType = {
  add: [
    ...commonErrorsMap,
  ],
  edit: [
    ...commonErrorsMap,
  ]
}

export const getPrettyErrorMessage = (rawErrorMessage: string, context: string): string => {
  if (context in errorsMap) {
    return errorsMap[context].find(([regex]) => regex.test(rawErrorMessage))?.[1] ?? rawErrorMessage
  }
  return rawErrorMessage
}
