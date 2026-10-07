import React from 'react';
import { HeaderCard, BodyCard, ContentCard } from './style';

interface CardCodeConfirmation {
	title: string;
	content: React.ReactNode;
}

const CardCodeConfirmation = ({ title, content }: CardCodeConfirmation) => {
	return (
		<ContentCard>
			<HeaderCard>{title}</HeaderCard>
			<BodyCard>{content}</BodyCard>
		</ContentCard>
	);
};

export default CardCodeConfirmation;
