/* global describe, it, expect */
import {getFixture, getDiffOfFixture} from './helpers/fixture'
import {ImageManipulation} from '../src/ImageManipulation.js'

describe('Variations', () => {
    it('resize and return canvas and base64 image', async () => {
        const inputCanvas = getFixture('sample_portrait.jpg')

        const iM = new ImageManipulation()
            .loadCanvas(inputCanvas)

        const canvas = await iM
            .centerInRectangle(150, 75)
            .saveAsCanvas()

        let diffPixels = getDiffOfFixture(canvas, 'resize_out.png', 'base64')
        expect(diffPixels).toBeLessThan(5)

        const base64 = await iM
            .saveAsImage()

        expect(base64).toMatch('data:image')
    })

    it('multiple actions', async () => {
        const inputCanvas = getFixture('sample_portrait.jpg')

        const canvas = await new ImageManipulation()
            .loadCanvas(inputCanvas)
            .pixelize()
            .toGrayscale()
            .toSquare(150)
            .saveAsCanvas()

        let diffPixels = getDiffOfFixture(canvas, 'multiple_out.png', 'multiple')
        expect(diffPixels).toBeLessThan(5)
    })
})
