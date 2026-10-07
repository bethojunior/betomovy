import {IconAvatar, Image} from './styles';
import {CouponImageProps} from './types';

/** Ícone do cupom — só a imagem, não decide layout nem tamanho de coluna. */
export function CouponImage({source}: CouponImageProps) {
  return (
    <IconAvatar>
      <Image source={source} resizeMode="contain" />
    </IconAvatar>
  );
}
