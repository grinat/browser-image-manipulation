/* global describe, it, expect */
import {getFixture, getDiffOfFixture} from './helpers/fixture'
import {ImageManipulation} from '../src/ImageManipulation.js'

describe('Draw', () => {
    it('draw line', async () => {
        const inputCanvas = getFixture('sample_portrait.jpg')

        const canvas = await new ImageManipulation()
            .loadCanvas(inputCanvas)
            .drawLine([[40, 40], [400, 400]])
            .saveAsCanvas()

        let diffPixels = getDiffOfFixture(canvas, 'draw_line_out.png', 'draw_line')
        expect(diffPixels).toBeLessThan(5)
    })

    it('draw polygon', async () => {
        const inputCanvas = getFixture('sample_portrait.jpg')

        const canvas = await new ImageManipulation()
            .loadCanvas(inputCanvas)
            .drawPolygon([[0, 0], [0, 400], [200, 400], [200, 0], [0, 0]])
            .saveAsCanvas()

        let diffPixels = getDiffOfFixture(canvas, 'draw_polygon_out.png', 'draw_polygon')
        expect(diffPixels).toBeLessThan(5)
    })
})
