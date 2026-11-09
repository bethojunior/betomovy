import java.util.Properties

plugins {
    id("com.android.application")
    id("org.jetbrains.kotlin.android")
    id("org.jetbrains.kotlin.plugin.compose")
    id("com.google.gms.google-services")
}

val local = Properties().apply {
    val file = rootProject.file("local.properties")
    if (file.exists()) file.inputStream().use { load(it) }
}
val keystore = Properties().apply {
    val file = rootProject.file("keystore.properties")
    if (file.exists()) file.inputStream().use { load(it) }
}

android {
    namespace = "com.movy.app"
    compileSdk = 35
    defaultConfig {
        minSdk = 26
        targetSdk = 35
        versionCode = 80308
        versionName = "8.3.8"
        buildConfigField("String", "API_BASE", "\"${local.getProperty("movy.apiUrl", "https://api.movymob.com")}\"")
        vectorDrawables { useSupportLibrary = true }
    }
    flavorDimensions += "role"
    productFlavors {
        create("passenger") {
            dimension = "role"
            applicationId = "br.com.client.rota101"
            resValue("string", "app_name", "Movy")
            buildConfigField("String", "ROLE", "\"passenger\"")
        }
        create("driver") {
            dimension = "role"
            applicationId = "br.com.driver.rota101"
            resValue("string", "app_name", "Movy Driver")
            buildConfigField("String", "ROLE", "\"driver\"")
        }
    }
    signingConfigs {
        create("upload") {
            val keyFile = rootProject.file(keystore.getProperty("storeFile", "movy_upload_keystore.jks"))
            val backupFile = rootProject.file(keystore.getProperty("backupStoreFile", "upload.jks"))
            if (keyFile.exists()) {
                storeFile = keyFile
                storePassword = keystore.getProperty("storePassword")
                keyAlias = keystore.getProperty("keyAlias")
                keyPassword = keystore.getProperty("keyPassword")
            } else if (backupFile.exists()) {
                storeFile = backupFile
                storePassword = keystore.getProperty("backupStorePassword")
                keyAlias = keystore.getProperty("backupKeyAlias")
                keyPassword = keystore.getProperty("backupKeyPassword")
            }
        }
    }
    buildTypes {
        release {
            isMinifyEnabled = false
            proguardFiles(getDefaultProguardFile("proguard-android-optimize.txt"), "proguard-rules.pro")
            signingConfig = if (keystore.getProperty("storeFile") != null) signingConfigs.getByName("upload") else signingConfigs.getByName("debug")
        }
    }
    compileOptions {
        sourceCompatibility = JavaVersion.VERSION_17
        targetCompatibility = JavaVersion.VERSION_17
    }
    kotlinOptions { jvmTarget = "17" }
    buildFeatures {
        compose = true
        buildConfig = true
    }
    packaging { resources { excludes += "/META-INF/{AL2.0,LGPL2.1}" } }
}

dependencies {
    val composeBom = platform("androidx.compose:compose-bom:2024.10.01")
    implementation(composeBom)
    implementation("androidx.activity:activity-compose:1.9.3")
    implementation("androidx.compose.ui:ui")
    implementation("androidx.compose.ui:ui-tooling-preview")
    implementation("androidx.compose.material3:material3")
    implementation("androidx.compose.material:material-icons-extended")
    implementation("androidx.core:core-ktx:1.15.0")
    implementation("com.squareup.okhttp3:okhttp:4.12.0")
    debugImplementation("androidx.compose.ui:ui-tooling")
}
