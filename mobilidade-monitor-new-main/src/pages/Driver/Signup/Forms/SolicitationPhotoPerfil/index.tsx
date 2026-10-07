import React, { useState, useRef } from 'react';
import { AiFillCamera } from 'react-icons/ai';
import swal from 'sweetalert';
import { DatasFormProps } from '../../types';

import {
	Container,
	Content,
	ContentButtonForm,
	ContentImageUser,
} from './style';

interface FormsRegisterDriverProps {
	indexForm: number;
	setIndexForm: (data: number) => void;
	datasUser: DatasFormProps | undefined;
	setDatasUser: (data: any) => void;
}

const SolicitationPhotoPerfil = ({
	indexForm,
	setIndexForm,
	datasUser,
	setDatasUser,
}: FormsRegisterDriverProps) => {
	const refInputFile = useRef<HTMLInputElement>(null);

	const [backgroundSelectedUser, setBackgroundSelectedUser] =
		useState<any>(null);
	const [filePhotoProfile, setFilePhotoProfile] = useState<any>();

	const handleSetBackgroundImageUser = () => {
		if (refInputFile.current?.files) {
			const files = refInputFile.current?.files[0];
			setFilePhotoProfile(files);

			const reader = new FileReader();
			reader.onload = () => {
				const dataUrl = reader.result;
				setBackgroundSelectedUser(dataUrl);
			};
			console.log(files);
			reader.readAsDataURL(files);
		}
	};

	const handleOnSubmit = (event: React.FormEvent) => {
		event.preventDefault();

		if (backgroundSelectedUser !== null) {
			const profileImage = {
				data: filePhotoProfile,
				imageChoosed: filePhotoProfile.name,
			};
			setDatasUser({ ...datasUser, imageProfile: profileImage });
			setIndexForm(indexForm + 1);
		} else {
			swal({
				title: 'Escolha uma foto',
				icon: 'warning',
			});
		}
	};

	return (
		<Container>
			<h1>Solicitação de foto do perfil</h1>
			<Content>
				<form onSubmit={handleOnSubmit}>
					<div style={{ textAlign: 'center', width: '190px' }}>
						<ContentImageUser backgroundUrl={backgroundSelectedUser}>
							<input
								name="image-selected"
								type="file"
								ref={refInputFile}
								onChange={handleSetBackgroundImageUser}
							/>
							<AiFillCamera />
						</ContentImageUser>

						<ContentButtonForm>
							<button type="submit">Próximo</button>
						</ContentButtonForm>
					</div>
				</form>
			</Content>
		</Container>
	);
};

export default SolicitationPhotoPerfil;
