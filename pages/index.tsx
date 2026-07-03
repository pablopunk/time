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
  clearMouseTimeout?: ReturnType<typeof setTimeout>
}

interface ColorParams {
  fg?: string
  bg?: string
  font?: string
  fontSize?: string
  position?: string
  format?: string
  seconds?: string
  randomColors?: string
  showLink?: string
  blink?: string
  pad?: string
  [key: string]: string | undefined
}

function firstString(value: unknown): string | undefined {
  if (Array.isArray(value)) return value[0]
  return typeof value === 'string' ? value : undefined
}

function sanitizeCSSValue(
  value: string | undefined,
  type: 'color' | 'font' | 'fontSize'
): string | undefined {
  if (value == null) return undefined
  const trimmed = value.trim()
  if (!trimmed) return undefined

  if (type === 'color') {
    // Allow hex colors, rgb/rgba/hsl/hsla, and CSS color keywords
    if (/^#[0-9a-fA-F]{3,8}$/.test(trimmed)) return trimmed
    if (/^(rgb|rgba|hsl|hsla)\([^)]*\)$/.test(trimmed)) return trimmed
    if (/^[a-zA-Z]+$/.test(trimmed)) return trimmed
    return undefined
  }

  if (type === 'fontSize') {
    // Allow CSS length values
    if (
      /^\d+(\.\d+)?(em|rem|px|%|vh|vw|vmin|vmax|ch|ex|cm|mm|in|pt|pc)$/.test(
        trimmed
      )
    )
      return trimmed
    return undefined
  }

  if (type === 'font') {
    // Strip potentially dangerous characters from font-family values
    return trimmed.replace(/[<>&"'()]/g, '')
  }

  return undefined
}

function normalizeColors(colors: ColorParams): ColorParams {
  const normalized: Record<string, string> = {}
  ;['fg', 'bg'].forEach((key) => {
    if (colors[key] != null) {
      const val = String(colors[key])
      if (isHexColor(`#${val}`)) {
        normalized[key] = `#${val}`
      } else {
        normalized[key] = val
      }
    }
  })

  return {
    ...colors,
    ...normalized,
  }
}

function randomizeColors(colors: ColorParams): ColorParams {
  const palette = palettes[Math.floor(Math.random() * palettes.length)]

  return {
    ...colors,
    fg: palette[0],
    bg: palette[palette.length - 1],
  }
}

export default class extends React.Component<IProps, IState> {
  private tickIntervalId?: ReturnType<typeof setInterval>
  private blinkIntervalId?: ReturnType<typeof setInterval>

  static async getInitialProps({
    query,
  }: {
    query: Record<string, string | undefined>
  }) {
    let normalizedQuery = normalizeColors(query)

    if (normalizedQuery.randomColors != null) {
      normalizedQuery = randomizeColors(normalizedQuery)
    }

    const fg = sanitizeCSSValue(normalizedQuery.fg as string | undefined, 'color')
    const bg = sanitizeCSSValue(normalizedQuery.bg as string | undefined, 'color')
    const font = sanitizeCSSValue(normalizedQuery.font as string | undefined, 'font')
    const fontSize = sanitizeCSSValue(normalizedQuery.fontSize as string | undefined, 'fontSize')

    return {
      font: font ?? `system-ui,
              -apple-system,
              'Segoe UI',
              Roboto,
              Helvetica,
              Arial,
              sans-serif,
              'Apple Color Emoji',
              'Segoe UI Emoji'`,
      bg: bg ?? 'black',
      fg: fg ?? 'royalblue',
      fontSize: fontSize ?? '10em',
      position: (normalizedQuery.position as Position | undefined) ?? 'center',
      seconds: normalizedQuery.seconds != null,
      randomColors: normalizedQuery.randomColors != null,
      showLink: normalizedQuery.showLink != null,
      blink: normalizedQuery.blink != null,
      format: (parseInt((normalizedQuery.format as string) || '24') as 12 | 24),
      pad: normalizedQuery.pad != null,
    }
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
    this.tickIntervalId = setInterval(() => {
      this.tick()
    }, 1000)

    // Let colons blink twice a second
    this.blinkIntervalId = setInterval(() => {
      const { lastTickHadColon } = this.state

      this.setState({
        lastTickHadColon: !lastTickHadColon,
      })
    }, 500)
  }

  componentWillUnmount() {
    if (this.tickIntervalId) {
      clearInterval(this.tickIntervalId)
    }
    if (this.blinkIntervalId) {
      clearInterval(this.blinkIntervalId)
    }
    const { clearMouseTimeout } = this.state
    if (clearMouseTimeout) {
      clearTimeout(clearMouseTimeout)
    }
  }

  getFlexPositions() {
    const { position } = this.props
    let flexPosition = {
      alignItems: 'center' as string,
      justifyContent: 'center' as string,
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
