# Time by [pablopunk](https://pablopunk.com)

> https://time.pablopunk.com

Perfect if you use tools like [Plash](https://sindresorhus.com/plash).

![screenshot](https://raw.githubusercontent.com/pablopunk/time/master/screenshot.gif)

## Customize options

- `fg`: Font color. Examples:
  - [`?fg=red`](https://time.pablopunk.com/?fg=red)
  - [`?fg=ff00ff`](https://time.pablopunk.com/?fg=ff00ff)
- `bg`: Background color.
  - [`?bg=lightpink`](https://time.pablopunk.com/?bg=lightpink)
- `font`: Font family. Examples:
  - [`?font=SFMono-Regular,Consolas,'Liberation Mono',Menlo,monospace`](https://time.pablopunk.com/?font=SFMono-Regular,Consolas,%27Liberation%20Mono%27,Menlo,monospace)
- `fontSize`: The size of the font in the clock. Examples:
  - [`?fontSize=5rem`](https://time.pablopunk.com/?fontSize=5rem)
  - [`?fontSize=200px`](https://time.pablopunk.com/?fontSize=200px)
- `position`: Position on the screen. Defaults to center:

  ```txt
  top-left      top       top-right
  left                        right
  bottom-left  bottom  bottom-right
  ```

  Examples:

  - [`?position=top-left`](https://time.pablopunk.com/?position=top-left)
  - [`?position=bottom`](https://time.pablopunk.com/?position=bottom)

- `seconds`: Show seconds if this argument present.
  - [`?seconds`](https://time.pablopunk.com/?seconds)
- `randomColors`: Sets a random color both for background and foreground.
  - [`?randomColors`](https://time.pablopunk.com/?randomColors)
- `blink`: The colon between the hours and the minutes will blink each second.
  - [`?blink`](https://time.pablopunk.com/?blink)
- `showLink`: By default, a link to this repo is shown when mouse input is detected, but it can be forced always on or off.
  - On: [`?showLink`](https://time.pablopunk.com/?showLink) or [`?showLink=true`](https://time.pablopunk.com/?showLink=true)
  - Off: [`?showLink=false`](https://time.pablopunk.com/?showLink=false)
- `format=12`: Don't like military time? Shame on you. But you can use 12h format instead.
  - [`?format=12`](https://time.pablopunk.com/?format=12)
- `pad`: Single digit hours will be padded with a 0: 9:41 will be shown as 09:41.
  - [`?pad`](https://time.pablopunk.com/?pad)

## More Examples

- https://time.pablopunk.com/?seconds&fg=F1396D&bg=382F32&font=monospace
- https://time.pablopunk.com/?fg=11cc88&bg=454545&font=monospace&fontSize=200px&position=bottom-right
- https://time.pablopunk.com/?seconds&randomColors&blink
- https://time.pablopunk.com/?fg=white&bg=transparent (this one is nice for Plash)

## Author

| ![me](https://gravatar.com/avatar/fa50aeff0ddd6e63273a068b04353d9d?size=100) |
| ---------------------------------------------------------------------------- |
| [Pablo Varela](https://pablopunk.com)                                        |
