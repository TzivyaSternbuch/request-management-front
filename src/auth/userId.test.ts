import { describe, expect, it } from 'vitest'
import { parseUserId } from './userId'

describe('parseUserId', () => {
  it.each([
    ['12', 12],
    ['', null],
    ['1.5', null],
    ['0', null],
    ['2147483648', null],
  ])('parses "%s" as %s', (text, expected) => {
    expect(parseUserId(text)).toBe(expected)
  })
})
