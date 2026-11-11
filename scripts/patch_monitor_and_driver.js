const fs = require('fs');

// 1. TariffWizard
const twPath = 'mobilidade-monitor-new-main/src/pages/Advanced/Configs/Tariffs/TypesTravels/components/TariffWizard/index.tsx';
let tw = fs.readFileSync(twPath, 'utf8');
tw = tw.replace(
  '<SuccessSummaryValue>{`${valueCalcDriver || "0,00"} ${valueTypeCalcDriver}`}</SuccessSummaryValue>',
  '<SuccessSummaryValue>{`${valueCalcDriver || "0,00"} ${valueTypeCalcDriver === "$" ? "$" : "%"}`}</SuccessSummaryValue>'
);
tw = tw.replace(
  '{valueCalcDriver || "0,00"} {valueTypeCalcDriver}',
  '{valueCalcDriver || "0,00"} {valueTypeCalcDriver === "$" ? "$" : "%"}'
);
tw = tw.replace(
  'valueType={valueTypeCalcDriver}',
  'valueType={valueTypeCalcDriver === "$" ? "$" : "%"}'
);
tw = tw.replace(
  'onChangeType={setValueTypeCalcDriver}',
  'onChangeType={(val) => setValueTypeCalcDriver(val === "$" ? "$" : "%")}'
);
fs.writeFileSync(twPath, tw, 'utf8');
console.log('TariffWizard patched!');

// 2. TypesTravels
const ttPath = 'mobilidade-monitor-new-main/src/pages/Advanced/Configs/Tariffs/TypesTravels/index.tsx';
let tt = fs.readFileSync(ttPath, 'utf8');
tt = tt.replace(
  "{valueCalcDriver || '0,00'} {valueTypeCalcDriver}",
  "{valueCalcDriver || '0,00'} {valueTypeCalcDriver === '$' ? '$' : '%'}"
);
tt = tt.replace(
  'valueType: valueTypeCalcDriver || "%"',
  'valueType: valueTypeCalcDriver === "$" ? "$" : "%"'
);
fs.writeFileSync(ttPath, tt, 'utf8');
console.log('TypesTravels patched!');

// 3. useDriverCommission
const ucPath = 'mobilidade-monitor-new-main/src/pages/Advanced/Configs/Tariffs/TypesTravels/hooks/useDriverCommission.ts';
let uc = fs.readFileSync(ucPath, 'utf8');
uc = uc.replace(
  'const [valueTypeCalcDriver, setValueTypeCalcDriver] = useState<string>("%");',
  'const [valueTypeCalcDriver, setValueTypeCalcDriver] = useState<"%" | "$">("%");'
);
fs.writeFileSync(ucPath, uc, 'utf8');
console.log('useDriverCommission patched!');

// 4. CancellationReason index
const criPath = 'mobility-pro-app-rota101-pro/src/driver/src/components/Modal/CancellationReason/index.tsx';
let cri = fs.readFileSync(criPath, 'utf8');
cri = cri.replace(
  '<Modal\n      visible={visible}\n      transparent\n      animationType="slide"\n      onRequestClose={handleClose}\n    >',
  '<Modal\n      visible={visible}\n      transparent\n      animationType="fade"\n      onRequestClose={handleClose}\n      statusBarTranslucent={true}\n      hardwareAccelerated={true}\n    >'
);
cri = cri.replace(
  '<Modal\r\n      visible={visible}\r\n      transparent\r\n      animationType="slide"\r\n      onRequestClose={handleClose}\r\n    >',
  '<Modal\r\n      visible={visible}\r\n      transparent\r\n      animationType="fade"\r\n      onRequestClose={handleClose}\r\n      statusBarTranslucent={true}\r\n      hardwareAccelerated={true}\r\n    >'
);
fs.writeFileSync(criPath, cri, 'utf8');
console.log('CancellationReason index patched!');

// 5. CancellationReason styles
const crsPath = 'mobility-pro-app-rota101-pro/src/driver/src/components/Modal/CancellationReason/styles.ts';
let crs = fs.readFileSync(crsPath, 'utf8');
crs = crs.replace(
  'justify-content: flex-end;',
  'justify-content: center;\n  align-items: center;\n  padding: 16px;\n  z-index: 99999;\n  elevation: 99999;'
);
crs = crs.replace(
  'border-top-left-radius: 24px;\n  border-top-right-radius: 24px;',
  'border-radius: 24px;\n  width: 100%;\n  max-width: 420px;\n  z-index: 100000;\n  elevation: 100000;'
);
crs = crs.replace(
  'border-top-left-radius: 24px;\r\n  border-top-right-radius: 24px;',
  'border-radius: 24px;\r\n  width: 100%;\r\n  max-width: 420px;\r\n  z-index: 100000;\r\n  elevation: 100000;'
);
fs.writeFileSync(crsPath, crs, 'utf8');
console.log('CancellationReason styles patched!');

// 6. InTrip index
const itiPath = 'mobility-pro-app-rota101-pro/src/driver/src/components/Modal/InTrip/index.tsx';
let iti = fs.readFileSync(itiPath, 'utf8');
iti = iti.replace(
  "pointerEvents={visible ? 'auto' : 'none'}",
  "pointerEvents={visible && !cancellationReasonsModal ? 'auto' : 'none'}"
);
iti = iti.replace(
  'elevation: 24,',
  'elevation: cancellationReasonsModal ? 0 : 24,'
);
fs.writeFileSync(itiPath, iti, 'utf8');
console.log('InTrip index patched!');
