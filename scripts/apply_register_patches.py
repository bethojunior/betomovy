import re

files = [
    r"D:\APLICATIVO MOVY\mobility-pro-app-rota101-pro\src\client\pages\Register\index.tsx",
    r"D:\APLICATIVO MOVY\mobility-pro-app-rota101-pro-ios\src\client\pages\Register\index.tsx"
]

for filepath in files:
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    # 1. Remove scrollToEnd from keyboard listener
    old_kbd = re.search(r'const showSub = Keyboard\.addListener\(showEvent, e => \{.*?\}\);', content, re.DOTALL)
    if old_kbd:
        new_kbd = """const showSub = Keyboard.addListener(showEvent, e => {
      setKeyboardHeight(e.endCoordinates.height);
    });"""
        content = content[:old_kbd.start()] + new_kbd + content[old_kbd.end():]

    # 2. Fix driver fallback with stdObject
    old_fallback = """      } catch (errMultipart) {
        response = await apiMain.post('Driver/Register', {
          driver: driverObj,
          car: vehicleObj,
        }, { timeout: 30000 });
      }"""
    new_fallback = """      } catch (errMultipart) {
        response = await apiMain.post('Driver/Register', {
          stdObject: {
            driver: driverObj,
            car: vehicleObj,
          }
        }, { timeout: 30000 });
      }"""
    if old_fallback in content:
        content = content.replace(old_fallback, new_fallback)

    # 3. Ensure driver response check strictly validates status === true
    old_resp_check = """      if (response?.data && response.data.status === false) {
        Alert.alert(
          t('Attention', 'Atenção'),
          response.data.message || t('Driver registration could not be completed. Please check your data.', 'Não foi possível concluir o cadastro de motorista. Verifique os dados.')
        );
        return;
      }"""
    new_resp_check = """      if (!response?.data || response.data.status !== true) {
        Alert.alert(
          t('Attention', 'Atenção'),
          response?.data?.message || t('Driver registration could not be completed. Please check your data.', 'Não foi possível concluir o cadastro de motorista. Verifique os dados.')
        );
        return;
      }"""
    if old_resp_check in content:
        content = content.replace(old_resp_check, new_resp_check)

    # 4. Ensure customer response check strictly validates status === true
    old_cust_check = """      if (!data || !data.status) {
        Alert.alert(
          'Atenção',
          data?.message || 'Não foi possível concluir o cadastro. Verifique os dados e tente novamente.'
        );
        return;
      }"""
    new_cust_check = """      if (!data || data.status !== true) {
        Alert.alert(
          t('Attention', 'Atenção'),
          data?.message || t('Unable to complete registration. Please check your data and try again.', 'Não foi possível concluir o cadastro. Verifique os dados e tente novamente.')
        );
        return;
      }"""
    if old_cust_check in content:
        content = content.replace(old_cust_check, new_cust_check)

    # 5. KeyboardAvoidingView behavior on Android
    content = content.replace(
        "behavior={Platform.OS === 'ios' ? 'padding' : undefined}",
        "behavior={Platform.OS === 'ios' ? 'padding' : 'height'}"
    )

    # 6. Add floating keyboard dismiss pill button before </KeyboardAvoidingView>
    pill_code = """        {keyboardHeight > 0 && (
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={() => Keyboard.dismiss()}
            style={{
              position: 'absolute',
              right: 18,
              bottom: Platform.OS === 'ios' ? keyboardHeight + 10 : 20,
              backgroundColor: '#CD2379',
              paddingVertical: 10,
              paddingHorizontal: 18,
              borderRadius: 24,
              flexDirection: 'row',
              alignItems: 'center',
              zIndex: 99999,
              elevation: 10,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.35,
              shadowRadius: 6,
            }}
          >
            <Feather name="check" size={16} color="#ffffff" style={{ marginRight: 6 }} />
            <Text style={{ color: '#ffffff', fontWeight: 'bold', fontSize: 13 }}>
              {t('Done', 'OK / Fechar')}
            </Text>
          </TouchableOpacity>
        )}
      </KeyboardAvoidingView>"""

    if "{keyboardHeight > 0 && (" not in content:
        content = content.replace("      </KeyboardAvoidingView>", pill_code)

    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(content)
    print(f"Patched {filepath}")
