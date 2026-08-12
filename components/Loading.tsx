import type { FC } from 'react'

interface LoadingProps {
  readonly size?: number
  readonly speed?: number
  readonly dir?: number
}

const Loading: FC<LoadingProps> = ({ size = 64, speed = 1, dir = 1 }) => (
  <div
    style={{
      animation: `${dir > 0 ? 'spin-cw' : 'spin-ccw'} ${2 / speed}s linear infinite`,
    }}
  >
    {/* biome-ignore lint/a11y/noSvgWithoutTitle: <explanation> */}
    <svg
      xmlns='http://www.w3.org/2000/svg'
      className="mx-auto block"
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
  </div>
)

export default Loading
