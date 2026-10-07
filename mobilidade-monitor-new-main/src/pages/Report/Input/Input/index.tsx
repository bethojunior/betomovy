import { FC, useEffect, useState } from 'react';
import { Input } from 'antd';

interface ReportFilters {
	field: string;
	fieldType: string;
	id: number;
	name: string;
	path_url: string;
	reportId: number;
	required: boolean;
	statusId: number;
}

interface InputProps {
	item: ReportFilters;
	onChangeValue: (name: string, value: number | string) => void;
}

const Inputt: FC<InputProps> = ({ item, onChangeValue }) => {
	const [value, setValue] = useState('');

	useEffect(() => {
		if (value) onChangeValue(value, item.field);
	}, [value]);

	return (
		<div>
			<p style={{ marginBottom: 0, marginTop: 10 }}>{item.name}</p>
			<Input
				type={item.fieldType}
				id={String(item.id)}
				key={`input${item.id}`}
				onChange={(e) => setValue(e.target.value)}
			/>
		</div>
	);
};

export default Inputt;
