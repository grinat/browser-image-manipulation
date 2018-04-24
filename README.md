## browser-image-manipulation
Convert and manipulate image on JS in browser.
Used [pica](https://github.com/nodeca/pica) for resize image.

### Install
```
npm install browser-image-manipulation --save
```

### Examples
[Open](https://github.com/grinat/browser-image-manipulation/blob/master/examples/index.html) (see in /examples)

### Usage
```
import BrowserImageManipulation from 'browser-image-manipulation'

let picaOptions = {} // see pica options
let iM = new BrowserImageManipulation()
            .loadBlob(e.target.files[0])
            .toCircle(300, {pica: picaOptions})
            .toGrayscale()
            
iM.saveAsBlob().then(blob => {
    if (blob.size > 3000000) {
        return new Error('Max size 3 mb')
    }
    // uploadToServer(blob, 'my circle black and white image')
    return iM.saveAsImage()
}).then(base64 => {
    document.getElementByTag('img')[0].src = base64
}).catch(e => alert(e.toString()))
```
