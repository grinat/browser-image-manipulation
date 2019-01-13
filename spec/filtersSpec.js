/* global describe, it, expect, beforeEach */
import {getFixture, getDiffOfFixture} from './helpers/fixture'
import ImageManipulation from '../src/ImageManipulation.js'

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
})
