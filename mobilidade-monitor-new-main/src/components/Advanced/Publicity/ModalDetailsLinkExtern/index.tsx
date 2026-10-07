import {
  CheckBoxContainer,
  CheckBoxLabel,
  Container,
  ContainerButtons,
  ContainerPreview,
  ContainerPreviewImage,
  ContainerRow,
  ContentInput,
  ImagePreview,
  InputFile,
  LabelText,
} from "./styles";
import swal from "sweetalert";

import { Button, Modal, Input, Select, Checkbox } from "antd";

import api from "../../../../services/api";

import Mask from "../../../../services/Mask";

import {
  MenuAppsProps,
  TypesModalities,
} from "../../../../pages/Advanced/Publicity/LinkExtern/types";
import { useEffect, useRef, useState } from "react";
import { ActionDetailsLinkExtern } from "../ActionDetailsLinkExtern";
import { CheckBoxComponent } from "./CheckBoxComponent";
import Utils from "../../../../utils/Utils";

interface ModalDetailsLinkExternProps {
  visible: boolean;
  setVisible: (data: boolean) => void;
  datas: MenuAppsProps | undefined;
  setDatas: (data: MenuAppsProps | undefined) => void;
  setLoading: (data: boolean) => void;
  getMenuApp: () => void;
  typesModalities: TypesModalities[];
}

