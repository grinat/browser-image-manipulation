import pica from 'pica/dist/pica'

const RESIZE_TYPE_SQUARE = 'square'
const RESIZE_TYPE_TO = 'to'

class ImageManipulation {
    _tasks = []
    _fileName = null
    _fileOptions = {
        type: 'image/jpeg'
    }
    _canvas = null
    _image = null

    constructor() {
        this.pica = pica()
    }

    loadBlob(imageFile) {
        this._tasks.push(() => new Promise((resolve, reject) => {
            this._fileName = imageFile.name
            this._fileOptions = {
                type: imageFile.type
            }
            this._image = document.createElement('img')
            let reader = new FileReader()
            reader.onload = (data) => {
                this._image.src = data.target.result
            }
            this._image.onload = (data) => {
                // set current image as _canvas
                let canvas = document.createElement('canvas')
                canvas.width = this._image.width
                canvas.height = this._image.height
                let ctx = canvas.getContext('2d')
                ctx.drawImage(this._image, 0, 0, canvas.width, canvas.height)
                this._canvas = canvas
                resolve(true)
            }
            reader.readAsDataURL(imageFile)
        }))
        return this
    }

    _checkImageLoaded () {
        if (!this._image) {
            throw new Error('loadBlob or image first')
        }
    }

    _imageResize(maxWidth = 200, maxHeight = 100, type = null, options = {}) {
        let resizeOptions = Object.assign({
            pica: {}
        }, options)
        this._tasks.push(() => new Promise((resolve, reject) => {
            this._checkImageLoaded()

            let canvas = document.createElement('canvas')
            let ratio = 0
            let width = this._image.width
            let height = this._image.height
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

            this.pica.resize(this._image, canvas, resizeOptions.pica).then(resizedCanvas => {
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

                    this._canvas = cropedCanvas
                } else {
                    this._canvas = resizedCanvas
                }
                resolve()
            })
        }))
        return this
    }

    toSquare (length = 150, opts = {}) {
        return this._imageResize(length, length, RESIZE_TYPE_SQUARE, opts)
    }

    resize (maxWidth = 200, maxHeight = 100, opts = {}) {
        return this._imageResize(maxWidth, maxHeight, RESIZE_TYPE_TO, opts)
    }

    rotate (degrees, opts = {}) {
        let {bgColor = 'white'} = opts
        this._tasks.push(() => new Promise((resolve, reject) => {
            this._checkImageLoaded()

            let radians = degrees * (Math.PI / 180)
            let canvas = document.createElement('canvas')
            // TODO: calc size
            let maxSize = this._canvas.width > this._canvas.height
                ? this._canvas.width
                : this._canvas.height
            canvas.width = maxSize
            canvas.height = maxSize
            let ctx = canvas.getContext('2d')
            // set bg
            if (bgColor) {
                ctx.beginPath()
                ctx.rect(0, 0, canvas.width, canvas.height)
                ctx.fillStyle = bgColor
                ctx.fill()
                ctx.save()
            }
            ctx.save()

            // rotate
            ctx.translate(canvas.width / 2, canvas.height / 2)
            ctx.rotate(radians)
            ctx.drawImage(this._canvas, -(this._canvas.width / 2), -(this._canvas.height / 2))
            ctx.restore()

            this._canvas = canvas
            resolve()
        }))
        return this
    }

    toGrayscale (opts = {}) {
        let {rQ = 0.34, gQ = 0.5, bQ = 0.16} = opts
        this._tasks.push(() => new Promise((resolve, reject) => {
            this._checkImageLoaded()

            let canvas = document.createElement('canvas')
            canvas.width = this._canvas.width
            canvas.height = this._canvas.height

            let ctx = canvas.getContext('2d')
            ctx.drawImage(this._canvas, 0, 0)

            let imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
            let data = imageData.data

            for(let i = 0; i < data.length; i += 4) {
                let brightness = rQ * data[i] + gQ * data[i + 1] + bQ * data[i + 2]

                data[i] = brightness
                data[i + 1] = brightness
                data[i + 2] = brightness
            }

            ctx.putImageData(imageData, 0, 0)
            this._canvas = canvas
            resolve()
        }))
        return this
    }

    centerInRectangle (width = 200, height = 100, opts = {}) {
        let {bgColor = 'white'} = opts
        // resize
        this._imageResize(width, height, RESIZE_TYPE_TO, opts)
        // fit
        this._tasks.push(() => new Promise((resolve, reject) => {
            let canvas = document.createElement('canvas')
            canvas.width = width
            canvas.height = height
            let ctx = canvas.getContext('2d')
            let newWidth = this._canvas.width
            let newHeight = this._canvas.height
            // set bg
            if (bgColor) {
                ctx.beginPath()
                ctx.rect(0, 0, width, height)
                ctx.fillStyle = bgColor
                ctx.fill()
                ctx.save()
            }
            // put image
            let dx = 0
            let dy = 0
            let sx = 0
            let sy = 0
            if (newWidth < width) {
                dx = (width - newWidth) / 2
            }
            if (newHeight < height) {
                dy = (height - newHeight) / 2
            }
            ctx.drawImage(this._canvas, sx, sy, newWidth, newHeight, dx, dy, newWidth, newHeight)
            this._canvas = canvas
            resolve()
        }))
        return this
    }

    toCircle (diametr = 150, opts = {}) {
        let {padding = 4, bgColor = 'white'} = opts
        // resize to square first
        this._imageResize(diametr, diametr, RESIZE_TYPE_SQUARE, opts)
        this._tasks.push(() => new Promise((resolve, reject) => {
            let canvas = document.createElement('canvas')
            canvas.width = diametr
            canvas.height = diametr

            let ctx = canvas.getContext('2d')
            // set area and area bg color
            ctx.beginPath()
            ctx.rect(0, 0, diametr, diametr)
            ctx.fillStyle = bgColor
            ctx.fill()
            ctx.save()
            // set padding in cropped circle
            let paddingSize = diametr - padding
            let halfSize = Math.round(paddingSize / 2)
            ctx.beginPath()
            ctx.arc(halfSize + (padding / 2), halfSize + (padding / 2), halfSize - (padding / 2), 0, Math.PI * 2, true)
            ctx.closePath()
            ctx.clip()

            ctx.drawImage(this._canvas, 0, 0, paddingSize, paddingSize)
            ctx.restore()
            this._canvas = canvas
            resolve()
        }))
        return this
    }

    async _runTasks () {
        for (let i = 0; i < this._tasks.length; i++) {
            await this._tasks[i]()
        }
        this._tasks = []
        return true
    }

    async saveAsCanvas () {
        await this._runTasks()

        return this._canvas
    }

    async saveAsImage(mimeType = 'image/jpeg', q = '1.0') {
        await this._runTasks()

        return new Promise(resolve => {
            let image = this._canvas.toDataURL(mimeType, q)
            resolve(image)
        })
    }

    async saveAsBlob(mimeType = 'image/jpeg', q = '1.0') {
        await this._runTasks()

        return new Promise(resolve => {
            this._canvas.toBlob((blob) => {
                this._fileOptions.type = mimeType
                this._fileName = this._getFileExtByMimeType(this._fileName, mimeType)
                let fileOfBlob = new File([blob], this._fileName, this._fileOptions)
                resolve(fileOfBlob)
            }, mimeType, q)
        })
    }

    _getFileExtByMimeType(fileName, mimeType) {
        let tmp = fileName.split('.')
        let ext = 'jpg'
        if (mimeType.indexOf('png') > -1) {
            ext = 'png'
        } else if(mimeType.indexOf('webp')) {
            ext = 'webp'
        }
        tmp.push(ext)
        return tmp.join('.')
    }
}

export default ImageManipulation
