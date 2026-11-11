import os

def patch_errors(filepath):
    with open(filepath, 'r', encoding='utf-8') as f:
        c = f.read()

    pairs = [
        ("newErrors.pName = 'Informe seu nome completo';", "newErrors.pName = t('Enter your full name', 'Informe seu nome completo');"),
        ("newErrors.pSsn = 'O SSN / ITIN deve ter 9 dígitos';", "newErrors.pSsn = t('SSN / ITIN must have 9 digits', 'O SSN / ITIN deve ter 9 dígitos');"),
        ("newErrors.pBirthDate = 'Data de nascimento incompleta (DD/MM/AAAA)';", "newErrors.pBirthDate = t('Incomplete date of birth', 'Data de nascimento incompleta (DD/MM/AAAA)');"),
        ("newErrors.pPhone = 'Informe um telefone válido';", "newErrors.pPhone = t('Enter a valid phone number', 'Informe um telefone válido');"),
        ("newErrors.pEmail = 'Informe um e-mail válido';", "newErrors.pEmail = t('Enter a valid email address', 'Informe um e-mail válido');"),
        ("newErrors.pPassword = 'A senha deve ter no mínimo 6 caracteres';", "newErrors.pPassword = t('Password must have at least 6 characters', 'A senha deve ter no mínimo 6 caracteres');"),
        ("newErrors.pConfirmPassword = 'As senhas não coincidem';", "newErrors.pConfirmPassword = t('Passwords do not match', 'As senhas não coincidem');"),
        ("newErrors.category = 'Selecione uma categoria para continuar';", "newErrors.category = t('Select a category to continue', 'Selecione uma categoria para continuar');"),
        ("newErrors.dName = 'Informe seu nome completo';", "newErrors.dName = t('Enter your full name', 'Informe seu nome completo');"),
        ("newErrors.dSsn = 'Informe o SSN / ITIN americano válido (9 números)';", "newErrors.dSsn = t('Enter a valid 9-digit US SSN / ITIN', 'Informe o SSN / ITIN americano válido (9 números)');"),
        ("newErrors.dBirthDate = 'Informe a data completa (DD/MM/AAAA)';", "newErrors.dBirthDate = t('Enter complete date of birth', 'Informe a data completa (DD/MM/AAAA)');"),
        ("newErrors.dBirthDate = 'Data de nascimento inválida (mínimo 18 anos)';", "newErrors.dBirthDate = t('Invalid date of birth (minimum 18 years old)', 'Data de nascimento inválida (mínimo 18 anos)');"),
        ("newErrors.dPhone = 'Informe um telefone válido com código de área';", "newErrors.dPhone = t('Enter a valid phone number with area code', 'Informe um telefone válido com código de área');"),
        ("newErrors.dEmail = 'Informe um e-mail válido';", "newErrors.dEmail = t('Enter a valid email address', 'Informe um e-mail válido');"),
        ("newErrors.dPlate = 'Informe uma placa de veículo válida (2 a 8 caracteres)';", "newErrors.dPlate = t('Enter a valid license plate (2 to 8 characters)', 'Informe uma placa de veículo válida (2 a 8 caracteres)');"),
        ("newErrors.dVehicleModel = 'Informe o modelo e marca do veículo';", "newErrors.dVehicleModel = t('Enter vehicle make and model', 'Informe o modelo e marca do veículo');"),
        ("newErrors.dDocLicense = 'Anexe a Carteira de motorista americana (Driver’s License)';", "newErrors.dDocLicense = t('Attach US Driver’s License', 'Anexe a Carteira de motorista americana (Driver’s License)');"),
        ("newErrors.dDocRegistration = 'Anexe o Registro do veículo (Vehicle Registration)';", "newErrors.dDocRegistration = t('Attach Vehicle Registration', 'Anexe o Registro do veículo (Vehicle Registration)');"),
        ("newErrors.dDocInsurance = 'Anexe o Comprovante de seguro do carro';", "newErrors.dDocInsurance = t('Attach Proof of Vehicle Insurance', 'Anexe o Comprovante de seguro do carro');"),
        ("newErrors.dDocResidence = 'Anexe o Comprovante de residência';", "newErrors.dDocResidence = t('Attach Proof of Residence', 'Anexe o Comprovante de residência');"),
        ("newErrors.dPhoto = 'Adicione sua foto de perfil nítida para identificação';", "newErrors.dPhoto = t('Add a clear profile photo for identification', 'Adicione sua foto de perfil nítida para identificação');"),
        ("newErrors.dPassword = 'A senha deve ter no mínimo 6 caracteres';", "newErrors.dPassword = t('Password must have at least 6 characters', 'A senha deve ter no mínimo 6 caracteres');"),
        ("newErrors.dConfirmPassword = 'As senhas não coincidem';", "newErrors.dConfirmPassword = t('Passwords do not match', 'As senhas não coincidem');"),
    ]

    for o, n in pairs:
        c = c.replace(o, n)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(c)
    print('Patched errors in', filepath)

patch_errors(r'D:\APLICATIVO MOVY\mobility-pro-app-rota101-pro\src\client\pages\Register\index.tsx')
patch_errors(r'D:\APLICATIVO MOVY\mobility-pro-app-rota101-pro-ios\src\client\pages\Register\index.tsx')
