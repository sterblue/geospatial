import { fromPairs, toPairs, filter } from 'ramda'

export const toto = (x: number) => 2 * x

export const tutu = (x: { [key: string]: any }): { [key: string]: any } => fromPairs(filter(([key, value]: [string, any]) => key != "tutu", toPairs(x)))