cordova build android --release -- --keystore=./keystore.jks --storePassword=Rota101704 --alias=rota101 --password=Rota101704 --packageType=bundle
mkdir release
cp -f ./platforms/android/app/build/outputs/bundle/release/app-release.aab ./release/app-release.aab
