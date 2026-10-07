import { Switch } from 'antd';
import { FC, useEffect, useState } from 'react';
import {
	Card,
	FirstColumn,
	Label,
	SecondColumn,
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
	onSearch: (value: boolean, attribute: string, inputType: string) => void;
}

const CardSwitch: FC<CardProps> = ({ item, onSearch }) => {
	const [phoneValue, setSwitchValue] = useState<boolean>();

	useEffect(() => {
		setSwitchValue(item.value === '1');
	}, [item]);

	return (
		<Card className="cardSwitch">
			<FirstColumn className="firstColumnSwitch">
				<Label>{item.description}</Label>
			</FirstColumn>
			<SecondColumn className="secondColumnSwitch">
				<Switch
					checked={phoneValue}
					onChange={(e) => {
						setSwitchValue(e);
						onSearch(e, item.attribute, item.inputType);
					}}
				/>
			</SecondColumn>
		</Card>
	);
};

export default CardSwitch;
