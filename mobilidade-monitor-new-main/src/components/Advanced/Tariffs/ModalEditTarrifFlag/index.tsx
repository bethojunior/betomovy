import { useEffect, useState } from "react";
import { Modal, Select, Input, TimePicker, Button } from "antd";
import swal from "sweetalert";
import dayjs from "dayjs";

import { Container, ContainerInput, ContentInput, LabelText } from "./styles";
import locale from "antd/lib/date-picker/locale/pt_BR";

import Mask from "../../../../services/Mask";
import Session from "../../../../utils/Session";
import Utils from "../../../../utils/Utils";
import api from "../../../../services/api";

import { TripTypesProps, TariffsFlagsProps } from "../../../../pages/Advanced/Configs/Tariffs/TariffFlag/types";

interface ModalEditTariffFlagProps {
    visible: boolean;
    setVisible: (data: boolean) => void;
    tripTypes: TripTypesProps[];
    setLoading: (data: boolean) => void;
    loading: boolean;
    getTariffFlag: () => void;
    editingItem: TariffsFlagsProps;
}

const daysWeekList = [
    { value: "1", label: "Domingo" },
    { value: "2", label: "Segunda-feira" },
    { value: "3", label: "Terça-feira" },
    { value: "4", label: "Quarta-feira" },
    { value: "5", label: "Quinta-feira" },
    { value: "6", label: "Sexta-feira" },
    { value: "7", label: "Sábado" },
];

export const ModalEditTariffFlag = ({
    visible,
    setVisible,
    tripTypes,
    setLoading,
    loading,
    getTariffFlag,
    editingItem,
}: ModalEditTariffFlagProps) => {
    const [idTripType, setIdTripType] = useState<number | null>(null);
    const [valueTax, setValueTax] = useState<string>("0,00");
    const [daysWeek, setDaysWeek] = useState<string[]>([]);
    const [timeInit, setTimeInit] = useState<string>("");
    const [timeFinal, setTimeFinal] = useState<string>("");

    const cityId = Session.getLocal("citySelected").cityId;

    useEffect(() => {
        if (editingItem) {
            setIdTripType(editingItem.tripTypeId);
    setValueTax(Utils.NumberToBrl(editingItem.multiplierValue));
            setDaysWeek(
                Array.isArray(editingItem.dayOfWeek)
                    ? editingItem.dayOfWeek.map((day) => String(day))
                    : [String(editingItem.dayOfWeek)]
            );
            setTimeInit(editingItem.timeStart);
            setTimeFinal(editingItem.timeEnd);
        }
    }, [editingItem]);
    

    const handleUpdateTrigger = async () => {
        if (!idTripType) {
            swal({ title: "Selecione uma modalidade.", icon: "info" });
            return;
        }

        if (Utils.BrlToNumber(valueTax, "positive") <= 0) {
            swal({ title: "O valor da taxa deve ser maior que zero!", icon: "info" });
            return;
        }

        if (!timeInit || !timeFinal) {
            swal({ title: "Selecione o horário de funcionamento.", icon: "info" });
            return;
        }

        if (daysWeek.length === 0) {
            swal({ title: "Os dias da semana são obrigatórios.", icon: "info" });
            return;
        }

        setLoading(true);
        try {
            const objectSend = {
                cityId,
                tripTypeId: String(idTripType),
                dayOfWeek: String(daysWeek),
                multiplierValue: Utils.BrlToNumber(valueTax, "positive"),
                timeStart: timeInit,
                timeEnd: timeFinal,
                timezoneOffset: new Date().getTimezoneOffset(),
            };

            await api.put(`price/dynamic/${editingItem.idPriceDynamic}/update`, objectSend);

            swal({ title: "Gatilho atualizado com sucesso!", icon: "success" });
            getTariffFlag();
            setVisible(false);
        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Modal
            title="Editar Gatilho de Tarifa"
            open={visible}
            onCancel={() => setVisible(false)}
            footer={null}
        >
            <Container>
                <ContentInput>
                    <LabelText>Modalidade do motorista</LabelText>
                    <Select value={idTripType} onChange={setIdTripType} style={{ width: "100%" }}>
                        {tripTypes.map((trip) => (
                            <Select.Option key={trip.tripTypeId} value={trip.tripTypeId}>
                                {trip.type}
                            </Select.Option>
                        ))}
                    </Select>
                </ContentInput>

                <ContentInput>
                    <h3>Detalhes</h3>
                    <LabelText>Taxa</LabelText>
                    <Input
                        type="text"
                        value={valueTax}
                        onChange={(e) => setValueTax(Mask.setMaskMoney(e.target.value))}
                    />
                </ContentInput>

                <ContainerInput>
                    <ContentInput>
                        <LabelText>Válido de:</LabelText>
                        <TimePicker
                            style={{ width: "100%" }}
                            locale={locale}
                            format="HH:mm"
                            value={timeInit ? dayjs(timeInit, "HH:mm") : null}
                            onChange={(_, timeString) => setTimeInit(timeString as any)}
                        />
                    </ContentInput>
                    <ContentInput>
                        <LabelText>Até</LabelText>
                        <TimePicker
                            locale={locale}
                            format="HH:mm"
                            value={timeFinal ? dayjs(timeFinal, "HH:mm") : null}
                            onChange={(_, timeString) => setTimeFinal(timeString as any)}
                            style={{ width: "100%" }}
                        />
                    </ContentInput>
                </ContainerInput>

                <ContentInput>
                    <LabelText>Dias válidos</LabelText>
                    <Select
                        mode="multiple"
                        style={{ width: "100%" }}
                        value={daysWeek}
                        onChange={setDaysWeek}
                    >
                        {daysWeekList.map((day) => (
                            <Select.Option key={day.value} value={day.value}>
                                {day.label}
                            </Select.Option>
                        ))}
                    </Select>
                </ContentInput>

                <Button loading={loading} type="primary" onClick={handleUpdateTrigger} style={{ marginTop: 20 }}>
                    Atualizar
                </Button>
            </Container>
        </Modal>
    );
};
