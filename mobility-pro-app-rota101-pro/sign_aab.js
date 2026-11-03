const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const dir = 'D:\\APLICATIVO MOVY\\mobility-pro-app-rota101-pro\\android\\app';
const releaseDir = path.join(dir, 'release');
const srcAab = path.join(releaseDir, 'app-release-unsigned.aab');
const destAab = path.join(releaseDir, 'app-release.aab');
const backupAab = path.join(releaseDir, 'app-movy-signed.aab');
const keystore = path.join(dir, 'movy_upload_keystore.jks');
const jarsigner = 'C:\\Users\\alexm\\.gradle\\jdks\\eclipse_adoptium-17-amd64-windows.2\\bin\\jarsigner.exe';

console.log('Copying file...');
fs.copyFileSync(srcAab, destAab);
fs.copyFileSync(srcAab, backupAab);

console.log('Signing destAab...');
const signCmd = `"${jarsigner}" -verbose -sigalg SHA256withRSA -digestalg SHA-256 -keystore "${keystore}" -storepass MovyMob2026@ -keypass MovyMob2026@ "${destAab}" movy`;
const signOutput = execSync(signCmd, { encoding: 'utf8' });
console.log('Sign output tail:', signOutput.slice(-300));

console.log('Verifying...');
const verifyCmd = `"${jarsigner}" -verify "${destAab}"`;
const verifyOutput = execSync(verifyCmd, { encoding: 'utf8' });
console.log('Verify output:', verifyOutput);

console.log('Signing backupAab...');
const signBackupCmd = `"${jarsigner}" -sigalg SHA256withRSA -digestalg SHA-256 -keystore "${keystore}" -storepass MovyMob2026@ -keypass MovyMob2026@ "${backupAab}" movy`;
execSync(signBackupCmd, { encoding: 'utf8' });

console.log('SUCCESS!');
