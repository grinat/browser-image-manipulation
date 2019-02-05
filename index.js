import 'regenerator-runtime/runtime'
import {ImageManipulation} from './src/ImageManipulation.js'
import 'blueimp-canvas-to-blob'

if (typeof window !== 'undefined') {
    window.BrowserImageManipulation = ImageManipulation
}

export default ImageManipulation
