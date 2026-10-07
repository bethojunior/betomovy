import { Card, Image } from 'antd'
import styled from 'styled-components'

// Estilos para motoristas
export const DriverAvatar = styled.div`
	width: clamp(48px, 9vw, 72px);
	aspect-ratio: 1 / 1;
	border-radius: 50%;
	overflow: hidden;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
	background: #f3f4f6;
`

export const ImageDriver = styled(Image)`
	&& {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}
`

interface CircleProps {
	status: string
}

export const CircleStatus = styled.div<CircleProps>`
	color: ${({ status }) =>
		status === 'disponivel' ? '#18b532' :
			status === 'corrida' ? '#ef4444' :
				status === 'desligado' ? '#6b7280' :
					'#6b7280'};
	display: flex;
	align-items: center;
`

export const CardDriver = styled(Card)`
	width: 100%;
	padding: 0px;
`

export const CardRow = styled.div`
	display: flex;
	align-items: center;
	justify-content: space-between;
	gap: 16px;
`

export const DriverInfo = styled.div`
	flex: 1;
	display: flex;
	align-items: center;
	justify-content: center;
`

export const TextCard = styled.p`
	margin: 0px;
	padding: 0px;
	font-size: 16px;
	font-weight: 600;
	color: #1f2937;
	text-align: center;
	line-height: 1.4;
`

// Estilos para clientes
export const ClientAvatar = styled.div`
	width: clamp(72px, 14vw, 120px);
	aspect-ratio: 1 / 1;
	border-radius: 50%;
	overflow: hidden;
	display: flex;
	align-items: center;
	justify-content: center;
	flex-shrink: 0;
	background: #f3f4f6;
`

export const Imageclient = styled(Image)`
	&& {
		width: 100%;
		height: 100%;
		object-fit: cover;
		display: block;
	}
`

export const Status = styled.div`
	display: flex;
	align-items: center;
`

export const CardClient = styled.div`
	width: 100%;
	padding: 12px;
	border: 1px solid #f0f0f0;
	border-radius: 8px;
	background-color: #fff;
`

export const ClientInfo = styled.div`
	display: flex;
	flex-direction: column;
	gap: 4px;
	flex: 1;

	> p {
		margin: 0;
		text-align: left;
	}

	> p:first-child {
		font-size: 16px;
		font-weight: 600;
		color: #1f2937;
	}

	> p:nth-child(2) {
		font-size: 14px;
		color: #6b7280;
	}

	> p:nth-child(3) {
		font-size: 15px;
		color: #111827;
		font-weight: 500;
	}
`

// Estilos compartilhados
export {
	ModalContainer,
	ModalHeader,
	SearchInput,
	ScrollableList,
	EmptyState,
} from '../sharedModalStyles'
