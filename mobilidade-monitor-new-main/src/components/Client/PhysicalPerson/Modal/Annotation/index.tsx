import { FC } from 'react';
import { Button } from 'antd';
import { AnnotationsModal, AnnotationsInput } from './styles';
import { ListClient } from '../Edition/type';

type ListClientFormProps = Record<keyof ListClient, string | ListClient>
interface AnnotationProps {
	annotationsModalProps: boolean;
	handleCancelProps: () => void;
	customerProps: ListClient | ListClientFormProps | undefined;
	annotationsClientProps: (idUser: number) => void;
	annotationsProps: string;
	setAnnotationsProps: (e: string) => void;
}

const Annotation: FC<AnnotationProps> = ({
	annotationsModalProps,
	handleCancelProps,
	customerProps,
	annotationsClientProps,
	annotationsProps,
	setAnnotationsProps,
}) => {
	return (
		<AnnotationsModal
			width={400}
			title="Anotações"
			visible={annotationsModalProps}
			onCancel={handleCancelProps}
			footer={[
				<Button key="back" onClick={() => handleCancelProps()}>
					Voltar
				</Button>,
				<Button
					key="submit"
					type="primary"
					onClick={() => {
						if (customerProps != null)
							annotationsClientProps((customerProps as ListClient)?.idUser);
					}}
				>
					Salvar
				</Button>,
			]}
		>
			<AnnotationsInput
				value={annotationsProps}
				required
				onChange={(e) => setAnnotationsProps(e.target.value)}
				rows={4}
			/>
		</AnnotationsModal>
	);
};
export default Annotation;
