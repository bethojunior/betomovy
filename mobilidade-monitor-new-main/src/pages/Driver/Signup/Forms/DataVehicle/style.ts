import styled from 'styled-components';

export const Container = styled.div`
	width: 100%;

	> h1 {
		font-size: 28px;
		text-align: center;
	}
`;

export const Content = styled.div`
	width: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	flex-direction: column;
`;

export const Form = styled.form`
	text-align: center;
	background-color: #dadadadc;
	border-radius: 5px;
	padding: 1rem 2rem;
	-webkit-box-shadow: 0px 0px 9px 0px rgba(0, 0, 0, 0.75);
	-moz-box-shadow: 0px 0px 9px 0px rgba(0, 0, 0, 0.75);
	box-shadow: 0px 0px 9px 0px rgba(0, 0, 0, 0.75);

	@media (max-width: 768px) {
		width: 100%;
	}
`;

export const ContentTwoColumns = styled.div`
	display: flex;
	align-items: center;
	gap: 20px;

	> div {
		width: 100%;
	}

	@media (max-width: 768px) {
		flex-direction: column;
	}
`;

export const Input = styled.input`
	width: 100%;
	padding: 0.5rem 0.8rem;
	margin: 1rem 0;
	border: 1px solid #000;
	border-radius: 5px;
`;

export const Select = styled.select`
	width: 100%;
	padding: 0.8rem 1.2rem;
	border: 1px solid #000;
	border-radius: 5px;
	margin: 1rem 0;
`;

export const ContentButtonForm = styled.div`
	width: 100%;
	text-align: center;

	> button {
		width: 100%;
		padding: 0.5rem 0.8rem;
		border: none;
		border-radius: 5px;
		background-color: #001529;
		color: #f1f1f1;

		:hover {
			transition: all ease 0.3s;
			background-color: #022f58;
		}
	}
`;

export const TextErrorField = styled.span`
	color: red;
	display: block;
`;
