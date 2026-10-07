import { Select } from 'antd';
import { FC, useEffect, useState } from 'react';
import { SelectValue } from 'antd/lib/select';
import api from '../../../../services/api';
import { LabeledValue } from 'antd/es/select';

const { Option } = Select;

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

interface ListSelectArray extends Array<ListSelectProps> {}

interface ListSelectProps {
	id: number;
	text: string;
}

type ValueProps = string | number | any[] | LabeledValue | LabeledValue[]

interface SelectProps {
	item: ReportFilters;
	onChangeValue: (value: ValueProps, name: string) => void;
}

const SelectInput: FC<SelectProps> = ({ item, onChangeValue }) => {
	const [listSelect, setListSelect] = useState<ListSelectArray>([]);
	const [value, setValue] = useState('' as SelectValue);

	useEffect(() => {
		if (value) onChangeValue(value, item.field);
	}, [value]);

useEffect(() => {
	api(item.path_url).then((result) => {
		if (!result.data.status) {
			return '';
		}
		const uniqueList = Array.from(
			new Map(result.data.response.map((option: ListSelectProps) => [option.id, option])).values()
		) as ListSelectArray;
		return setListSelect(uniqueList);
	});
}, [item.path_url]);

	return (
		<div>
			<p style={{ marginBottom: 0, marginTop: 10 }}>{item.name}</p>
			<Select onChange={(e) => setValue(e)} style={{ width: '100%' }}>
				{listSelect.map((option) => (
					<Option value={option.id} key={`select${option.id}`}>
						{option.text}
					</Option>
				))}
			</Select>
		</div>
	);
};

export default SelectInput;
