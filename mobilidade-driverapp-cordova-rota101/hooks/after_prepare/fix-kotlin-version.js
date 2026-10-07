#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

module.exports = function (ctx) {
    const buildGradle = path.join(ctx.opts.projectRoot, 'platforms', 'android', 'app', 'build.gradle');

    if (!fs.existsSync(buildGradle)) return;

    let content = fs.readFileSync(buildGradle, 'utf8');

    // Força a versão do Kotlin em qualquer lugar que apareça
    content = content.replace(/GradlePluginKotlinVersion\s*=\s*['"]?\d+\.\d+\.\d+['"]?/g, 'GradlePluginKotlinVersion = "1.8.22"');

    // Adiciona resolutionStrategy para forçar todas as stdlibs
    const insert = `
      configurations.all {
          resolutionStrategy {
              force 'org.jetbrains.kotlin:kotlin-stdlib:1.8.22'
              force 'org.jetbrains.kotlin:kotlin-stdlib-jdk7:1.8.22'
              force 'org.jetbrains.kotlin:kotlin-stdlib-jdk8:1.8.22'
          }
      }
    `;

    // Insere no final do build.gradle se ainda não existir
    if (!content.includes("resolutionStrategy")) {
        content += insert;
    }

    fs.writeFileSync(buildGradle, content, 'utf8');
    console.log('✅ Kotlin version and stdlib forced to 1.8.22 in build.gradle');
};