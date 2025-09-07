# Vietrau Mobile App


rd /s /q node_modules

del package-lock.json

npm cache clean --force


npm install fbjs --save

npm install
npm install --legacy-peer-deps
npm install --force



========================== chạy android ==============================================

start cmd /k "npx react-native start --reset-cache"

cd android


rmdir /s /q build
rmdir /s /q app\build

gradlew clean
gradlew assembleDebug --stacktrace
gradlew assembleDebug --stacktrace --info
gradlew assembleDebug

cd ..

npx react-native run-android --no-jetifier


======================================== show log =================================
npx react-native log-android

adb logcat *:S ReactNative:V ReactNativeJS:V

adb logcat *:E