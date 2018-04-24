import pica from 'pica/dist/pica'

const RESIZE_TYPE_SQUARE = 'square'
const RESIZE_TYPE_TO = 'to'

class ImageManipulation {
    _tasks = []
    fileName = null
    fileOptions = {
        type: 'image/jpeg'
    }
    convertedCanvas = null
    convertedCanvasCtx = null

    constructor() {
        this.pica = pica()
    }

    loadBlob(imageFile) {
        this._tasks.push(() => new Promise((resolve, reject) => {
            this.fileName = imageFile.name
            this.fileOptions = {
                type: imageFile.type
            }
            this.reader = new FileReader()
            this.image = document.createElement('img')
            this.reader.onload = (e) => {
                this.image.src = e.target.result
            }
            this.image.onload = (e) => {
                resolve(e)
            }
            this.reader.readAsDataURL(imageFile)
        }))
        return this
    }

    /**
     * @param maxWidth
     * @param maxHeight
     * @param type
     * @param options
     * @returns {ImageManipulation}
     * @private
     */
    _resize(maxWidth = 200, maxHeight = 100, type = null, options = {}) {
        let resizeOptions = Object.assign({
            pica: {}
        }, options)
        this._tasks.push(() => new Promise((resolve, reject) => {
            if (!this.image) {
                reject(new Error('loadBlob first'))
            }

            let canvas = document.createElement('canvas')
            let ratio = 0
            let width = this.image.width
            let height = this.image.height
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

            this.pica.resize(this.image, canvas, resizeOptions.pica).then(resizedCanvas => {
                let resizedCtx = resizedCanvas.getContext('2d')

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

                    this.convertedCanvasCtx = cropedCanvasCtx
                    this.convertedCanvas = cropedCanvas
                } else {
                    this.convertedCanvasCtx = resizedCtx
                    this.convertedCanvas = resizedCanvas
                }
                resolve()
            })
        }))
        return this
    }

    toSquare (length = 150, opts = {}) {
        return this._resize(length, length, RESIZE_TYPE_SQUARE, opts)
    }

    resizeTo (maxWidth = 200, maxHeight = 100, opts = {}) {
        return this._resize(maxWidth, maxHeight, RESIZE_TYPE_TO, opts)
    }

    centerInRectangle (width = 200, height = 100, opts = {}) {
        let {bgColor = 'white'} = opts
        // resize
        this._resize(width, height, RESIZE_TYPE_TO, opts)
        // fitt
        this._tasks.push(() => new Promise((resolve, reject) => {
            let canvas = document.createElement('canvas')
            canvas.width = width
            canvas.height = height
            let ctx = canvas.getContext('2d')
            let newWidth = this.convertedCanvas.width
            let newHeight = this.convertedCanvas.height
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
            console.log(sx, sy, dx, dy)
            ctx.drawImage(this.convertedCanvas, sx, sy, newWidth, newHeight, dx, dy, newWidth, newHeight)
            this.convertedCanvas = canvas
            this.convertedCanvasCtx = ctx
            resolve()
        }))
        return this
    }

    toCircle (diametr = 150, opts = {}) {
        let {padding = 4, bgColor = 'white'} = opts
        // resize to square first
        this._resize(diametr, diametr, RESIZE_TYPE_SQUARE, opts)
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

            ctx.drawImage(this.convertedCanvas, 0, 0, paddingSize, paddingSize)
            ctx.restore()
            this.convertedCanvasCtx = ctx
            this.convertedCanvas = canvas
            resolve()
        }))
        return this
    }

    async runTasks () {
        for (let i = 0; i < this._tasks.length; i++) {
            await this._tasks[i]()
        }
        this._tasks = []
        return true
    }

    async saveAsImage(mimeType = 'image/jpeg', q = '1.0') {
        await this.runTasks()

        return new Promise(resolve => {
            let image = this.convertedCanvas.toDataURL(mimeType, q)
            resolve(image)
        })
    }

    async saveAsBlob(mimeType = 'image/jpeg', q = '1.0') {
        await this.runTasks()

        return new Promise(resolve => {
            this.convertedCanvas.toBlob((blob) => {
                this.fileOptions.type = mimeType
                this.fileName = this.getFileExtByMimeType(this.fileName, mimeType)
                let fileOfBlob = new File([blob], this.fileName, this.fileOptions)
                resolve(fileOfBlob)
            }, mimeType, q)
        })
    }

    getFileExtByMimeType(fileName, mimeType) {
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
