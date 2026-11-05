const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const java = 'C:\\Users\\alexm\\.gradle\\jdks\\eclipse_adoptium-17-amd64-windows.2\\bin\\java.exe';
const jarsigner = 'C:\\Users\\alexm\\.gradle\\jdks\\eclipse_adoptium-17-amd64-windows.2\\bin\\jarsigner.exe';
const jarTool = 'C:\\Users\\alexm\\.gradle\\jdks\\eclipse_adoptium-17-amd64-windows.2\\bin\\jar.exe';
const bundletool = 'D:\\APLICATIVO MOVY\\mobility-pro-app-rota101-pro\\bundletool-all.jar';

const appDir = 'D:\\APLICATIVO MOVY\\mobility-pro-app-rota101-pro';
const keystore = path.join(appDir, 'android\\app\\movy_upload_keystore.jks');
const releaseDir = path.join(appDir, 'android\\app\\release');
const gradleAab = path.join(appDir, 'android\\app\\build\\outputs\\bundle\\release\\app-release.aab');
const targetAab = path.join(releaseDir, 'app-release.aab');
const outputApks = path.join(releaseDir, 'app-release.apks');
const universalApk = path.join(releaseDir, 'app-movy-universal.apk');
const movyUniversalApk = path.join(releaseDir, 'movy-app-universal.apk');

if (!fs.existsSync(releaseDir)) {
    fs.mkdirSync(releaseDir, { recursive: true });
}

console.log('[1/4] Copying Gradle-built AAB to release folder...');
const sourceAab = fs.existsSync(gradleAab) ? gradleAab : path.join(releaseDir, 'app-release-unsigned.aab');
fs.copyFileSync(sourceAab, targetAab);

console.log('[2/4] Signing AAB with jarsigner...');
// Note: no -verbose so it runs fast without buffer overflow
const signCmd = `"${jarsigner}" -sigalg SHA256withRSA -digestalg SHA-256 -keystore "${keystore}" -storepass MovyMob2026@ -keypass MovyMob2026@ "${targetAab}" movy`;
execSync(signCmd, { stdio: 'inherit' });

console.log('Verifying AAB signature...');
const verifyCmd = `"${jarsigner}" -verify "${targetAab}"`;
const verifyOut = execSync(verifyCmd, { encoding: 'utf8' });
console.log('Verify result:', verifyOut.trim());

console.log('[3/4] Generating universal APK using bundletool...');
if (fs.existsSync(outputApks)) {
    fs.unlinkSync(outputApks);
}
const buildApksCmd = `"${java}" -jar "${bundletool}" build-apks --bundle="${targetAab}" --output="${outputApks}" --mode=universal --ks="${keystore}" --ks-pass=pass:MovyMob2026@ --ks-key-alias=movy --key-pass=pass:MovyMob2026@`;
execSync(buildApksCmd, { stdio: 'inherit' });

console.log('[4/4] Extracting universal APK from APKS archive...');
// APKS is a zip archive containing universal.apk
const extractCmd = `"${jarTool}" -xf "${outputApks}" universal.apk`;
execSync(extractCmd, { cwd: releaseDir, stdio: 'inherit' });

const extractedApk = path.join(releaseDir, 'universal.apk');
if (fs.existsSync(extractedApk)) {
    fs.copyFileSync(extractedApk, movyUniversalApk);
    // Também copia para a raiz do workspace para acesso imediato
    const rootApk = path.join('D:\\APLICATIVO MOVY', 'movy-app-universal.apk');
    try {
        fs.copyFileSync(extractedApk, rootApk);
        console.log('Universal APK also copied to root:', rootApk);
    } catch (e) {
        console.warn('Failed to copy to root:', e.message);
    }
    fs.unlinkSync(extractedApk);
    if (fs.existsSync(universalApk)) fs.unlinkSync(universalApk);
    if (fs.existsSync(outputApks)) fs.unlinkSync(outputApks);
    console.log('Universal APK created successfully at:', movyUniversalApk);
}

const statsAab = fs.statSync(targetAab);
const statsApk = fs.statSync(movyUniversalApk);
console.log('\n================ ALL DONE ================');
console.log(`Signed AAB: ${targetAab} (${(statsAab.size / (1024*1024)).toFixed(2)} MB)`);
console.log(`Signed APK: ${universalApk} (${(statsApk.size / (1024*1024)).toFixed(2)} MB)`);
console.log('==========================================');
