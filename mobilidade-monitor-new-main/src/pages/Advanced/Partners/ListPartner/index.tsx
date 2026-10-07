import { useEffect, useState, useCallback } from "react";
import api from "../../../../services/api";
import { Button, Form, Input, Select, Table, Radio } from "antd";
import swal from "sweetalert";
import { AiFillLock } from "react-icons/ai";
import { Container, ContentTable, ContentBtnActions, FilterSection, CustomModal } from "./styles";
import { PartnerType } from "./types";
      
import Alert from "../../../../components/Utils/Alert";
import avatarFallback from "../../../../assets/avatar2.png";

const { Option } = Select;

const S3_BASE_URL = "https://s3.amazonaws.com/nodes-voutehomologar-dev/customer/profile/compressed/";

const ListPartner = () => {
         
    const [loadingTable, setLoadingTable] = useState<boolean>(false);
    const [showAlert, setShowAlert] = useState(false);
    const [messageAlert, setMessageAlert] = useState("");
    const [typeAlert, setTypeAlert] = useState<"success" | "info" | "warning" | "error">("success");
    const [partners, setPartners] = useState<PartnerType[]>([]);
    const [status, setStatus] = useState<number | null>(null);
    const [searchText, setSearchText] = useState<string>("");
    const [searchType, setSearchType] = useState<string>("name");
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const [form] = Form.useForm();

    const handleImageClick = (imageUrl: string) => {
        setSelectedImage(imageUrl);
    };

    const columns = [
        {
            title: "Imagem",
            dataIndex: "profileImage",
            key: "profileImage",
            width: 100,
            render: (text: string) => (
                <div style={{ position: "relative" }}>
                    <img
                        src={text ? `${S3_BASE_URL}${text}` : avatarFallback}
                        alt="Profile"
                        onError={(e: any) => e.target.src = avatarFallback}
                        style={{ width: 100, height: 100, borderRadius: '10%', cursor: 'pointer' }}
                        onClick={() => handleImageClick(`${S3_BASE_URL}${text}`)}
                    />
                </div>
            ),
        },
        {
            title: "Nome",
            dataIndex: "name",
            key: "name",
            width: 200,
        },
        {
            title: "Email",
            dataIndex: "email",
            key: "email",
            width: 200,
        },
        {
            title: "Telefone",
            dataIndex: "phone",
            key: "phone",
            width: 150,
        },
        {
            title: "Status",
            dataIndex: "partnerRegister",
            key: "partnerRegister",
            width: 100,
        },
        {
            title: "Ações",
            dataIndex: "",
            key: "actions",
            width: 100,
            render: (record: PartnerType) => {
                const isBlocked = record.partnerRegister === "BLOQUEADO";
                return (
                    <ContentBtnActions>
                        <Button
                            onClick={() => handleChangeStatus(record.idPartner)}
                            style={{ backgroundColor: isBlocked ? "red" : undefined, color: isBlocked ? "white" : undefined }}
                            icon={<AiFillLock style={{ color: isBlocked ? "white" : "red" }} />}
                        >
                            {isBlocked ? "Bloqueado" : "Bloquear"}
                        </Button>
                    </ContentBtnActions>
                );
            },
        },
    ];

    const fetchPartners = useCallback(async (searchParams: { name?: string; email?: string; phone?: string; partnerRegisterStatusId?: number | null }) => {
        setLoadingTable(true);
        try {
            const response = await api.get("/partner", {
                params: searchParams
            });
            if (response.data.status) {
                setPartners(response.data.response.data);
            } else {
                setMessageAlert(response.data.message);
                setTypeAlert("error");
                setShowAlert(true);
            }
        } catch (error) {
            setMessageAlert("Erro ao carregar parceiros");
            setTypeAlert("error");
            setShowAlert(true);
        } finally {
            setLoadingTable(false);
        }
    }, []);

    const handleChangeStatus = async (id: number) => {
        swal({
            title: "Deseja bloquear este parceiro?",
            icon: "warning",
            buttons: ["Cancelar", "Confirmar"],
        }).then(async (confirm) => {
            if (!confirm) return;

            setLoadingTable(true);
            try {
                const response = await api.put(`/partner/${id}/changeStatus`);
                if (response.data.status) {
                    setMessageAlert("Parceiro bloqueado com sucesso!");
                    setTypeAlert("success");
                    fetchPartners({ [searchType]: searchText, partnerRegisterStatusId: status });
                } else {
                    setMessageAlert("Erro ao bloquear parceiro");
                    setTypeAlert("error");
                    setShowAlert(true);
                }
            } catch (error) {
                setMessageAlert("Erro ao bloquear parceiro");
                setTypeAlert("error");
                setShowAlert(true);
            } finally {
                setLoadingTable(false);
            }
        });
    };

    useEffect(() => {
        fetchPartners({ partnerRegisterStatusId: status });
    }, [status, fetchPartners]);

    const handleSearch = () => {
        if (!searchText) {
            fetchPartners({ partnerRegisterStatusId: status });
            return;
        }
        
        if (searchType === 'phone') {
            setLoadingTable(true);
            api.get('/partner')
                .then(response => {
                    if (response.data.status) {
                        const searchDigits = searchText.replace(/\D/g, '');
                        const filteredPartners = response.data.response.data.filter(
                            (partner: PartnerType) => {
                                if (!partner.phone) return false;
                                
                                const phoneDigits = partner.phone.replace(/\D/g, '');
                                
                                if (searchDigits.length === 2) {
                                    return phoneDigits.startsWith(searchDigits);
                                }
                                
                                return phoneDigits.includes(searchDigits);
                            }
                        );
                        setPartners(filteredPartners);
                    } else {
                        setMessageAlert(response.data.message);
                        setTypeAlert("error");
                        setShowAlert(true);
                    }
                })
                .catch(() => {
                    setMessageAlert("Erro ao carregar parceiros");
                    setTypeAlert("error");
                    setShowAlert(true);
                })
                .finally(() => {
                    setLoadingTable(false);
                });
            return;
        }
        
        const params: any = { partnerRegisterStatusId: status };
        params[searchType] = searchText;
        fetchPartners(params);
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const value = e.target.value;
        setSearchText(value);
        if (!value) {
            fetchPartners({ partnerRegisterStatusId: status });
        }
    };

    return (
        <Container>
            <Alert visibility={showAlert} message={messageAlert} typeAlert={typeAlert} setVisibility={setShowAlert} />
            <FilterSection>
                <Form layout="inline" form={form} onFinish={handleSearch}>
                    <Form.Item>
                        <Radio.Group onChange={(e) => setSearchType(e.target.value)} value={searchType}>
                            <Radio value="name">Nome</Radio>
                            <Radio value="email">E-mail</Radio>
                            <Radio value="phone">Telefone</Radio>
                        </Radio.Group>
                    </Form.Item>
                    <Form.Item name="searchText">
                        <Input
                            placeholder="Filtrar por Nome, Email ou Telefone"
                            value={searchText}
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
                    <Form.Item>
                        <Select
                            defaultValue={null}
                            onChange={(value: number | null) => setStatus(value)}
                            style={{ width: 150 }}
                        >
                            <Option value={null}>TODOS</Option>
                            <Option value={1}>ATIVO</Option>
                            <Option value={2}>PENDENTE</Option>
                            <Option value={3}>BLOQUEADO</Option>
                        </Select>
                    </Form.Item>
                </Form>
            </FilterSection>
            <ContentTable>
                <Table columns={columns} dataSource={partners} pagination={false} loading={loadingTable} rowKey="idPartner" />
            </ContentTable>
            <CustomModal
                visible={!!selectedImage}
                footer={null}
                onCancel={() => setSelectedImage(null)}
                centered
                closable={false}
            >
                <img
                    src={selectedImage || avatarFallback}
                    alt="Profile"
                    style={{ width: '100%', borderRadius: '10%' }}
                />
            </CustomModal>
        </Container>
    );
};

export default ListPartner;