import { describe, expect, it } from 'bun:test'
import worksheet from './__mocks__/worksheet.json'
import { toMapData } from './toMapData'

describe('toMapData', () => {
  it('should transform worksheet to map data', () => {
    expect(toMapData(worksheet)).toMatchSnapshot()
  })
})
