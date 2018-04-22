import pica from 'pica/dist/pica'

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

    _getOrCreateCanvas() {
        if (this.convertedCanvas === null) {
            this.convertedCanvas = document.createElement('canvas')
        }
        return this.convertedCanvas
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

    resize(maxWidth = 150, maxHeight = 150, opts = {}) {
        let {type = 'default'} = opts
        this._tasks.push(() => new Promise((resolve, reject) => {
            let canvas = this._getOrCreateCanvas()
            let ratio = 0
            let width = this.image.width
            let height = this.image.height

            if (type === 'rectangle') {
                if (width < height) {
                    ratio = maxWidth / width
                } else {
                    ratio = maxHeight / height
                }
            } else {
                if (width > maxWidth) {
                    ratio = maxWidth / width
                } else {
                    ratio = maxHeight / height
                }
            }

            height = height * ratio
            width = width * ratio

            canvas.width = width
            canvas.height = height

            // let ctx = canvas.getContext('2d')
            // ctx.drawImage(this.image, 0, 0, width, height)
            this.pica.resize(this.image, canvas, {
                unsharpAmount: 80,
                unsharpRadius: 0.6,
                unsharpThreshold: 2
            }).then(resizedCanvas => {
                let resizedCtx = resizedCanvas.getContext('2d')

                if (type === 'rectangle') {
                    let dx = 0
                    let dy = 0
                    let sx = 0
                    let sy = 0

                    if (width < height) {
                        sy = (height - width) / 2
                        height = width
                    } else {
                        sx = (width - height) / 2
                        width = height
                    }
                    let cropedCanvas = document.createElement('canvas')
                    let cropedCanvasCtx = cropedCanvas.getContext('2d')
                    cropedCanvas.width = width
                    cropedCanvas.height = height

                    cropedCanvasCtx.drawImage(resizedCanvas, sx, sy, width, height, dx, dy, width, height)

                    this.convertedCanvasCtx = cropedCanvasCtx
                    this.convertedCanvas = cropedCanvas
                } else {
                    this.convertedCanvasCtx = resizedCtx
                    this.convertedCanvas = resizedCanvas
                }
                this.image.src = this.convertedCanvas.toDataURL('image/png')
                resolve()
            })
        }))
        return this
    }

    toCircle(size = 150, opts = {}) {
        let {padding = 4, fillStyle = 'white'} = opts
        this._tasks.push(() => new Promise((resolve, reject) => {
            let canvas = this._getOrCreateCanvas()
            canvas.width = size
            canvas.height = size

            let ctx = canvas.getContext('2d')
            // set area and area bg color
            ctx.beginPath()
            ctx.rect(0, 0, size, size)
            ctx.fillStyle = fillStyle
            ctx.fill()
            ctx.save()
            // set padding in cropped circle
            let paddingSize = size - padding
            let halfSize = Math.round(paddingSize / 2)
            ctx.beginPath()
            ctx.arc(halfSize + (padding / 2), halfSize + (padding / 2), halfSize - (padding / 2), 0, Math.PI * 2, true)
            ctx.closePath()
            ctx.clip()

            ctx.drawImage(this.image, 0, 0, paddingSize, paddingSize)
            ctx.restore()
            this.convertedCanvasCtx = ctx
            this.convertedCanvas = canvas
            resolve()
        }))
        return this
    }

    * promises() {
        for (let i = 0; i < this._tasks.length; i++) {
            yield this._tasks[i]()
        }
        this._tasks = []
    }

    async saveAsImage(mimeType = 'image/jpeg', q = '1.0') {
        for (let promise of this.promises()) {
            await promise
        }

        return new Promise(resolve => {
            let image = this.convertedCanvas.toDataURL(mimeType, q)
            resolve(image)
        })
    }

    async saveAsBlob(mimeType = 'image/jpeg', q = '1.0') {
        for (let promise of this.promises()) {
            await promise
        }
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
        tmp.push(ext)
        return tmp.join('.')
    }
}

export default ImageManipulation
