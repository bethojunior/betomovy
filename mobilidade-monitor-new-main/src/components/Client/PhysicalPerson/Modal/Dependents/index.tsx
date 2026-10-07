import { FC } from 'react';
import { Button } from 'antd';
import { DependentsModal, TableOfDependent } from './styles';

interface DependentsClientData extends Array<DependentsInterface> {}

interface DependentsInterface {
	document: string;
	email: string;
	idUser: number;
	name: string;
	phone: string;
	relationShip: string;
}

interface DependentsProps {
	modalOfDependentsProps: boolean;
	handleCancelProps: () => void;
	dependentsClientProps: DependentsClientData;
}

const Dependents: FC<DependentsProps> = ({
	modalOfDependentsProps,
	handleCancelProps,
	dependentsClientProps,
}) => {
	const columns = [
		{
			title: 'Nome',
			dataIndex: 'name',
			key: 'name',
		},
		{
			title: 'Email',
			dataIndex: 'email',
			key: 'email',
		},
		{
			title: 'Número',
			dataIndex: 'phone',
			key: 'phone',
		},
		{
			title: 'Grau parentesco',
			dataIndex: 'relationship',
			key: 'relationship',
		},
	];

	return (
		<DependentsModal
			width={800}
			title="Dependentes"
			visible={modalOfDependentsProps}
			onCancel={handleCancelProps}
			footer={[
				<Button key="back" onClick={() => handleCancelProps()}>
					Fechar
				</Button>,
			]}
		>
			<TableOfDependent
				dataSource={dependentsClientProps}
				size="small"
				columns={columns}
			/>
		</DependentsModal>
	);
};
export default Dependents;
