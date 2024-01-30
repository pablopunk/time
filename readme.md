# Time with Bing Photo of the Day

Fork from [time](https://github.com/pablopunk/time)

Integrate with [plash-bing-photo-of-the-day](https://github.com/sindresorhus/plash-bing-photo-of-the-day)

> https://time-with-bing-photo-of-the-day.netlify.app

Perfect if you use tools like [Plash](https://sindresorhus.com/plash).

![screenshot](https://raw.githubusercontent.com/pablopunk/time/master/screenshot.gif)

## Customize options

- `fg`: Font color. Examples:
  - [`?fg=red`](https://time-with-bing-photo-of-the-day.netlify.app/?fg=red)
  - [`?fg=ff00ff`](https://time-with-bing-photo-of-the-day.netlify.app/?fg=ff00ff)
- `bg`: Background color.
  - [`?bg=lightpink`](https://time-with-bing-photo-of-the-day.netlify.app/?bg=lightpink)
- `font`: Font family. Examples:
  - [`?font=SFMono-Regular,Consolas,'Liberation Mono',Menlo,monospace`](https://time-with-bing-photo-of-the-day.netlify.app/?font=SFMono-Regular,Consolas,%27Liberation%20Mono%27,Menlo,monospace)
- `fontSize`: The size of the font in the clock. Examples:
  - [`?fontSize=5rem`](https://time-with-bing-photo-of-the-day.netlify.app/?fontSize=5rem)
  - [`?fontSize=200px`](https://time-with-bing-photo-of-the-day.netlify.app/?fontSize=200px)
- `position`: Position on the screen. Defaults to center:

  ```
  top-left      top       top-right
  left                        right
  bottom-left  bottom  bottom-right
  ```

  Examples:

  - [`?position=top-left`](https://time-with-bing-photo-of-the-day.netlify.app/?position=top-left)
  - [`?position=bottom`](https://time-with-bing-photo-of-the-day.netlify.app/?position=bottom)

- `seconds`: Show seconds if this argument present.
  - [`?seconds`](https://time-with-bing-photo-of-the-day.netlify.app/?seconds)
- `randomColors`: Sets a random color both for background and foreground.
  - [`?randomColors`](https://time-with-bing-photo-of-the-day.netlify.app/?randomColors)
- `blink`: The colon between the hours and the minutes will blink each second.
  - [`?blink`](https://time-with-bing-photo-of-the-day.netlify.app/?blink)
- `showLink`: A link to this repo is shown automatically when mouse input is detected, but it can be forced using this option.
  - [`?showLink`](https://time-with-bing-photo-of-the-day.netlify.app/?showLink)
- `format=12`: Don't like military time? Shame on you. But you can use 12h format instead.
  - [`?format=12`](https://time-with-bing-photo-of-the-day.netlify.app/?format=12)
- `pad`: Single digit hours will be padded with a 0: 9:41 will be shown as 09:41.
  - [`?pad`](https://time-with-bing-photo-of-the-day.netlify.app/?pad)
- `useBingPhoto`: It will cover the setting of `bg`, and it will use a photo from Bing Photo of the day.
  - [`?useBingPhoto`](https://time-with-bing-photo-of-the-day.netlify.app/?useBingPhoto)

## More Examples

- https://time-with-bing-photo-of-the-day.netlify.app/?seconds&fg=F1396D&bg=382F32&font=monospace
- https://time-with-bing-photo-of-the-day.netlify.app/?fg=11cc88&bg=454545&font=monospace&fontSize=200px&position=bottom-right
- https://time-with-bing-photo-of-the-day.netlify.app/?seconds&randomColors&blink
- https://time-with-bing-photo-of-the-day.netlify.app/?fg=white&bg=transparent (this one is nice for Plash)
- https://time-with-bing-photo-of-the-day.netlify.app/?fg=white&useBingPhoto

## Deploy your own

> From [plash-bing-photo-of-the-day](https://github.com/sindresorhus/plash-bing-photo-of-the-day)

_Keep in mind that the above URL is on a free plan and has limited resources. If you have the technical ability, I would recommend deploying your own instance. Netlify has a generous free plan. It takes less than a minute._

[![](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start/deploy?repository=https://github.com/sindresorhus/plash-bing-photo-of-the-day)
