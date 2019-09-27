/* global describe, it, expect */
import {pointsTo2DArray} from '../src/helpers/pointsTo2DArray'

describe('Helpers', () => {
    it('pointsTo2DArray', () => {
        expect(
            pointsTo2DArray([0, 0, 0, 400, 200, 400, 200, 0, 0, 0])
        ).toEqual(
            [[0, 0], [0, 400], [200, 400], [200, 0], [0, 0]]
        )

        expect(
            pointsTo2DArray([[0, 0], [0, 400], [200, 400], [200, 0], [0, 0]])
        ).toEqual(
            [[0, 0], [0, 400], [200, 400], [200, 0], [0, 0]]
        )
    })
})
