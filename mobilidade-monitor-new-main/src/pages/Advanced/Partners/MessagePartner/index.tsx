import { useEffect, useState, useCallback } from "react";
import api from "../../../../services/api";
import { Button, Form, Input, Table, Radio } from "antd";
import { Container, ContentTable, FilterSection } from "./styles";
import { AuditType } from "./types";
      
import Alert from "../../../../components/Utils/Alert";

const MessagePartner = () => {
         
    const [loadingTable, setLoadingTable] = useState<boolean>(false);
    const [showAlert, setShowAlert] = useState(false);
    const [messageAlert, setMessageAlert] = useState("");
    const [typeAlert, setTypeAlert] = useState<"success" | "info" | "warning" | "error">("success");
    const [audits, setAudits] = useState<AuditType[]>([]);
    const [searchText, setSearchText] = useState<string>("");
    const [searchType, setSearchType] = useState<string>("email");

    const [form] = Form.useForm();

    const columns = [
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
            width: 200,
        },
        {
            title: "Mensagem",
            dataIndex: "message",
            key: "message",
            width: 400,
        },
        {
            title: "Data",
            dataIndex: "date",
            key: "date",
            width: 200,
        },
    ];

    const fetchAudits = useCallback(async (searchParams: { email?: string; searchText?: string; page?: number }) => {
        setLoadingTable(true);
        try {
            const response = await api.get("/audit", {
                params: searchParams,
            });
            if (response.data.status) {
                setAudits(response.data.response);
            } else {
                setMessageAlert(response.data.message);
                setTypeAlert("error");
                setShowAlert(true);
            }
        } catch (error) {
            setMessageAlert("Erro ao carregar auditorias");
            setTypeAlert("error");
            setShowAlert(true);
        } finally {
            setLoadingTable(false);
        }
    }, []);

    useEffect(() => {
        fetchAudits({});
    }, [fetchAudits]);

    const handleSearch = () => {
        const params = searchType === "email" ? { email: searchText } : { searchText };
        fetchAudits(params);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchText(value);
        if (!value) {
            fetchAudits({});
        }
    };

    return (
        <Container>
             
            <Alert visibility={showAlert} message={messageAlert} typeAlert={typeAlert} setVisibility={setShowAlert} />
            <FilterSection>
                <Form layout="inline" form={form} onFinish={handleSearch}>
                    <Form.Item>
                        <Radio.Group onChange={(e) => setSearchType(e.target.value)} value={searchType}>
                            <Radio value="email">E-mail</Radio>
                            <Radio value="searchText">Texto</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item name="searchText">
                        <Input
                            placeholder="Filtrar por E-mail ou Texto"
                            onChange={handleInputChange}
                            style={{ width: 300 }}
                            onPressEnter={handleSearch}
                        />
                    </Form.Item>
                    <Form.Item>
                        <Button type="primary" htmlType="submit">
                            Buscar
                        </Button>
                    </Form.Item>
                </Form>
            </FilterSection>
            <ContentTable>
                <Table columns={columns} dataSource={audits} pagination={false} rowKey="idAudit" loading={loadingTable} />
            </ContentTable>
        </Container>
    );
};

export default MessagePartner;