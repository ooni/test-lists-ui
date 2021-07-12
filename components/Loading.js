import styled, { keyframes } from 'styled-components'

const rotate = (dir) => keyframes`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(${dir * 360}deg);
  }
`

const Spinner = styled.div`
  animation: ${props => rotate(props.dir)} ${props => 2 / props.speed}s linear infinite;
`

/**
 * Configurable animated loading component
 * @param {number} [size=64] Size
 * @param {number} [speed=1] Used in css transformation as {2 / speed}s
 * @param {number} [dir=1] 1 for clockwise, -1 for counter clockwise
 * @returns Animated Loading Component
 */
const Loading = ({ size = 64, speed = 1, dir = 1 }) => (
  <Spinner speed={speed} dir={dir}>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      style={{ margin: 'auto', ßbackground: '#fff', display: 'block' }}
      width={`${size}px`}
      height={`${size}px`}
      viewBox="0 0 100 100"
      preserveAspectRatio="xMidYMid"
    >
      <g transform="translate(50,50)">
        <g transform="scale(0.66)">
          <circle cx="0" cy="0" r="50" fill="#0588cb"></circle>
          <circle cx="0" cy="-22" r="18" fill="#ffffff">
          </circle>
        </g>
      </g>
    </svg>
  </Spinner>
)

export default Loading
