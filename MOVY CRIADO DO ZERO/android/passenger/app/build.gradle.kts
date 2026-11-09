plugins { id("com.android.application") }
android {
    namespace = "com.movy.rider"
    compileSdk = 35
    defaultConfig {
        applicationId = "com.movy.rider"
        minSdk = 26
        targetSdk = 35
        versionCode = 1
        versionName = "1.0.0"
    }
    buildTypes { release { isMinifyEnabled = false } }
}
dependencies { implementation("androidx.appcompat:appcompat:1.7.0") }
