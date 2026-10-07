import React, { useState, useEffect } from 'react';
import { Modal } from 'antd';
import api from '../../../../services/api';
import swal from 'sweetalert';
import { ContentWrapper, ModalTitle, ModalText, ContentContainer, LargeButton } from './styles';

interface SplitModalProps {
  visibility: boolean;
  handleCloseModal: () => void;
  driverId: number | null;
}

const SplitModal: React.FC<SplitModalProps> = ({
  visibility,
  handleCloseModal,
  driverId,
}) => {
  const [driverName, setDriverName] = useState<string>('');

  useEffect(() => {
    if (driverId !== null) {
      api.get(`driver/${driverId}`).then((response) => {
        if (response.data.status) {
          setDriverName(response.data.response.name);
        }
      }).catch((error) => {
        console.error('Failed to fetch driver data', error);
      });
    }
  }, [driverId]);

  const handleSplitConfigCreation = () => {
    swal({
      title: "Você tem certeza que deseja fazer essa alteração?",
      icon: "warning",
      buttons: ["Cancelar", "Confirmar"],
      dangerMode: true,
    }).then((willCreate) => {
      if (willCreate && driverId !== null) {
        api.post(`/driver/${driverId}/driverSplitConfig`).then(response => {
          if (response.data.status) {
            swal("Sucesso", "Configuração de divisão de ganhos criada com sucesso.", "success");
            handleCloseModal();
          } else {
            swal("Erro", response.data.message, "error");
          }
        }).catch(error => {
          console.error('Failed to create split config', error);
          swal("Erro", "Não foi possível criar a configuração de divisão de ganhos.", "error");
        });
      }
    });
  };

  return (
    <Modal
      title={<ModalTitle>Split Driver</ModalTitle>}
      visible={visibility}
      onCancel={handleCloseModal}
      width={600}
      footer={null}
    >
      <ContentContainer>
        <ModalText>{driverName} ainda não possui uma configuração de split de pagamentos. Clique no botão abaixo para criar uma.</ModalText>
        <ContentWrapper>
          <LargeButton
            type="primary"
            onClick={handleSplitConfigCreation}
          >
            Criar configuração de divisão de ganhos
          </LargeButton>
        </ContentWrapper>
      </ContentContainer>
    </Modal>
  );
};

export default SplitModal;
