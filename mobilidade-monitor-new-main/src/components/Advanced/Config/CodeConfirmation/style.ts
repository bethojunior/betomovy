import styled from 'styled-components';

export const ContentCard = styled.div`
	width: 100%;
	background-color: #fff;
	border: 1px solid #00000050;
	border-radius: 5px;
	-webkit-box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.75);
	-moz-box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.75);
	box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.75);
`;

export const HeaderCard = styled.div`
	font-size: 20px;
	padding: 0.8rem 0.5rem;
	border-bottom: 1px solid #00000050;

	@media (max-width: 425px) {
		font-size: 16px;
		text-align: center;
	}
`;

export const BodyCard = styled.div`
	padding: 1rem 0.5rem;
	display: flex;
	gap: 20px;
	@media (max-width: 425px) {
		font-size: 14px;
		justify-content: center;
	}
`;
