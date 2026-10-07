import { Button, Modal, Select } from "antd";
import { FC, useContext, useState } from "react";
import AuthContext from "../../../contexts/auth";
import apiSpeedmob from "../../../services/apiSpeedmob";
import { useDebounce } from "../../../hooks/useDebounce";

interface FranchiseProps {
  id: string;
  [key: string]: string;
}

interface LoginValues {
  email: string;
  password: string;
}

interface HostsFranchise {
  hostName: string;
  hostLink: string;
}

interface ModalFranchises {
  open: boolean;
  setOpen: (val: boolean) => void;
  franchises: FranchiseProps[];
  loginValues: LoginValues;
}

const ModalFranshises: FC<ModalFranchises> = ({
  open,
  setOpen,
  franchises,
  loginValues,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [franchiseId, setFranchiseId] = useState<string>();
  const { changeApi, signIn } = useContext(AuthContext);
  const [franchisesFiltered, setFranchisesFiltered] = useState<any>();

  const filterColors = (inputValue: string) => {
    franchises.filter((item) => {
      if (item != null) {
        setFranchisesFiltered(
          JSON.stringify(
            item.label.toLowerCase().includes(inputValue.toLowerCase())
          )
        );
      }
    });
  };

  const loadOptions = useDebounce((nameFranchise) => {
    filterColors(nameFranchise);
  }, 1000);

  const getHosts = () => {
    apiSpeedmob
      .get(`franchise/hosts?franchiseId=${franchiseId}`)
      .then(async ({ data }) => {
        await data.response.map(
          async ({ hostName, hostLink }: HostsFranchise) => {
            changeApi(hostName, hostLink);
          }
        );
        setLoading(true);
        await signIn(loginValues.email, loginValues.password);
        setLoading(false);
      });
  };

  const onChange = (informationsFranchise: string) => {
    setFranchiseId(JSON.parse(informationsFranchise).id);
  };

  const onSearch = (franchiseSearched: string) => {
    loadOptions(franchiseSearched);
  };

  const filterOption = (
    input: string,
    option?: { label: string; value: string }
  ) => (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  return (
    <>
      <Modal
        title="Franquias"
        open={open}
        width={600}
        onCancel={() => setOpen(false)}
        footer={[
          <Button key="back" onClick={() => setOpen(false)}>
            Voltar
          </Button>,
          <Button
            type="primary"
            key="submit"
            onClick={() => {
              getHosts();
              setOpen(false);
            }}
            loading={loading}
          >
            Entrar
          </Button>,
        ]}
      >
        <Select
          style={{
            width: "100%",
          }}
          showSearch
          placeholder="Escolha uma franquia"
          optionFilterProp="children"
          onChange={onChange}
          onSearch={onSearch}
          filterOption={filterOption}
          options={franchisesFiltered}
        />
      </Modal>
    </>
  );
};

export default ModalFranshises;
