import styled from 'styled-components';

type TypeMessage = {
	type: boolean;
};

export const TypeMessage = styled.p`
	margin-bottom: 2px;
	font-size: 12px;
	font-weight: bold;
`;

export const Message = styled.p`
	margin-bottom: 0;
`;

export const MessageContent = styled.li<TypeMessage>`
	width: 50%;
	height: auto;
	border-radius: 10px;
	background: #e9e9e9;
	padding: 10px;
	color: #000000;
	font-family: arial;
	margin-bottom: 10px;
	position: relative;

	&:last-child {
		margin-bottom: 0;
	}

	@media (max-width: 800px) {
		width: 80%;
		left: ${({ type }) => type && '60px'};
	}

	left: ${({ type }) => type && '230px'};

	${({ type }) =>
		type
			? `
  :before {
  content: "";
  width: 0px;
  height: 0px;
  position: absolute;
  border-left: 10px solid #e9e9e9;
  border-right: 10px solid transparent;
  border-top: 10px solid #e9e9e9;
  border-bottom: 10px solid transparent;
  right: -20px;
  top: 6px;
}`
			: `:before {
  content: "";
  width: 0px;
  height: 0px;
  position: absolute;
  border-left: 10px solid transparent;
  border-right: 10px solid #e9e9e9;
  border-top: 10px solid #e9e9e9;
  border-bottom: 10px solid transparent;
  left: -19px;
  top: 6px;
}`};
`;
