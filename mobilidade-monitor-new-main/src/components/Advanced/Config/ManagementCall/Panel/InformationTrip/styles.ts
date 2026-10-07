import styled from 'styled-components';

export const Container = styled.div`
	width: 100%;
	display: flex;
	gap: 2rem;
	padding: 0 2rem;
	justify-content: space-between;

	@media (max-width: 1200px) {
		flex-direction: column;
		align-items: center;
		gap: 2rem;
	}

	@media (max-width: 768px) {
		padding: 0 1rem;
	}
`;

export const Content = styled.div`
	flex: 1;
	display: flex;
	flex-direction: column;
	gap: 20px;
	max-width: 800px;
	width: 100%;
`;

export const FormSection = styled.div`
	display: flex;
	flex-direction: column;
	gap: 20px;
`;

export const FirstSection = styled.div`
	width: 100%;
`;

export const SecondSection = styled.div`
	width: 100%;
`;

export const MockupSection = styled.div`
	flex-shrink: 0;
`;

export const Title = styled.p`
	margin-bottom: 8px;
	font-weight: 500;
`;

export const SaveButton = styled.div`
	width: 100%;
	margin-top: 8px;

	.ant-btn {
		width: 100%;
		height: 40px;
		font-size: 16px;
		font-weight: 500;
	}
`;