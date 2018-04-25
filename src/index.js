import 'regenerator-runtime/runtime'
import BrowserImageManipulation from './ImageManipulation.js'

if (typeof window !== 'undefined') {
    window.BrowserImageManipulation = BrowserImageManipulation
}

export default BrowserImageManipulation
