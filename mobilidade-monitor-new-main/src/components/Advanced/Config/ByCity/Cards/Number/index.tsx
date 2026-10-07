import { FC, useEffect, useState } from 'react';
import { MdCheck } from 'react-icons/md';
import Mask from '../../../../../../services/Mask';
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

const CardNumber: FC<CardProps> = ({ item, onSearch }) => {
	const [numberValue, setNumberValue] = useState('');

	useEffect(() => {
		setNumberValue(item.value as string);
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
					value={numberValue}
					onChange={(e) =>
						setNumberValue(Mask.setMaskNumberAndDot(e.target.value))
					}
					onSearch={() =>
						onSearch(numberValue, item.attribute, item.inputType)
					}
				/>
			</SecondColumn>
		</Card>
	);
};

export default CardNumber;
