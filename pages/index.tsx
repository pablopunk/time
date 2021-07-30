import React from 'react'
import * as validHexColor from 'valid-hex-color'
import palettes from 'nice-color-palettes'

function whatTimeIsIt() {
  const now = new Date()

  let time = {
    hours: now.getHours().toString(),
    minutes: now.getMinutes().toString(),
    seconds: now.getSeconds().toString(),
  }

  if (time.seconds.length === 1) {
    time.seconds = '0' + time.seconds
  }

  if (time.minutes.length === 1) {
    time.minutes = '0' + time.minutes
  }

  return time
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
}

interface IState {
  hours: string
  minutes: string
  seconds: string
  mouseInteraction: boolean
  lastTickHadColon: boolean
}

function normalizeColors(colors) {
  const normalized = {}
  ;['fg', 'bg'].map((key) => {
    if (colors[key] != null) {
      if (validHexColor.check(`#${colors[key]}`)) {
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
    let time = whatTimeIsIt()
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

  render() {
    const { blink } = this.props
    const { lastTickHadColon, mouseInteraction } = this.state
    let colonOpacity = 1

    if (blink && lastTickHadColon) {
      colonOpacity = 0
    }

    if (mouseInteraction) {
      setTimeout(() => {
        this.setState({ mouseInteraction: false })
      }, 3000) // hide in 3 seconds
    }

    const flexPositions = this.getFlexPositions()
    let hours = parseInt(this.state.hours) || 0

    if (this.props.format === 12) {
      hours = hours < 12 ? hours : hours - 12
    }

    return (
      <>
        {mouseInteraction && (
          <a href="https://github.com/pablopunk/time">Code available here</a>
        )}
        <main
          onMouseMove={() =>
            !mouseInteraction && this.setState({ mouseInteraction: true })
          }
        >
          <div id="time">
            <span id="hours">{hours}</span>
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
              background-color: ${this.props.bg};
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
