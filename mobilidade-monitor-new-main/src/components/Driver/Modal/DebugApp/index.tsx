import { FC, useEffect, useState } from 'react';
import { Modal, Button, Collapse, DatePicker, Tag } from 'antd';
import { Dayjs } from 'dayjs';
import {
	ClockCircleOutlined,
	EnvironmentOutlined,
	PictureOutlined,
	AimOutlined,
	BorderOutlined,
	ThunderboltOutlined,
	TagOutlined,
} from '@ant-design/icons';
import {
	ListItem,
	Label,
	Configuration,
	ContentButton,
	ScrollArea,
	FilterRow,
	PanelContent,
} from './styles';
import { ModalProps } from './types';

const { Panel } = Collapse;

const StatusTag: FC<{ active: boolean; activeText: string; inactiveText: string }> = ({
	active,
	activeText,
	inactiveText,
}) => (
	<Tag color={active ? 'green' : 'red'}>{active ? activeText : inactiveText}</Tag>
);

const DebugAppModal: FC<ModalProps> = ({
	visibility,
	handleCloseModal,
	driverConfigs,
	driverId,
	page,
	nextPageDebugApp,
	debugAppInfo,
}) => {
	const [loadingMore, setLoadingMore] = useState(false);
	const [selectedDate, setSelectedDate] = useState<Dayjs | null>(null);
	const [activeKeys, setActiveKeys] = useState<string[]>([]);

	useEffect(() => {
		if (visibility && driverConfigs?.length) {
			setActiveKeys([String(driverConfigs[0].id)]);
		}
	}, [visibility]);

	const handleFilterByDate = (date: Dayjs | null) => {
		setSelectedDate(date);
		debugAppInfo(driverId, 1, date ? date.format('YYYY-MM-DD') : '');
	};

	return (
		<Modal
			title="Configurações do motorista"
			visible={visibility}
			onCancel={handleCloseModal}
			width={640}
			footer={null}
		>
			<FilterRow>
				<DatePicker
					placeholder="Filtrar por data"
					format="DD/MM/YYYY"
					size="large"
					style={{ width: '100%' }}
					value={selectedDate}
					onChange={handleFilterByDate}
					allowClear
				/>
			</FilterRow>

			<ScrollArea>
				<Collapse
					activeKey={activeKeys}
					onChange={(keys) => setActiveKeys(keys as string[])}
					style={{ borderRadius: 10, overflow: 'hidden' }}
				>
					{driverConfigs?.map((item) => (
						<Panel
							header={
								<span>
									<ClockCircleOutlined style={{ marginRight: 8 }} />
									Criado em: {new Date(item.created_at).toLocaleDateString()}
								</span>
							}
							key={String(item.id)}
						>
							<PanelContent>
								<ListItem>
									<Label>
										<EnvironmentOutlined />
										Localização em segundo plano:
									</Label>
									<StatusTag
										active={item.permissionLocationBackground !== 0}
										activeText="Ativada"
										inactiveText="Desativada"
									/>
								</ListItem>
								<ListItem>
									<Label>
										<PictureOutlined />
										Acesso a fotos, mídias e arquivos no seu dispositivo:
									</Label>
									<StatusTag
										active={item.permissionWriteExternalStorage !== 0}
										activeText="Ativado"
										inactiveText="Desativado"
									/>
								</ListItem>
								<ListItem>
									<Label>
										<AimOutlined />
										Status do GPS:
									</Label>
									<StatusTag
										active={item.permissionGps !== 0}
										activeText="Ativado"
										inactiveText="Desativado"
									/>
								</ListItem>
								<ListItem>
									<Label>
										<BorderOutlined />
										Permissão de sobrepor tela:
									</Label>
									<StatusTag
										active={item.permissionSystemOverlay !== 0}
										activeText="Ativada"
										inactiveText="Desativada"
									/>
								</ListItem>
								<ListItem>
									<Label>
										<ThunderboltOutlined />
										Otimização de bateria:
									</Label>
									<StatusTag
										active={item.permissionIgnoreBatteryOptimization !== 0}
										activeText="Ativada"
										inactiveText="Desativada"
									/>
								</ListItem>
								<ListItem>
									<Label>
										<TagOutlined />
										Versão do aplicativo:
									</Label>
									<Configuration>{item.version}</Configuration>
								</ListItem>
							</PanelContent>
						</Panel>
					))}
				</Collapse>
				{nextPageDebugApp !== "" && nextPageDebugApp !== null && (
					<ContentButton>
						<Button
							type="primary"
							loading={loadingMore}
							onClick={async () => {
								setLoadingMore(true);
								await debugAppInfo(
									driverId,
									page + 1,
									selectedDate ? selectedDate.format('YYYY-MM-DD') : '',
								);
								setLoadingMore(false);
							}}
						>
							Mostrar mais
						</Button>
					</ContentButton>
				)}
			</ScrollArea>
		</Modal>
	);
};

export default DebugAppModal;
