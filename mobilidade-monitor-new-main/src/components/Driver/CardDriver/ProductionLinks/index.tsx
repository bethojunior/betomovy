import { useContext, useState } from "react";
import { Link } from "react-router-dom";
import { notification } from "antd";
import {
  FiPlusCircle,
  FiList,
  FiTrendingUp,
  FiDollarSign,
  FiHome,
  FiChevronRight,
} from "react-icons/fi";

import {
  ProductionCard,
  SectionTitleRow,
  ProductionGrid,
  ProductionTile,
  ProductionIconCircle,
  ProductionTileText,
  ProductionChevron,
} from "./styles";
import { ProductionLinksProps } from "./types";
import AuthContext from "../../../../contexts/auth";
import {
  MOTORISTA,
  MOTORISTA_EDITAR_DADOS_BANCARIOS,
  MOTORISTA_VISUALIZAR_DADOS_BANCARIOS,
} from "../../../../constants/permissions";
import { BankAccountDetails } from "../../BankAccount/BankAccountDetails";
import { BankAccountFormModal } from "../../BankAccount/BankAccountFormModal";
import { useDriverBankAccount } from "../../BankAccount/hooks/useDriverBankAccount";

export const ProductionLinks = ({
  idDriver,
  name,
  setLoading,
}: ProductionLinksProps) => {
  const { hasPermission } = useContext(AuthContext);
  const { account, load, clear } = useDriverBankAccount(idDriver);
  const [editVisible, setEditVisible] = useState(false);
  const canViewBankAccount = hasPermission(MOTORISTA, MOTORISTA_VISUALIZAR_DADOS_BANCARIOS);
  const canEditBankAccount = hasPermission(MOTORISTA, MOTORISTA_EDITAR_DADOS_BANCARIOS);

  const toggleBankAccount = async () => {
    if (account) {
      clear();
      return;
    }

    setLoading(true);
    const loaded = await load();
    setLoading(false);

    if (!loaded) {
      notification.error({ message: "Erro ao buscar os dados bancários do motorista" });
    }
  };

  return (
    <ProductionCard>
      <SectionTitleRow>
        <FiPlusCircle size={18} />
        Dados de produção
      </SectionTitleRow>
      <ProductionGrid>
        <ProductionTile
          as="a"
          target="_blank"
          href={`/trip/list/${idDriver}`}
        >
          <ProductionIconCircle>
            <FiList size={18} />
          </ProductionIconCircle>
          <ProductionTileText>
            Lista de viagens
            <br />
            deste motorista
          </ProductionTileText>
          <ProductionChevron>
            <FiChevronRight size={16} />
          </ProductionChevron>
        </ProductionTile>

        <ProductionTile
          as="a"
          target="_blank"
          href={`/financial/report-production-driver/${idDriver}`}
        >
          <ProductionIconCircle>
            <FiTrendingUp size={18} />
          </ProductionIconCircle>
          <ProductionTileText>
            Produção
            <br />
            deste motorista
          </ProductionTileText>
          <ProductionChevron>
            <FiChevronRight size={16} />
          </ProductionChevron>
        </ProductionTile>

        <ProductionTile
          as={Link}
          to={{
            pathname: `/driver/${idDriver}/financial`,
            state: { driverName: name },
          }}
        >
          <ProductionIconCircle>
            <FiDollarSign size={18} />
          </ProductionIconCircle>
          <ProductionTileText>
            Financeiro do Motorista
            <br />
            (Visão do app)
          </ProductionTileText>
          <ProductionChevron>
            <FiChevronRight size={16} />
          </ProductionChevron>
        </ProductionTile>

        {canViewBankAccount && (
          <ProductionTile
            as="button"
            type="button"
            onClick={toggleBankAccount}
          >
            <ProductionIconCircle>
              <FiHome size={18} />
            </ProductionIconCircle>
            <ProductionTileText>Dados bancários</ProductionTileText>
            <ProductionChevron>
              <FiChevronRight size={16} />
            </ProductionChevron>
          </ProductionTile>
        )}
      </ProductionGrid>

      {canViewBankAccount && account && (
        <BankAccountDetails
          account={account}
          canEdit={canEditBankAccount}
          onEdit={() => setEditVisible(true)}
        />
      )}

      {canEditBankAccount && (
        <BankAccountFormModal
          visible={editVisible}
          driverId={idDriver}
          account={account}
          onClose={() => setEditVisible(false)}
          onSaved={load}
        />
      )}
    </ProductionCard>
  );
};
