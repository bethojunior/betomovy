import { Radio, Button, Input, Modal, Skeleton } from "antd";
import { Controller } from "react-hook-form";
import dayjs, { Dayjs } from "dayjs";
import locale from "antd/es/date-picker/locale/pt_BR";

import {
  Content,
  LabelText,
  ContentInput,
  ContentInputPadded,
  ContentInputFlex,
  Image,
  SubTitle,
  Column,
  ColumnLeft,
  ContentTwoColumns,
  ContentBannerAndLabel,
  ContentButtonLoadImg,
  MessageErrorInput,
  FullWidthDatePicker,
  FullWidthSelect,
  FormActions,
  SkeletonColumn,
  SkeletonColumnRight,
  SkeletonActions,
  FormTextExtra,
} from "./styles";

import imageDefaultIcon from "../../../../assets/imageDefaultIcon.png";
import { useModalEditPublicity } from "./useModalEditPublicity";
import { ModalEditPublicityProps } from "./types";

const DEFAULT_IMAGE_URL = imageDefaultIcon;

export const ModalEditPublicity = ({
  visible,
  setVisible,
  publicityId,
  onSuccess,
}: ModalEditPublicityProps) => {
  const {
    control,
    handleSubmit,
    setValue,
    loadingButton,
    loadingData,
    listCompanies,
    listGender,
    listApps,
    listAdvertising,
    urlImgBanner,
    urlImgModal,
    refImgBanner,
    refImgModal,
    onChangeImgBanner,
    onChangeImgModal,
    onSubmitDatas,
    handleClose,
  } = useModalEditPublicity({ visible, publicityId, setVisible, onSuccess });

  return (
    <Modal
      title="Editar Publicidade"
      open={visible}
      onCancel={handleClose}
      width={900}
      footer={null}
      destroyOnClose
    >
      <Content>
        {loadingData ? (
          <div>
            <ContentTwoColumns>
              <SkeletonColumn>
                <Skeleton.Image active style={{ width: 288, height: 180, marginBottom: 16 }} />
                <Skeleton.Button active block style={{ marginBottom: 16 }} />
                <Skeleton.Image active style={{ width: 324, height: 108, marginBottom: 16 }} />
                <Skeleton.Button active block style={{ marginBottom: 16 }} />
                <Skeleton.Input active block style={{ marginBottom: 16 }} />
                <Skeleton.Input active block style={{ marginBottom: 16 }} />
                <Skeleton.Input active block style={{ marginBottom: 16 }} />
              </SkeletonColumn>
              <SkeletonColumnRight>
                <Skeleton active paragraph={{ rows: 2 }} style={{ marginBottom: 16 }} />
                <Skeleton active paragraph={{ rows: 2 }} style={{ marginBottom: 16 }} />
                <Skeleton active paragraph={{ rows: 2 }} style={{ marginBottom: 16 }} />
                <Skeleton active paragraph={{ rows: 3 }} />
              </SkeletonColumnRight>
            </ContentTwoColumns>
            <Skeleton.Input active block style={{ marginTop: 16, marginBottom: 16 }} />
            <Skeleton.Input active block style={{ marginBottom: 16 }} />
            <SkeletonActions>
              <Skeleton.Button active style={{ width: 100 }} />
              <Skeleton.Button active style={{ width: 100 }} />
            </SkeletonActions>
          </div>
        ) : (
          <form onSubmit={handleSubmit(onSubmitDatas)}>
            <ContentTwoColumns>
              <ColumnLeft>
                <ContentInputPadded>
                  <ContentBannerAndLabel>
                    <LabelText>Imagem para o modal (288 x 180)</LabelText>
                    <Image src={urlImgModal.length > 1 ? urlImgModal : DEFAULT_IMAGE_URL} />
                  </ContentBannerAndLabel>
                  <ContentButtonLoadImg>
                    <label htmlFor="imageModal" className="labelImg">Carregar Imagem</label>
                    <input
                      id="imageModal"
                      type="file"
                      accept=".png, .jpg, .jpeg"
                      ref={refImgModal}
                      onChange={onChangeImgModal}
                    />
                  </ContentButtonLoadImg>
                </ContentInputPadded>

                <ContentInputPadded>
                  <ContentBannerAndLabel>
                    <LabelText>Banner promocional (324 x 108)</LabelText>
                    <Image src={urlImgBanner.length > 1 ? urlImgBanner : DEFAULT_IMAGE_URL} />
                  </ContentBannerAndLabel>
                  <ContentButtonLoadImg>
                    <label htmlFor="imageBanner" className="labelImg">Carregar Imagem</label>
                    <input
                      id="imageBanner"
                      type="file"
                      accept=".png, .jpg, .jpeg"
                      ref={refImgBanner}
                      onChange={onChangeImgBanner}
                    />
                  </ContentButtonLoadImg>
                </ContentInputPadded>
              </ColumnLeft>

              <Column>
                <Controller
                  control={control}
                  name="genderId"
                  render={({ field: { name, value, onChange }, fieldState: { error } }) => (
                    <ContentInput>
                      <SubTitle>Público</SubTitle>
                      <Radio.Group name={name} value={value} onChange={onChange}>
                        {listGender.map((item) => (
                          <Radio key={item.id} value={item.id}>
                            {item.name.toLocaleUpperCase()}
                          </Radio>
                        ))}
                      </Radio.Group>
                      {error && <MessageErrorInput>{error.message}</MessageErrorInput>}
                    </ContentInput>
                  )}
                />

                <Controller
                  control={control}
                  name="advertisingId"
                  render={({ field: { value, onChange, name }, fieldState: { error } }) => (
                    <ContentInput>
                      <SubTitle>Onde</SubTitle>
                      <Radio.Group name={name} value={value} onChange={onChange}>
                        {listAdvertising.map((item) => (
                          <Radio key={item.id} value={item.id}>
                            {item.name.toLocaleUpperCase()}
                          </Radio>
                        ))}
                      </Radio.Group>
                      {error && <MessageErrorInput>{error.message}</MessageErrorInput>}
                    </ContentInput>
                  )}
                />

                <Controller
                  control={control}
                  name="appId"
                  render={({ field: { name, value, onChange }, fieldState: { error } }) => (
                    <ContentInput>
                      <SubTitle>App</SubTitle>
                      <Radio.Group name={name} value={value} onChange={onChange}>
                        {listApps.map((item) => (
                          <Radio key={item.idApp} value={item.idApp}>
                            {item.name}
                          </Radio>
                        ))}
                      </Radio.Group>
                      {error && <MessageErrorInput>{error.message}</MessageErrorInput>}
                    </ContentInput>
                  )}
                />

                <ContentInput>
                  <SubTitle>Links</SubTitle>

                  <Controller
                    control={control}
                    name="link"
                    render={({ field: { value, name, onChange }, fieldState: { error } }) => (
                      <ContentInput>
                        <LabelText>Link de destino</LabelText>
                        <Input type="text" name={name} onChange={onChange} value={value} status={error ? "error" : ""} />
                        {error && <MessageErrorInput>{error.message}</MessageErrorInput>}
                      </ContentInput>
                    )}
                  />

                  <Controller
                    control={control}
                    name="emailInformation"
                    render={({ field: { value, name, onChange }, fieldState: { error } }) => (
                      <ContentInput>
                        <LabelText>Email de informação</LabelText>
                        <Input type="text" name={name} value={value} onChange={onChange} status={error ? "error" : ""} />
                        {error && <MessageErrorInput>{error.message}</MessageErrorInput>}
                      </ContentInput>
                    )}
                  />

                  <Controller
                    control={control}
                    name="emailRedirect"
                    render={({ field: { value, name, onChange }, fieldState: { error } }) => (
                      <ContentInput>
                        <LabelText>Email de redirecionamento</LabelText>
                        <Input type="text" name={name} value={value} onChange={onChange} status={error ? "error" : ""} />
                        {error && <MessageErrorInput>{error.message}</MessageErrorInput>}
                      </ContentInput>
                    )}
                  />
                </ContentInput>

                <ContentInput>
                  <SubTitle>Período</SubTitle>

                  <ContentTwoColumns>
                    <Controller
                      control={control}
                      name="dateInit"
                      render={({ field: { name, value }, fieldState: { error } }) => (
                        <ContentInputFlex>
                          <LabelText>Data Início</LabelText>
                          <FullWidthDatePicker
                            locale={locale}
                            showTime
                            format="DD/MM/YYYY HH:mm:ss"
                            placeholder="Selecione a data"
                            name={name}
                            value={value ? dayjs(value) : null}
                            onChange={(value) => setValue("dateInit", (value as Dayjs | null)?.toDate() ?? null)}
                            status={error ? "error" : ""}
                          />
                          {error && <MessageErrorInput>{error.message}</MessageErrorInput>}
                        </ContentInputFlex>
                      )}
                    />

                    <Controller
                      control={control}
                      name="dateFinal"
                      render={({ field: { name, value }, fieldState: { error } }) => (
                        <ContentInputFlex>
                          <LabelText>Data Final</LabelText>
                          <FullWidthDatePicker
                            locale={locale}
                            showTime
                            format="DD/MM/YYYY HH:mm:ss"
                            placeholder="Selecione a data"
                            name={name}
                            value={value ? dayjs(value) : null}
                            onChange={(value) => setValue("dateFinal", (value as Dayjs | null)?.toDate() ?? null)}
                            status={error ? "error" : ""}
                          />
                          {error && <MessageErrorInput>{error.message}</MessageErrorInput>}
                        </ContentInputFlex>
                      )}
                    />
                  </ContentTwoColumns>

                  <Controller
                    control={control}
                    name="amountOfTime"
                    defaultValue="6"
                    render={({ field: { value, name }, fieldState: { error } }) => (
                      <ContentInput>
                        <LabelText>Tempo de exibição do anúncio (em segundos)</LabelText>
                        <Input
                          type="number"
                          name={name}
                          min={1}
                          max={300}
                          value={value ?? ""}
                          status={error ? "error" : ""}
                          onChange={(event) => {
                            const { value } = event.target;
                            setValue("amountOfTime", value.replace(/\D/g, ""));
                          }}
                        />
                        {error && <MessageErrorInput>{error.message}</MessageErrorInput>}
                        <FormTextExtra>Valor mínimo 1 segundo | Valor máximo 300 segundos</FormTextExtra>
                      </ContentInput>
                    )}
                  />
                </ContentInput>
              </Column>
            </ContentTwoColumns>

            <Controller
              control={control}
              name="description"
              render={({ field: { value, name, onChange }, fieldState: { error } }) => (
                <ContentInput>
                  <LabelText>Descrição</LabelText>
                  <Input.TextArea
                    placeholder="Texto"
                    rows={3}
                    name={name}
                    value={value}
                    onChange={onChange}
                    status={error ? "error" : ""}
                  />
                  {error && <MessageErrorInput>{error.message}</MessageErrorInput>}
                </ContentInput>
              )}
            />

            <ContentTwoColumns>
              <Controller
                control={control}
                name="company"
                render={({ field: { value, onChange }, fieldState: { error } }) => (
                  <ContentInputFlex>
                    <LabelText>Empresa</LabelText>
                    <FullWidthSelect
                      value={value}
                      onChange={onChange}
                      status={error ? "error" : ""}
                      placeholder="Escolha uma empresa"
                    >
                      {listCompanies.map((item) => (
                        <FullWidthSelect.Option key={item.id} value={item.id}>
                          {item.fantasyName}
                        </FullWidthSelect.Option>
                      ))}
                    </FullWidthSelect>
                    {error && <MessageErrorInput>{error.message}</MessageErrorInput>}
                  </ContentInputFlex>
                )}
              />

              <ContentInputFlex>
                <LabelText>Gestor</LabelText>
                <Input type="text" name="manager" disabled />
              </ContentInputFlex>
            </ContentTwoColumns>

            <FormActions>
              <Button onClick={handleClose}>Cancelar</Button>
              <Button type="primary" htmlType="submit" loading={loadingButton}>
                Atualizar
              </Button>
            </FormActions>
          </form>
        )}
      </Content>
    </Modal>
  );
};
