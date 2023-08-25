# cursedui

Cursed Javacript UI Library (😨 DO NOT USE 😨)

![bundle size](https://img.badgesize.io/benarmstrongg/cursedui/main/dist/cursedui.min.js)
![gzipped bundle size](https://img.badgesize.io/benarmstrongg/cursedui/main/dist/cursedui.min.js?compression=gzip)

`cursedui` is a lightweight, reactive Javascript UI library that promotes only the most cursed Javascript practices:
- 👿 Not compatible with Typescript 👿
- 😱 State properties are set directly on the `window` object 😱
- 👻 Change detection checks are run on every frame 👻
- 😳 Deprecated `with` statements are encouraged 😳
- 🎃 Semicolons are discouraged 🎃

## Usage
Add the following code snippet to your HTML file:
```html
<script src="https://raw.githubusercontent.com/benarmstrongg/cursedui/main/dist/cursedui.min.js">
```

## API Reference

### Rendering

Use the `component` method to declare composable, reusable components.
```javascript
// named function -> <counter>
component(function counter($) {
    // ...
})

// anonymous function -> <component>
component($ => {
    // ...
})

// reusable component
const Counter = () => component(function counter($) {
    // ...
})
```

The callback you pass to `component` function recieves one argument: the `createElement` function. To call this function, pass your element's tag name and a callback method to define properties on your element using `with` statements.

```javascript
component(function counter($) {
    $('p', p => {
        with (p) {
            innerText = 'The count is 0'
        }
    })
})
```

### State

No need for `let` or `const` - state variables are declared on the window object! Be careful not to reuse variable names! 

```javascript
component(function counter($) {
    count = 0

    $('p', p => {
        with (p) {
            innerText = `The count is ${count}`
        }
    })

    $('button', button => {
        with (button) {
            innerText = '+1'
            onclick = () => count++
        }
    })
})

// WILL NOT RERENDER ON count CHANGE
component(function countChecker($) {
    count = 0
})
```

Don't worry, you can nest components without having your nested state reinitialized.

### Styling

You can style your components with regular old CSS, but who wants to do that? Use more `with` statements instead!

```javascript
component(function counter($) {
    count = 0

    $('p', p => {
        with (p) {
            classList.add('i-use-with-statements')
            innerText = `The count is ${count}`

            with (style) {
                color = 'red'
                fontSize = '20px'
                padding = 100
            }
        }
    })

    $('button', button => {
        with (button) {
            innerText = '+1'
            onclick = () => count++
        }
    })
})
```

## Example

Full counter example

[Page](https://benarmstrongg.github.io/cursedui/)

[Code](https://github.com/benarmstrongg/cursedui/blob/main/index.html)