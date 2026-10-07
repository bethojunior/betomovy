import { FC, useEffect, useState } from 'react';
import { MdCheck } from 'react-icons/md';
import {
	Card,
	FirstColumn,
	Label,
	SecondColumn,
	SearchInput,
} from '../../../../../../pages/Advanced/Configs/ConfigByCities/styles';

interface configCitiesData {
	attribute: string;
	cityId: number;
	description: string;
	inputType: string;
	value: string | {
		accept: {
			[key:string]: boolean
		}
	};
}

interface CardProps {
	item: configCitiesData;
	onSearch: (value: string, attribute: string, inputType: string) => void;
}

const CardLink: FC<CardProps> = ({ item, onSearch }) => {
	const [linkValue, setLinkValue] = useState('');

	useEffect(() => {
		setLinkValue(item.value as string);
	}, [item]);

	return (
		<Card>
			<FirstColumn>
				<Label>{item.description}</Label>
			</FirstColumn>
			<SecondColumn>
				<SearchInput
					enterButton={<MdCheck />}
					size="middle"
					value={linkValue}
					onChange={(e) => setLinkValue(e.target.value)}
					onSearch={() =>
						onSearch(linkValue, item.attribute, item.inputType)
					}
				/>
			</SecondColumn>
		</Card>
	);
};

export default CardLink;
