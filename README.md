# Vietrau Mobile App


rd /s /q node_modules

del package-lock.json

npm cache clean --force

npm install



========================================================================

start cmd /k "npx react-native start --reset-cache"

cd android

gradlew clean
gradlew assembleDebug

cd ..

npx react-native run-android --no-jetifier
