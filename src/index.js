import 'babel-polyfill'
import ImageManipulation from './ImageManipulation.js'

if(typeof window !== 'undefined') {
    window.BrowserImageManipulation = ImageManipulation
}

export default ImageManipulation
