import React, { useState, useEffect } from 'react';
import { Modal, Select } from 'antd';
import { Container, Content, Header, Title, DataCard, DataSection, KeyList, KeyItem, FormSection, FormRow, Input, SwitchDefault, SmallButton, SubmitRow } from './styles';
import apiWhatsappMobilidade from '../../services/apiWhatsAppMobilidade';

const MAP_TYPE_OPTIONS = [
  { label: 'Google', value: 'google' },
  { label: 'Here', value: 'here' },
  { label: 'Mapbox', value: 'mapbox' },
];

interface MapKey {
  id: string;
  key: string;
  type: string;
  isDefault: boolean;
  clientId: string;
}

interface ClientData {
  id: string;
  name: string;
  appName: string;
  appNameAlias: string;
  email: string;
  phone: string;
  isActive: boolean;
  createdAt: string;
  MapKey: MapKey[];
}

const KeysWhatsapp: React.FC = () => {
  const [clientData, setClientData] = useState<ClientData | null>(null);
  const [creating, setCreating] = useState<boolean>(false);
  const [pendingKeyId, setPendingKeyId] = useState<string | null>(null);
  const [saving, setSaving] = useState<boolean>(false);

  type NewMap = { key: string; type: string; isDefault: boolean };
  const [name, setName] = useState<string>("");
  const [appNameAlias, setAppNameAlias] = useState<string>("");
  const [appName, setAppName] = useState<string>("");
  const [email, setEmail] = useState<string>("");
  const [phone, setPhone] = useState<string>("");
  const [maps, setMaps] = useState<NewMap[]>([
    { key: "", type: "", isDefault: false },
  ]);
  let sessionName = import.meta.env.PROJECT_NAME_ALIAS.toString();

  if(sessionName == null || sessionName == undefined || sessionName == ""){
    sessionName = import.meta.env.PROJECT_NAME.toString();
  }


  if(sessionName == null || sessionName == undefined || sessionName == ""){
    sessionName = import.meta.env.PROJECT_NAME.toString();
  }
  
  useEffect(() => {
    const fetchClientData = async () => {
      const userData = localStorage.getItem('@App:user');
      const parsedUser = userData ? JSON.parse(userData) : null;
      setEmail(parsedUser?.email || '');
      setAppNameAlias(sessionName || '');
      setAppName(sessionName || '');
        try {
        
        const response = await apiWhatsappMobilidade.get('/admin/client/'+sessionName);
        setClientData(response.data);
      } catch (err) {
        console.error('Erro ao buscar dados do cliente:', err);
      }
    };

    fetchClientData();
  }, []);


  const handleAddMap = () => {
    setMaps((prev) => [...prev, { key: "", type: "", isDefault: false }]);
  };

  const handleRemoveMap = (index: number) => {
    setMaps((prev) => prev.filter((_, i) => i !== index));
  };

  const handleMapChange = (index: number, field: keyof NewMap, value: string | boolean) => {
    setMaps((prev) =>
      prev.map((m, i) => {
        if (i !== index) return m;
        if (field === 'isDefault' && value === true) {
          return { ...m, isDefault: true };
        }
        // Garantir que o tipo seja sempre minúsculo
        if (field === 'type' && typeof value === 'string') {
          return { ...m, [field]: value.toLowerCase() } as NewMap;
        }
        return { ...m, [field]: value } as NewMap;
      })
    );
    if (field === 'isDefault' && value === true) {
      setMaps((prev) => prev.map((m, i) => (i === index ? m : { ...m, isDefault: false })));
    }
  };

  const handleSubmitCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreating(true);
    try {
      if (clientData) {
        const payload = {
          maps,
          appNameAlias: clientData.appNameAlias,
        };
        await apiWhatsappMobilidade.patch('/admin/client', payload);
        const res = await apiWhatsappMobilidade.get(`/admin/client/${clientData.appNameAlias}`);
        setClientData(res.data);
      } else {
        const payload = {
          maps,
          name,
          appNameAlias,
          appName,
          email,
          phone,
        };
        console.log('POST payload:', payload);
        await apiWhatsappMobilidade.post('/admin/client', payload);
        const res = await apiWhatsappMobilidade.get(`/admin/client/${name}`);
        setClientData(res.data);
        setName("");
        setAppNameAlias("");
        setAppName("");
        setEmail("");
        setPhone("");
        setMaps([{ key: "", type: "", isDefault: false }]);
      }
    } finally {
      setCreating(false);
    }
  };


  const handleRequestChangeDefault = (targetId: string) => {
    if (!clientData) return;
    const target = clientData.MapKey.find(k => k.id === targetId);
    if (!target) return;

    if (target.isDefault) return; // já é a ativa
    setPendingKeyId(targetId);
  };

  const confirmChangeDefault = async () => {
    if (!clientData || !pendingKeyId) return;
    const target = clientData.MapKey.find(k => k.id === pendingKeyId);
    if (!target) return;
    
    const previous = clientData.MapKey;
    
    // atualização otimista
    const optimist = previous.map(k => ({ ...k, isDefault: k.id === pendingKeyId }));
    setClientData({ ...clientData, MapKey: optimist });
    setSaving(true);

    try {
      const updatedMaps = maps.map(m => ({
        key: m.key,
        type: m.type,
        isDefault: m.key === target.key
      }));
      
      const payload = {
        maps: updatedMaps,
        appNameAlias: clientData.appNameAlias,
      };
      await apiWhatsappMobilidade.patch('/admin/client', payload);
      setPendingKeyId(null);
    } catch (e) {
      setClientData({ ...clientData, MapKey: previous });
      setPendingKeyId(null);
    } finally {
      setSaving(false);
    }
  };

  const cancelChangeDefault = () => setPendingKeyId(null);



  return (
    <Container>
      <Content>
        <Header>
          <Title>Gerenciamento de chaves chamado WhatsApp</Title>
        </Header>
        
        <FormSection onSubmit={handleSubmitCreate}>
          <h3>Cadastrar cliente e chaves</h3>
          <FormRow>
            <label>Nome</label>
            <Input value={name} onChange={(e) => setName(e.target.value)}  required />
          </FormRow>
          <FormRow>
            <label>Nome do App</label>
            <Input value={appName} onChange={(e) => setAppName(e.target.value)} required />
          </FormRow>
          <FormRow>
            <label>Email</label>
            <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="email@exemplo.com" required />
          </FormRow>
          <FormRow>
            <label>Telefone</label>
            <Input maxLength={11} value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="48999999999" required />
          </FormRow>

          <h4>Chaves (maps)</h4>
          {maps.map((m, index) => (
            <FormRow key={index}>
              <label>Tipo</label>
              <Select
                value={m.type || undefined}
                onChange={(value) => handleMapChange(index, 'type', value)}
                placeholder="Selecione o tipo de mapa"
                style={{ minWidth: 300 }}
                options={MAP_TYPE_OPTIONS}
              />
              <label style={{ width: '56px', marginLeft: '40px' }}>Chave</label>
              <Input value={m.key} onChange={(e) => handleMapChange(index, 'key', e.target.value)} required />
              <label style={{ marginLeft: '32px', width: '44px' }}>Padrão</label>
              <SwitchDefault
                type="checkbox"
                checked={m.isDefault}
                onChange={(e) => handleMapChange(index, 'isDefault', e.target.checked)}
              />
              <SmallButton type="button" onClick={() => handleRemoveMap(index)} disabled={maps.length === 1}>
                Remover
              </SmallButton>
            </FormRow>
          ))}
            <SubmitRow>
              <SmallButton type="button" onClick={handleAddMap}>Adicionar chave</SmallButton>            
              <SmallButton type="submit" disabled={creating}>{creating ? 'Salvando...' : 'Salvar'}</SmallButton>
            </SubmitRow>
        </FormSection>

        {clientData && clientData.MapKey.length > 0 && (
  <DataSection>
    {clientData.MapKey.map((mapKey) => (
      <DataCard key={mapKey.id}>
        <h3>Chaves do WhatsApp</h3>
        <KeyList>
          <KeyItem
            isDefault={mapKey.isDefault}
            onClick={() => handleRequestChangeDefault(mapKey.id)}
            title={mapKey.isDefault ? 'Chave ativa' : 'Clique para tornar ativa'}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div><strong>Tipo:</strong> {mapKey.type}</div>
              {mapKey.isDefault && <span className="activeTag">ATIVA</span>}
            </div>
            <div>
              <strong>Chave:</strong> {mapKey.key}
            </div>
            <div>
              <strong>Padrão:</strong> {mapKey.isDefault ? 'Sim' : 'Não'}
            </div>
          </KeyItem>
        </KeyList>
      </DataCard>
    ))}
  </DataSection>
)}

        <Modal
          open={!!pendingKeyId}
          onOk={confirmChangeDefault}
          onCancel={cancelChangeDefault}
          okButtonProps={{ loading: saving }}
          cancelButtonProps={{ disabled: saving }}
          title="Confirmar alteração de chave"
        >
          Tem certeza que deseja definir esta chave como ativa? Esta ação substituirá a chave ativa atual.
        </Modal>
      </Content>
    </Container>
  );
};

export default KeysWhatsapp;
