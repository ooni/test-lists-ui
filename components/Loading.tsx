import type React from 'react'
import styled, { keyframes } from 'styled-components'

const rotate = (dir) => keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(${dir * 360}deg);
  }
`

interface SpinnerProps {
  readonly speed: number
  readonly $dir: number
}

const Spinner = styled.div<SpinnerProps>`
  animation: ${(props) => rotate(props.$dir)} ${(props) => 2 / props.speed}s linear infinite;
`

interface LoadingProps {
  readonly size?: number
  readonly speed?: number
  readonly dir?: number
}
const Loading: React.FC<LoadingProps> = ({ size = 64, speed = 1, dir = 1 }) => (
  <Spinner speed={speed} $dir={dir}>
    {/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
    <svg
      xmlns='http://www.w3.org/2000/svg'
      style={{ margin: 'auto', display: 'block' }}
      width={`${size}px`}
      height={`${size}px`}
      viewBox='0 0 100 100'
      preserveAspectRatio='xMidYMid'
    >
      <g transform='translate(50,50)'>
        <g transform='scale(0.66)'>
          <circle cx='0' cy='0' r='50' fill='#0588cb' />
          <circle cx='0' cy='-22' r='18' fill='#ffffff' />
        </g>
      </g>
    </svg>
  </Spinner>
)

export default Loading
