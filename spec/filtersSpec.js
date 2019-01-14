/* global describe, it, expect */
import {getFixture, getDiffOfFixture} from './helpers/fixture'
import {ImageManipulation} from '../src/ImageManipulation.js'

describe('Filters', () => {
    it('grayscale image', async () => {
        const inputCanvas = getFixture('sample_portrait.jpg')

        const canvas = await new ImageManipulation()
            .loadCanvas(inputCanvas)
            .toGrayscale()
            .saveAsCanvas()

        let diffPixels = getDiffOfFixture(canvas, 'gray_out.png', 'grayscale')
        expect(diffPixels).toBeLessThan(5)
    })

    it('pixelize image', async () => {
        const inputCanvas = getFixture('sample_portrait.jpg')

        const canvas = await new ImageManipulation()
            .loadCanvas(inputCanvas)
            .pixelize()
            .saveAsCanvas()

        let diffPixels = getDiffOfFixture(canvas, 'pixelize_out.png', 'pixelize')
        expect(diffPixels).toBeLessThan(5)
    })

    it('gaussianBlur', async () => {
        const inputCanvas = getFixture('sample_portrait.jpg')

        const canvas = await new ImageManipulation()
            .loadCanvas(inputCanvas)
            .gaussianBlur()
            .saveAsCanvas()

        let diffPixels = getDiffOfFixture(canvas, 'gaussian_blur_out.png', 'gaussianBlur')
        expect(diffPixels).toBeLessThan(5)
    })
})
