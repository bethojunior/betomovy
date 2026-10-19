import { Button, Checkbox, Form, Input, Modal, Radio, Select } from 'antd'
import { FC, useEffect, useState } from 'react'
import Resizer from 'react-image-file-resizer'
import Blank from '../../../assets/blank.png'
import { SelectSearch } from '../../SelectSearch'
import { useDebounce } from '../../../hooks/useDebounce'
import api from '../../../services/api'
import apiApp from '../../../services/apiApp'
import apiv1 from '../../../services/apiv1'
import Session from '../../../utils/Session'
import { ButtonSelectAddress } from './styles'

interface Props {
  visible: boolean
  setVisible: (visible: boolean) => void
  getCentral: () => void
  loading: boolean
  setLoading: (loading: boolean) => void
  setShowAlert: (showAlert: boolean) => void
  setMessageAlert: (messageAlert: string) => void
  setTypeAlert: (typeAlert: 'info' | 'success' | 'error' | 'warning') => void
  callDriverTypes: any
  data: any
  editCentral: (id: number, values: any) => void
  setData: (data: any) => void
}

const positionCity = Session.getLocal('pointsCity')
let isEdit = false

export const ModalRegister: FC<Props> = ({
  visible,
  setVisible,
  getCentral,
  setLoading,
  loading,
  setShowAlert,
  setMessageAlert,
  setTypeAlert,
  callDriverTypes,
  data,
  setData,
}) => {
  const [selectedFile, setSelectedFile] = useState<any>()
  const [whatRender, setWhatRender] = useState<string>()
  const [listPlaces, setListPlaces] = useState<any>([])
  const [place, setPlace] = useState('')
  const [renderImage, setRenderImage] = useState(false)
  const [enableCustomRadius, setEnableCustomRadius] = useState(false)

  const [userMode, setUserMode] = useState<'new' | 'existing'>('existing')
  const [eligibleUsers, setEligibleUsers] = useState<DefaultOptionsSelectAntdProps[]>([])
  const [eligibleLoading, setEligibleLoading] = useState(false)
  const [eligiblePage, setEligiblePage] = useState(1)
  const [eligibleSearch, setEligibleSearch] = useState('')
  const [eligibleHasMore, setEligibleHasMore] = useState(true)
  const [responsibleId, setResponsibleId] = useState('')

  const [form] = Form.useForm()
  const { Option } = Select

  const searchEligibleUsers = async (search: string, page: number) => {
    setEligibleLoading(true)
    try {
      const { data } = await api.get('central/user/eligible', { params: { search, page } })
      const results = (data.response?.data ?? []).map((user: any) => ({
        value: String(user.id),
        label: `${user.text} (${user.email})`,
      }))
      setEligibleUsers((prev) => (page === 1 ? results : [...prev, ...results]))
      setEligibleHasMore(Boolean(data.response?.next_page_url))
      setEligiblePage(page)
      setEligibleSearch(search)
    } finally {
      setEligibleLoading(false)
    }
  }

  const debouncedSearchEligibleUsers = useDebounce((search: string) => searchEligibleUsers(search, 1), 500)

  const handleSearchEligibleUsers = (search: string) => {
    setEligibleLoading(true)
    debouncedSearchEligibleUsers(search)
  }

  const handleEligibleScroll = (event: React.UIEvent<HTMLDivElement>) => {
    const target = event.currentTarget
    const nearBottom = target.scrollTop + target.clientHeight >= target.scrollHeight - 24

    if (nearBottom && eligibleHasMore && !eligibleLoading) {
      searchEligibleUsers(eligibleSearch, eligiblePage + 1)
    }
  }

  useEffect(() => {
    if (visible && !isEdit && userMode === 'existing') {
      searchEligibleUsers('', 1)
    }
  }, [visible, userMode])

  useEffect(() => {
    if (Object.keys(data).length !== 0 && visible) {
      isEdit = true
      setPlace(data.address || '')
      setSelectedFile(data.logo)
      form.setFieldsValue(data)

      form.setFieldsValue({
        name: data.name,
        responsibleName: data.responsible?.name || data.responsibleName || '',
        phone: data.responsible?.phone || data.phone || '',
        image: data.logo,
        address: {
          address: data.address || '',
          latitude: data.latitude,
          longitude: data.longitude,
        },
        latitude: data.latitude,
        longitude: data.longitude,
        enableCustomRadiusCentral: data.enableCustomRadiusCentral === 1 || data.enableCustomRadiusCentral === true,
        placesSearchRadius: data.placesSearchRadius,
        centralCallDriver: data.centralCallDriver,
        syncCustomers: Boolean(data.syncCustomers),
        showAllPrices: data.showAllPrices !== undefined ? Boolean(data.showAllPrices) : true,
        discount_type: data.discount_type || '%',
        discount_value: data.discount_value,
      })

      setEnableCustomRadius(data.enableCustomRadiusCentral === 1 || data.enableCustomRadiusCentral === true)
      setRenderImage(false)
    } else if (visible) {
      isEdit = false
      setUserMode('existing')
      setEligibleUsers([])
      setEligiblePage(1)
      setEligibleSearch('')
      setEligibleHasMore(true)
      setResponsibleId('')
      setPlace('')
      setSelectedFile(null)
      form.resetFields()
    }
  }, [visible, data])

  const resizeFile = (file: Blob, width: number, heigth: number) =>
    new Promise((resolve) => {
      Resizer.imageFileResizer(
        file,
        width,
        heigth,
        'PNG',
        100,
        0,
        (uri) => {
          resolve(uri)
        },
        'blob'
      )
    })

  const handleCreate = async (data: any) => {
    if (userMode === 'existing' && !responsibleId) {
      setMessageAlert('Selecione um usuário existente')
      setTypeAlert('error')
      setShowAlert(true)
      return
    }

    setLoading(true)

    const doSubmit = (logoBlob?: Blob | null) => {
      const formData = new FormData()

      formData.append('name', data.name)
      const addr = typeof data.address === 'object' && data.address !== null
        ? data.address.address || place || ''
        : (data.address || place || '')
      const lat = typeof data.address === 'object' && data.address !== null
        ? (data.address.latitude || '')
        : (data.latitude || '')
      const lng = typeof data.address === 'object' && data.address !== null
        ? (data.address.longitude || '')
        : (data.longitude || '')

      formData.append('address', addr)
      formData.append('latitude', lat)
      formData.append('longitude', lng)
      formData.append('centralCallDriver', data.centralCallDriver || 'only_central_drivers')
      formData.append('syncCustomers', data.syncCustomers ? '1' : '0')
      formData.append('showAllPrices', data.showAllPrices ? '1' : '0')
      formData.append('enableCustomRadiusCentral', data.enableCustomRadiusCentral ? '1' : '0')
      if (data.enableCustomRadiusCentral && data.placesSearchRadius) {
        formData.append('placesSearchRadius', data.placesSearchRadius)
      }
      if (userMode === 'existing') {
        formData.append('responsibleId', responsibleId)
      } else {
        formData.append('user[name]', data.responsibleName)
        formData.append('user[email]', data.responsibleEmail)
        formData.append('user[phone]', data.phone)
        formData.append('user[password]', data.password)
      }
      if (logoBlob) {
        formData.append('logo', logoBlob)
      }

      const config = {
        headers: {
          accept: 'application/json',
          'Content-Type': `multipart/form-data`,
        },
      }

      api
        .post(`central`, formData, config)
        .then((value) => {
          setLoading(false)
          const res = value.data
          if (!res?.status && value.status !== 200) {
            setMessageAlert(res?.message || 'Ocorreu um erro, tente novamente')
            setTypeAlert('error')
            return setShowAlert(true)
          }

          form.resetFields()
          setSelectedFile(null)
          setMessageAlert('Central cadastrada com sucesso!')
          setTypeAlert('success')
          setShowAlert(true)
          setVisible(false)
          getCentral()
        })
        .catch((error) => {
          setLoading(false)
          setMessageAlert(error.response?.data?.message ?? 'Ocorreu um erro, tente novamente')
          setTypeAlert('error')
          setShowAlert(true)
        })
    }

    if (selectedFile && typeof selectedFile !== 'string' && selectedFile[0]) {
      resizeFile(selectedFile[0], 250, 250)
        .then((result) => doSubmit(result as Blob))
        .catch(() => doSubmit(null))
    } else {
      doSubmit(null)
    }
  }

  useEffect(() => {
    if (selectedFile && renderImage) {
      setWhatRender(URL.createObjectURL(selectedFile[0] as File))
    } else {
      setWhatRender(Blank)
    }
  }, [selectedFile, renderImage])

  const editCentral = async (values: any) => {
    setLoading(true)

    if (selectedFile && typeof selectedFile !== 'string' && selectedFile[0]) {
      const formData = new FormData()
      try {
        const result = await resizeFile(selectedFile[0], 250, 250)
        formData.append('logo', result as Blob)

        const config = {
          headers: {
            accept: 'application/json',
            'Content-Type': `multipart/form-data`,
          },
        }

        await apiv1.post(`central/${data.id}/updateLogo`, formData, config)
      } catch (err) {
        console.error('Erro ao atualizar logo da central:', err)
      }
    }

    let addressStr = ''
    let lat = data.latitude
    let lng = data.longitude

    if (typeof values.address === 'object' && values.address !== null) {
      addressStr = values.address.address || values.address.adress || place || data.address || ''
      if (values.address.latitude !== undefined && values.address.latitude !== null && values.address.latitude !== '') {
        lat = Number(values.address.latitude)
      }
      if (values.address.longitude !== undefined && values.address.longitude !== null && values.address.longitude !== '') {
        lng = Number(values.address.longitude)
      }
    } else if (typeof values.address === 'string' && values.address) {
      addressStr = values.address
    } else {
      addressStr = place || data.address || ''
    }

    if (place && !addressStr) {
      addressStr = place
    }

    const payload: any = {
      name: values.name,
      address: addressStr,
      centralCallDriver: values.centralCallDriver,
      showAllPrices: Boolean(values.showAllPrices),
      syncCustomers: Boolean(values.syncCustomers),
      enableCustomRadiusCentral: values.enableCustomRadiusCentral ? 1 : 0,
      placesSearchRadius: values.enableCustomRadiusCentral && values.placesSearchRadius ? Number(values.placesSearchRadius) : null,
      discount_type: values.discount_type || null,
      discount_value: values.discount_value ? Number(values.discount_value) : null,
    }

    if (lat !== undefined && lat !== null && lat !== '') {
      payload.latitude = Number(lat)
    }
    if (lng !== undefined && lng !== null && lng !== '') {
      payload.longitude = Number(lng)
    }

    api
      .put(`central/${data.id}`, payload)
      .then(({ data: resData }) => {
        setLoading(false)
        if (!resData.status) {
          setMessageAlert(resData.message || 'Ocorreu um erro, tente novamente')
          setTypeAlert('error')
          setShowAlert(true)
          return
        }

        setMessageAlert('Dados atualizados com sucesso!')
        setTypeAlert('success')
        setShowAlert(true)
        setVisible(false)
        setData({})
        setRenderImage(false)
        setWhatRender('')
        setPlace('')
        form.resetFields()
        getCentral()
      })
      .catch((error) => {
        setLoading(false)
        setMessageAlert(error.response?.data?.message || 'Erro ao atualizar central, tente novamente')
        setTypeAlert('error')
        setShowAlert(true)
      })
  }

  const fetchCoordinates = async (address: string) => {
    const response = await apiApp.get(`/Geocoding/search?address=${encodeURIComponent(address)}`)
    if (response.data && response.data.data) {
      return {
        lat: response.data.data.latitude,
        lng: response.data.data.longitude,
      }
    } else {
      throw new Error('Erro ao buscar coordenadas')
    }
  }

  const getPlaces = async () => {
    const value = form.getFieldValue('address')
    if (value !== '') {
      apiApp(`Place/Search?q=${value}&latlng=${positionCity[0].lat},${positionCity[0].lng}`).then(
        (result) => {
          setListPlaces(result.data.data)
        }
      )
    }
  }

  return (
    <Modal
      title={Object.keys(data).length !== 0 ? 'Editar central' : 'Cadastrar central'}
      open={visible}
      footer={null}
      onCancel={() => {
        setVisible(false)
        setData({})
        form.resetFields()
        setSelectedFile(null)
        setWhatRender('')
        setPlace('')
      }}
      afterClose={() => {
        setVisible(false)
        setData({})
        form.resetFields()
        setSelectedFile(null)
        setWhatRender('')
        setPlace('')
      }}
      destroyOnClose
      style={{ left: 100 }}
    >
      <Form
        form={form}
        onFinish={(e) => (isEdit ? editCentral(e) : handleCreate(e))}
        layout='vertical'
        name='form'
        initialValues={{ syncCustomers: false }}
      >
        {selectedFile && (
          <img
            src={isEdit && !renderImage ? (selectedFile as string) : whatRender}
            style={{
              width: '80%',
              height: 150,
              borderRadius: 5,
            }}
            alt='Ícone do chamado'
          />
        )}
        <Form.Item
          name='image'
          label='Imagem da central'
          valuePropName='file'
          rules={[
            {
              required: !isEdit && !selectedFile,
              message: 'Insira a imagem da central',
            },
          ]}
        >
          <Input
            type='file'
            name='file'
            accept='.png, .jpg, .svg, .jpeg'
            onChange={(e) => {
              setRenderImage(true)
              setSelectedFile(e.target.files)
            }}
          />
        </Form.Item>

        <Form.Item
          name='name'
          label='Nome da central'
          rules={[
            {
              required: true,
              message: 'Insira o nome da central',
            },
          ]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          name='address'
          label='Endereço da central'
          rules={[
            {
              validator: async () => {
                const currentPlace = place || form.getFieldValue('address')
                if (!currentPlace || (typeof currentPlace === 'object' && !currentPlace.address)) {
                  throw new Error('Insira o endereço da central')
                }
              },
            },
          ]}
        >
          <div style={{ display: 'flex' }}>
            <Input
              value={place}
              onChange={(e) => {
                setPlace(e.target.value)
                form.setFieldValue('address', e.target.value)
              }}
            />
            <Button type='primary' onClick={getPlaces}>
              Pesquisar
            </Button>
          </div>
        </Form.Item>
        <div style={{ marginBottom: 10 }}>
          {listPlaces?.length !== 0 &&
            listPlaces?.map((item: any) => (
              <ButtonSelectAddress
                type='default'
                onClick={async () => {
                  const selectedAddress = item.address
                  const coordinates = await fetchCoordinates(selectedAddress)

                  form.setFieldValue('address', {
                    address: selectedAddress,
                    latitude: coordinates.lat,
                    longitude: coordinates.lng,
                  })

                  setPlace(selectedAddress)
                  setListPlaces([])
                }}
              >
                {item.address}
              </ButtonSelectAddress>
            ))}
        </div>
        <Form.Item
          name='centralCallDriver'
          label='Formas de chamado de motorista'
          rules={[
            {
              required: true,
              message: 'Insira o nome da central',
            },
          ]}
        >
          <Select onChange={(e) => form.setFieldValue('centralCallDriver', e)} defaultValue=''>
            <Option key={0} value=''>
              Selecione um tipo de chamado
            </Option>
            <Option key={1} value='all'>
              {callDriverTypes.all}
            </Option>
            <Option key={2} value='only_app'>
              {callDriverTypes.only_app}
            </Option>
            <Option key={3} value='only_central_drivers'>
              {callDriverTypes.only_central_drivers}
            </Option>
          </Select>
        </Form.Item>
        <Form.Item name='syncCustomers' valuePropName='checked'>
          <Checkbox onChange={(e) => form.setFieldValue('syncCustomers', e.target.checked)}>
            Unificar clientes da central junto com da plataforma
          </Checkbox>
        </Form.Item>

        <Form.Item name='showAllPrices' initialValue={true}>
          <Radio.Group>
            <Radio value={true}>Mostrar todos os preços</Radio>
            <Radio value={false}>Mostrar apenas preços da central</Radio>
          </Radio.Group>
        </Form.Item>

        <Form.Item name='enableCustomRadiusCentral' valuePropName='checked' initialValue={false}>
          <Checkbox
            onChange={(e) => {
              const checked = e.target.checked
              form.setFieldValue('enableCustomRadiusCentral', checked)
              setEnableCustomRadius(checked)
              if (!checked) {
                form.setFieldValue('placesSearchRadius', null)
              }
            }}
          >
            Personalizar área de cobertura
          </Checkbox>
        </Form.Item>

        <Form.Item
          name='placesSearchRadius'
          label='Distância máxima de atendimento (km)'
          rules={[
            {
              required: enableCustomRadius,
              message: 'Insira a distância máxima de atendimento',
            },
          ]}
        >
          <Input type='number' min={0} disabled={!enableCustomRadius} placeholder='Ex: 50' />
        </Form.Item>

        <Form.Item
          name='discount_type'
          label='Tipo de desconto (Habilitado para cobrir preço de concorrentes)'
        >
          <Select onChange={(e) => form.setFieldValue('discount_type', e)} defaultValue='%'>
            <Option key={0} value=''>
              Selecione um tipo
            </Option>
            <Option key={1} value='%'>
              %
            </Option>
            <Option key={2} value='$'>
              $
            </Option>
          </Select>
        </Form.Item>

        <Form.Item
          name='discount_value'
          label='Valor máximo de desconto'
        >
          <Input type='number' min={0} placeholder='Ex: 50' />
        </Form.Item>

        {!isEdit && (
          <>
            <p>Responsável pela central</p>
            <Form.Item>
              <Radio.Group
                value={userMode}
                onChange={(e) => setUserMode(e.target.value)}
              >
                <Radio value='existing'>Usar usuário existente</Radio>
                <Radio value='new'>Cadastrar novo usuário</Radio>
              </Radio.Group>
            </Form.Item>

            {userMode === 'existing' ? (
              <Form.Item label='Usuário'>
                <SelectSearch
                  placeholder='Selecione ou busque um usuário'
                  options={eligibleUsers}
                  onSearch={handleSearchEligibleUsers}
                  onChange={setResponsibleId}
                  onPopupScroll={handleEligibleScroll}
                  loading={eligibleLoading}
                  width='100%'
                  value={responsibleId}
                />
              </Form.Item>
            ) : (
              <>
                <Form.Item
                  name='responsibleName'
                  label='Nome'
                  rules={[
                    {
                      required: userMode === 'new',
                      message: 'Insira o nome do responsável',
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name='responsibleEmail'
                  label='E-mail'
                  rules={[
                    {
                      required: userMode === 'new',
                      message: 'Insira o e-mail do responsável',
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name='phone'
                  label='Telefone'
                  rules={[
                    {
                      required: userMode === 'new',
                      message: 'Insira o telefone do responsável',
                    },
                  ]}
                >
                  <Input />
                </Form.Item>
                <Form.Item
                  name='password'
                  label='Senha'
                  rules={[
                    {
                      required: userMode === 'new',
                      message: 'Insira a senha',
                    },
                  ]}
                >
                  <Input type='password' />
                </Form.Item>
              </>
            )}
          </>
        )}
        <Button type='primary' htmlType='submit' loading={loading}>
          {isEdit ? 'Salvar' : 'Criar central'}
        </Button>
      </Form>
    </Modal>
  )
}
