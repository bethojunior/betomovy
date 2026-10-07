import { Alert } from 'antd';
import styled from 'styled-components';

type AlertProps = {
	visible: boolean;
};

export const AlertComponent = styled(Alert)<AlertProps>`
	display: ${(props) => (props.visible ? '' : 'none')};
	position: absolute;
	top: 70px;
	width: 300px;
	right: 15px;
	z-index: 10000;
`;
