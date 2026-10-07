import { InputNumber, Button } from 'antd';
import { FC, useEffect, useState } from 'react';
import {
	Card,
	FirstColumn,
	InputRow,
	Label,
	SecondColumn,
} from '../../../../../../pages/Advanced/Configs/ConfigByCities/styles';
import { CardProps } from './types';

// 0 - Desabilitado, 1 - Ativado por saldo, 2 - Ativado por período, 3 - Ambos
const PREPAID_MODE_MIN = 0;
const PREPAID_MODE_MAX = 3;

const CardPrepaid: FC<CardProps> = ({ item, onSearch }) => {
	const [prepaidValue, setPrepaidValue] = useState<number | null>(null);

	useEffect(() => {
		const numValue = parseInt(String(item.value));
		setPrepaidValue(isNaN(numValue) ? null : numValue);
	}, [item]);

	const handleSave = () => {
		const valueToSave = prepaidValue?.toString() || '';
		onSearch(valueToSave, item.attribute, item.inputType);
	};

	return (
		<Card className="cardPrepaid">
			<FirstColumn className="firstColumnPrepaid">
				<Label>{item.description}</Label>
			</FirstColumn>
			<SecondColumn className="secondColumnPrepaid">
				<InputRow>
					<InputNumber
						value={prepaidValue}
						onChange={(value) => setPrepaidValue(value)}
						placeholder="0 - Desabilitado, 1 - Ativado por saldo, 2 - Ativado por período, 3 - Ambos"
						style={{ flex: 1 }}
						min={PREPAID_MODE_MIN}
						max={PREPAID_MODE_MAX}
						step={1}
						precision={0}
					/>
					<Button type="primary" onClick={handleSave}>
						Salvar
					</Button>
				</InputRow>
			</SecondColumn>
		</Card>
	);
};

export default CardPrepaid;
