import { FC, useEffect } from "react";
import { Button } from "antd";
import { useForm, Controller } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import Mask from "../../../../../../services/Mask";
import {
  DetailStepBody,
  Label,
  TwoSelects,
  MiddleSelectContainer,
  ContentButtonStep,
} from "./styles";

import { InputAntd } from "../../../../../InputAntd";

import { SchemaFormDetailsStep } from "./schemas";
import { SchemaFormDetailsStepProps, SecondStep } from "./types";
import { ObjectPerfilLegalPersonProps } from "../../Edition/types";
import swal from "sweetalert";

const DetailStep: FC<SecondStep> = ({
  current,
  setCurrent,
  objectPerfilLegalPerson,
  setObjectPerfilLegalPerson,
}) => {
  const { handleSubmit, control, setValue } =
    useForm<SchemaFormDetailsStepProps>({
      resolver: yupResolver(SchemaFormDetailsStep),
    });

  const handleNextStep = (data: SchemaFormDetailsStepProps) => {

    if(Number(data.dayPayment) === 0){
      swal({
        title: "Aviso",
        text: "Dia do mês de cobrança não pode ser 0",
        icon: "error"
      })
      return;
    }

    const objectUpdated = {
      ...objectPerfilLegalPerson,
      email: data.financialEmail,
      site: data.siteCompany,
      observation: data.goalOfTrip,
      phone: data.phoneCompany,
      registration: data.numberRegister,
      billingDay: Number(data.dayPayment),
      voucherLimit: Number(data.limitVoucher),
      facebook: data.facebook,
      instagram: data.instagram,
    };

    setCurrent(current + 1);
    setObjectPerfilLegalPerson(objectUpdated as ObjectPerfilLegalPersonProps);
  };

  useEffect(() => {
    if (objectPerfilLegalPerson) {
      setValue("financialEmail", objectPerfilLegalPerson?.email);
      if (objectPerfilLegalPerson.site) {
        setValue("siteCompany", objectPerfilLegalPerson?.site);
      }
      setValue("goalOfTrip", objectPerfilLegalPerson?.observation);
      setValue("phoneCompany", objectPerfilLegalPerson?.phone);
      setValue("numberRegister", objectPerfilLegalPerson?.registration);
      setValue("dayPayment", String(objectPerfilLegalPerson?.billingDay));
      setValue("limitVoucher", String(objectPerfilLegalPerson?.voucherLimit));
      if (objectPerfilLegalPerson.facebook) {
        setValue("facebook", objectPerfilLegalPerson?.facebook);
      }
      if (objectPerfilLegalPerson.instagram) {
        setValue("instagram", objectPerfilLegalPerson?.instagram);
      }
    }
  }, [objectPerfilLegalPerson]);

  return (
    <DetailStepBody onSubmit={handleSubmit(handleNextStep)}>
      <Controller
        control={control}
        name="financialEmail"
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <div>
            <Label>Email financeiro*</Label>
            <InputAntd
              value={value}
              onChange={onChange}
              status={Boolean(error) ? "error" : ""}
              messageError={error?.message}
            />
          </div>
        )}
      />

      <Controller
        control={control}
        name="siteCompany"
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <div>
            <Label>Site da empresa</Label>
            <InputAntd
              value={value}
              onChange={onChange}
              status={Boolean(error) ? "error" : ""}
              messageError={error?.message}
            />
          </div>
        )}
      />

      <Controller
        control={control}
        name="goalOfTrip"
        render={({ field: { onChange, value }, fieldState: { error } }) => (
          <div>
            <Label>Finalidade da viagem*</Label>
            <InputAntd
              value={value}
              onChange={onChange}
              status={Boolean(error) ? "error" : ""}
              messageError={error?.message}
            />
          </div>
        )}
      />

      <TwoSelects>
        <Controller
          control={control}
          name="phoneCompany"
          render={({ field: { value }, fieldState: { error } }) => (
            <MiddleSelectContainer>
              <Label>Telefone Empresarial*</Label>
              <InputAntd
                value={value}
                onChange={(event) =>
                  setValue(
                    "phoneCompany",
                    Mask.setMaskPhoneValue(event.target.value)
                  )
                }
                status={Boolean(error) ? "error" : ""}
                messageError={error?.message}
              />
            </MiddleSelectContainer>
          )}
        />

        <Controller
          control={control}
          name="numberRegister"
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <MiddleSelectContainer>
              <Label>Número da matrícula*</Label>
              <InputAntd
                value={value}
                onChange={onChange}
                status={Boolean(error) ? "error" : ""}
                messageError={error?.message}
              />
            </MiddleSelectContainer>
          )}
        />
      </TwoSelects>
      <TwoSelects>
        <Controller
          control={control}
          name="dayPayment"
          render={({ field: { value }, fieldState: { error } }) => (
            <MiddleSelectContainer>
              <Label>Dia do mês para cobrança*</Label>
              <InputAntd
                maxLength={2}
                value={value}
                onChange={(event) =>
                  setValue(
                    "dayPayment",
                    String(Mask.setMaskJustNumber(event.target.value))
                  )
                }
                status={Boolean(error) ? "error" : ""}
                messageError={error?.message}
              />
            </MiddleSelectContainer>
          )}
        />

        <Controller
          control={control}
          name="limitVoucher"
          render={({ field: { value }, fieldState: { error } }) => (
            <MiddleSelectContainer>
              <Label>Limite Voucher*</Label>
              <InputAntd
                value={value}
                onChange={(event) =>
                  setValue(
                    "limitVoucher",
                    Mask.setMaskJustNumber(event.target.value)
                  )
                }
                status={Boolean(error) ? "error" : ""}
                messageError={error?.message}
              />
            </MiddleSelectContainer>
          )}
        />
      </TwoSelects>
      <TwoSelects>
        <Controller
          control={control}
          name="instagram"
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <MiddleSelectContainer>
              <Label>Instagram</Label>
              <InputAntd
                value={value}
                onChange={onChange}
                messageError={error?.message}
              />
            </MiddleSelectContainer>
          )}
        />

        <Controller
          control={control}
          name="instagram"
          render={({ field: { onChange, value }, fieldState: { error } }) => (
            <MiddleSelectContainer>
              <Label>Facebook</Label>
              <InputAntd
                value={value}
                onChange={onChange}
                messageError={error?.message}
              />
            </MiddleSelectContainer>
          )}
        />
      </TwoSelects>

      <ContentButtonStep>
        <Button onClick={() => setCurrent(current - 1)}>Voltar</Button>

        <Button htmlType="submit" type="primary">
          Próximo
        </Button>
      </ContentButtonStep>
    </DetailStepBody>
  );
};

export default DetailStep;
