import { useRef, useCallback, useState } from 'react';
import { ActivityIndicator, Platform, View } from 'react-native';
import { MaterialIcons } from '@expo/vector-icons';
import QRCode from 'react-native-qrcode-svg';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import * as Print from 'expo-print';
import { useTheme } from 'styled-components';
import { QRCodeRef, DELAY_BEFORE_DELETE_MS, QRCODE_SIZE } from './types';
import {
    Container,
    Content,
    ShareableContent,
    HeaderCard,
    HeaderTitle,
    VehicleName,
    PlateContainer,
    PlateText,
    QRCodeSection,
    QRCodeWrapper,
    InstructionText,
    FooterCard,
    FooterText,
    ShareButton,
    ShareButtonText,
} from './styles';
import { useUserDriver } from '../../context/userDriver';
import { buildApp } from '../../../../constantBuild/config';
import { translate } from '../../../../client/locales';
import { customToast } from '../../../../utils/FlashMessage';
import { pulse } from '../../../../../lib/pulse';

// QR Code Fiscalização Component
export function QRCodeFiscalizacao() {
    const { userDriverFind } = useUserDriver();
    const theme = useTheme();
    const colors = theme?.colors || { primary: '#00349a' };
    const qrCodeRef = useRef<QRCodeRef | null>(null);
    const [isSharing, setIsSharing] = useState<boolean>(false);

    const baseUrl = buildApp().HOST_SITE;
    const baseUrlFormatted = baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
    const driverId = userDriverFind?.idDriver;
    const qrcodeUrl = driverId ? `${baseUrlFormatted}/audit?q=${driverId}` : '';

    const carBrand = userDriverFind?.car?.brand || '';
    const carModel = userDriverFind?.car?.model || '';
    const carPlate = userDriverFind?.car?.plate || '';
    const vehicleInfo = carBrand || carModel ? `${carBrand} ${carModel}`.trim() : 'Veículo';

    const generateQRCodeAsBase64 = useCallback((): Promise<string> => {
        return new Promise((resolve, reject) => {
            if (!qrCodeRef.current) {
                reject(new Error('QRCode não está disponível'));
                return;
            }
            try {
                qrCodeRef.current.toDataURL((dataURL: string) => {
                    if (dataURL) {
                        resolve(dataURL);
                    } else {
                        reject(new Error('Falha ao gerar QRCode'));
                    }
                });
            } catch (error) {
                reject(error);
            }
        });
    }, []);

    const createHtmlContent = useCallback((qrCodeBase64: string, headerTitle: string, footerText: string): string => {
        const primaryColor = colors.primary || '#00349a';
        const qrCodeDataUri = qrCodeBase64.startsWith('data:')
            ? qrCodeBase64
            : `data:image/png;base64,${qrCodeBase64}`;

        return `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    @page { 
      margin: 0;
      padding: 0;
      size: 148mm 210mm;
      border: none;
      marks: none;
      bleed: 0;
      crop: none;
    }
    * { 
      margin: 0; 
      padding: 0; 
      box-sizing: border-box; 
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    html {
      width: 148mm;
      height: 210mm;
      margin: 0;
      padding: 0;
      border: none;
      overflow: hidden;
    }
    body {
      width: 148mm;
      height: 210mm;
      margin: 0;
      padding: 0;
      overflow: visible;
      border: none;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Helvetica Neue', Arial, sans-serif;
      background: white;
      display: block;
      position: relative;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
    }
    img {
      border: none;
      outline: none;
      padding: 0;
      margin: 0;
      max-width: 100%;
      height: auto;
      display: block;
      image-rendering: -webkit-optimize-contrast;
      image-rendering: crisp-edges;
    }
    .card {
      background: white;
      border-radius: 0;
      box-shadow: none;
      overflow: hidden;
      width: 559px;
      height: 794px;
      min-width: 559px;
      min-height: 794px;
      border: none;
      outline: none;
      display: flex;
      flex-direction: column;
      margin: 0;
      padding: 0;
      position: absolute;
      top: 0px;
      left: 0px;
      right: 0px;
      bottom: 0px;
    }
    .header {
      background: linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}dd 100%);
      padding: 30px 0;
      text-align: center;
      color: white;
      flex-shrink: 0;
      width: 559px;
      min-width: 559px;
      position: absolute;
      top: 0px;
      left: 0px;
      right: 0px;
      margin: 0;
      padding-left: 0;
      padding-right: 0;
      border: none;
      outline: none;
      border-top-left-radius: 12px;
      border-top-right-radius: 12px;
      z-index: 10;
    }
    .header::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: rgba(255, 255, 255, 0.3);
    }
    .header-title {
      font-size: clamp(26px, 7vw, 42px);
      font-weight: 800;
      margin-bottom: 3%;
      padding: 0 4%;
      text-transform: uppercase;
      line-height: 1.15;
      letter-spacing: 0.5px;
      text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    }
    .vehicle-name {
      font-size: clamp(24px, 6.5vw, 38px);
      font-weight: 600;
      margin-bottom: 4%;
      padding: 0 4%;
      opacity: 0.98;
      line-height: 1.25;
      letter-spacing: 0.3px;
    }
    .plate-container {
      background: rgba(255, 255, 255, 0.28);
      border-radius: 12px;
      padding: 2.5% 6%;
      display: inline-block;
      margin-top: 2%;
      box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
      border: 1px solid rgba(255, 255, 255, 0.4);
    }
    .plate {
      font-size: clamp(26px, 7vw, 42px);
      font-weight: 800;
      letter-spacing: 3px;
      color: white;
      line-height: 1.2;
      text-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
    }
    .qr-section {
      padding: 3% 3%;
      text-align: center;
      background: #ffffff;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      width: 100%;
      margin: 0;
      position: absolute;
      top: 34%;
      left: 0;
      right: 0;
      bottom: 12%;
      padding-top: 3%;
      padding-bottom: 3%;
    }
    .qr-wrapper {
      display: block;
      margin: 0 auto;
      line-height: 0;
      width: 75%;
      max-width: 75%;
      text-align: center;
      padding: 8px;
      background: white;
      border: 3px solid ${primaryColor};
      border-radius: 12px;
    }
    .qr-wrapper img {
      display: block;
      width: 100%;
      max-width: 100%;
      height: auto;
      aspect-ratio: 1 / 1;
      object-fit: contain;
      object-position: center;
      margin: 0 auto;
      padding: 0;
      border: none;
      border-radius: 8px;
    }
    .footer {
      background: linear-gradient(135deg, ${primaryColor} 0%, ${primaryColor}dd 100%);
      color: white;
      padding: 25px 0;
      text-align: center;
      font-size: clamp(20px, 5.5vw, 32px);
      font-weight: 600;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      width: 559px;
      min-width: 559px;
      line-height: 1.5;
      position: absolute;
      bottom: 0px;
      left: 0px;
      right: 0px;
      letter-spacing: 0.3px;
      margin: 0;
      padding-left: 0;
      padding-right: 0;
      border: none;
      outline: none;
      border-bottom-left-radius: 12px;
      border-bottom-right-radius: 12px;
      z-index: 10;
    }
    .footer::before {
      content: '';
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      height: 3px;
      background: rgba(255, 255, 255, 0.3);
    }
    .footer-icon {
      margin-right: 3%;
      font-size: clamp(24px, 6vw, 36px);
      flex-shrink: 0;
      filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.2));
    }
    .footer span:last-child {
      padding: 0 4%;
    }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <div class="header-title">${escapeHtml(headerTitle)}</div>
      <div class="vehicle-name">${escapeHtml(vehicleInfo)}</div>
      <div class="plate-container">
        <div class="plate">${escapeHtml(carPlate)}</div>
      </div>
    </div>
    <div class="qr-section">
      <div class="qr-wrapper">
        <img src="${qrCodeDataUri}" alt="QR Code" />
      </div>
    </div>
    <div class="footer">
      <span class="footer-icon">✓</span>
      <span>${escapeHtml(footerText)}</span>
    </div>
  </div>
</body>
</html>`;
    }, [colors.primary, vehicleInfo, carPlate]);

    const deleteFileAsync = useCallback(async (uri: string): Promise<void> => {
        try {
            await FileSystem.deleteAsync(uri, { idempotent: true });
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            pulse.send('warn', `Falha ao deletar PDF: ${errorMessage}`, 'qrcode-fiscalizacao');
        }
    }, []);

    const handleShare = useCallback(async () => {
        if (isSharing || !qrcodeUrl) {
            if (!qrcodeUrl) {
                customToast(translate('audit.qrcode_not_generated') || 'QR Code não gerado', 'warning');
            }
            return;
        }

        setIsSharing(true);
        let pdfUri: string | null = null;

        const driverName = userDriverFind?.name?.trim() || translate('audit.header_title') || 'Motorista';
        const footerText = translate('audit.footer') || 'Código válido para fiscalização';

        try {
            const qrCodeBase64 = await generateQRCodeAsBase64();
            const htmlContent = createHtmlContent(qrCodeBase64, driverName, footerText);

            const { uri } = await Print.printToFileAsync({
                html: htmlContent,
                base64: false,
            });
            pdfUri = uri;

            const isAvailable = await Sharing.isAvailableAsync();
            if (!isAvailable) {
                customToast(translate('audit.share_error') || 'Erro ao compartilhar', 'danger');
                if (pdfUri) {
                    deleteFileAsync(pdfUri).catch((err) => {
                        pulse.send('warn', `Falha ao deletar PDF: ${err}`, 'qrcode-fiscalizacao');
                    });
                }
                return;
            }

            await Sharing.shareAsync(pdfUri, {
                mimeType: 'application/pdf',
                dialogTitle: translate('audit.title') || 'Compartilhar QR Code',
                UTI: Platform.OS === 'ios' ? 'com.adobe.pdf' : undefined,
            });

            setTimeout(() => {
                if (pdfUri) {
                    deleteFileAsync(pdfUri).catch((err) => {
                        pulse.send('warn', `Falha ao deletar PDF: ${err}`, 'qrcode-fiscalizacao');
                    });
                }
            }, DELAY_BEFORE_DELETE_MS);
        } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            console.error('Erro ao compartilhar:', errorMessage);
            pulse.send('error', `Erro ao compartilhar QRCode: ${errorMessage}`, 'qrcode-fiscalizacao');
            customToast(translate('audit.share_error') || 'Erro ao compartilhar', 'danger');
            if (pdfUri) {
                deleteFileAsync(pdfUri).catch((err) => {
                    pulse.send('warn', `Falha ao deletar PDF: ${err}`, 'qrcode-fiscalizacao');
                });
            }
        } finally {
            setIsSharing(false);
        }
    }, [isSharing, qrcodeUrl, generateQRCodeAsBase64, createHtmlContent, deleteFileAsync, translate, userDriverFind]);

    const driverName = userDriverFind?.name?.trim() || translate('audit.header_title') || 'Motorista';
    const instructionText = translate('audit.instruction') || 'Apresente este QRCode ao fiscal de trânsito';
    const footerText = translate('audit.footer') || 'Código válido para fiscalização';
    const shareButtonText = translate('audit.share_btn') || 'Compartilhar QR Code';

    return (
        <Container>
            <Content>
                <ShareableContent>
                    <HeaderCard>
                        <HeaderTitle>{driverName}</HeaderTitle>
                        <VehicleName>{vehicleInfo}</VehicleName>
                        <PlateContainer>
                            <PlateText>{carPlate}</PlateText>
                        </PlateContainer>
                    </HeaderCard>

                    <QRCodeSection>
                        <QRCodeWrapper>
                            {qrcodeUrl ? (
                                <QRCode
                                    value={qrcodeUrl}
                                    size={QRCODE_SIZE}
                                    color="#000000"
                                    backgroundColor="#FFFFFF"
                                    quietZone={0}
                                    getRef={(ref) => (qrCodeRef.current = ref)}
                                />
                            ) : (
                                <View style={{ width: QRCODE_SIZE, height: QRCODE_SIZE, justifyContent: 'center', alignItems: 'center' }}>
                                    <ActivityIndicator size="large" color={colors.primary} />
                                </View>
                            )}
                        </QRCodeWrapper>
                        <InstructionText>{instructionText}</InstructionText>
                    </QRCodeSection>

                    <FooterCard>
                        <MaterialIcons name="verified" size={18} color="#FFFFFF" />
                        <FooterText>{footerText}</FooterText>
                    </FooterCard>
                </ShareableContent>

                <ShareButton onPress={handleShare} activeOpacity={0.8} disabled={isSharing}>
                    {isSharing ? (
                        <ActivityIndicator size="small" color="#FFF" />
                    ) : (
                        <MaterialIcons name="share" size={24} color="#FFF" />
                    )}
                    <ShareButtonText>{shareButtonText}</ShareButtonText>
                </ShareButton>
            </Content>
        </Container>
    );
}

function escapeHtml(text: string): string {
    if (!text) return '';
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
