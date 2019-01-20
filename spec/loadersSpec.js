/* global describe, it, expect */
import {ImageManipulation} from '../src/ImageManipulation.js'
import {getDiffOfFixture, getFixtureFile} from './helpers/fixture'

describe('Loaders', () => {
    it('load image file by blob', async () => {
        const imageFile = getFixtureFile('sample_portrait.jpg')

        const canvas = await new ImageManipulation()
            .loadBlob(imageFile)
            .toCircle(100)
            .saveAsCanvas()

        let diffPixels = getDiffOfFixture(canvas, 'circle_out.png', 'load-blob')
        expect(diffPixels).toBeLessThan(5)
    })

    it('load non image file by blob', async () => {
        const imageFile = getFixtureFile('text.txt')

        try {
            await new ImageManipulation()
                .loadBlob(imageFile)
                .toCircle(100)
                .saveAsCanvas()
            expect(false).toBeTruthy()
        } catch (e) {
            expect(true).toBeTruthy()
        }
    })
})
