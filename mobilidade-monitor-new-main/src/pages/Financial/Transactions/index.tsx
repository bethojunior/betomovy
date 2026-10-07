import { TransactionsHistory } from "../DashboardFinancial/_components/TransactionsHistory";
import { Container, Content } from "./styles";

export function FinancialTransactions() {
  return (
    <Container>
      <Content>
        <TransactionsHistory showFilters />
      </Content>
    </Container>
  );
}
