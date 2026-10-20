import React, { useEffect, useRef, useState, useMemo } from 'react';
import { useLocation, useHistory } from 'react-router-dom';
import { AiOutlineArrowRight } from 'react-icons/ai';
import swal from 'sweetalert';
import axios from 'axios';
import api from '../../services/api';
import Preload from '../../Utils/Preload';

import {
	Container,
	ContentForm,
	InputDocument,
	ContentInputDocument,
	ImageSelected,
	Button,
	NameDocument,
} from './style';

declare global {
	interface Window {
		dataURLtoBlob: any;
	}
}

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
interface DocumentsRequisitedProps {
	indexDocument: number;
	saveDatas: boolean;
	setIndexDocument: (data: number) => void;
	datasUser: any;
	setDatasUser: (data: any) => void;
	dataOnylDocument: DocUserTypeProps;
}

interface DocumentsChoosedProps {
	docId: string;
	image: {
		data: any;
		name: string;
	};
	inArray: boolean;
}

interface DocsDriverProps {
	docId: string;
	text: string;
}

const useQuerySearch = () => {
	const { search } = useLocation();
	return useMemo(() => new URLSearchParams(search), [search]);
};

const DocumentRequisited = ({
	indexDocument,
	setIndexDocument,
	saveDatas,
	datasUser,
	setDatasUser,
	dataOnylDocument,
}: DocumentsRequisitedProps) => {
	const refInputFile = useRef<HTMLInputElement>(null);
	const refInputNameFile = useRef<HTMLInputElement>(null);

	const [loading, setLoading] = useState<boolean>(false);
	const [docsDriver, setDocsDriver] = useState<any>([]);
	const [listDocuments, setListDocuments] = useState<any>([]);
	const [documentImageSelected, setDocumentImageSelected] = useState<any>('');
	const [fileDocument, setFileDocument] = useState<any>();

	const query = useQuerySearch();
	const searchQuery = query.get('form');

	const history = useHistory();

	const handleRegisterDriver = (
		docsDriverr: DocsDriverProps[],
		docsImage: DocumentsChoosedProps[],
	) => {
		const formData = new FormData();
		/* eslint-disable */

		const isRentalCar =
			datasUser.datasVehicle && datasUser.datasVehicle.companyCnpj
				? true
				: false;
		const isCompanyCnpj =
			datasUser.datasVehicle && datasUser.datasVehicle.companyCnpj
				? datasUser.datasVehicle.companyCnpj
				: null;

		const objectSended = {
			driver: {
				userTypeId: searchQuery,
				name: datasUser.dataPersonal ? datasUser.dataPersonal.name : null,
				nickname: 'TESTE',
				phone: datasUser.dataPersonal ? datasUser.dataPersonal.phone : null,
				password: '123456',
				document: datasUser.dataPersonal
					? datasUser.dataPersonal.cpf_cnpj
					: null,
				gender: datasUser.dataPersonal
					? datasUser.dataPersonal.gender
					: null,
				email: datasUser.dataPersonal ? datasUser.dataPersonal.email : null,
				stationId: '',
				cityId: datasUser.stateSelected
					? datasUser.stateSelected.city
					: null,
				estateId: '',
				cooperativeId: '',
				militaryUser: null,
				cnh: '',
				created_at: '',
				hasCardReader: false,
				numberCNH: null,
				numberCRLV: datasUser.datasVehicle
					? datasUser.datasVehicle.documentCar
					: null,
				numberAlvara: null,
				numberCriminalRecord: null,
				docs: docsDriverr ? docsDriverr : null,
				rentalCar: datasUser.datasVehicle ? isRentalCar : null,
				rentalCompanyDocument: datasUser.datasVehicle
					? isCompanyCnpj
					: null,
			},
			image: {
				CNH: null,
				CRLV: null,
				ALVARA: null,
				PROFILE: {
					data: datasUser.imageProfile
						? datasUser.imageProfile.data
						: null,
					name: datasUser.imageProfile
						? datasUser.imageProfile.imageChoosed
						: null,
				},
				CRIMINAL_RECORD: null,
				PROOF_OF_RESIDENCE: null,
				RG_FRONT: null,
				RG_BACK: null,
				DOCUMENTS: docsImage,
			},
			car: {
				licensePlate: datasUser.datasVehicle
					? datasUser.datasVehicle.plateCar
					: null,
				renavam: datasUser.datasVehicle
					? datasUser.datasVehicle.numberRenavam
					: null,
				markCar: datasUser.datasVehicle
					? datasUser.datasVehicle.brandCar
					: null,
				modelCar: datasUser.datasVehicle
					? datasUser.datasVehicle.modelCar
					: null,
				colorCar: datasUser.datasVehicle
					? datasUser.datasVehicle.colorCar
					: null,
				numberSeatingCar: datasUser.datasVehicle
					? datasUser.datasVehicle.numberSeats
					: null,
				year: datasUser.datasVehicle
					? datasUser.datasVehicle.yearCar
					: null,
			},
		};

		const objectSendedConverted = JSON.stringify(objectSended);

		formData.append('stdObject', objectSendedConverted);

		console.log(objectSended);

		const isProfile =
			objectSended.image.PROFILE && objectSended.image.PROFILE.data;

		Promise.all([
			isProfile &&
				new Promise((resolve1) => {
					formData.append(
						'PROFILE',
						objectSended.image.PROFILE.data,
						objectSended.image.PROFILE.name,
					);

					resolve1('');
				}),
			...objectSended.image.DOCUMENTS.map((item) => {
				console.log(item);
				return new Promise((resolve1) => {
					formData.append(
						`DOC_${item.docId}`,
						item.image.data,
						item.image.name,
					);

					resolve1('');
				});
			}),
		]).then(() => {
			try {
				console.log(formData);
				setLoading(true);
				api.post('/driver/register', formData, {
					headers: { 'Content-Type': 'multipart/form-data' },
				})
					.then((response) => {
						setLoading(false);
						if (response.data.status) {
							swal({
								title: 'Motorista cadastrado com sucesso!',
								icon: 'success',
							}).then((isConfirm) => {
								if (isConfirm) {
									history.push('/driver/signup');
								}
							});
						}
						console.log(response);
					})
					.catch((error) => {
						console.log(error);
					});
			} catch (error) {
				console.log(error);
			}
		});
	};

	const handleSetBackgroundImage = () => {
		if (refInputFile.current?.files) {
			const files = refInputFile.current?.files[0];

			const reader = new FileReader();
			reader.onload = () => {
				const dataUrlImage = reader.result;
				setDocumentImageSelected(dataUrlImage);
				setFileDocument(files);
			};
			if (files) {
				reader.readAsDataURL(files);
			}
		}
	};

	const handleSubmit = (event: React.FormEvent) => {
		event.preventDefault();

		if (documentImageSelected.length > 0 && dataOnylDocument.image === '1') {
			const documentSelected = {
				docId: dataOnylDocument.docId,
				image: {
					data: fileDocument,
					name: fileDocument.name,
				},
				inArray: false,
			};

			const docDriverObject = {
				docId: dataOnylDocument.docId,
				text: refInputNameFile.current?.value,
			};

			setListDocuments([...listDocuments, documentSelected]);
			setDocsDriver([...docsDriver, docDriverObject]);
			setIndexDocument(indexDocument + 1);
		} else {
			swal({
				title: 'Escolha o documento',
				icon: 'warning',
			});
		}
	};

	const handleSaveDatasUser = (event: React.FormEvent) => {
		event.preventDefault();
		if (documentImageSelected.length > 0 && dataOnylDocument.image === '1') {
			const documentSelected = {
				docId: dataOnylDocument.docId,
				image: {
					data: fileDocument,
					name: fileDocument.name,
				},
				inArray: false,
			};

			const docDriverObject = {
				docId: dataOnylDocument.docId,
				text: refInputNameFile.current?.value,
			};

			const documentUpdated = [...listDocuments, documentSelected];
			const docsUpdated = [...docsDriver, docDriverObject];

			setDatasUser({
				...datasUser,
				documentChoosed: documentUpdated,
				docs: docsUpdated,
			});

			handleRegisterDriver(docsUpdated, documentUpdated);
		} else {
			swal({
				title: 'Escolha o documento',
				icon: 'warning',
			});
		}
	};

	useEffect(() => {
		if (refInputNameFile.current) {
			refInputNameFile.current.value = '';
		}

		setDocumentImageSelected('');
	}, [indexDocument]);

	return (
		<Container>
			<Preload visible={loading} />
			<h1>{dataOnylDocument.label.toUpperCase()}</h1>
			<ContentForm onSubmit={saveDatas ? handleSaveDatasUser : handleSubmit}>
				<NameDocument
					type="text"
					placeholder="Nome do documento"
					ref={refInputNameFile}
					required
				/>
				{dataOnylDocument.image !== '0' && (
					<ContentInputDocument>
						<InputDocument
							type="file"
							ref={refInputFile}
							onChange={handleSetBackgroundImage}
						/>
						<span>Adicionar foto do documento</span>
						<AiOutlineArrowRight />
					</ContentInputDocument>
				)}

				{documentImageSelected.length > 0 && (
					<ImageSelected backgroundUrl={documentImageSelected} />
				)}
				<Button type="submit">PRÓXIMO</Button>
			</ContentForm>
		</Container>
	);
};

export default DocumentRequisited;
