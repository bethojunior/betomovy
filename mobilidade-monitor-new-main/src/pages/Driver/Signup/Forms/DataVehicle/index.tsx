import React, { useState, useRef, useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import {
	Container,
	Content,
	Form,
	Input,
	ContentTwoColumns,
	ContentButtonForm,
	TextErrorField,
	Select,
} from './style';

import { DatasFormProps } from '../../types';
import Mask from '../../../../../services/Mask';

interface FormsRegisterDriverProps {
	indexForm: number;
	setIndexForm: (data: number) => void;
	datasUser: DatasFormProps | undefined;
	setDatasUser: (data: any) => void;
}

interface InputProps {
	documentCar: string;
	brandCar: string;
	modelCar: string;
	plateCar: string;
	numberRenavam: string;
	colorCar: string;
	numberSeats: string;
	yearCar: string;
	companyCnpj: string;
}

const optionsColorCar = [
	{
		id: 1,
		name: 'Branco',
	},
	{
		id: 2,
		name: 'Prata',
	},
	{
		id: 3,
		name: 'Preto',
	},
	{
		id: 4,
		name: 'Cinza',
	},
	{
		id: 5,
		name: 'Vermelho',
	},
	{
		id: 6,
		name: 'Azul',
	},
	{
		id: 7,
		name: 'Verde',
	},
	{
		id: 8,
		name: 'Bege',
	},
	{
		id: 9,
		name: 'Branco',
	},
	{
		id: 10,
		name: 'Marrom',
	},
	{
		id: 11,
		name: 'Dourado/Amarelo',
	},
	{
		id: 12,
		name: 'Laranja',
	},
];

const DataVehicle = ({
	indexForm,
	setIndexForm,
	datasUser,
	setDatasUser,
}: FormsRegisterDriverProps) => {
	const {
		register,
		handleSubmit,
		formState: { errors },
	} = useForm<InputProps>();

	const refCheckInput = useRef<HTMLInputElement>(null);

	const [numberSeats, setNumberSeats] = useState<number>(4);
	const [isShowInput, setIsShowInput] = useState<boolean>(false);
	const [cnpjCompany, setCnpjCompany] = useState<string>('');

	const handleShowInputCompanyCnpj = () => {
		if (refCheckInput.current?.checked) {
			setIsShowInput(true);
		} else {
			setIsShowInput(false);
			setCnpjCompany('');
		}
	};

	const onSubmit: SubmitHandler<InputProps> = (datas) => {
		setDatasUser({ ...datasUser, datasVehicle: datas });
		setIndexForm(indexForm + 1);
	};

	useEffect(() => {
		setCnpjCompany(Mask.setMaskCPFCNPJ(cnpjCompany));
	}, [cnpjCompany]);

	return (
		<Container>
			<h1>Cadastro de veículo</h1>
			<Content>
				<Form onSubmit={handleSubmit(onSubmit)}>
					<Input
						{...register('documentCar', { required: true })}
						placeholder="Numero do documento do carro"
						autoComplete="off"
						aria-invalid={errors.documentCar ? 'true' : 'false'}
						onChange={(event) => {
							const { value } = event.target;
							event.target.value = Mask.setMaskJustNumber(value);
						}}
						maxLength={14}
					/>
					{errors.documentCar && (
						<TextErrorField>Campo obrigatório</TextErrorField>
					)}
					<ContentTwoColumns>
						<div>
							<Input
								{...register('brandCar', { required: true })}
								placeholder="Informe a marca do carro"
								autoComplete="off"
								aria-invalid={errors.brandCar ? 'true' : 'false'}
							/>
							{errors.brandCar && (
								<TextErrorField>Campo obrigatório</TextErrorField>
							)}
						</div>

						<div>
							<Input
								{...register('modelCar', { required: true })}
								placeholder="Informe o modelo do carro"
								autoComplete="off"
								aria-invalid={errors.modelCar ? 'true' : 'false'}
							/>
							{errors.modelCar && (
								<TextErrorField>Campo obrigatório</TextErrorField>
							)}
						</div>
					</ContentTwoColumns>

					<ContentTwoColumns>
						<div>
							<Input
								{...register('plateCar', { required: true })}
								placeholder="Placa do carro - AAA-1234"
								autoComplete="off"
								aria-invalid={errors.plateCar ? 'true' : 'false'}
								maxLength={8}
								onChange={(event) => {
									const { value } = event.target;
									event.target.value = Mask.setMaskPlateVehicle(value);
								}}
							/>
							{errors.plateCar && (
								<TextErrorField>Campo obrigatório</TextErrorField>
							)}
						</div>

						<div>
							<Input
								{...register('numberRenavam', { required: true })}
								placeholder="Número do Renavam"
								autoComplete="off"
								aria-invalid={errors.numberRenavam ? 'true' : 'false'}
								onChange={(event) => {
									const { value } = event.target;
									event.target.value = Mask.setMaskJustNumber(value);
								}}
								maxLength={11}
							/>
							{errors.numberRenavam && (
								<TextErrorField>Campo obrigatório</TextErrorField>
							)}
						</div>
					</ContentTwoColumns>

					<ContentTwoColumns>
						<div>
							<Select {...register('colorCar', { required: true })}>
								<option value="" disabled selected>
									Selecione a cor do carro
								</option>
								{optionsColorCar.map((value) => {
									return (
										<React.Fragment key={value.id}>
											<option value={value.name}>
												{value.name}
											</option>
										</React.Fragment>
									);
								})}
							</Select>
							{errors.colorCar && (
								<TextErrorField>Campo obrigatório</TextErrorField>
							)}
						</div>

						<div>
							<Input
								{...register('numberSeats', { required: true })}
								placeholder="Número de assentos"
								type="number"
								onChange={(event) =>
									setNumberSeats(Number(event.target.value))
								}
								value={numberSeats}
								autoComplete="off"
								aria-invalid={errors.numberSeats ? 'true' : 'false'}
							/>
							{errors.numberSeats && (
								<TextErrorField>Campo obrigatório</TextErrorField>
							)}
						</div>
					</ContentTwoColumns>

					<ContentTwoColumns>
						<div>
							<Input
								{...register('yearCar', { required: true })}
								placeholder="Ano do carro"
								autoComplete="off"
								aria-invalid={errors.yearCar ? 'true' : 'false'}
								onChange={(event) => {
									const { value } = event.target;
									event.target.value = Mask.setMaskJustNumber(value);
								}}
							/>
							{errors.yearCar && (
								<TextErrorField>Campo obrigatório</TextErrorField>
							)}
						</div>

						<div>
							{/* eslint-disable */}
							<input
								type="checkbox"
								id="isLocated"
								name="isLocated"
								ref={refCheckInput}
								onChange={handleShowInputCompanyCnpj}
							/>
							<label htmlFor="isLocated">Veículo é locado?</label>
						</div>
					</ContentTwoColumns>

					{isShowInput && (
						<>
							<Input
								{...register('companyCnpj', {
									required: isShowInput ? true : false,
								})}
								placeholder="CNPJ da empresa"
								value={cnpjCompany}
								onChange={(event) => setCnpjCompany(event.target.value)}
								autoComplete="off"
								aria-invalid={errors.companyCnpj ? 'true' : 'false'}
							/>
							{errors.companyCnpj && (
								<TextErrorField>Campo obrigatório</TextErrorField>
							)}
						</>
					)}

					<ContentButtonForm>
						<button type="submit">Próximo</button>
					</ContentButtonForm>
				</Form>
			</Content>
		</Container>
	);
};

export default DataVehicle;
