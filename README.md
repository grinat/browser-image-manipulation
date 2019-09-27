## browser-image-manipulation
Convert and manipulate image on JS in browser. Fluent interface based, at end returning promise.

### Install
```
npm install browser-image-manipulation --save
```

### Examples
[Open](https://grinat.github.io/browser-image-manipulation/examples/index.html) (see in /examples)

### Features
Load image in formats:
- blob
- canvas

Filters:
- grayscale
- pixelize
- gaussian blur (used [StackBlur.js](https://github.com/flozz/StackBlur))

Manipulations:
- rotate
- crop
- crop to circle with resize
- crop to square with resize
- resize by max height/max width (used [pica](https://github.com/nodeca/pica) for correct resize image)
- resize to fit in rectangle (proportion saved, empty space filled by color)
- draw line
- draw polygon

Output formats:
- blob
- canvas
- base64 image

### Usage
One format:
```js
import BrowserImageManipulation from 'browser-image-manipulation'

new BrowserImageManipulation()
   .loadBlob(e.target.files[0])
   .gaussianBlur()
   .saveAsImage()
   .then(base64 => {
      alert('Blured done!')
   })
   .catch(e => alert(e.toString()))
```
Multi format:
```js
import BrowserImageManipulation from 'browser-image-manipulation'

let picaOptions = {} // optional, see pica options
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

Fluent interface:
```js
new BrowserImageManipulation()
    .loadBlob(e.target.files[0])
    .toCircle(400)
    .toGrayscale()
    .pixelize()
    .rotate(90)
    .saveAsImage()
    .then(base64 => {
        document.getElementById('exampleFluentImg').src = base64
    }).catch(e => alert(e.toString()))
```

If use UglifyJs set in comperss evaluate to false
```
compress: {
  ...
  evaluate: false
  ...
}
```
