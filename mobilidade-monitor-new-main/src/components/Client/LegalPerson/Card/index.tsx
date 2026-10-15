import { FC, useState } from "react";
import { Dropdown } from "antd";
import { FiSettings } from "react-icons/fi";

import { Card, HeaderRow, HeaderTitle, SettingsButton, TopRow } from "../../../Utils/EntityCard/styles";
import { CompanyInfo } from "./CompanyInfo";
import { Workers } from "./Workers";
import ClientProfileModal from "../Modal/Profile";
import api from "../../../../services/api";
import { LegalCardProps, UserInformationData } from "./types";

const CardLegalPerson: FC<LegalCardProps> = ({ data, menu, whatsAppMessageProps }) => {
	const [showProfileModal, setShowProfileModal] = useState(false);
	const [userInformation, setUserInformation] = useState<UserInformationData>();

	const getUsersInfo = (customerId: number) => {
		api.get(`customer/${customerId}`).then((values) => {
			setUserInformation(values.data.response);
			setShowProfileModal(true);
		});
	};

	return (
		<>
			<Card>
				<HeaderRow>
					<HeaderTitle>{data.fantasyName}</HeaderTitle>
					<Dropdown overlay={menu(data)} placement="bottomRight">
						<SettingsButton
							type="text"
							onClick={(e) => e.preventDefault()}
							icon={<FiSettings size={16} />}
						>
							Configurações
						</SettingsButton>
					</Dropdown>
				</HeaderRow>
				<TopRow>
					<CompanyInfo
						fantasyName={data.fantasyName}
						document={data.document}
						phone={data.phone}
						email={data.email}
						status={data.company_register_status?.name ?? "ATIVO"}
						createdAt={data.created_at}
						voucherBalance={Number(data.balance?.tripBalance ?? 0)}
						whatsAppMessage={whatsAppMessageProps}
					/>
					<Workers
						companyId={data.id}
						whatsAppMessage={whatsAppMessageProps}
						onSelectUser={getUsersInfo}
					/>
				</TopRow>
			</Card>
			<ClientProfileModal
				showProfileModal={showProfileModal}
				setShowProfileModal={setShowProfileModal}
				userInformation={userInformation}
			/>
		</>
	);
};

export default CardLegalPerson;
