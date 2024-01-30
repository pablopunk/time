import React from 'react'
import isHexColor from 'is-hexcolor'
import palettes from 'nice-color-palettes'

function whatTimeIsIt(props: IProps) {
  const now = new Date()

  let hours = now.getHours()
  let minutes = now.getMinutes()
  let seconds = now.getSeconds()

  if (props.format === 12) {
    hours = hours % 12 || 12
  }

  let time: any = {
    hours: hours.toString().padStart(props.pad ? 2 : 1, '0'),
    minutes: minutes.toString().padStart(2, '0'),
    seconds: seconds.toString().padStart(2, '0'),
  }

  return time
}

async function getBingPhotoOfTheDayUrl() {
  // For local dev
  // const imageUrl =
  //   'http://www.bing.com/th?id=OHR.NewYearFuji_ROW7249160512_1920x1080.jpg&rf=LaDigue_1920x1080.jpg&pid=hp'

  const baseUrl = 'http://www.bing.com'
  const response = await fetch(`/api`)
  const json = await response.json()
  const imageUrl = baseUrl + json.images[0].url

  return imageUrl
}

type Position =
  | 'top-left'
  | 'top'
  | 'top-right'
  | 'left'
  | 'center'
  | 'right'
  | 'bottom-left'
  | 'bottom'
  | 'bottom-right'

interface IProps {
  seconds: boolean
  randomColors: boolean
  fg: string
  bg: string
  font: string
  fontSize: string
  showLink: boolean
  blink: boolean
  position: Position
  format: 12 | 24
  pad: boolean
  bgImage: string | boolean
}

interface IState {
  hours: string
  minutes: string
  seconds: string
  mouseInteraction: boolean
  lastTickHadColon: boolean
  clearMouseTimeout?: ReturnType<typeof setTimeout>
}

function normalizeColors(colors) {
  const normalized = {}
  ;['fg', 'bg'].map((key) => {
    if (colors[key] != null) {
      if (isHexColor(`#${colors[key]}`)) {
        normalized[key] = `#${colors[key]}`
      } else {
        normalized[key] = colors[key]
      }
    }
  })

  return {
    ...colors,
    ...normalized,
  }
}

function randomizeColors(colors) {
  const palette = palettes[Math.ceil(Math.random() * palettes.length)]

  return {
    ...colors,
    fg: palette[0],
    bg: palette[palette.length - 1],
  }
}

export default class extends React.Component<IProps, IState> {
  static async getInitialProps({ query }) {
    query = normalizeColors(query)

    if (query.randomColors != null) {
      query = randomizeColors(query)
    }

    return {
      font: `system-ui,
              -apple-system,
              'Segoe UI',
              Roboto,
              Helvetica,
              Arial,
              sans-serif,
              'Apple Color Emoji',
              'Segoe UI Emoji'`,
      bg: 'black',
      fg: 'royalblue',
      fontSize: '10em',
      position: 'center',
      ...query,
      seconds: query.seconds != null,
      randomColors: query.randomColors != null,
      showLink: query.showLink != null,
      blink: query.blink != null,
      format: parseInt(query.format || '24'),
      pad: query.pad != null,
      bgImage: query.useBingPhoto != null && (await getBingPhotoOfTheDayUrl()),
    }
  }

  constructor(props) {
    super(props)

    this.state = {
      hours: '',
      minutes: '',
      seconds: '',
      mouseInteraction:
        this.props.showLink == null ? false : this.props.showLink,
      lastTickHadColon: false,
    }
  }

  tick() {
    let time = whatTimeIsIt(this.props)
    this.setState({ ...time })
  }

  componentDidMount() {
    this.tick()
    setInterval(() => {
      this.tick()
    }, 1000)

    // Let colons blink twice a second
    setInterval(() => {
      const { lastTickHadColon } = this.state

      this.setState({
        lastTickHadColon: !lastTickHadColon,
      })
    }, 500)
  }

  getFlexPositions() {
    const { position } = this.props
    let flexPosition = {
      alignItems: 'center',
      justifyContent: 'center',
    }

    if (position.includes('top')) {
      flexPosition.alignItems = 'flex-start'
    } else if (position.includes('bottom')) {
      flexPosition.alignItems = 'flex-end'
    }

    if (position.includes('left')) {
      flexPosition.justifyContent = 'flex-start'
    } else if (position.includes('right')) {
      flexPosition.justifyContent = 'flex-end'
    }

    return flexPosition
  }

  mouseInteracting() {
    const { clearMouseTimeout } = this.state

    if (clearMouseTimeout) {
      clearTimeout(clearMouseTimeout)
    }

    const newClearMouseTimeout = setTimeout(
      () => this.setState({ mouseInteraction: false }),
      2000
    )

    this.setState({
      mouseInteraction: true,
      clearMouseTimeout: newClearMouseTimeout,
    })
  }

  render() {
    const { blink, showLink } = this.props
    const { lastTickHadColon, mouseInteraction } = this.state
    let colonOpacity = 1

    if (blink && lastTickHadColon) {
      colonOpacity = 0
    }

    const flexPositions = this.getFlexPositions()

    return (
      <>
        {(mouseInteraction || showLink) && (
          <a href="https://github.com/pablopunk/time">Code available here</a>
        )}
        <main onMouseMove={() => this.mouseInteracting()}>
          <div id="time">
            <span id="hours">{this.state.hours}</span>
            <span className="colon" style={{ opacity: colonOpacity }}>
              :
            </span>
            <span id="minutes">{this.state.minutes}</span>
            {this.props.seconds && (
              <>
                <span className="colon" style={{ opacity: colonOpacity }}>
                  :
                </span>
                <span id="seconds">{this.state.seconds}</span>
              </>
            )}
          </div>
          <style global jsx>{`
            body,
            html {
              margin: 0;
              padding: 0;
              width: 100vw;
              height: 100vh;
              overflow: hidden;
            }
            main {
              width: 100vw;
              height: 100vh;
              display: flex;
              align-items: ${flexPositions.alignItems};
              justify-content: ${flexPositions.justifyContent};
              font-weight: bold;
              color: ${this.props.fg};
              ${this.props.bgImage
                ? `background-image: url(${this.props.bgImage});`
                : `background-color: ${this.props.bg};`}
              font-family: ${this.props.font};
              font-size: ${this.props.fontSize};
              font-variant-numeric: tabular-nums;
            }
            #time {
              margin: 1rem;
            }
            a {
              position: absolute;
              top: 20px;
              left: 20px;
              font-size: 1.2rem;
              font-family: system-ui, -apple-system, 'Segoe UI', Roboto,
                Helvetica, Arial, sans-serif, 'Apple Color Emoji',
                'Segoe UI Emoji';
              color: ${this.props.fg};
              opacity: 0.7;
            }
          `}</style>
        </main>
      </>
    )
  }
}
