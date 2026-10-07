import { DatasFormProps } from '../../types';

interface FormsRegisterDriverProps {
	indexForm: number;
	setIndexForm: (data: number) => void;
	datasUser: DatasFormProps | undefined;
	setDatasUser: (data: any) => void;
}

const ValidateNumber = ({
	indexForm,
	setIndexForm,
	//@ts-ignore
	datasUser,
	//@ts-ignore
	setDatasUser,
}: FormsRegisterDriverProps) => {
	const handleNext = () => {
		setIndexForm(indexForm + 1);
	};

	return (
		<>
			<h1>Formulário de validação de senha</h1>
			<button type="button" onClick={handleNext}>
				Próxima
			</button>
		</>
	);
};

export default ValidateNumber;
