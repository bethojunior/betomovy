import { useState } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import swal from 'sweetalert';
import { DatasFormProps } from '../../types';

import {
	Container,
	Form,
	Content,
	Input,
	Select,
	ContentButtonForm,
	TextErrorField,
} from './style';

import Mask from '../../../../../services/Mask';
import api from '../../../../../services/api';

interface InputProps {
	name: string;
	cpf_cnpj: string;
	gender: string;
	email: string;
	phone: string;
}

interface FormsRegisterDriverProps {
	indexForm: number;
	setIndexForm: (data: number) => void;
	datasUser: DatasFormProps | undefined;
	setDatasUser: (data: any) => void;
}

const DatasPersonal = ({
	indexForm,
	setIndexForm,
	datasUser,
	setDatasUser,
}: FormsRegisterDriverProps) => {
	const {
		register,
		handleSubmit,
		reset,
		formState: { errors },
	} = useForm<InputProps>();

	const [loading, setLoading] = useState<boolean>(false);
	//@ts-ignore
	const [cpfOrcnpj, setCpfOrCnpj] = useState<string>('');

	const handleCheckEmail = (email: string) => {
		/* CHECK EMAIL */
		api.post(`/driver/checkemail`, {
			stdObject: [{ email }],
		})
			.then((response: any) => {
				if (response.data.status) {
					swal({
						title: 'Esse email já existe!',
						icon: 'warning',
					});
					reset({
						email: '',
					});
					/* eslint-disable */
					return;
				}
			})
			.catch((error: any) => {
				console.log(error);
			});
	};

	const onSubmit: SubmitHandler<InputProps> = async (data) => {
		/* CHECK EXISTS SPACE IN NAME */
		if (!/\s/.test(data.name)) {
			swal({
				title: 'Insira seu nome completo!',
				icon: 'warning',
			});

			return;
		}

		setLoading(true);

		const response = await api.post(
			`/driver/checkdocument`,
			{
				document: data.cpf_cnpj,
			},
		);

		if (response.data.status) {
			swal({
				title: 'Esse documento já existe',
				icon: 'warning',
			});
			setCpfOrCnpj('');
			setLoading(false);
			return;
		}

		if (!loading) {
			setDatasUser({ ...datasUser, dataPersonal: data });
			setIndexForm(indexForm + 1);
		}
	};

	return (
		<Container>
			<h1>Dados Pessoais</h1>
			<Content>
				<Form onSubmit={handleSubmit(onSubmit)}>
					<Input
						{...register('name', { required: true })}
						placeholder="Nome Completo"
						aria-invalid={errors.name ? 'true' : 'false'}
						autoComplete="off"
						onChange={(event) => {
							const { value } = event.target;
							event.target.value = Mask.setMaskOnlyLetters(value);
						}}
					/>
					{errors.name && (
						<TextErrorField>Nome é obrigatório</TextErrorField>
					)}

					<Input
						{...register('cpf_cnpj', { required: true })}
						placeholder="CPF/CNPJ"
						onChange={(event) => {
							const { value } = event.target;
							event.target.value = Mask.setMaskCPFCNPJ(value);
						}}
						aria-invalid={errors.cpf_cnpj ? 'true' : 'false'}
						autoComplete="off"
					/>
					{errors.cpf_cnpj && (
						<TextErrorField>CPF/CNPJ é obrigatório</TextErrorField>
					)}

					<Select {...register('gender', { required: true })}>
						<option value="default" disabled selected>
							Gênero
						</option>
						<option value="feminino">Feminino</option>
						<option value="masculino">Masculino</option>
						<option value="outro">Outro</option>
					</Select>
					{errors.gender && (
						<TextErrorField>Gênero é obrigatório</TextErrorField>
					)}

					<Input
						{...register('email', { required: true })}
						placeholder="Email"
						aria-invalid={errors.email ? 'true' : 'false'}
						type="email"
						autoComplete="off"
						onBlur={(event) => handleCheckEmail(event.target.value)}
					/>
					{errors.email && (
						<TextErrorField>Email é obrigatório</TextErrorField>
					)}

					<Input
						{...register('phone', { required: true })}
						placeholder="Telefone"
						onChange={(event) => {
							const { value } = event.target;
							event.target.value = Mask.setMaskPhoneValue(value);
						}}
						aria-invalid={errors.phone ? 'true' : 'false'}
						autoComplete="off"
					/>
					{errors.phone && (
						<TextErrorField>Telefone é obrigatório</TextErrorField>
					)}

					<ContentButtonForm>
						<button type="submit">Próximo</button>
					</ContentButtonForm>
				</Form>
			</Content>
		</Container>
	);
};

export default DatasPersonal;
