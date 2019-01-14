import 'regenerator-runtime/runtime'
import {ImageManipulation} from './src/ImageManipulation.js'

if (typeof window !== 'undefined') {
    window.BrowserImageManipulation = ImageManipulation
}

export default ImageManipulation
