import React, { FC, useMemo, useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import api from '../../../services/api';
import Preload from '../../../components/Utils/Preload';
import DocumentRequisited from '../../../components/Driver/Signup';
import { FormsStepProps, DatasFormProps } from './types';

import DatasPersonal from './Forms/DataPersonal/index';
import PasswordApp from './Forms/PasswordApp';
import SelectionState from './Forms/SelectionState/index';
import SolicitationPhotoPerfil from './Forms/SolicitationPhotoPerfil/index';
import DataVehicle from './Forms/DataVehicle/index';
import Terms from './Forms/Terms';
import ValidateNumber from './Forms/ValidateNumber';
import DriverAttachment from './Forms/DriverAttachment';

interface DocUserTypeProps {
	description: string | null;
	docId: string;
	docUserTypeId: string;
	image: string;
	label: string;
	link: string | null;
	pdf: string;
	text: string;
}

const useQuerySearch = () => {
	const { search } = useLocation();

	return useMemo(() => new URLSearchParams(search), [search]);
};

const FormRegisterDriver: FC = () => {
	const query = useQuerySearch();
	const searchQuery = query.get('form');

	const [datasUser, setDatasUser] = useState<DatasFormProps>();
	const [loading, setLoading] = useState<boolean>(false);
	const [indexStep, setIndexStep] = useState<number>(0);
	const [indexDocuments, setIndexDocuments] = useState<number>(0);
	const [formsStep, setFormsStep] = useState<FormsStepProps[]>([]);
	const [docUserType, setDocUserType] = useState<DocUserTypeProps[]>([]);
	const [componentRendered, setComponentRendered] =
		useState<React.ReactNode>('');

	console.log(datasUser);

	const getDataAll = async () => {
		setLoading(true);
		try {
			const responseFormStep = await api.get(
				`https://apiteste.taxireturn.com.br/FormStep/GetByUserType?userTypeId=${searchQuery}`,
			);
			const responseDocUserType = await api.get(
				`https://apiteste.taxireturn.com.br/DocUserType/FindByUserType?userTypeId=${searchQuery}`,
			);

			if (responseFormStep.data?.data) {
				setFormsStep(responseFormStep.data.data);
			}
			if (responseDocUserType.data?.data) {
				setDocUserType(responseDocUserType.data.data);
			}
		} catch (error) {
			console.error("Erro ao carregar dados:", error);
		} finally {
			setLoading(false);
		}
	};

	const handleRenderForms = () => {
		switch (formsStep[indexStep] && formsStep[indexStep].step) {
			case 'PERSONAL_DATA':
				setComponentRendered(
					<DatasPersonal
						setDatasUser={setDatasUser}
						datasUser={datasUser}
						indexForm={indexStep}
						setIndexForm={setIndexStep}
					/>,
				);
				break;

			case 'SAFETY':
				setComponentRendered(
					<PasswordApp
						setDatasUser={setDatasUser}
						datasUser={datasUser}
						indexForm={indexStep}
						setIndexForm={setIndexStep}
					/>,
				);
				break;

			case 'CITY':
				setComponentRendered(
					<SelectionState
						setDatasUser={setDatasUser}
						datasUser={datasUser}
						indexForm={indexStep}
						setIndexForm={setIndexStep}
					/>,
				);
				break;

			case 'TERMS':
				setComponentRendered(
					<Terms
						setDatasUser={setDatasUser}
						datasUser={datasUser}
						indexForm={indexStep}
						setIndexForm={setIndexStep}
					/>,
				);
				break;

			case 'VALIDATE_NUMBER':
				setComponentRendered(
					<ValidateNumber
						setDatasUser={setDatasUser}
						datasUser={datasUser}
						indexForm={indexStep}
						setIndexForm={setIndexStep}
					/>,
				);
				break;

			case 'DRIVER_ATTACHMENT':
				setComponentRendered(
					<DriverAttachment
						setDatasUser={setDatasUser}
						datasUser={datasUser}
						indexForm={indexStep}
						setIndexForm={setIndexStep}
					/>,
				);
				break;

			case 'CAR_DATA':
				setComponentRendered(
					<DataVehicle
						setDatasUser={setDatasUser}
						datasUser={datasUser}
						indexForm={indexStep}
						setIndexForm={setIndexStep}
					/>,
				);
				break;

			case 'PROFILE_IMAGE':
				setComponentRendered(
					<SolicitationPhotoPerfil
						datasUser={datasUser}
						setDatasUser={setDatasUser}
						indexForm={indexStep}
						setIndexForm={setIndexStep}
					/>,
				);
				break;

			default:
				if (indexStep !== 0) {
					setComponentRendered(
						<DocumentRequisited
							datasUser={datasUser}
							setDatasUser={setDatasUser}
							saveDatas={indexDocuments === docUserType.length - 1}
							indexDocument={indexDocuments}
							setIndexDocument={setIndexDocuments}
							dataOnylDocument={docUserType[indexDocuments]}
						/>,
					);
				} else {
					setComponentRendered(
						<DatasPersonal
							datasUser={datasUser}
							setDatasUser={setDatasUser}
							indexForm={indexStep}
							setIndexForm={setIndexStep}
						/>,
					);
				}
				break;
		}
	};

	useEffect(() => {
		getDataAll();
	}, []);

	useEffect(() => {
		handleRenderForms();
	}, [indexStep, indexDocuments]);

	return (
		<>
			<Preload visible={loading} />
			{componentRendered}
		</>
	);
};

export default FormRegisterDriver;
