import React, {useState} from 'react'
import {View, StyleSheet, TouchableOpacity, Linking, Image} from 'react-native'
import QRCodeScanner from 'react-native-qrcode-scanner'
import {RNCamera} from 'react-native-camera'
import {useIsFocused} from '@react-navigation/native'
import Colors from '../../styles/Colors'
import {getQrScanInfo} from '../../store/actions/ProductsActions'
import QrScanInfoDialog from '../../components/Dialog/QrScanInfoDialog'
import {useDispatch} from 'react-redux'
import AppText from '../../components/SwitchLanguage/AppText'

export default ScanCodeScreen = ({}) => {
  const dispatch = useDispatch()
  const isFocused = useIsFocused()
  const [isFlashLight, setIsFlashLight] = useState(false)
  const [resScan, setResScan] = useState(null)
  const [showDataScan, setShowDataScan] = useState(false)

  onSuccess = e => {
    // Linking.openURL(`https://www.trace.vr-systems.link/?choices-single-defaul=Traceability&lot=${e.data}`).catch(err =>
    //     console.error('An error occured', err)
    // );
    dispatch(getQrScanInfo(e.data, _handleScanSuccess))
  }

  _handleScanSuccess = data => {
    setResScan(data)
    setShowDataScan(true)
  }

  _handleCloseDialogScan = () => {
    setShowDataScan(false)
    setResScan(null)
  }

  _handleFlash = () => {
    setIsFlashLight(!isFlashLight)
  }

  return isFocused ? (
    <View style={[styles.container]}>
      {!showDataScan && (
        <QRCodeScanner
          onRead={onSuccess}
          cameraProps={{
            flashMode: isFlashLight
              ? RNCamera.Constants.FlashMode.torch
              : RNCamera.Constants.FlashMode.off,
            captureAudio: false,
          }}
          reactivate={true}
          reactivateTimeout={3000}
          containerStyle={{flex: 0.8}}
          cameraStyle={{
            width: 250,
            height: 250,
            alignSelf: 'center',
            zIndex: 1,
          }}
          markerStyle={{width: 250, height: 250}}
          topViewStyle={{
            backgroundColor: Colors.black_22281F,
            paddingVertical: 15,
            zIndex: 2,
          }}
          bottomViewStyle={{backgroundColor: Colors.black_22281F, zIndex: 2}}
          showMarker={true}
          bottomContent={
            <View style={{justifyContent: 'space-between'}}>
              <AppText
                style={{
                  color: Colors.gray_F2,
                  textAlign: 'center',
                  paddingBottom: 10,
                }}
                title={'move-cam-to-qr'}
              />
              <TouchableOpacity
                onPress={_handleFlash}
                activeOpacity={1}
                style={{alignSelf: 'center'}}>
                <Image
                  source={require('../../assests/images/ic_flashlight.png')}
                  style={{height: 40, width: 40}}
                />
              </TouchableOpacity>
            </View>
          }
        />
      )}
      <QrScanInfoDialog
        modalVisible={showDataScan}
        data={resScan}
        closeDialog={_handleCloseDialogScan}
      />
    </View>
  ) : (
    <View style={[styles.container]} />
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.black_22281F,
  },
})
