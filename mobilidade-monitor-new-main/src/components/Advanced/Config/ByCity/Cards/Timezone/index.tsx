import { Select } from 'antd';
import { FC, useEffect, useState } from 'react';
import {
	Card,
	FirstColumn,
	Label,
	SecondColumn,
} from '../../../../../../pages/Advanced/Configs/ConfigByCities/styles';
import { BRAZIL_TIMEZONES } from '../../../../../../constants/timezones';

const { Option } = Select;

interface configCitiesData {
	attribute: string;
	cityId: number;
	description: string;
	inputType: string;
	value: string | {
		accept: {
			[key: string]: boolean
		}
	};
}

interface CardProps {
	item: configCitiesData;
	onSearch: (value: string, attribute: string, inputType: string) => void;
}

const CardTimezone: FC<CardProps> = ({ item, onSearch }) => {
	const [timezoneValue, setTimezoneValue] = useState<string>('');

	useEffect(() => {
		const value = item.value;
		setTimezoneValue(value && value !== 'null' && value !== null ? String(value) : '');
	}, [item]);

	const handleChange = (value: string) => {
		setTimezoneValue(value);
		onSearch(value, item.attribute, item.inputType);
	};

	return (
		<Card className="cardTimezone">
			<FirstColumn className="firstColumnTimezone">
				<Label>{item.description}</Label>
			</FirstColumn>
			<SecondColumn className="secondColumnTimezone">
				<Select
					value={timezoneValue || undefined}
					onChange={handleChange}
					placeholder="Selecione um timezone"
					style={{ width: '100%' }}
					allowClear
				>
					{BRAZIL_TIMEZONES.map(timezone => (
						<Option key={timezone} value={timezone}>
							{timezone}
						</Option>
					))}
				</Select>
			</SecondColumn>
		</Card>
	);
};

export default CardTimezone;