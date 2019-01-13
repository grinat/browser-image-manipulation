import 'regenerator-runtime/runtime'
import BrowserImageManipulation from './src/ImageManipulation.js'

if (typeof window !== 'undefined') {
    window.BrowserImageManipulation = BrowserImageManipulation
}

export default BrowserImageManipulation
