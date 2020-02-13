import Pica from 'pica/dist/pica'

import {RESIZE_TYPE_SQUARE, RESIZE_TYPE_TO} from '../constants'

/**
 * @param newWidth{number} - new width after crop.
 * @param newHeight{number} - new height after crop.
 * @param offsetX{number} - If specified, cropping will start from that offset on X axis,
 * otherwise it will crop so result is centered in the source
 * @param offsetY{number} - If specified, cropping will start from that offset on Y axis,
 * otherwise it will crop so result is centered in the source
 * @returns {function(*=): Promise<HTMLCanvasElement>}
 */
 export function imageCrop(newWidth, newHeight, offsetX = 0, offsetY = 0) {
    return (canvasImage) => new Promise((resolve, reject) => {
        let dx = 0
        let dy = 0
        let sx = 0
        let sy = 0
        let width = canvasImage.width
        let height = canvasImage.height

        sy = offsetY || (height - newHeight) / 2
        sx = offsetX || (width - newWidth) / 2

        let cropedCanvas = document.createElement('canvas')
        let cropedCanvasCtx = cropedCanvas.getContext('2d')
        cropedCanvas.width = newWidth
        cropedCanvas.height = newHeight

        cropedCanvasCtx.drawImage(canvasImage, sx, sy, newWidth, newHeight, dx, dy, newWidth, newHeight)

        resolve(cropedCanvas)
    })
 }

/**
 * @param maxWidth
 * @param maxHeight
 * @param type
 * @param options{Object}
 * @returns {function(*=): Promise<HTMLCanvasElement>}
 */
export function imageResize (maxWidth, maxHeight, type = null, options = {}) {
    let resizeOptions = Object.assign({
        pica: {},
        picaInit: {}
    }, options)

    if (!resizeOptions.picaInit.features) {
        resizeOptions.picaInit.features = ['js']
    }

    return (canvasImage) => new Promise((resolve, reject) => {
        let outputCanvas = null
        let canvas = document.createElement('canvas')
        let ratio = 0
        let width = canvasImage.width
        let height = canvasImage.height
        let newHeight = 0
        let newWidth = 0

        if (type === RESIZE_TYPE_SQUARE) {
            if (width < height) {
                ratio = maxWidth / width
            } else {
                ratio = maxHeight / height
            }
            newHeight = height * ratio
            newWidth = width * ratio
        } else if (type === RESIZE_TYPE_TO) {
            let ratioWidth = width / maxWidth
            let ratioHeight = height / maxHeight
            if (ratioWidth > ratioHeight) {
                newHeight = Math.round(height / ratioWidth)
                newWidth = maxWidth
            } else {
                newWidth = Math.round(width / ratioHeight)
                newHeight = maxHeight
            }
        } else {
            reject(new Error('Unknown resize type'))
        }

        canvas.width = newWidth
        canvas.height = newHeight

        let picaInstanse = new Pica(resizeOptions.picaInit)
        picaInstanse.resize(canvasImage, canvas, resizeOptions.pica).then(resizedCanvas => {
            if (type === RESIZE_TYPE_SQUARE) {
                let dx = 0
                let dy = 0
                let sx = 0
                let sy = 0

                if (newWidth < newHeight) {
                    sy = (newHeight - newWidth) / 2
                    newHeight = newWidth
                } else {
                    sx = (newWidth - newHeight) / 2
                    newWidth = newHeight
                }
                let cropedCanvas = document.createElement('canvas')
                let cropedCanvasCtx = cropedCanvas.getContext('2d')
                cropedCanvas.width = newWidth
                cropedCanvas.height = newHeight

                cropedCanvasCtx.drawImage(resizedCanvas, sx, sy, newWidth, newHeight, dx, dy, newWidth, newHeight)

                outputCanvas = cropedCanvas
            } else {
                outputCanvas = resizedCanvas
            }
            resolve(outputCanvas)
        })
    })
}
