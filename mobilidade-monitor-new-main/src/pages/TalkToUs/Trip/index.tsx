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
	emailUser: string;
	idTripReport: number;
	message: string;
	nameUser: string;
	phoneName: string;
	read: boolean;
	statusId: boolean;
	tripReference: string;
	tripReportType: string;
	updated_at: string;
	userId: number;
	userType: string;
}

const TalkToUsTrip: FC = () => {
	const [loadingTable, setLoadingTable] = useState<boolean>(false);
	const [list, setList] = useState<ListArray>([]);
	const [whatsappMessage, setWhatsappMessage] = useState('');
	const [thisPage, setThisPage] = useState(1);
	const [showPagination, setShowPagination] = useState(false);
	 

	const talkToUsRequest = (page = 1) => {
		setLoadingTable(true);
		api.get(`tripReport?page=${page}`).then((result) => {
			setThisPage(page);
			setLoadingTable(false);
			if (result.status === 200) {
				setLoadingTable(false);
				setShowPagination(false);
				const respData = Array.isArray(result.data?.response?.data) ? result.data.response.data : [];
				const lastPage = result.data?.response?.last_page || 1;
				if (respData.length === 0) {
					setShowPagination(false);
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

	const handlePagination = () => {
		talkToUsRequest(thisPage + 1);
	};

	useEffect(() => {
		talkToUsRequest();
		api.get('config/whatsapp_message_driver').then((result) => {
			setWhatsappMessage(result.data.response);
		});
	}, []);

	 

	return (
		<>
			{list.length === 0 ? (
			loadingTable ? (
				<Loader spinning={loadingTable} />
			) : (
				<EmptyMessage>
				<p>Nessa cidade ainda não possuem mensagens</p>
				</EmptyMessage>
			)
			) : (
				<Body>
					<Preload visible={loadingTable} />
					<Content>
						{list.map((item) => {
							return (
								<Comment
									key={item.idTripReport}
									author={`${item.userType}: ${item.nameUser}`}
									avatar={<CgProfile />}
									content={
										<div>
											<p>{item.message}</p>
											<LinksContainer>
												<LinkButton
													type="link"
													target="_blank"
													href={`https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=${item.emailUser}`}
												>
													{' '}
													{item.emailUser}
												</LinkButton>
												<LinkButton
													type="link"
													target="_blank"
													href={`https://api.whatsapp.com/send?phone=55${item.phoneName}&text=${whatsappMessage}}`}
												>
													{Mask.setMaskPhoneValue(item.phoneName)}
												</LinkButton>
												<LinkButton
													type="link"
													target="_blank"
													href={`/trip/list/details/${item.tripReference}`}
												>
													detalhes da viagem
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
							<Button type="primary" onClick={handlePagination} loading={loadingTable}>
								Mostrar Mais
							</Button>
						</PaginationContainer>
					)}
				</Body>
			)}
		</>
	);
};

export default TalkToUsTrip;
