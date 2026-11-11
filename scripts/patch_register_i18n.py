import os

def patch_file(filepath):
    print(f"Patching {filepath}...")
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Fix I18n import
    if "import I18n," not in content and "import I18n " not in content:
        content = content.replace(
            "import { translate } from '../../locales';",
            "import I18n, { translate } from '../../locales';"
        )

    # 2. Add t helper inside Register
    helper_def = """  // Perfil selecionado (false = Passageiro, true = Motorista)
  const isPt = (I18n.locale || '').startsWith('pt');
  const t = (enText: string, ptText: string) => (isPt ? ptText : enText);

  const formatCategoryName = (rawName: string) => {
    if (isPt) return rawName;
    const lower = (rawName || '').toLowerCase();
    if (lower.includes('mulher')) return 'Women Driver';
    if (lower.includes('particular')) return 'Private Driver';
    if (lower.includes('mototaxi')) return 'Motorcycle Taxi';
    if (lower.includes('delivery')) return 'Delivery';
    if (lower.includes('entregador')) return 'Courier';
    if (lower.includes('utilit')) return 'Utility Vehicle';
    return rawName;
  };

  const formatCategoryDesc = (rawDesc: string) => {
    if (isPt) return rawDesc;
    const lower = (rawDesc || '').toLowerCase();
    if (lower.includes('mulher')) return 'Exclusive rides for women passengers by women drivers';
    if (lower.includes('particular')) return 'Passenger transportation in private car with comfort';
    if (lower.includes('moto')) return 'Fast rides and motorcycle passenger transport';
    if (lower.includes('delivery') || lower.includes('pacote')) return 'Express deliveries for packages and orders';
    if (lower.includes('mercadoria')) return 'Urban merchandise and package delivery';
    if (lower.includes('utilit')) return 'Cargo and medium haul transport in utility vehicles';
    return rawDesc || 'Professional driving with Movy';
  };"""

    if "const formatCategoryName" not in content:
        content = content.replace(
            "  // Perfil selecionado (false = Passageiro, true = Motorista)",
            helper_def
        )

    # 3. Replacements dictionary
    replacements = [
        # Subtitles & Titles
        ("<HeaderSubtitle>Cadastro Realizado</HeaderSubtitle>",
         "<HeaderSubtitle>{t('Registration Complete', 'Cadastro Realizado')}</HeaderSubtitle>"),
        ("{!isDriver ? 'Cadastro concluído com sucesso!' : 'Cadastro de motorista enviado!'}",
         "{!isDriver ? t('Registration completed successfully!', 'Cadastro concluído com sucesso!') : t('Driver registration submitted!', 'Cadastro de motorista enviado!')}"),
        ("{!isDriver ? 'Entrar na Movy Agora' : 'Ir para Login de Motorista'}",
         "{!isDriver ? t('Sign in to Movy Now', 'Entrar na Movy Agora') : t('Go to Driver Login', 'Ir para Login de Motorista')}"),
        ("{!isDriver ? 'Passo a passo Passageiro' : 'Passo a passo Motorista'}",
         "{!isDriver ? t('Rider Registration', 'Passo a passo Passageiro') : t('Driver Registration', 'Passo a passo Motorista')}"),
        ("<ProfileGridTitle active={!isDriver}>\n                  PASSAGEIRO\n                </ProfileGridTitle>",
         "<ProfileGridTitle active={!isDriver}>\n                  {t('RIDER', 'PASSAGEIRO')}\n                </ProfileGridTitle>"),
        ("<ProfileGridSubtitle active={!isDriver}>\n                  Quero viajar\n                </ProfileGridSubtitle>",
         "<ProfileGridSubtitle active={!isDriver}>\n                  {t('I want to ride', 'Quero viajar')}\n                </ProfileGridSubtitle>"),
        ("<ProfileGridTitle active={isDriver}>\n                  MOTORISTA\n                </ProfileGridTitle>",
         "<ProfileGridTitle active={isDriver}>\n                  {t('DRIVER', 'MOTORISTA')}\n                </ProfileGridTitle>"),
        ("<ProfileGridSubtitle active={isDriver}>\n                  Quero dirigir\n                </ProfileGridSubtitle>",
         "<ProfileGridSubtitle active={isDriver}>\n                  {t('I want to drive', 'Quero dirigir')}\n                </ProfileGridSubtitle>"),

        # Passenger Steps
        ("{passengerStep === 1 && 'Etapa 1 de 3: Identificação'}",
         "{passengerStep === 1 && t('Step 1 of 3: Identification', 'Etapa 1 de 3: Identificação')}"),
        ("{passengerStep === 2 && 'Etapa 2 de 3: Contato e Localização'}",
         "{passengerStep === 2 && t('Step 2 of 3: Contact & Location', 'Etapa 2 de 3: Contato e Localização')}"),
        ("{passengerStep === 3 && 'Etapa 3 de 3: Foto de Perfil e Senha'}",
         "{passengerStep === 3 && t('Step 3 of 3: Profile Photo & Password', 'Etapa 3 de 3: Foto de Perfil e Senha')}"),
        ("<CardHeaderPillText>Cadastro de Passageiro</CardHeaderPillText>",
         "<CardHeaderPillText>{t('Rider Registration', 'Cadastro de Passageiro')}</CardHeaderPillText>"),
        ("<StepCounterBadge>Passo {passengerStep} de 3</StepCounterBadge>",
         "<StepCounterBadge>{t(`Step ${passengerStep} of 3`, `Passo ${passengerStep} de 3`)}</StepCounterBadge>"),
        ("<ModernInputLabel>Nome Completo *</ModernInputLabel>",
         "<ModernInputLabel>{t('Full Name *', 'Nome Completo *')}</ModernInputLabel>"),
        ('placeholder="Digite seu nome completo"',
         'placeholder={t(\'Enter your full name\', \'Digite seu nome completo\')}'),
        ("<ModernInputLabel>SSN / ITIN (Identificação Americana)</ModernInputLabel>",
         "<ModernInputLabel>{t('SSN / ITIN (US Identification)', 'SSN / ITIN (Identificação Americana)')}</ModernInputLabel>"),
        ('placeholder="000-00-0000 (9 números)"',
         'placeholder={t(\'000-00-0000 (9 digits)\', \'000-00-0000 (9 números)\')}'),
        ("<ModernInputLabel>Data de Nascimento</ModernInputLabel>",
         "<ModernInputLabel>{t('Date of Birth', 'Data de Nascimento')}</ModernInputLabel>"),
        ('placeholder="DD/MM/AAAA"',
         'placeholder={t(\'MM/DD/YYYY\', \'DD/MM/AAAA\')}'),
        ("<NextStepButtonText>Continuar</NextStepButtonText>",
         "<NextStepButtonText>{t('Continue', 'Continuar')}</NextStepButtonText>"),
        ("<BackStepButtonText>Voltar</BackStepButtonText>",
         "<BackStepButtonText>{t('Back', 'Voltar')}</BackStepButtonText>"),
        ("<ModernInputLabel>Telefone / Celular *</ModernInputLabel>",
         "<ModernInputLabel>{t('Phone Number *', 'Telefone / Celular *')}</ModernInputLabel>"),
        ("<ModernInputLabel>E-mail *</ModernInputLabel>",
         "<ModernInputLabel>{t('Email Address *', 'E-mail *')}</ModernInputLabel>"),
        ("<ModernInputLabel>Cidade</ModernInputLabel>",
         "<ModernInputLabel>{t('City / Area', 'Cidade')}</ModernInputLabel>"),
        ("{pCity ? pCity.nome : 'Selecione sua cidade'}",
         "{pCity ? pCity.nome : t('Select your city', 'Selecione sua cidade')}"),
        ("{dCity ? dCity.nome : 'Selecione sua cidade'}",
         "{dCity ? dCity.nome : t('Select your city', 'Selecione sua cidade')}"),
        ("Selecione sua Cidade\n",
         "{t('Select your City', 'Selecione sua Cidade')}\n"),
        ("{pPhoto ? 'Foto de perfil selecionada' : 'Adicione uma foto de perfil nítida'}",
         "{pPhoto ? t('Profile photo selected', 'Foto de perfil selecionada') : t('Add a clear profile photo', 'Adicione uma foto de perfil nítida')}"),
        ("<PhotoChoiceButtonText>Tirar Foto</PhotoChoiceButtonText>",
         "<PhotoChoiceButtonText>{t('Take Photo', 'Tirar Foto')}</PhotoChoiceButtonText>"),
        ("<PhotoChoiceButtonText>Galeria</PhotoChoiceButtonText>",
         "<PhotoChoiceButtonText>{t('Gallery', 'Galeria')}</PhotoChoiceButtonText>"),
        ("<PhotoRemoveBtnText>Remover Foto</PhotoRemoveBtnText>",
         "<PhotoRemoveBtnText>{t('Remove Photo', 'Remover Foto')}</PhotoRemoveBtnText>"),
        ("<ModernInputLabel>Senha de Acesso *</ModernInputLabel>",
         "<ModernInputLabel>{t('Password *', 'Senha de Acesso *')}</ModernInputLabel>"),
        ('placeholder="Mínimo de 6 caracteres"',
         'placeholder={t(\'Minimum 6 characters\', \'Mínimo de 6 caracteres\')}'),
        ("<ModernInputLabel>Confirmar Senha *</ModernInputLabel>",
         "<ModernInputLabel>{t('Confirm Password *', 'Confirmar Senha *')}</ModernInputLabel>"),
        ('placeholder="Repita a senha"',
         'placeholder={t(\'Repeat your password\', \'Repita a senha\')}'),
        ("<NextStepButtonText>Finalizar Cadastro</NextStepButtonText>",
         "<NextStepButtonText>{t('Submit Registration', 'Finalizar Cadastro')}</NextStepButtonText>"),

        # Driver Steps
        ("{driverStep === 1 && 'Etapa 1 de 5: Escolha sua Categoria'}",
         "{driverStep === 1 && t('Step 1 of 5: Choose your Category', 'Etapa 1 de 5: Escolha sua Categoria')}"),
        ("{driverStep === 2 && 'Etapa 2 de 5: Dados Pessoais e SSN / ITIN'}",
         "{driverStep === 2 && t('Step 2 of 5: Personal Details & SSN / ITIN', 'Etapa 2 de 5: Dados Pessoais e SSN / ITIN')}"),
        ("{driverStep === 3 && 'Etapa 3 de 5: Dados do Veículo'}",
         "{driverStep === 3 && t('Step 3 of 5: Vehicle Details', 'Etapa 3 de 5: Dados do Veículo')}"),
        ("{driverStep === 4 && 'Etapa 4 de 5: Documentação Americana (EUA)'}",
         "{driverStep === 4 && t('Step 4 of 5: US Documentation (USA)', 'Etapa 4 de 5: Documentação Americana (EUA)')}"),
        ("{driverStep === 5 && 'Etapa 5 de 5: Foto de Perfil e Senha'}",
         "{driverStep === 5 && t('Step 5 of 5: Profile Photo & Password', 'Etapa 5 de 5: Foto de Perfil e Senha')}"),
        ("<CardHeaderPillText>Cadastro de Motorista</CardHeaderPillText>",
         "<CardHeaderPillText>{t('Driver Registration', 'Cadastro de Motorista')}</CardHeaderPillText>"),
        ("<StepCounterBadge>Passo {driverStep} de 5</StepCounterBadge>",
         "<StepCounterBadge>{t(`Step ${driverStep} of 5`, `Passo ${driverStep} de 5`)}</StepCounterBadge>"),
        ("Selecione a categoria em que você deseja atuar na Movy para iniciar suas corridas:",
         "{t('Select the category you wish to drive with Movy to start earning:', 'Selecione a categoria em que você deseja atuar na Movy para iniciar suas corridas:')}"),
        ("<CategoryTitle isSelected={isSelected}>{cat.name}</CategoryTitle>",
         "<CategoryTitle isSelected={isSelected}>{formatCategoryName(cat.name)}</CategoryTitle>"),
        ("{cat.description || 'Atuação profissional com a Movy'}",
         "{formatCategoryDesc(cat.description)}"),
        ("<ModernInputLabel>SSN / ITIN * (Identificação Individual Americana)</ModernInputLabel>",
         "<ModernInputLabel>{t('SSN / ITIN * (US Individual Identification)', 'SSN / ITIN * (Identificação Individual Americana)')}</ModernInputLabel>"),
        ("<ModernInputLabel>Data de Nascimento *</ModernInputLabel>",
         "<ModernInputLabel>{t('Date of Birth *', 'Data de Nascimento *')}</ModernInputLabel>"),
        ("<ModernInputLabel>Placa do Veículo (License Plate) *</ModernInputLabel>",
         "<ModernInputLabel>{t('Vehicle License Plate *', 'Placa do Veículo (License Plate) *')}</ModernInputLabel>"),
        ("<ModernInputLabel>Marca e Modelo do Veículo *</ModernInputLabel>",
         "<ModernInputLabel>{t('Vehicle Make and Model *', 'Marca e Modelo do Veículo *')}</ModernInputLabel>"),
        ("<ModernInputLabel>Cor do Veículo</ModernInputLabel>",
         "<ModernInputLabel>{t('Vehicle Color', 'Cor do Veículo')}</ModernInputLabel>"),
        ('placeholder="Ex: Prata, Preto, Branco, Azul"',
         'placeholder={t(\'Ex: Silver, Black, White, Blue\', \'Ex: Prata, Preto, Branco, Azul\')}'),
        ("<ModernInputLabel>Ano de Fabricação</ModernInputLabel>",
         "<ModernInputLabel>{t('Year of Manufacture', 'Ano de Fabricação')}</ModernInputLabel>"),
        ("<DocSectionTitle>Documentação dos Estados Unidos</DocSectionTitle>",
         "<DocSectionTitle>{t('United States Documentation', 'Documentação dos Estados Unidos')}</DocSectionTitle>"),
        ("A Movy opera nos EUA. Anexe fotos nítidas dos 4 documentos obrigatórios para validação:",
         "{t('Movy operates in the US. Attach clear photos of the 4 required documents for validation:', 'A Movy opera nos EUA. Anexe fotos nítidas dos 4 documentos obrigatórios para validação:')}"),
        ("<DocCardTitle>Carteira de motorista americana</DocCardTitle>",
         "<DocCardTitle>{t('US Driver’s License', 'Carteira de motorista americana')}</DocCardTitle>"),
        ("<DocRequirementText>O que apresentar: Driver’s License válida.</DocRequirementText>",
         "<DocRequirementText>{t('Requirement: Valid Driver’s License.', 'O que apresentar: Driver’s License válida.')}</DocRequirementText>"),
        ("<DocPreviewFilename>Driver’s License anexada</DocPreviewFilename>",
         "<DocPreviewFilename>{t('Driver’s License attached', 'Driver’s License anexada')}</DocPreviewFilename>"),
        ("<DocPreviewHint>Toque abaixo para alterar ou remover</DocPreviewHint>",
         "<DocPreviewHint>{t('Tap below to change or remove', 'Toque abaixo para alterar ou remover')}</DocPreviewHint>"),
        ("{dDocLicense ? 'Tirar Outra' : 'Câmera'}",
         "{dDocLicense ? t('Retake', 'Tirar Outra') : t('Camera', 'Câmera')}"),
        ("{dDocLicense ? 'Anexado' : 'Pendente'}",
         "{dDocLicense ? t('Attached', 'Anexado') : t('Pending', 'Pendente')}"),
        ("<DocCardTitle>Registro do veículo</DocCardTitle>",
         "<DocCardTitle>{t('Vehicle Registration', 'Registro do veículo')}</DocCardTitle>"),
        ("<DocRequirementText>O que apresentar: Vehicle Registration atualizado.</DocRequirementText>",
         "<DocRequirementText>{t('Requirement: Updated Vehicle Registration.', 'O que apresentar: Vehicle Registration atualizado.')}</DocRequirementText>"),
        ("<DocPreviewFilename>Vehicle Registration anexado</DocPreviewFilename>",
         "<DocPreviewFilename>{t('Vehicle Registration attached', 'Vehicle Registration anexado')}</DocPreviewFilename>"),
        ("{dDocRegistration ? 'Tirar Outra' : 'Câmera'}",
         "{dDocRegistration ? t('Retake', 'Tirar Outra') : t('Camera', 'Câmera')}"),
        ("{dDocRegistration ? 'Anexado' : 'Pendente'}",
         "{dDocRegistration ? t('Attached', 'Anexado') : t('Pending', 'Pendente')}"),
        ("<DocCardTitle>Seguro do carro</DocCardTitle>",
         "<DocCardTitle>{t('Vehicle Insurance', 'Seguro do carro')}</DocCardTitle>"),
        ("<DocRequirementText>O que apresentar: Comprovante de seguro válido.</DocRequirementText>",
         "<DocRequirementText>{t('Requirement: Valid auto insurance policy document.', 'O que apresentar: Comprovante de seguro válido.')}</DocRequirementText>"),
        ("<DocPreviewFilename>Seguro de carro anexado</DocPreviewFilename>",
         "<DocPreviewFilename>{t('Vehicle insurance attached', 'Seguro de carro anexado')}</DocPreviewFilename>"),
        ("{dDocInsurance ? 'Tirar Outra' : 'Câmera'}",
         "{dDocInsurance ? t('Retake', 'Tirar Outra') : t('Camera', 'Câmera')}"),
        ("{dDocInsurance ? 'Anexado' : 'Pendente'}",
         "{dDocInsurance ? t('Attached', 'Anexado') : t('Pending', 'Pendente')}"),
        ("<DocCardTitle>Comprovante de residência</DocCardTitle>",
         "<DocCardTitle>{t('Proof of Residence', 'Comprovante de residência')}</DocCardTitle>"),
        ("<DocRequirementText>O que apresentar: Na cidade ou estado onde pretende dirigir.</DocRequirementText>",
         "<DocRequirementText>{t('Requirement: In the city or state where you intend to drive.', 'O que apresentar: Na cidade ou estado onde pretende dirigir.')}</DocRequirementText>"),
        ("<DocPreviewFilename>Comprovante de residência anexado</DocPreviewFilename>",
         "<DocPreviewFilename>{t('Proof of residence attached', 'Comprovante de residência anexado')}</DocPreviewFilename>"),
        ("{dDocResidence ? 'Tirar Outra' : 'Câmera'}",
         "{dDocResidence ? t('Retake', 'Tirar Outra') : t('Camera', 'Câmera')}"),
        ("{dDocResidence ? 'Anexado' : 'Pendente'}",
         "{dDocResidence ? t('Attached', 'Anexado') : t('Pending', 'Pendente')}"),
        ("{dPhoto\n                            ? 'Foto de perfil do motorista selecionada'\n                            : 'Foto nítida do motorista, conforme as orientações (rosto frontal e visível)'}",
         "{dPhoto ? t('Driver profile photo selected', 'Foto de perfil do motorista selecionada') : t('Clear driver photo (front facing and visible)', 'Foto nítida do motorista, conforme as orientações (rosto frontal e visível)')}"),
        ("<ModernInputLabel>Senha de Acesso de Motorista *</ModernInputLabel>",
         "<ModernInputLabel>{t('Driver Password *', 'Senha de Acesso de Motorista *')}</ModernInputLabel>"),
        ("<NextStepButtonText>Concluir Cadastro</NextStepButtonText>",
         "<NextStepButtonText>{t('Submit Registration', 'Concluir Cadastro')}</NextStepButtonText>"),
    ]

    count = 0
    for old, new in replacements:
        if old in content:
            content = content.replace(old, new)
            count += 1
        else:
            print(f"NOT FOUND: {repr(old[:40])}")

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Applied {count} replacements to {filepath}")

patch_file(r"D:\APLICATIVO MOVY\mobility-pro-app-rota101-pro\src\client\pages\Register\index.tsx")
patch_file(r"D:\APLICATIVO MOVY\mobility-pro-app-rota101-pro-ios\src\client\pages\Register\index.tsx")
