import React, { useState, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import api from '../../../../../services/api';
import {
	Container,
	Content,
	Select,
	Form,
	ContentButtonForm,
	TextErrorField,
} from './style';
import Preload from '../../../../../components/Utils/Preload';
import { DatasFormProps } from '../../types';

interface InputsProps {
	city: string;
}

interface CityActiveProps {
	cityId: number;
	nome: string;
	polygon: string;
	shortName: string;
}

interface FormsRegisterDriverProps {
	indexForm: number;
	setIndexForm: (data: number) => void;
	datasUser: DatasFormProps | undefined;
	setDatasUser: (data: any) => void;
}

const SelectionState = ({
	indexForm,
	setIndexForm,
	datasUser,
	setDatasUser,
}: FormsRegisterDriverProps) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<InputsProps>();

	const [loading, setLoading] = useState<boolean>(false);
	const [statesActive, setStatesActive] = useState<CityActiveProps[]>([]);

	useEffect(() => {
		const handleGetAllCitiesActive = async () => {
			setLoading(true);
			const response = await api.get(`city/actives/fully`);
			setStatesActive(response.data.response);

			setLoading(false);
		};

		handleGetAllCitiesActive();
	}, []);

	const onSubmit: SubmitHandler<InputsProps> = (data) => {
		setDatasUser({ ...datasUser, stateSelected: data });
		setIndexForm(indexForm + 1);
	};

	return (
		<Container>
			<Preload visible={loading} />
			<h1>Seleção da cidade</h1>
			<Content>
				<Form onSubmit={handleSubmit(onSubmit)}>
					<Select {...register('city', { required: true })}>
						<option value="" disabled selected>
							Selecione a cidade
						</option>
						{statesActive.map((value) => {
							return (
								<React.Fragment key={value.cityId}>
									<option value={value.cityId}>{value.nome}</option>;
								</React.Fragment>
							);
						})}
					</Select>
					{errors.city && (
						<TextErrorField>
							O campo seleção de cidade é obrigatório
						</TextErrorField>
					)}

					<ContentButtonForm>
						<button type="submit">Próximo</button>
					</ContentButtonForm>
				</Form>
			</Content>
		</Container>
	);
};

export default SelectionState;
