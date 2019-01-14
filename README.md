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
- crop to circle
- crop to square
- resize by max height/max width (used [pica](https://github.com/nodeca/pica) for correct resize image)
- resize to fit in rectangle (proportion saved, empty space filled by color)

Output formats:
- blob
- canvas
- base64 image

### Usage
```
import BrowserImageManipulation from 'browser-image-manipulation'

// return in multiple formats
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

// one format
new ImageManipulation()
   .loadBlob(e.target.files[0])
   .gaussianBlur()
   .saveAsImage()
   .then(base64 => {
      alert('Blured done!')
   })
```


If use UglifyJs set in comperss evaluate to false
```
compress: {
  ...
  evaluate: false
  ...
}
```
