#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const manifestPath = path.join("platforms", "android", "app", "src", "main", "AndroidManifest.xml");

if (!fs.existsSync(manifestPath)) {
    console.log("AndroidManifest não encontrado");
    process.exit(0);
}

let manifest = fs.readFileSync(manifestPath, "utf8");

const regex = /<uses-feature android:name="android\.hardware\.location\.gps"(.*?)\/>/g;

let matches = manifest.match(regex);

if (matches && matches.length > 1) {
    let first = true;

    manifest = manifest.replace(regex, (match) => {
        if (first) {
            first = false;
            return '<uses-feature android:name="android.hardware.location.gps" android:required="true" />';
        }
        return "";
    });

    fs.writeFileSync(manifestPath, manifest);
}

console.log("✅ GPS feature duplication fixed in AndroidManifest");
