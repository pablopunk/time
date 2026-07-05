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

  let time: {
    hours: string
    minutes: string
    seconds: string
  } = {
    hours: hours.toString().padStart(props.pad ? 2 : 1, '0'),
    minutes: minutes.toString().padStart(2, '0'),
    seconds: seconds.toString().padStart(2, '0'),
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
  pad: boolean
}

interface IState {
  hours: string
  minutes: string
  seconds: string
  mouseInteraction: boolean
  lastTickHadColon: boolean
}

const CSS_LENGTH_REGEX =
  /^\d+(\.\d+)?(px|em|rem|vh|vw|%|pt|cm|mm|in|ex|ch|vmin|vmax)$/

function sanitizeCSS(value: string): string {
  if (!value) return value
  let sanitized = value.replace(/[<>]/g, '')
  sanitized = sanitized.replace(/<\/style>/gi, '')
  sanitized = sanitized.replace(/url\(/gi, '')
  sanitized = sanitized.replace(/[;(){}]/g, '')
  return sanitized
}

function normalizeColors(
  colors: Record<string, string | undefined>
): Record<string, string | undefined> {
  const normalized: Record<string, string | undefined> = {}
  ;['fg', 'bg'].forEach((key) => {
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

function randomizeColors(
  colors: Record<string, string | undefined>
): Record<string, string | undefined> {
  const palette = palettes[Math.floor(Math.random() * palettes.length)]

  return {
    ...colors,
    fg: palette[0],
    bg: palette[palette.length - 1],
  }
}

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { hasError: boolean }
> {
  constructor(props: { children: React.ReactNode }) {
    super(props)
    this.state = { hasError: false }
  }

  static getDerivedStateFromError(): { hasError: boolean } {
    return { hasError: true }
  }

  render() {
    if (this.state.hasError) {
      return (
        <main>
          <div id="time">Something went wrong</div>
        </main>
      )
    }
    return this.props.children as React.ReactElement
  }
}

class Clock extends React.Component<IProps, IState> {
  private tickInterval: ReturnType<typeof setInterval> | undefined
  private blinkInterval: ReturnType<typeof setInterval> | undefined
  private mouseTimeoutRef: ReturnType<typeof setTimeout> | undefined

  static async getInitialProps({ query }: { query: Record<string, string> }) {
    query = normalizeColors(query) as Record<string, string>

    if (query.randomColors != null) {
      query = randomizeColors(query) as Record<string, string>
    }

    const props: Record<string, unknown> = {
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
    }

    // Sanitize CSS values to prevent XSS
    props.fg = sanitizeCSS(props.fg as string)
    props.bg = sanitizeCSS(props.bg as string)
    props.font = sanitizeCSS(props.font as string)

    // Validate fontSize; default to '10em' if invalid
    const fontSize = props.fontSize as string
    if (fontSize && !CSS_LENGTH_REGEX.test(fontSize)) {
      props.fontSize = '10em'
    }
    props.fontSize = sanitizeCSS(props.fontSize as string)

    return props
  }

  constructor(props: IProps) {
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
    this.tickInterval = setInterval(() => {
      this.tick()
    }, 1000)

    // Let colons blink twice a second
    this.blinkInterval = setInterval(() => {
      const { lastTickHadColon } = this.state

      this.setState({
        lastTickHadColon: !lastTickHadColon,
      })
    }, 500)
  }

  componentWillUnmount() {
    if (this.tickInterval) clearInterval(this.tickInterval)
    if (this.blinkInterval) clearInterval(this.blinkInterval)
    if (this.mouseTimeoutRef) clearTimeout(this.mouseTimeoutRef)
  }

  getFlexPositions(): { alignItems: string; justifyContent: string } {
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
    if (this.mouseTimeoutRef) {
      clearTimeout(this.mouseTimeoutRef)
    }

    this.mouseTimeoutRef = setTimeout(
      () => this.setState({ mouseInteraction: false }),
      2000
    )

    this.setState({
      mouseInteraction: true,
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

function IndexPage(props: IProps) {
  return (
    <ErrorBoundary>
      <Clock {...props} />
    </ErrorBoundary>
  )
}

// Attach getInitialProps from Clock to the page component
(IndexPage as any).getInitialProps = Clock.getInitialProps

export default IndexPage
