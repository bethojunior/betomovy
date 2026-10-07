import { FC, useEffect, useState } from 'react'
import { MdPerson } from 'react-icons/md'
import { Image, Wrapper } from './styles'
import { AvatarWithFallbackProps } from './types'

const AvatarWithFallback: FC<AvatarWithFallbackProps> = ({ src, alt, size = 48 }) => {
  const [failed, setFailed] = useState(false)
  const showFallback = !src || failed

  useEffect(() => {
    setFailed(false)
  }, [src])

  return (
    <Wrapper $size={size}>
      {showFallback
        ? <MdPerson size={size * 0.65} />
        : <Image src={src} alt={alt} onError={() => setFailed(true)} />
      }
    </Wrapper>
  )
}

export default AvatarWithFallback
