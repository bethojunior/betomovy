#!/bin/bash

if [ ! -d "test" ]; then
  mkdir test
fi

cordova build android

cp -f ./platforms/android/app/build/outputs/apk/debug/app-debug.apk ./test/app-test.apk
