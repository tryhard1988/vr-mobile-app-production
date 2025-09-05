import React, {useEffect, useState, useRef} from 'react'
import {
  Text,
  StyleSheet,
  View,
  Image,
  ScrollView,
  TouchableOpacity,
  Linking,
  Alert,
} from 'react-native'
import Colors from '../../styles/Colors'
import I18n from '../../config/LanguageConfig'
import FontSizes from '../../styles/FontSizes'
import ToolbarNormal from '../../components/Other/ToolbarNormal'
import InputView from '../../components/Other/InputView'
import {useDispatch, useSelector} from 'react-redux'
import {sendContactForm} from '../../store/actions/UserAction'
import {checkValidatePhone, checkValidateEmail} from '../../helpers/Utils'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import AppText from '../../components/SwitchLanguage/AppText'

export default HelpCenterScreen = ({navigation}) => {
  const dispatch = useDispatch()
  const userState = useSelector(state => state.user)

  const [name, setName] = useState(
    `${userState.userInfo?.last_name} ${userState.userInfo?.first_name}` || '',
  )
  const [phone, setPhone] = useState(userState.userInfo?.billing?.phone || '')
  const [email, setEmail] = useState(userState.userInfo?.email || '')
  const [request, setRequest] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)

  _handleBack = () => {
    navigation.pop()
  }

  _onChangeName = text => {
    setName(text)
  }

  _onChangePhone = text => {
    setPhone(text)
  }

  _onChangeEmail = text => {
    setEmail(text)
  }

  _onChangeRequest = text => {
    setRequest(text)
  }

  useEffect(() => {
    if (errorMessage) {
      Alert.alert(null, I18n.t(errorMessage), [
        {
          text: I18n.t('0k'),
          onPress: () => {
            setErrorMessage(null)
          },
          style: 'default',
        },
        // { text: 'Có', onPress: () => { }, style: 'destructive' },
      ])
    }
  }, [errorMessage])

  _checkErrorInput = () => {
    if (
      name.trim() == '' ||
      phone.trim() == '' ||
      request.trim() == '' ||
      email.trim() == ''
    ) {
      setErrorMessage('lack-impotant-data')
      return false
    } else {
      if (!checkValidateEmail(email)) {
        setErrorMessage('wrong-email-format')
        return false
      }
      if (!checkValidatePhone(phone)) {
        setErrorMessage('wrong-phone-lenght')
        return false
      }
    }
    return true
  }

  async function _handleSendRequest () {
    let checked = await _checkErrorInput()
    if (checked) {
      let formData = new FormData()
      formData.append('fullname', name)
      formData.append('email', email)
      formData.append('phone', phone)
      formData.append('message', request)
      dispatch(sendContactForm(formData, _sendRequestSuccess))
      // navigation.pop()
    }
  }

  _sendRequestSuccess = () => {
    setName('')
    setEmail('')
    setPhone('')
    setRequest('')
  }

  _onClickPhone = () => {
    Linking.openURL(`tel:+842512860828`)
  }

  _onClickEmail = () => {
    Linking.openURL('mailto:info@vietrau.com?subject=SendMail&body=Description')
  }

  _onClickFacebook = () => {
    Linking.openURL('https://www.facebook.com/vietrau.farm')
  }

  return (
    <View style={styles.container}>
      <ToolbarNormal titleToolbar='support' onClose={_handleBack} />
      <KeyboardAwareScrollView
        style={{paddingVertical: 8}}
        showsVerticalScrollIndicator={false}>
        <View style={styles.viewContent}>
          <AppText
            style={{
              color: Colors.black_22281F,
              fontSize: 14,
              fontWeight: '700',
              alignSelf: 'center',
            }}
            title={'contact-help'}
          />
          <InputView
            header='name'
            title='input-full-name'
            isCompulsory
            onChangeText={_onChangeName}
            value={name}
          />
          <InputView
            header='phone'
            title='phone-numb'
            isCompulsory
            onChangeText={_onChangePhone}
            value={phone}
          />
          <InputView
            header='email'
            title='input-email'
            isCompulsory
            onChangeText={_onChangeEmail}
            value={email}
          />
          <InputView
            header='need-help-head'
            title='need-help'
            isCompulsory
            onChangeText={_onChangeRequest}
            value={request}
            containerStyle={{flex: 1}}
            inputStyle={{
              backgroundColor: Colors.white,
              height: 60,
              textAlignVertical: 'top',
              paddingVertical: 5,
            }}
            isMultiline={true}
          />
          <TouchableOpacity
            onPress={_handleSendRequest}
            style={styles.buttonSend}>
            <AppText style={{color: Colors.white}} title={'send-request'} />
          </TouchableOpacity>
        </View>
        <View style={[styles.viewContent, {marginVertical: 8}]}>
          <TouchableOpacity
            onPress={_onClickPhone}
            activeOpacity={1}
            style={styles.lineButton}>
            <Image
              source={require('../../assests/images/ic_telemarketer.png')}
              style={{height: 28, width: 28}}
            />
            <View style={{flex: 1, paddingStart: 12}}>
              <Text style={styles.textTitle}>Hotline</Text>
              <Text style={styles.textSubTitle}>(+84) 251 286 08 28</Text>
            </View>
          </TouchableOpacity>
          <View
            style={{
              height: 1,
              backgroundColor: Colors.gray_E0E0E0,
              marginVertical: 4,
            }}
          />
          <TouchableOpacity
            onPress={_onClickEmail}
            activeOpacity={1}
            style={styles.lineButton}>
            <Image
              source={require('../../assests/images/ic_mail.png')}
              style={{height: 28, width: 28}}
            />
            <View style={{flex: 1, paddingStart: 12}}>
              <Text style={styles.textTitle}>Email</Text>
              <Text style={styles.textSubTitle}>info@vietrau.com</Text>
            </View>
          </TouchableOpacity>
        </View>
        <View style={styles.viewContent}>
          <TouchableOpacity
            onPress={_onClickFacebook}
            activeOpacity={1}
            style={styles.lineButton}>
            <Image
              source={require('../../assests/images/ic_facebook.png')}
              style={{height: 28, width: 28}}
            />
            <Text style={[styles.textTitle, {marginStart: 12}]}>Facebook</Text>
          </TouchableOpacity>
        </View>
      </KeyboardAwareScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray_F2,
  },
  viewContent: {
    backgroundColor: Colors.white,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  buttonSend: {
    marginTop: 8,
    marginBottom: 4,
    alignSelf: 'center',
    justifyContent: 'center',
    height: 40,
    paddingHorizontal: 25,
    backgroundColor: Colors.green_00A74C,
    borderRadius: 6,
  },
  lineButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  textTitle: {
    color: Colors.black_22281F,
    fontSize: 14,
  },
  textSubTitle: {
    color: Colors.gray_828282,
  },
})
