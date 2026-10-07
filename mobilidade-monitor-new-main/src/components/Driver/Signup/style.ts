import styled from 'styled-components';

interface ImageSelectedProps {
	backgroundUrl: string;
}

export const Container = styled.div`
	width: 100%;
	text-align: center;

	> h1 {
		font-size: 28px;
		text-align: center;
	}
`;

export const ContentForm = styled.form`
	width: 100%;
	display: flex;
	justify-content: center;
	flex-direction: column;
	align-items: center;
	gap: 20px;
`;

export const NameDocument = styled.input`
	width: 50%;
	padding: 6px 12px;
	font-size: 16px;
	border: 1px solid #cccccc;
	border-radius: 5px;
`;

export const ContentInputDocument = styled.div`
	width: 50%;
	background-color: #fff;
	position: relative;
	padding: 10px;
	border-radius: 5px;

	> span {
		position: absolute;
		left: 10px;
		top: 12px;
		z-index: 5;
	}

	> svg {
		position: absolute;
		right: 10px;
		top: 16px;
		z-index: 5;
	}

	@media (max-width: 600px) {
		width: 80%;
	}
`;

export const InputDocument = styled.input`
	width: 100%;
	opacity: 0;
	position: relative;
	z-index: 10;
`;

export const ImageSelected = styled.div<ImageSelectedProps>`
	width: 50%;
	height: 40vh;
	background-image: url(${(props) => props.backgroundUrl});
	background-position: center;
	background-repeat: no-repeat;
	background-size: cover;

	@media (max-width: 600px) {
		width: 80%;
	}
`;

export const Button = styled.button`
	width: 50%;
	padding: 0.5rem 0.8rem;
	border: none;
	border-radius: 5px;
	background-color: #001529;
	color: #f1f1f1;

	:hover {
		transition: all ease 0.3s;
		background-color: #022f58;
	}
`;
