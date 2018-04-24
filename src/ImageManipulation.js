import loadBlob from './loaders/loadBlob.js'
import imageResize from './manipulations/imageResize.js'
import rotate from './manipulations/rotate.js'
import centerInRectangle from './manipulations/centerInRectangle.js'
import circle from './manipulations/circle.js'
import grayscale from './filters/grayscale.js'
import fileExtByMimeType from './helpers/fileExtByMimeType.js'

import {RESIZE_TYPE_SQUARE, RESIZE_TYPE_TO, MANIPULATION, LOADER, FILTER} from './types/types'

class ImageManipulation {
    _tasks = []
    _canvas = null
    _fileName = null

    loadBlob(imageFile) {
        this._addToTask(LOADER, loadBlob(imageFile))
        return this
    }

    _imageResize(maxWidth = 200, maxHeight = 100, type = null, options = {}) {
        this._addToTask(MANIPULATION, imageResize(maxWidth, maxHeight, type, options))
        return this
    }

    toSquare (length = 150, opts = {}) {
        return this._imageResize(length, length, RESIZE_TYPE_SQUARE, opts)
    }

    resize (maxWidth = 200, maxHeight = 100, opts = {}) {
        return this._imageResize(maxWidth, maxHeight, RESIZE_TYPE_TO, opts)
    }

    rotate (degrees, opts = {}) {
        this._addToTask(MANIPULATION, rotate(degrees, opts))
        return this
    }

    toGrayscale (opts = {}) {
        this._addToTask(FILTER, grayscale(opts))
        return this
    }

    centerInRectangle (width = 200, height = 100, opts = {}) {
        // resize
        this._imageResize(width, height, RESIZE_TYPE_TO, opts)
        // fit
        this._addToTask(MANIPULATION, centerInRectangle(width, height, opts))
        return this
    }

    toCircle (diametr = 150, opts = {}) {
        // resize to square first
        this._imageResize(diametr, diametr, RESIZE_TYPE_SQUARE, opts)
        this._addToTask(MANIPULATION, circle(diametr, opts))
        return this
    }

    async _runTasks () {
        for (let i = 0; i < this._tasks.length; i++) {
            if(this._tasks[i].type === LOADER) {
                let data = await this._tasks[i].func(this._canvas)
                this._canvas = data.canvas
                this._fileName = data.fileName
            } else {
                this._canvas = await this._tasks[i].func(this._canvas)
            }
        }
        this._cleanTasks()
        return true
    }

    _addToTask(type = 'manipulation', func) {
        this._tasks.push({type, func})
    }

    _cleanTasks(){
        this._tasks = []
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
                let fileName = fileExtByMimeType(this._fileName, mimeType)
                let fileOfBlob = new File([blob], fileName)
                resolve(fileOfBlob)
            }, mimeType, q)
        })
    }

}

export default ImageManipulation
