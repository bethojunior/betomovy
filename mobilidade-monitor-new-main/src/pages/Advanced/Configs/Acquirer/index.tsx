import { FC, useEffect, useState } from 'react';
import { Button, Form, Input, Select } from 'antd';
import swal from 'sweetalert';
import api from '../../../../services/api';
import {
	AcquirerBody,
	SearchContainer,
	LabelSelect,
	BankContainer,
	Title,
	CardDataContainer,
	Container,
	DataContainer,
	ButtonContainer,
	Loader,
} from './styles';
import Alert from '../../../../components/Utils/Alert';
import Preload from '../../../../components/Utils/Preload';

interface AcquirerId {
	idFinancialIntermediary: number;
}

interface FindActive {
	active: number;
}

interface AcquirerInterface extends Array<AcquirerData> {}

interface AcquirerData {
	name: string;
	value: {
		acquirer_meta_data: [
			{
				description: string;
				financialIntermediaryId: number;
				key: string;
				value: string;
			},
		];
		active: number;
		idFinancialIntermediary: number;
		name: string;
	};
}

interface ListDataInterface extends Array<ListData> {}

interface ListData {
	acquirer_meta_data: [
		{
			description: string;
			financialIntermediaryId: number;
			key: string;
			value: string;
		},
	];
	active: number;
	idFinancialIntermediary: number;
	name: string;
}

interface ListDataMap {
	description: string;
	financialIntermediaryId: number;
	key: string;
	value: string;
}

interface ResultProps {
	[key: string]: string;
}

const Acquirer: FC = () => {
	const [loading, setLoading] = useState(false);
	const [messageAlert, setMessageAlert] = useState('');
	const [showAlert, setShowAlert] = useState(false);
	const [typeAlert, setTypeAlert] = useState<
		'success' | 'info' | 'warning' | 'error'
	>('success');

	const [searchResponse, setSearchResponse] = useState<ListDataInterface>();
	const [acquirerArray, setAcquirerArray] = useState<AcquirerInterface>();
	const [list, setList] = useState<ListData>();
	const [showButton, setShowButton] = useState(false);
	const [form] = Form.useForm();

	const { Option } = Select;

	useEffect(() => {
		if (list !== null) {
			const result: ResultProps = {};
			list?.acquirer_meta_data?.map((item: ListDataMap) => {
				result[item.key] = item.value;
				return null;
			});
			form.setFieldsValue({ ...result });
		}
	}, [list]);

	useEffect(() => {
		setLoading(true);
		api.get(`acquirer`).then((values) => {
			setLoading(false);
			if (values.status === 200) {
				setList(
					values.data.response.find(
						(item: FindActive) => item.active === 1,
					),
				);
				setAcquirerArray(
					values.data.response.map((item: AcquirerData) => ({
						value: item,
						label: item.name,
					})),
				);
				setSearchResponse(values.data.response);
			}
		});
	}, []);

	useEffect(() => {
		setShowButton(true);
		if (list === undefined) {
			setShowButton(false);
		}
	}, [showButton, list]);

	const onFinish = (response: {}) => {
		const key = Object.keys(response);
		const value = Object.values(response);

		let obj = {};
		const keepValue = [];
		const finalValue: {}[] = [];
		for (let i = 0; i < key.length; i++) {
			obj = {
				key: key[i],
				value: value[i],
			};
			keepValue.push(obj);
			finalValue.push(keepValue.slice(0));
		}
		swal({
			title: 'Confirma alteração de adquirente?',
			text: 'Mudança de adquirente pode excluir coletivamente os números dos cartões de crédito dos usuários ja cadastrados, podendo causar falhas ou exigir recadastramento dos mesmos.',
			icon: 'warning',
			buttons: ['Cancelar', 'Confirmar'],
			dangerMode: true,
		}).then((result) => {
			if (result) {
				setLoading(true);
				api.put(`acquirer/${list?.idFinancialIntermediary}`, {
					metadata: finalValue[finalValue.length - 1],
				}).then((values) => {
					setLoading(false);
					if (values.status === 200) {
						setTypeAlert('success');
						setMessageAlert('Adquirente alterada com sucesso!');
						return setShowAlert(true);
					}
					setTypeAlert('error');
					setMessageAlert('Erro ao alterar adquirente!');
					return setShowAlert(true);
				});
			}
		});
	};

	const valueSeleted = (id: number) => {
		setList(
			searchResponse?.find(
				(el: AcquirerId) => el?.idFinancialIntermediary === id,
			),
		);
	};

	if (loading) return <Loader spinning />;

	return (
		<AcquirerBody>
			<Preload visible={loading} />
			<Alert
				visibility={showAlert}
				message={messageAlert}
				typeAlert={typeAlert}
				setVisibility={setShowAlert}
			/>
			<CardDataContainer>
				<SearchContainer>
					<LabelSelect>Adquirentes</LabelSelect>
					<Select
						style={{ width: '100%' }}
						placeholder={list?.name || 'Selecione uma adquirente'}
						onChange={(value) => {
							valueSeleted(Number(value));
							setShowButton(true);
						}}
					>
						{acquirerArray?.map((item: AcquirerData) => {
							return (
								<Option
									key={item.value.idFinancialIntermediary}
									value={item.value.idFinancialIntermediary}
								>
									{item.value.name}
								</Option>
							);
						})}
					</Select>
				</SearchContainer>
				<BankContainer>
					<Title>{list?.name || ''}</Title>
				</BankContainer>
				<Form
					form={form}
					layout="vertical"
					name="keysForm"
					onFinish={onFinish}
				>
					{list?.acquirer_meta_data?.map((item: ListDataMap) => {
						return (
							<Container key={item.key}>
								<DataContainer>
									<Form.Item
										label={item.description}
										name={item.key}
										rules={[
											{
												required: true,
												message: 'Esse campo é obrigatório!',
											},
										]}
									>
										<Input />
									</Form.Item>
								</DataContainer>
							</Container>
						);
					})}
					<ButtonContainer>
						<Button type="primary" htmlType="submit">
							Salvar
						</Button>
					</ButtonContainer>
				</Form>
			</CardDataContainer>
		</AcquirerBody>
	);
};

export default Acquirer;
