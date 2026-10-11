import { CgProfile } from 'react-icons/cg';
import { Button } from 'antd';
import { Comment } from '@ant-design/compatible';
import { FC, useEffect, useState } from 'react';
import Preload from '../../../components/Utils/Preload';
import api from '../../../services/api';
import Mask from '../../../services/Mask';
import {
	Body,
	Content,
	LinksContainer,
	LinkButton,
	PaginationContainer,
	EmptyMessage,
	Loader,
} from './styles';

interface ListArray extends Array<ListCounts> {}

interface ListCounts {
	created_at: string;
	email: string;
	idContactUs: number;
	message: string;
	name: string;
	phone: string;
	updated_at: string;
	userType: string;
	userTypeId: number;
}

const TalkToUsClient: FC = () => {
	const [loading, setLoading] = useState(false);
	const [list, setList] = useState<ListArray>([]);
	const [whatsappMessage, setWhatsappMessage] = useState('');
	const [thisPage, setThisPage] = useState(1);
	const [showPagination, setShowPagination] = useState(false);
	const [showMessage, setShowMessage] = useState(false);

	const talkToUsRequest = (page = 1) => {
		setLoading(true);
		api.get(`contactUs?page=${page}`).then((result) => {
			setThisPage(page);
			setLoading(false);
			if (result.status === 200) {
				setShowMessage(false);
				setShowPagination(false);
				const respData = Array.isArray(result.data?.response?.data) ? result.data.response.data : [];
				const lastPage = result.data?.response?.last_page || 1;
				if (respData.length === 0) {
					setShowMessage(true);
				}
				if (page !== lastPage) {
					setShowPagination(true);
				}
				if (page !== 1) {
					setList((state) => (state || []).concat(...respData));
					return;
				}
				setList(respData);
			}
		});
	};

	useEffect(() => {
		talkToUsRequest();
		api.get('config/whatsapp_message_driver').then((result) => {
			setWhatsappMessage(result.data.response);
		});
	}, []);

	const handlePagination = () => {
		talkToUsRequest(thisPage + 1);
	};

	if (loading) return <Loader spinning />;

	return (
		<>
			{showMessage ? (
				<EmptyMessage>
					<p>Nessa cidade ainda não possuem mensagens</p>
				</EmptyMessage>
			) : (
				<Body>
					<Preload visible={loading} />
					<Content>
						{(list || []).map((item) => {
							return (
								<Comment
									key={item.idContactUs}
									author={`${item.userType}: ${item.name}`}
									avatar={<CgProfile />}
									content={
										<div>
											<p>{item.message}</p>
											<LinksContainer>
												<LinkButton
													type="link"
													target="_blank"
													href={`https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=${item.email}`}
												>
													{' '}
													{item.email}
												</LinkButton>
												<LinkButton
													type="link"
													target="_blank"
													href={`https://api.whatsapp.com/send?phone=55${item.phone}&text=${whatsappMessage}}`}
												>
													{Mask.setMaskPhoneValue(item.phone)}
												</LinkButton>
											</LinksContainer>
										</div>
									}
									datetime={
										<span>
											{new Date(
												item.created_at,
											).toLocaleDateString()}
										</span>
									}
								/>
							);
						})}
					</Content>
					{showPagination && (
						<PaginationContainer>
							<Button type="primary" onClick={handlePagination}>
								Mostrar Mais
							</Button>
						</PaginationContainer>
					)}
				</Body>
			)}
		</>
	);
};

export default TalkToUsClient;