export const ModalDetailsLinkExtern = ({
  visible,
  setVisible,
  datas,
  setDatas,
  setLoading,
  getMenuApp,
  typesModalities,
}: ModalDetailsLinkExternProps) => {
  const [phone, setPhone] = useState<string>("");
  const [link, setLink] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [idMenuType, setIdMenuType] = useState<number>(0);
  const [idActionType, setIdActionType] = useState<number>(0);
  const actionDetailsLinkExternalRef = useRef<CheckMethodRef>(null);
  const inputFileRef = useRef<HTMLInputElement>(null);
  const buttonActionLike = useRef<CheckBoxComponentRefProps>(null);
  const buttonActionShare = useRef<CheckBoxComponentRefProps>(null);
  const [image, setImage] = useState<File | null | string>(null);
  const [buttonCta, setButtonCta] = useState({
    checked: false,
    name: "",
    link: "",
  });

  const validationActionTypes = () => {
    const objectReturn = {
      status: false,
      message: "Preencha todos os campos",
    };

    if (idActionType === 1) {
      objectReturn.status = true;
      return objectReturn;
    }

    if (!image) {
      objectReturn.status = false;
      objectReturn.message = "Preencha a imagem";
      return objectReturn;
    }
    if (buttonCta.checked) {
      if (!buttonCta.name) {
        objectReturn.status = false;
        objectReturn.message = "Preencha o nome usado para o CTA";
        return objectReturn;
      }
      if (!buttonCta.link) {
        objectReturn.status = false;
        objectReturn.message = "Preencha o link usado para o CTA";
        return objectReturn;
      }
    }
    objectReturn.status = true;
    return objectReturn;
  };

  const handleSaveAdd = async () => {
    if (!idActionType) {
      swal({
        title: "Escolha a ação do link",
        icon: "info",
      });
      return;
    }
    if (idMenuType === 0) {
      swal({
        title: "Escolha a modalidade",
        icon: "info",
      });
      return;
    }

    if (link === "" || description === "" || phone === "") {
      swal({
        title: "Preencha os campos!",
        icon: "info",
      });
      return;
    }

    if (!Utils.checkURLIsValid(String(link))) {
      swal({
        title: "Link inválido!",
        icon: "info",
      });
      return;
    }

    if (phone.length < 15) {
      swal({
        title: "Complete o número de telefone!",
        icon: "info",
      });
      return;
    }
    const validation = validationActionTypes();
    if (!validation.status) {
      swal({
        title: validation.message,
        icon: "warning",
      });
      return;
    }
    setLoading(true);
    try {
      const objectSend = {
        description: description,
        link: link,
        menuAppTypeId: idMenuType,
        phoneNotification: phone,
        menuAppTypeAction: idActionType,
        linkImage: image || null,
        textImage:
          actionDetailsLinkExternalRef.current?.getTextImg() ||
          datas?.textImage ||
          null,
        buttonsActions: {
          like: buttonActionLike.current?.getChecked() || false,
          share: buttonActionShare.current?.getChecked() || false,
        },
        buttonCta:
          idActionType === 1
            ? null
            : {
                checked: buttonCta?.checked || false,
                name: buttonCta?.name,
                link: buttonCta?.link,
              },
        quantity: null,
      };

      const formdata = new FormData();
      formdata.append("data", JSON.stringify(objectSend));
      formdata.append("linkImage", image || "");

      const responseSaveAdd = await api.post("menuApp/insertPro", formdata, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      if (responseSaveAdd.status) {
        swal({
          title: "Menu externo criado com sucesso!",
          icon: "success",
        });
        setLink("");
        setDescription("");
        setPhone("");
        setIdMenuType(0);
        getMenuApp();
        setVisible(false);
      }
    } catch (error) {
      console.error(error);
      swal({
        title: "Erro ao salvar novo menu externo",
        icon: "error",
      });
    }
    setLoading(false);
  };

  const handleSaveEdit = async () => {
    if (!idActionType) {
      swal({
        title: "Escolha a ação do link",
        icon: "info",
      });
      return;
    }

    if (link === "" || description === "" || phone === "") {
      swal({
        title: "Preencha os campos!",
        icon: "info",
      });
      return;
    }
    if (!Utils.checkURLIsValid(String(link))) {
      swal({
        title: "Link inválido!",
        icon: "info",
      });
      return;
    }
    if (phone.length < 15) {
      swal({
        title: "Complete o número de telefone!",
        icon: "info",
      });
      return;
    }
    const validation = validationActionTypes();
    if (!validation.status) {
      swal({
        title: validation.message,
        icon: "warning",
      });
      return;
    }
    setLoading(true);
    try {
      const objectSend = {
        description: description,
        link: link,
        menuAppTypeId: datas?.menuAppTypeId,
        phoneNotification: phone,
        menuAppTypeAction: idActionType,
        linkImage: image,
        textImage:
          actionDetailsLinkExternalRef.current?.getTextImg() ||
          datas?.textImage ||
          null,
        buttonsActions: {
          like: buttonActionLike.current?.getChecked() || false,
          share: buttonActionShare.current?.getChecked() || false,
        },
        buttonCta:
          idActionType === 1
            ? null
            : {
                checked: buttonCta?.checked || false,
                name: buttonCta?.name,
                link: buttonCta?.link,
              },
        quantity: null,
      };

      const formdata = new FormData();
      formdata.append("data", JSON.stringify(objectSend));
      formdata.append("linkImage", image || "");

      const responseEdit = await api.post("menuApp/insertPro", formdata, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      if (responseEdit.status) {
        swal({
          title: "Menu externo alterado com sucesso!",
          icon: "success",
        });
        setVisible(false);
        getMenuApp();
        setDatas(undefined);
      }
    } catch (error) {
      console.error(error);
      swal({
        title: "Menu externo alterado com sucesso!",
        icon: "success",
      });
    }
    setLoading(false);
  };

  useEffect(() => {
    if (visible) {
      if (datas) {
        setIdActionType(datas.menuAppTypeAction);
        setPhone(datas.phoneNotification);
        setDescription(datas.description);
        setLink(datas.link);
        setButtonCta({
          checked: datas?.buttonCta?.checked || false,
          name: datas?.buttonCta?.name || "",
          link: datas?.buttonCta?.link || "",
        });
        setImage(datas?.linkImage);
        buttonActionLike.current?.setCheckedData(datas?.buttonsActions?.like);
        buttonActionShare.current?.setCheckedData(datas?.buttonsActions?.share);
      } else {
        setIdActionType(0);
        setPhone("");
        setDescription("");
        setLink("");
        setButtonCta({
          checked: false,
          name: "",
          link: "",
        });
        buttonActionLike.current?.setCheckedData(false);
        buttonActionShare.current?.setCheckedData(false);
      }
    } else {
      setPhone("");
      setDescription("");
      setLink("");
    }
  }, [visible]);

  const typesModalitiesFormated = typesModalities.map((value) => {
    return {
      label: value.name,
      value: value.id,
    };
  });

  return (
    <Modal
      title={datas ? "Editar Menu Externo" : "Novo Menu Externo"}
      open={visible}
      onCancel={() => {
        setVisible(false);
        setDatas(undefined);
      }}
      footer={[
        <Button
          key={1}
          onClick={() => {
            setVisible(false);
            setDatas(undefined);
          }}
        >
          Fechar
        </Button>,
        <Button
          key={2}
          type="primary"
          onClick={() => (datas ? handleSaveEdit() : handleSaveAdd())}
        >
          Salvar
        </Button>,
      ]}
    >
      <ContainerRow>
        <Container>
          {!datas && Object.values(typesModalitiesFormated).length > 0 ? (
            <ContentInput>
              <LabelText>Modalidade:</LabelText>
              <Select
                style={{
                  width: "100%",
                }}
                defaultValue={0}
                onChange={(value) => setIdMenuType(value)}
              >
                <Select.Option value={0}>Selecione a modalidade</Select.Option>
                {typesModalities.map((value) => {
                  return (
                    <Select.Option key={value.id} value={value.id}>
                      {value.name}
                    </Select.Option>
                  );
                })}
              </Select>
            </ContentInput>
          ) : null}
          <ContentInput>
            <LabelText>Telefone:</LabelText>
            <Input
              type="text"
              value={Mask.setMaskPhoneValue(phone)}
              onChange={(event) =>
                setPhone(Mask.setMaskPhoneValue(event.target.value))
              }
            />
          </ContentInput>

          <ContentInput>
            <LabelText>Link a direcionar:</LabelText>
            <Input
              type="text"
              defaultValue={datas?.link}
              value={link}
              onChange={(event) => setLink(event.target.value)}
            />
          </ContentInput>

          <ContentInput>
            <LabelText>Descrição no Menu:</LabelText>
            <Input
              type="text"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
            />
          </ContentInput>

          <ActionDetailsLinkExtern
            setIdActionType={setIdActionType}
            idActionType={idActionType}
            datas={datas}
            ref={actionDetailsLinkExternalRef}
          />
        </Container>
        {(idActionType === 2 || idActionType === 3) && (
          <ContainerPreview>
            <ContainerPreviewImage>
              <ImagePreview
                src={
                  !image
                    ? "https://placehold.co/600x400"
                    : typeof image === "string"
                    ? image
                    : URL.createObjectURL(image)
                }
                onClick={() => inputFileRef.current?.click()}
              />
              <InputFile
                type="file"
                ref={inputFileRef}
                accept="image/*"
                onChange={(e) => setImage(e.target?.files?.[0] ?? null)}
              />
            </ContainerPreviewImage>
            <ContainerButtons>
              <ContentInput>
                <LabelText>Botões de ação:</LabelText>
                <CheckBoxComponent
                  defaultChecked={datas?.buttonsActions?.like}
                  ref={buttonActionLike}
                  title="Curtir"
                />
                <CheckBoxComponent
                  ref={buttonActionShare}
                  defaultChecked={datas?.buttonsActions?.share}
                  title="Compatilhar"
                />
                <div>
                  <CheckBoxContainer>
                    <Checkbox
                      defaultChecked={
                        datas?.buttonCta?.checked || buttonCta?.checked || false
                      }
                      onChange={(e) =>
                        setButtonCta({
                          ...buttonCta,
                          checked: e.target.checked,
                        })
                      }
                    />
                    <CheckBoxLabel
                      style={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      CTA
                    </CheckBoxLabel>
                  </CheckBoxContainer>
                  <ContentInput>
                    <Input
                      type="text"
                      placeholder="Nome do Botão"
                      value={buttonCta?.name}
                      onChange={(event) =>
                        setButtonCta({
                          ...buttonCta,
                          name: event.target.value,
                        })
                      }
                    />
                  </ContentInput>
                  <ContentInput>
                    <Input
                      type="text"
                      value={buttonCta?.link}
                      placeholder="Link do botão CTA"
                      onChange={(event) =>
                        setButtonCta({
                          ...buttonCta,
                          link: event.target.value,
                        })
                      }
                    />
                  </ContentInput>
                </div>
              </ContentInput>
            </ContainerButtons>
          </ContainerPreview>
        )}
      </ContainerRow>
    </Modal>
  );
};
