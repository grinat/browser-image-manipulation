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
```javascript
import BrowserImageManipulation from 'browser-image-manipulation'

let iM = new BrowserImageManipulation()
            .loadBlob(file)
            .resize(300, 300, {type: 'rectangle'})
            .toCircle(300)
            
iM.saveAsBlob().then(blob => {
    if (blob.size > 3000000) {
        return new Error('Max size 3 mb')
    }
    // uploadToServer(blob, 'myCircleImage')
    return iM.saveAsImage()
}).then(base64 => {
    document.getElementByTag('img')[0].src = base64
}).catch(e => alert(e.toString()))
```
