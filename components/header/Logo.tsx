import Image from 'next/image'
import logoSvg from './logo-word.svg'

export const Logo = () => (
  <Image
    priority
    src={logoSvg}
    alt="WaterGuardia logo"
    className="h-8"
    width={189}
    height={32}
  />
)
