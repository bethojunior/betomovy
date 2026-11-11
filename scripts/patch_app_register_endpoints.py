import os

files = [
    r"D:\APLICATIVO MOVY\mobility-pro-app-rota101-pro\src\client\pages\Register\index.tsx",
    r"D:\APLICATIVO MOVY\mobility-pro-app-rota101-pro-ios\src\client\pages\Register\index.tsx"
]

for file_path in files:
    if not os.path.exists(file_path):
        print(f"Skipping {file_path} (not found)")
        continue

    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Update customer city fallback to 5605
    content = content.replace("cityId: pCity?.id || 1,", "cityId: pCity?.id || 5605,")

    # 2. Locate handleSubmitDriver and replace the submission logic
    target_pattern = """      let response: any;
      try {
        response = await apiMain.post('Customer/registerPartner', driverPayload);
      } catch (errPartner) {
        response = await apiMain.post('PreRegisterDriverMk/insert', driverPayload);
      }

      const resolvedId =
        response?.data?.idDriver ||
        response?.data?.driverId ||
        response?.data?.idCustomer ||
        response?.data?.customerId ||
        response?.data?.idUser ||
        response?.data?.userId ||
        response?.data?.id;"""

    replacement_pattern = """      const driverObj = {
        name: dName.trim(),
        email: dEmail.trim().toLowerCase(),
        document: cleanSsn,
        dateOfBirth: formattedDate,
        phone: dPhone.replace(/\D/g, ''),
        password: dPassword,
        userTypeId: selectedCategoryId,
        registered_in: 'mobilidade',
        cityId: dCity?.id || 5605,
        docs: [
          { docId: 1, text: "Driver's License" },
          { docId: 2, text: "Vehicle insurance and registration" },
          { docId: 6, text: "Proof of residence" },
          { docId: 10, text: "SCN" },
        ],
      };

      const vehicleObj = {
        licensePlate: dPlate.toUpperCase().trim() || ('MOV' + Math.floor(1000 + Math.random() * 9000)),
        model: dVehicleModel.trim() || 'Standard',
        brand: (dVehicleModel.trim().split(' ')[0]) || 'Vehicle',
        color: dVehicleColor.trim() || 'Black',
        year: dVehicleYear.trim() || '2022',
      };

      const formData = new FormData();
      formData.append('stdObject', JSON.stringify({
        driver: driverObj,
        car: vehicleObj,
      }));

      if (dPhoto) {
        formData.append('PROFILE', {
          uri: dPhoto,
          type: 'image/jpeg',
          name: 'profile.jpg',
        } as any);
      }
      if (dDocLicense) {
        formData.append('DOC_1', {
          uri: dDocLicense,
          type: 'image/jpeg',
          name: 'drivers_license.jpg',
        } as any);
        formData.append('CNH', {
          uri: dDocLicense,
          type: 'image/jpeg',
          name: 'drivers_license.jpg',
        } as any);
      }
      if (dDocRegistration) {
        formData.append('DOC_2', {
          uri: dDocRegistration,
          type: 'image/jpeg',
          name: 'vehicle_registration.jpg',
        } as any);
        formData.append('CRLV', {
          uri: dDocRegistration,
          type: 'image/jpeg',
          name: 'vehicle_registration.jpg',
        } as any);
      }
      if (dDocResidence) {
        formData.append('DOC_6', {
          uri: dDocResidence,
          type: 'image/jpeg',
          name: 'proof_of_residence.jpg',
        } as any);
        formData.append('DOC_4', {
          uri: dDocResidence,
          type: 'image/jpeg',
          name: 'proof_of_residence.jpg',
        } as any);
      }
      if (dDocInsurance) {
        formData.append('DOC_10', {
          uri: dDocInsurance,
          type: 'image/jpeg',
          name: 'insurance.jpg',
        } as any);
        formData.append('DOC_3', {
          uri: dDocInsurance,
          type: 'image/jpeg',
          name: 'insurance.jpg',
        } as any);
      }

      let response: any;
      try {
        response = await apiMain.post('Driver/Register', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
          timeout: 45000,
        });
      } catch (errMultipart) {
        response = await apiMain.post('Driver/Register', {
          driver: driverObj,
          car: vehicleObj,
        }, { timeout: 30000 });
      }

      if (response?.data && response.data.status === false) {
        Alert.alert(
          t('Attention', 'Atenção'),
          response.data.message || t('Driver registration could not be completed. Please check your data.', 'Não foi possível concluir o cadastro de motorista. Verifique os dados.')
        );
        return;
      }

      const resolvedId =
        response?.data?.idDriver ||
        response?.data?.driverId ||
        response?.data?.data?.idDriver ||
        response?.data?.data?.driverId ||
        response?.data?.data?.idUser ||
        response?.data?.data?.userId ||
        response?.data?.idUser ||
        response?.data?.userId ||
        response?.data?.id;"""

    if target_pattern in content:
        content = content.replace(target_pattern, replacement_pattern)
        print(f"Patched (LF) in {file_path}")
    elif target_pattern.replace('\n', '\r\n') in content:
        content = content.replace(target_pattern.replace('\n', '\r\n'), replacement_pattern.replace('\n', '\r\n'))
        print(f"Patched (CRLF) in {file_path}")
    else:
        print(f"Target pattern not found in {file_path}")

    with open(file_path, 'w', encoding='utf-8') as f:
        f.write(content)

print("Done patching Register pages.")
