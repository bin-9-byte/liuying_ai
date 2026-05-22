declare module '@/components/webgl/Dither' {
  interface DitherProps {
    waveSpeed?: number
    waveFrequency?: number
    waveAmplitude?: number
    waveColor?: [number, number, number]
    colorNum?: number
    pixelSize?: number
    disableAnimation?: boolean
    enableMouseInteraction?: boolean
    mouseRadius?: number
  }
  const Dither: (props: DitherProps) => JSX.Element
  export default Dither
}