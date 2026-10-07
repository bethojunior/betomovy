import { DatasFormProps } from '../../types';

interface FormsRegisterDriverProps {
	indexForm: number;
	setIndexForm: (data: number) => void;
	datasUser: DatasFormProps | undefined;
	setDatasUser: (data: any) => void;
}

const PasswordApp = ({
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
			<h1>Senha de segurança</h1>
			<button type="button" onClick={handleNext}>
				Próxima
			</button>
		</>
	);
};

export default PasswordApp;
