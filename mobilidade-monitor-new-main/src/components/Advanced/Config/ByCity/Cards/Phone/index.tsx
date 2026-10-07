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

const CardPhone: FC<CardProps> = ({ item, onSearch }) => {
	const [phoneValue, setPhoneValue] = useState('');

	useEffect(() => {
		setPhoneValue(item.value as string);
	}, [item]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const newValue = e.target.value;
		setPhoneValue(newValue);
	};

	return (
		<Card>
			<FirstColumn>
				<Label>{item.description}</Label>
			</FirstColumn>
			<SecondColumn>
				<SearchInput
					enterButton={<MdCheck />}
					size="middle"
					placeholder="+55 (99) 9 9999-9999"
					value={Mask.setCustomPhoneMask(phoneValue)}
					onChange={handleChange}
					onSearch={() =>
						onSearch(phoneValue.replace(/\D/g, ''), item.attribute, item.inputType)
					}
				/>
			</SecondColumn>
		</Card>
	);
};

export default CardPhone;
