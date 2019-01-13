/* global describe, it, expect, beforeEach */
import {getFixture, getDiffOfFixture} from './helpers/fixture'
import ImageManipulation from '../src/ImageManipulation.js'

describe('Manipulations', () => {
    it('convert image to 50 px circle', async () => {
        const inputCanvas = getFixture('sample_portrait.jpg')

        const canvas = await new ImageManipulation()
            .loadCanvas(inputCanvas)
            .toCircle(100)
            .saveAsCanvas()

        let diffPixels = getDiffOfFixture(canvas, 'circle_out.png', 'circle')
        expect(diffPixels).toBeLessThan(5)
    })

    it('rotate image by 180 dedree', async () => {
        const inputCanvas = getFixture('sample_portrait.jpg')

        const canvas = await new ImageManipulation()
            .loadCanvas(inputCanvas)
            .rotate(180)
            .saveAsCanvas()

        let diffPixels = getDiffOfFixture(canvas, 'rotate_out.png', 'rotate')
        expect(diffPixels).toBeLessThan(5)
    })

    it('resize with put center in rectangle to 150x75', async () => {
        const inputCanvas = getFixture('sample_portrait.jpg')

        const canvas = await new ImageManipulation()
            .loadCanvas(inputCanvas)
            .centerInRectangle(150, 75)
            .saveAsCanvas()

        let diffPixels = getDiffOfFixture(canvas, 'resize_out.png', 'resize')
        expect(diffPixels).toBeLessThan(5)
    })
})
