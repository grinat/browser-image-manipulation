import {getExifTags} from '../helpers/exif'

/**
 * @param imageFile{File}
 * @param fixOrientation
 * @param readExif
 * @returns {function(): Promise<{canvas: HTMLCanvasElement, fileName: String}>}
 */
export function loadBlob (imageFile, {fixOrientation = false, readExif = false} = {}) {
    return () => new Promise((resolve, reject) => {
        let image = document.createElement('img')
        let reader = new FileReader()
        let exif = {}

        reader.onload = (data) => {
            exif = (fixOrientation || readExif) ? getExifTags(data.target.result) : {}

            image.src = data.target.result
        }

        reader.onerror = () => {
            reject(new Error('Image read error'))
        }

        image.onload = () => {
            let orientation = null
            if (fixOrientation) {
                orientation = exif['0th'] ? exif['0th']['Orientation'] : null
            }

            const canvas = createCanvasWithFixedOrientation(image, orientation)

            resolve({canvas, fileName: imageFile.name, exif})
        }

        image.onerror = () => {
            reject(new Error('Invalid image'))
        }

        reader.readAsDataURL(imageFile)
    })
}

/**
 * @source https://piexifjs.readthedocs.io/en/latest/sample.html#generates-rotated-jpeg
 * @param image
 * @param orientation
 * @returns {HTMLCanvasElement}
 */
function createCanvasWithFixedOrientation (image, orientation) {
    const canvas = document.createElement('canvas')
    canvas.width = image.width
    canvas.height = image.height
    const ctx = canvas.getContext('2d')
    let x = 0
    let y = 0
    ctx.save()

    if (orientation === 2) {
        x = -canvas.width
        ctx.scale(-1, 1)
    } else if (orientation === 3) {
        x = -canvas.width
        y = -canvas.height
        ctx.scale(-1, -1)
    } else if (orientation === 3) {
        x = -canvas.width
        y = -canvas.height
        ctx.scale(-1, -1)
    } else if (orientation === 4) {
        y = -canvas.height
        ctx.scale(1, -1)
    } else if (orientation === 5) {
        canvas.width = image.height
        canvas.height = image.width
        ctx.translate(canvas.width, canvas.height / canvas.width)
        ctx.rotate(Math.PI / 2)
        y = -canvas.width
        ctx.scale(1, -1)
    } else if (orientation === 6) {
        canvas.width = image.height
        canvas.height = image.width
        ctx.translate(canvas.width, canvas.height / canvas.width)
        ctx.rotate(Math.PI / 2)
    } else if (orientation === 7) {
        canvas.width = image.height
        canvas.height = image.width
        ctx.translate(canvas.width, canvas.height / canvas.width)
        ctx.rotate(Math.PI / 2)
        x = -canvas.height
        ctx.scale(-1, 1)
    } else if (orientation === 8) {
        canvas.width = image.height
        canvas.height = image.width
        ctx.translate(canvas.width, canvas.height / canvas.width)
        ctx.rotate(Math.PI / 2)
        x = -canvas.height
        y = -canvas.width
        ctx.scale(-1, -1)
    }

    ctx.drawImage(image, x, y)
    ctx.restore()

    return canvas
}
