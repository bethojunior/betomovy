import styled from 'styled-components';

export const TabTransition = styled.div`
	width: 100%;
	animation: tabFadeIn 0.25s ease;

	@keyframes tabFadeIn {
		from {
			opacity: 0;
			transform: translateY(6px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}
`;
