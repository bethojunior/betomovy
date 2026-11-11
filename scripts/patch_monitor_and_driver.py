import os

# 1. Patch TariffWizard/index.tsx
tariff_wizard_path = r'mobilidade-monitor-new-main/src/pages/Advanced/Configs/Tariffs/TypesTravels/components/TariffWizard/index.tsx'
with open(tariff_wizard_path, 'r', encoding='utf-8') as f:
    tw_content = f.read()

tw_content = tw_content.replace(
    '<SuccessSummaryValue>{`${valueCalcDriver || "0,00"} ${valueTypeCalcDriver}`}</SuccessSummaryValue>',
    '<SuccessSummaryValue>{`${valueCalcDriver || "0,00"} ${valueTypeCalcDriver === "$" ? "$" : "%"}`}</SuccessSummaryValue>'
)
tw_content = tw_content.replace(
    '{valueCalcDriver || "0,00"} {valueTypeCalcDriver}',
    '{valueCalcDriver || "0,00"} {valueTypeCalcDriver === "$" ? "$" : "%"}'
)
tw_content = tw_content.replace(
    'valueType={valueTypeCalcDriver}',
    'valueType={valueTypeCalcDriver === "$" ? "$" : "%"}'
)
tw_content = tw_content.replace(
    'onChangeType={setValueTypeCalcDriver}',
    'onChangeType={(val) => setValueTypeCalcDriver(val === "$" ? "$" : "%")}'
)

with open(tariff_wizard_path, 'w', encoding='utf-8') as f:
    f.write(tw_content)
print("TariffWizard patched!")

# 2. Patch TypesTravels/index.tsx
types_travels_path = r'mobilidade-monitor-new-main/src/pages/Advanced/Configs/Tariffs/TypesTravels/index.tsx'
with open(types_travels_path, 'r', encoding='utf-8') as f:
    tt_content = f.read()

tt_content = tt_content.replace(
    "{valueCalcDriver || '0,00'} {valueTypeCalcDriver}",
    "{valueCalcDriver || '0,00'} {valueTypeCalcDriver === '$' ? '$' : '%'}"
)
tt_content = tt_content.replace(
    'valueType: valueTypeCalcDriver || "%"',
    'valueType: valueTypeCalcDriver === "$" ? "$" : "%"'
)

with open(types_travels_path, 'w', encoding='utf-8') as f:
    f.write(tt_content)
print("TypesTravels patched!")

# 3. Patch useDriverCommission.ts
use_commission_path = r'mobilidade-monitor-new-main/src/pages/Advanced/Configs/Tariffs/TypesTravels/hooks/useDriverCommission.ts'
with open(use_commission_path, 'r', encoding='utf-8') as f:
    uc_content = f.read()

uc_content = uc_content.replace(
    'const [valueTypeCalcDriver, setValueTypeCalcDriver] = useState<string>("%");',
    'const [valueTypeCalcDriver, setValueTypeCalcDriver] = useState<"%" | "$">("%");'
)
uc_content = uc_content.replace(
    'commissionForSelectedTrip?.valueType === "$" ? "$" : "%"',
    '(commissionForSelectedTrip?.valueType === "$" ? "$" : "%")'
)

with open(use_commission_path, 'w', encoding='utf-8') as f:
    f.write(uc_content)
print("useDriverCommission patched!")

# 4. Patch Driver CancellationReason Modal
cr_index_path = r'mobility-pro-app-rota101-pro/src/driver/src/components/Modal/CancellationReason/index.tsx'
with open(cr_index_path, 'r', encoding='utf-8') as f:
    cr_content = f.read()

# Add statusBarTranslucent and hardwareAccelerated to Modal
old_modal_tag = '''    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >'''
new_modal_tag = '''    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={handleClose}
      statusBarTranslucent={true}
      hardwareAccelerated={true}
    >'''
if old_modal_tag in cr_content:
    cr_content = cr_content.replace(old_modal_tag, new_modal_tag)
else:
    # try CRLF
    old_modal_tag_crlf = old_modal_tag.replace('\n', '\r\n')
    new_modal_tag_crlf = new_modal_tag.replace('\n', '\r\n')
    cr_content = cr_content.replace(old_modal_tag_crlf, new_modal_tag_crlf)

with open(cr_index_path, 'w', encoding='utf-8') as f:
    f.write(cr_content)
print("CancellationReason index patched!")

# 5. Patch Driver CancellationReason styles
cr_styles_path = r'mobility-pro-app-rota101-pro/src/driver/src/components/Modal/CancellationReason/styles.ts'
with open(cr_styles_path, 'r', encoding='utf-8') as f:
    crs_content = f.read()

crs_content = crs_content.replace(
    '''export const Overlay = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.6);
  justify-content: flex-end;
`;''',
    '''export const Overlay = styled.View`
  flex: 1;
  background-color: rgba(0, 0, 0, 0.75);
  justify-content: center;
  align-items: center;
  padding: 16px;
  z-index: 99999;
  elevation: 99999;
`;'''
)
crs_content = crs_content.replace(
    '''export const ContainerAll = styled.View`
  background-color: ${({ theme }) => theme.colors.background_global || '#FFFFFF'};
  border-top-left-radius: 24px;
  border-top-right-radius: 24px;
  padding: 20px 20px 28px 20px;
  max-height: 85%;
  elevation: 32;
  shadow-color: #000;
  shadow-offset: 0px -4px;
  shadow-opacity: 0.25;
  shadow-radius: 12px;
`;''',
    '''export const ContainerAll = styled.View`
  background-color: ${({ theme }) => theme.colors.background_global || '#FFFFFF'};
  border-radius: 24px;
  padding: 22px 20px 24px 20px;
  width: 100%;
  max-width: 420px;
  max-height: 85%;
  elevation: 100000;
  z-index: 100000;
  shadow-color: #000;
  shadow-offset: 0px 8px;
  shadow-opacity: 0.35;
  shadow-radius: 16px;
`;'''
)

with open(cr_styles_path, 'w', encoding='utf-8') as f:
    f.write(crs_content)
print("CancellationReason styles patched!")

# 6. Patch InTrip/index.tsx so elevation does not clash when cancellationReasonsModal is active
intrip_index_path = r'mobility-pro-app-rota101-pro/src/driver/src/components/Modal/InTrip/index.tsx'
with open(intrip_index_path, 'r', encoding='utf-8') as f:
    it_content = f.read()

it_content = it_content.replace(
    'pointerEvents={visible ? \'auto\' : \'none\'}',
    'pointerEvents={visible && !cancellationReasonsModal ? \'auto\' : \'none\'}'
)
it_content = it_content.replace(
    'elevation: 24,',
    'elevation: cancellationReasonsModal ? 0 : 24,'
)

with open(intrip_index_path, 'w', encoding='utf-8') as f:
    f.write(it_content)
print("InTrip index patched!")
