import { Input, Button } from 'antd';
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
			[key: string]: boolean
		}
	};
}

interface CardProps {
	item: configCitiesData;
	onSearch: (value: string, attribute: string, inputType: string) => void;
}

const CardCurrency: FC<CardProps> = ({ item, onSearch }) => {
	const [currencyValue, setCurrencyValue] = useState<string>('');

	useEffect(() => {
		setCurrencyValue(String(item.value) || '');
	}, [item]);

	const handleSave = () => {
		onSearch(currencyValue, item.attribute, item.inputType);
	};

	return (
		<Card className="cardCurrency">
			<FirstColumn className="firstColumnCurrency">
				<Label>{item.description}</Label>
			</FirstColumn>
			<SecondColumn className="secondColumnCurrency">
				<div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
					<Input
						value={currencyValue}
						onChange={(e) => setCurrencyValue(e.target.value)}
						placeholder="Ex: BRL, USD, EUR"
						style={{ flex: 1 }}
					/>
					<Button type="primary" onClick={handleSave}>
						Salvar
					</Button>
				</div>
			</SecondColumn>
		</Card>
	);
};

export default CardCurrency;