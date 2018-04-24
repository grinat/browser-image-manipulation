import pica from 'pica/dist/pica'

import {RESIZE_TYPE_SQUARE, RESIZE_TYPE_TO} from '../types/types'

export default function (maxWidth = 200, maxHeight = 100, type = null, options = {}) {
    let resizeOptions = Object.assign({
        pica: {}
    }, options)

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
        } else if(type === RESIZE_TYPE_TO) {
            ratio = width / height
            if (width > height) {
                newHeight = maxWidth / ratio
                newWidth = maxWidth
            } else {
                newHeight = maxHeight
                newWidth = maxHeight * ratio
            }
        } else {
            reject(new Error('Unknown resize type'))
        }

        canvas.width = newWidth
        canvas.height = newHeight

        let picaInstanse = new pica()
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