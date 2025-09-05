import React, {useState} from 'react'
import {View, TouchableOpacity, Alert, Linking} from 'react-native'
import InputView from '../../components/Other/InputView'
import Colors from '../../styles/Colors'
import {useDispatch} from 'react-redux'
import {getQrScanInfo} from '../../store/actions/ProductsActions'
import QrScanInfoDialog from '../../components/Dialog/QrScanInfoDialog'
import I18n from '../../config/LanguageConfig'
import AppText from '../../components/SwitchLanguage/AppText'

export default InputCodeScreen = ({}) => {
  const dispatch = useDispatch()
  const [code, setCode] = useState('')
  const [resInput, setResInput] = useState(null)
  const [showData, setShowData] = useState(false)

  _onChangeCode = text => {
    setCode(text)
  }

  _handleSearch = () => {
    if (code == '' || code == null) {
      Alert.alert(null, I18n.t('pls-input-code'), [
        {text: I18n.t('0k'), onPress: () => {}, style: 'default'},
      ])
    } else {
      // Linking.openURL(`https://www.trace.vr-systems.link/?choices-single-defaul=Traceability&lot=${code}`).catch(err =>
      //     console.error('An error occured', err)
      // )
      dispatch(getQrScanInfo(code, _handleInputSuccess))
    }
  }

  _handleInputSuccess = data => {
    setResInput(data)
    setShowData(true)
  }

  _handleCloseDialogInput = () => {
    setShowData(false)
    setResInput(null)
  }

  return (
    <View
      style={{
        backgroundColor: Colors.white,
        paddingHorizontal: 16,
        marginVertical: 8,
      }}>
      <InputView
        header='input-product-code'
        title='input-code'
        onChangeText={_onChangeCode}
        value={setCode}
      />
      <TouchableOpacity
        onPress={_handleSearch}
        activeOpacity={0.5}
        style={{
          backgroundColor: Colors.green_00A74C,
          height: 40,
          paddingHorizontal: 30,
          marginTop: 8,
          marginBottom: 16,
          justifyContent: 'center',
          alignItems: 'center',
          borderRadius: 6,
          alignSelf: 'center',
        }}>
        <AppText
          style={{color: Colors.white, fontSize: 16}}
          title={'look-up'}
        />
      </TouchableOpacity>
      <QrScanInfoDialog
        modalVisible={showData}
        data={resInput}
        closeDialog={_handleCloseDialogInput}
      />
    </View>
  )
}
