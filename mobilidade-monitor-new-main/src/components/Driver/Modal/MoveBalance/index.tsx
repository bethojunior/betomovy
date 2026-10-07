import { Button, Input, Modal, Select } from 'antd'
import { FC, useState } from 'react'
import api from '../../../../services/api'
import Mask from '../../../../services/Mask'
import Utils from '../../../../utils/Utils'
import Alert from '../../../Utils/Alert'

const { Option } = Select
const { TextArea } = Input

interface ModalProps {
  visibility: boolean
  handleCloseModal: () => void
  driverId: number
  onSearch: () => void
}

interface BalanceDriverPayload {
  driverId: number
  value: number
  observation?: string
}

const MoveBalanceModal: FC<ModalProps> = ({ visibility, handleCloseModal, driverId, onSearch }) => {
  const [loading, setLoading] = useState(false)
  const [showAlert, setShowAlert] = useState(false)
  const [messageAlert, setMessageAlert] = useState('')
  const [typeAlert, setTypeAlert] = useState<'success' | 'info' | 'warning' | 'error'>('success')
  const [quantityBalanceDriver, setQuantityBalanceDriver] = useState('0,00')
  const [actionSelected, setActionSelected] = useState(1)
  const [observation, setObservation] = useState('')

  const handleChangeBalanceDriver = () => {
    setLoading(true)
    const payload: BalanceDriverPayload = {
      driverId,
      value:
        actionSelected === 2
          ? Utils.BrlToNumber(quantityBalanceDriver, 'negative')
          : Utils.BrlToNumber(quantityBalanceDriver, 'positive')
    }

    if (observation && observation.trim()) {
      payload.observation = observation.trim()
    }

    api
      .put(`balance/driver/${driverId}`, payload)
      .then((result) => {
        if (!result.data.status) {
          setMessageAlert('Não foi possível alterar o saldo do motorista')
          setTypeAlert('error')
          return setShowAlert(true)
        }
        setMessageAlert('O saldo foi atualizado!')
        setTypeAlert('success')
        setShowAlert(true)
        setQuantityBalanceDriver('0,00')
        setObservation('')
        handleCloseModal()
        return onSearch()
      })
      .catch(() => {
        setMessageAlert('Erro ao alterar o saldo do motorista')
        setTypeAlert('error')
        setShowAlert(true)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <>
      <Alert
        visibility={showAlert}
        setVisibility={setShowAlert}
        message={messageAlert}
        typeAlert={typeAlert}
      />
      <Modal
        title="Movimentar Saldo"
        visible={visibility}
        width={400}
        centered
        onCancel={handleCloseModal}
        bodyStyle={{ paddingBottom: 24 }}
        footer={[
          <Button key="back" onClick={handleCloseModal} disabled={loading}>
            Cancelar
          </Button>,
          <Button type="primary" key="submit" onClick={handleChangeBalanceDriver} loading={loading}>
            Salvar
          </Button>
        ]}
      >
        <div style={{ marginBottom: 16 }}>
          <p style={{ marginBottom: 2, marginLeft: 2 }}>Quantia</p>
          <Input
            id="quantityInput"
            type="text"
            value={quantityBalanceDriver}
            onChange={(e) => setQuantityBalanceDriver(Mask.setMaskMoney(e.target.value))}
            suffix={<p style={{ marginBottom: 0, color: '#d3d3d3' }}>R$</p>}
            disabled={loading}
          />
          <p style={{ marginBottom: -18, marginLeft: 2, marginTop: 15 }}>Ação</p>
          <Select
            value={actionSelected}
            onChange={(value) => setActionSelected(value)}
            style={{ width: '100%', marginTop: 20 }}
            disabled={loading}
          >
            <Option value={1}>Inserir</Option>
            <Option value={2}>Remover</Option>
          </Select>
          <p style={{ marginBottom: 2, marginLeft: 2, marginTop: 15 }}>Detalhamento</p>
          <TextArea
            rows={3}
            value={observation}
            onChange={(e) => setObservation(e.target.value)}
            placeholder="Especifique o motivo da movimentação (opcional)"
            maxLength={500}
            showCount
            disabled={loading}
            autoSize={{ minRows: 3, maxRows: 5 }}
          />
        </div>
      </Modal>
    </>
  )
}

export default MoveBalanceModal
