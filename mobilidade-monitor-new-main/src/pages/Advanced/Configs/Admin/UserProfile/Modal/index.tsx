import { Checkbox, Collapse, Input, Modal, Spin } from 'antd';
import { FC, useEffect, useState } from 'react';
import Alert from '../../../../../../components/Utils/Alert';
import Preload from '../../../../../../components/Utils/Preload';
import api from '../../../../../../services/api';
import { ItemsContent, Title, Pannel } from './styles';
import {
	CONFIGURACAO_GROUP_NAME,
	groupConfiguracaoPermissions,
	type UserGroupPermissionRow,
} from './configuracaoPermissionSections';

interface CitiesArray extends Array<Cities> {}

interface Cities {
	cityId: number;
	nome: string;
	polygon: string;
	shortName: string;
	id: number;
}

interface PermissionsArray extends Array<Permissions> {}

interface Permissions {
	id: number;
	name: string;
	user_group_permissions: UserGroupPermissionsArray;
}

interface UserGroupPermissionsArray extends Array<UserGroupPermissions> {}

interface UserGroupPermissions extends UserGroupPermissionRow {}

interface ModalProps {
	visibility: boolean;
	setVisibility(visible: boolean): void;
	loadProfiles: () => void;
	idModal: number;
}

const NewProfileModal: FC<ModalProps> = ({
	visibility,
	setVisibility,
	loadProfiles,
	idModal,
}) => {
	const [loading, setLoading] = useState(false);
	const [messageAlert, setMessageAlert] = useState('');
	const [showAlert, setShowAlert] = useState(false);
	const [typeAlert, setTypeAlert] = useState<
		'success' | 'info' | 'warning' | 'error'
	>('success');

	const [listCities, setListCities] = useState<CitiesArray>([]);
	const [listPermissions, setListPermissions] = useState<PermissionsArray>([]);

	const [citiesExist, setCitiesExist] = useState([0]);

	const [name, setName] = useState('');
	const [support, setSupport] = useState(false);
	const [citiesSelected, setCitiesSelected] = useState([0]);
	const [permissionsSelected, setPermissionsSelected] = useState([0]);

	const handleLoadDataProfile = () => {
		setLoading(true);
		api(`role/${idModal}`).then((result) => {
			if (!result?.data?.status) {
				setLoading(false);
				return '';
			}
			setName(result.data.response.name);
			setSupport(result.data.response.support);
			setCitiesExist(
				result.data.response.cities.map((item: Cities) => {
					return item.id;
				}),
			);
			setCitiesSelected(
				result.data.response.cities.map((item: Cities) => {
					return item.id;
				}),
			);

			const activePermissions: number[] = [];
			result.data.response.permissions.forEach((item: Permissions) => {
				item.user_group_permissions.forEach(
					(permission: UserGroupPermissions) => {
						if (permission.statusId === 1) {
							activePermissions.push(permission.id);
						}
					},
				);
			});
			setPermissionsSelected(activePermissions);
			return setLoading(false);
		}).catch(() => {
			setLoading(false);
		});
	};

	useEffect(() => {
		setLoading(true);
		setName('');
		setSupport(false);
		setCitiesSelected([0]);
		setPermissionsSelected([0]);
		setCitiesExist([0]);

		const citiesRequest = api('city/actives/fully');
		const permissionsRequest = api('role/permissions');

		Promise.all([citiesRequest, permissionsRequest]).then((result) => {
			setLoading(false);
			if (!result[0]?.data?.status || !result[1]?.data?.status) {
				return '';
			}
			setListCities(result[0].data.response || result[0].data.data || []);
			setListPermissions(result[1].data.response || result[1].data.data || []);

			if (idModal !== 0) {
				handleLoadDataProfile();
			} else {
				setLoading(false);
			}
		}).catch(() => {
			setLoading(false);
		});
		});
	}, [idModal]);

	const handleMountCities = (id: string | undefined, checked: boolean) => {
		if (checked) {
			return setCitiesSelected([...citiesSelected, Number(id)]);
		}

		return setCitiesSelected(
			citiesSelected.filter((el) => el !== Number(id)),
		);
	};

	const handleMountPermissions = (
		id: string | undefined,
		checked: boolean,
	) => {
		if (checked) {
			return setPermissionsSelected([...permissionsSelected, Number(id)]);
		}
		return setPermissionsSelected(
			permissionsSelected.filter((el) => el !== Number(id)),
		);
	};

	const handleProfile = () => {
		if (permissionsSelected.find((el) => el === 0) === 0) {
			permissionsSelected.splice(0, 1);
		}

		if (citiesSelected.find((el) => el === 0) === 0) {
			citiesSelected.splice(0, 1);
		}

		if (name === '') {
			setMessageAlert('O nome do perfil é obrigatório.');
			setTypeAlert('warning');
			return setShowAlert(true);
		}

		if (name.length < 3) {
			setMessageAlert(
				'O nome do perfil deve ter, no mínimo, três caracteres.',
			);
			setTypeAlert('warning');
			return setShowAlert(true);
		}

		if (citiesSelected.length === 0) {
			setMessageAlert('Deve ser selecionado, no mínimo, uma cidade.');
			setTypeAlert('warning');
			return setShowAlert(true);
		}

		if (permissionsSelected.length === 0) {
			setMessageAlert('Deve ser selecionado, no mínimo, uma permissão.');
			setTypeAlert('warning');
			return setShowAlert(true);
		}
		setLoading(true);
		if (idModal === 0) {
			api.post('role', {
				name,
				permissions: permissionsSelected,
				cities: citiesSelected,
				support,
			}).then((result) => {
				setLoading(false);
				if (!result.data.status) {
					setMessageAlert(
						'Não foi possível adicionar o perfil. Tente novamente.',
					);
					setTypeAlert('error');
					return setShowAlert(true);
				}
				setMessageAlert('Novo perfil criado com sucesso!');
				setTypeAlert('success');
				setShowAlert(true);
				setVisibility(false);
				setName('');
				return loadProfiles();
			});
		} else {
			const addCities = citiesSelected.filter(
				(el) => !citiesExist.includes(el),
			);

			const removeCities = citiesExist.filter(
				(el) => !citiesSelected.includes(el),
			);

			if (addCities.length !== 0) {
				addCities.map((item) => {
					return api
						.post(`role/${idModal}/city`, {
							cityId: item,
						})
						.then((result) => {
							if (!result.data.status) {
								setMessageAlert(
									'Não foi possível adicionar as novas cidades, tente novamente',
								);
								setTypeAlert('error');
								return setShowAlert(true);
							}
							return '';
						});
				});
			}

			if (removeCities.length !== 0) {
				removeCities.map((item) => {
					return api
						.delete(`role/${idModal}/city/${item}`)
						.then((result) => {
							if (!result.data.status) {
								setMessageAlert(
									'Ocorreu um erro ao editar as cidades, tente novamente',
								);
								setTypeAlert('error');
								return setShowAlert(true);
							}
							return '';
						});
				});
			}

			api.put(`role/${idModal}`, {
				name,
				permissions: permissionsSelected,
				support,
			}).then((result) => {
				if (!result.data.status) {
					setMessageAlert(
						'Não foi possível editar o perfil. Tente novamente.',
					);
					setTypeAlert('error');
					return setShowAlert(true);
				}
				setLoading(false);
				setMessageAlert('Perfil atualizado com sucesso!');
				setTypeAlert('success');
				setShowAlert(true);
				setVisibility(false);
				return loadProfiles();
			});
		}
		return '';
	};

	return (
		<>
			<Preload visible={loading} />
			<Alert
				visibility={showAlert}
				setVisibility={setShowAlert}
				message={messageAlert}
				typeAlert={typeAlert}
			/>
			<Modal
				title={idModal === 0 ? "Adicionar perfil" : "Editar perfil"}
				visible={visibility}
				onOk={handleProfile}
				onCancel={() => {
					setVisibility(false);
				}}
				width="min(700px, 90vw)"
				bodyStyle={{ maxHeight: '70vh', overflowY: 'auto' }}
			>
				{loading ? (
					<div style={{ textAlign: 'center', padding: '40px' }}>
						<Spin size="large" />
					</div>
				) : (
					<>
						<p style={{ marginBottom: 0 }}>Nome do perfil</p>
				<Input value={name} onChange={(e) => setName(e.target.value)} />
				<Checkbox
					checked={support}
					onChange={(e) => setSupport(e.target.checked)}
				>
					Ativar perfil para suporte
				</Checkbox>
				<Collapse style={{ marginTop: 10 }} ghost>
					<Pannel header="Cidades" key="cities">
						<ItemsContent>
							{listCities.map((item) => {
								return (
									<Checkbox
										key={item.cityId}
										id={String(item.cityId)}
										checked={citiesSelected.some(
											(el) => el === item.cityId,
										)}
										onChange={(e) => {
											handleMountCities(
												e.target.id,
												e.target.checked,
											);
										}}
									>
										{item.nome}
									</Checkbox>
								);
							})}
						</ItemsContent>
					</Pannel>
				</Collapse>
				<Title>Permissões</Title>
				<Collapse ghost>
					{listPermissions.map((item) => {
						const isConfiguracao =
							item.name.toLowerCase() === CONFIGURACAO_GROUP_NAME;
						return (
							<Pannel
								style={{ textTransform: 'capitalize' }}
								header={item.name}
								key={item.id}
							>
								{isConfiguracao ? (
									<Collapse
										ghost
										style={{ marginLeft: 4 }}
									>
										{groupConfiguracaoPermissions(
											item.user_group_permissions,
										).map((section) => (
											<Pannel
												header={section.title}
												key={section.key}
											>
												<ItemsContent>
													{section.permissions.map(
														(permission) => (
															<Checkbox
																key={permission.id}
																id={String(permission.id)}
																checked={permissionsSelected.some(
																	(el) =>
																		el === permission.id,
																)}
																onChange={(e) => {
																	handleMountPermissions(
																		e.target.id,
																		e.target.checked,
																	);
																}}
															>
																{permission.description}
															</Checkbox>
														),
													)}
												</ItemsContent>
											</Pannel>
										))}
									</Collapse>
								) : (
									<ItemsContent>
										{item.user_group_permissions.map((permission) => {
											return (
												<Checkbox
													key={permission.id}
													id={String(permission.id)}
													checked={permissionsSelected.some(
														(el) => el === permission.id,
													)}
													onChange={(e) => {
														handleMountPermissions(
															e.target.id,
															e.target.checked,
														);
													}}
												>
													{permission.description}
												</Checkbox>
											);
										})}
									</ItemsContent>
								)}
							</Pannel>
						);
					})}
					</Collapse>
					</>
				)}
			</Modal>
		</>
	);
};

export default NewProfileModal;
