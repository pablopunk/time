import { render } from '@testing-library/react'
import IndexPage from '../pages'

describe('IndexPage smoke test', () => {
  it('renders without crashing', () => {
    const props = {
      seconds: false,
      randomColors: false,
      fg: 'royalblue',
      bg: 'black',
      font: 'system-ui',
      fontSize: '10em',
      showLink: false,
      blink: false,
      position: 'center',
      format: 24,
      pad: false,
    } as const

    const { container } = render(<IndexPage {...props} />)

    expect(container.querySelector('#time')).not.toBeNull()
  })
})
