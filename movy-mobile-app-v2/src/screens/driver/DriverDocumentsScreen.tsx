import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Alert } from 'react-native';
import { MOVY_THEME } from '../../theme/colors';
import { i18n } from '../../i18n';
import { MovyApiService } from '../../services/api';

interface DriverDocumentsScreenProps {
  onBack: () => void;
}

export const DriverDocumentsScreen: React.FC<DriverDocumentsScreenProps> = ({ onBack }) => {
  const country = i18n.getCountry();

  const [documents, setDocuments] = useState<any[]>(
    country === 'US'
      ? [
          {
            id: 'dl_front',
            title: "Driver's License (Front)",
            desc: 'Clear photo of your valid US Driver License',
            status: 'approved',
          },
          {
            id: 'dl_back',
            title: "Driver's License (Back)",
            desc: 'Barcode and security holograms visible',
            status: 'approved',
          },
          {
            id: 'registration',
            title: 'Vehicle Registration',
            desc: 'Valid state vehicle registration card',
            status: 'approved',
          },
          {
            id: 'insurance',
            title: 'Auto Insurance Policy',
            desc: 'Policy card showing active coverage',
            status: 'pending',
          },
        ]
      : [
          {
            id: 'cnh_front',
            title: 'CNH com EAR (Frente)',
            desc: 'Foto legível da sua Carteira Nacional de Habilitação',
            status: 'approved',
          },
          {
            id: 'cnh_back',
            title: 'CNH (Verso com QR Code)',
            desc: 'Verso legível com o código de segurança',
            status: 'approved',
          },
          {
            id: 'crlv',
            title: 'CRLV do Veículo',
            desc: 'Certificado de Registro e Licenciamento anual',
            status: 'approved',
          },
          {
            id: 'antecedentes',
            title: 'Atestado de Antecedentes',
            desc: 'Certidão negativa de antecedentes criminais',
            status: 'pending',
          },
        ]
  );

  const handleUploadDoc = (docId: string, docTitle: string) => {
    Alert.alert(
      country === 'US' ? 'Upload Document' : 'Enviar Documento',
      country === 'US'
        ? `Select source for "${docTitle}":`
        : `Selecione a origem para "${docTitle}":`,
      [
        {
          text: country === 'US' ? 'Camera' : 'Tirar Foto',
          onPress: () => simulateUpload(docId),
        },
        {
          text: country === 'US' ? 'Photo Library' : 'Galeria de Fotos',
          onPress: () => simulateUpload(docId),
        },
        { text: 'Cancelar', style: 'cancel' },
      ]
    );
  };

  const simulateUpload = (docId: string) => {
    setDocuments((prev) =>
      prev.map((d) => (d.id === docId ? { ...d, status: 'pending' } : d))
    );
    Alert.alert(
      country === 'US' ? 'Upload Received' : 'Envio Concluído',
      country === 'US'
        ? 'Document uploaded! Compliance team will verify within 24 hours.'
        : 'Documento enviado com sucesso! Nossa equipe analisará em até 24h.'
    );
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.backButtonText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>
          {country === 'US' ? 'Driver Documents & Compliance' : 'Documentos do Motorista'}
        </Text>
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* Banner de Status Geral */}
        <View style={styles.statusBanner}>
          <View style={styles.statusDot} />
          <View style={{ flex: 1, marginLeft: 10 }}>
            <Text style={styles.statusBannerTitle}>
              {country === 'US' ? 'ACCOUNT ACTIVE & AUTHORIZED' : 'CONTA ATIVA E AUTORIZADA'}
            </Text>
            <Text style={styles.statusBannerSub}>
              {country === 'US'
                ? 'All primary documents verified. You can go online anytime.'
                : 'Documentos essenciais verificados. Você está apto a receber corridas.'}
            </Text>
          </View>
        </View>

        {/* Lista de Documentos */}
        {documents.map((doc) => {
          const isApproved = doc.status === 'approved';
          return (
            <View key={doc.id} style={styles.docCard}>
              <View style={{ flex: 1 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={styles.docTitle}>{doc.title}</Text>
                  <View
                    style={[
                      styles.statusBadge,
                      isApproved ? styles.statusBadgeApproved : styles.statusBadgePending,
                    ]}
                  >
                    <Text
                      style={[
                        styles.statusBadgeText,
                        isApproved ? styles.statusTextApproved : styles.statusTextPending,
                      ]}
                    >
                      {isApproved
                        ? country === 'US' ? 'VERIFIED' : 'APROVADO'
                        : country === 'US' ? 'UNDER REVIEW' : 'EM ANÁLISE'}
                    </Text>
                  </View>
                </View>
                <Text style={styles.docDesc}>{doc.desc}</Text>
              </View>

              <TouchableOpacity
                style={styles.uploadBtn}
                onPress={() => handleUploadDoc(doc.id, doc.title)}
              >
                <Text style={styles.uploadBtnText}>
                  {isApproved ? (country === 'US' ? 'Update' : 'Atualizar') : (country === 'US' ? 'Upload' : 'Enviar')}
                </Text>
              </TouchableOpacity>
            </View>
          );
        })}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: MOVY_THEME.colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderColor: '#1E293B',
  },
  backButton: {
    padding: 8,
    marginRight: 12,
  },
  backButtonText: {
    color: '#FFF',
    fontSize: 22,
    fontWeight: '800',
  },
  headerTitle: {
    color: '#FFF',
    fontSize: 18,
    fontWeight: '800',
  },
  content: {
    padding: 20,
  },
  statusBanner: {
    flexDirection: 'row',
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#10B981',
    alignItems: 'center',
    marginBottom: 20,
  },
  statusDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10B981',
  },
  statusBannerTitle: {
    color: '#10B981',
    fontSize: 13,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  statusBannerSub: {
    color: '#CBD5E1',
    fontSize: 11,
    marginTop: 2,
  },
  docCard: {
    flexDirection: 'row',
    backgroundColor: '#0F1426',
    borderRadius: 16,
    padding: 18,
    borderWidth: 1,
    borderColor: '#1E293B',
    marginBottom: 14,
    alignItems: 'center',
  },
  docTitle: {
    color: '#FFF',
    fontSize: 15,
    fontWeight: '800',
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
    marginLeft: 8,
  },
  statusBadgeApproved: {
    backgroundColor: 'rgba(16, 185, 129, 0.2)',
  },
  statusBadgePending: {
    backgroundColor: 'rgba(245, 158, 11, 0.2)',
  },
  statusBadgeText: {
    fontSize: 9,
    fontWeight: '900',
    letterSpacing: 0.5,
  },
  statusTextApproved: {
    color: '#10B981',
  },
  statusTextPending: {
    color: '#F59E0B',
  },
  docDesc: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 4,
  },
  uploadBtn: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: MOVY_THEME.colors.brandCyan,
    marginLeft: 10,
  },
  uploadBtnText: {
    color: MOVY_THEME.colors.brandCyan,
    fontSize: 12,
    fontWeight: '800',
  },
});
