import {JSDOM} from 'jsdom'

const dom = new JSDOM('<html><body></body></html>', {
    // for load images
    resources: 'usable'
})
global.document = dom.window.document
global.window = dom.window
global.navigator = dom.window.navigator

global.FileReader = require('filereader')
