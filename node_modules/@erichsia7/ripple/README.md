# Ripple.js
## Install
```
<script src="https://unpkg.com/@erichsia7/ripple@latest/dist/index.min.js"></script>
```
## Usage
```
ripple.addTo(selector, color, duration, callback)
```
### Selector
Selector is a query selector string like `.button`, `.container .button`, or `.button,.button2[attribute="1"]`.

### Color
Color can comes in any format that is supported by browser like `#000000`, `rgba(0, 0, 0, 0.5)`, or `var(--custom-css-variable)`.

### Duration
Duration is a time parameter for animation of a ripple effect, and it's measured in million seconds.

### Callback
Callback is a function that you want to execute when the animation end. If it has a selector including multiple elements, you need to use an array to load up all the functions like `[ function() {/*...*/}, function() {/*...*/} ]`.

## Demo
[Live demo](https://erichsia7.github.io/ripple.js/)
