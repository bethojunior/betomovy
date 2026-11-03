const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const java = 'C:\\Users\\alexm\\.gradle\\jdks\\eclipse_adoptium-17-amd64-windows.2\\bin\\java.exe';
const jarTool = 'C:\\Users\\alexm\\.gradle\\jdks\\eclipse_adoptium-17-amd64-windows.2\\bin\\jar.exe';
const bundletool = 'D:\\APLICATIVO MOVY\\mobility-pro-app-rota101-pro\\bundletool-all.jar';
const keystore = 'D:\\APLICATIVO MOVY\\mobility-pro-app-rota101-pro\\android\\app\\movy_upload_keystore.jks';
const releaseDir = 'D:\\APLICATIVO MOVY\\mobility-pro-app-rota101-pro\\android\\app\\release';
const targetAab = path.join(releaseDir, 'app-release.aab');
const outputApks = path.join(releaseDir, 'app-release.apks');
const universalApk = path.join(releaseDir, 'movy-app-universal.apk');

if (fs.existsSync(outputApks)) {
    try { fs.unlinkSync(outputApks); } catch (e) {}
}

console.log('Running bundletool build-apks...');
const cmd = `"${java}" -jar "${bundletool}" build-apks --bundle="${targetAab}" --output="${outputApks}" --mode=universal --overwrite --ks="${keystore}" --ks-pass=pass:MovyMob2026@ --ks-key-alias=movy --key-pass=pass:MovyMob2026@`;
const out = execSync(cmd, { encoding: 'utf8', input: '' });
console.log('Bundletool output:', out);

console.log('Extracting universal.apk...');
execSync(`"${jarTool}" -xf "${outputApks}" universal.apk`, { cwd: releaseDir, encoding: 'utf8' });

const extracted = path.join(releaseDir, 'universal.apk');
if (fs.existsSync(extracted)) {
    fs.copyFileSync(extracted, universalApk);
    console.log('Universal APK ready at:', universalApk);
    console.log('Size:', (fs.statSync(universalApk).size / (1024*1024)).toFixed(2), 'MB');
} else {
    console.log('Extracted file not found');
}
