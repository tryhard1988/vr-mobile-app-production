import React, {useEffect, useState, useRef} from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
} from 'react-native'
import Colors from '../../styles/Colors'
import {useDispatch, useSelector} from 'react-redux'
import Input from '../../components/Other/InputView'
import ErrorTitle from '../../components/Other/ErrorLabel'
import Loading from '../../components/Progress/ProgressDialog'
import ToolbarNormal from '../../components/Other/ToolbarNormal'
import {Auth} from 'aws-amplify'
import I18n from '../../config/LanguageConfig'
import AppText from '../../components/SwitchLanguage/AppText'

export default VerificationCodeScreen = ({navigation}) => {
  const [code, setCode] = useState('')
  const [message, setMessage] = useState('')
  const [headerTitle, setHeaderTitle] = useState()
  const [isFaild, setIsFaild] = useState(false)
  const [isLoading, setLoading] = useState(false)
  const [codeValid, setValidCode] = useState(true)
  const [username, setUsername] = useState(true)

  const userState = useSelector(state => state.user)

  useEffect(() => {
    setUsername(userState.userRegister?.username)
    setHeaderTitle(this._renderHeaderText(userState.userRegister?.email))
  }, [userState.userRegister])

  _validationTap = () => {
    !this._codeEmpty() ? this._validationCode() : null
  }

  _validationCode = async time => {
    return new Promise(resolve => this.handleConfirmationSubmit())
  }

  _validationSuccess = () => {
    setLoading(false)
    this._pushView()
  }

  _validationFailure = () => {
    setLoading(false)
    setIsFaild(true)
    setMessage('un-known-error')
  }

  _codeEmpty = (empty = '') => {
    var flag = false
    code == empty ? (flag = true) : null
    setValidCode(code != empty)
    switch (empty) {
      case code: {
        setMessage('lack-info-error')
        break
      }
    }
    setIsFaild(flag)
    return flag
  }

  onCodeChange = value => {
    setCode(value)
  }

  handleConfirmationSubmit = async () => {
    setLoading(true)
    try {
      await Auth.confirmSignUp(username, code)
      this._validationSuccess()
    } catch (error) {
      this._validationFailure()
    }
  }

  _pushView = () => {
    console.lg
    navigation.reset({
      index: 0,
      routes: [{name: 'Login'}],
    })
  }

  _validationCodeBackTap = () => {
    navigation.popToTop()
  }

  _renderHeaderText = email => {
    var prefix = I18n.t('verify-message-prefix')
    var email = email
    var subfix = I18n.t('verify-message-suffix')
    return prefix + '\n' + email + '\n' + subfix
  }

  _resendCode = async time => {
    return new Promise(resolve => this._resendConfirmationCode())
  }

  _resendConfirmationCode = async () => {
    try {
      await Auth.resendSignUp(username)
    } catch (error) {
    }
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <ToolbarNormal
          titleToolbar='v-erify'
          onClose={this._validationCodeBackTap}
        />
        <View style={styles.containerContentView}>
          <View style={styles.containerInput}>
            {isFaild ? <ErrorTitle message={message} /> : null}
            <Text style={styles.textNormal2}>{headerTitle}</Text>
            <Input
              header='input-verify-code'
              keyboardType='number-pad'
              title='input-verify-code'
              onChangeText={text => onCodeChange(text)}
              isValid={codeValid}
              value={code}
            />
            <TouchableOpacity onPress={this._validationCode}>
              <View style={styles.containerButton}>
                <AppText style={styles.textWhiteHightlight} title={'v-erify'} />
              </View>
            </TouchableOpacity>
            <View style={styles.containerFooter}>
              <AppText style={styles.textNormal} title={'dont-recieve-code'} />
              <TouchableOpacity onPress={this._resendCode}>
                <AppText style={styles.textNormalGreen} title={'r-esend'} />
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <Loading visible={isLoading} />
      </View>
    </TouchableWithoutFeedback>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'white',
  },
  headerText: {
    color: Colors.black_22281F,
    fontWeight: '700',
    fontSize: 18,
  },
  containerContentView: {
    flex: 1,
  },
  containerInput: {
    borderRadius: 16,
    paddingVertical: 24,
    paddingHorizontal: 16,
    backgroundColor: 'white',
  },
  textHightlight: {
    fontWeight: '700',
    fontSize: 18,
    marginVertical: 12,
    textAlign: 'left',
    color: Colors.black_22281F,
  },
  textWhiteHightlight: {
    fontWeight: '400',
    fontSize: 16,
    color: 'white',
    alignSelf: 'center',
    marginVertical: 12,
  },
  textNormal: {
    fontWeight: '400',
    fontSize: 14,
    color: Colors.gray_4F4F4F,
    alignSelf: 'center',
    marginStart: 8,
  },
  textNormal2: {
    fontWeight: '400',
    fontSize: 18,
    color: Colors.gray_4F4F4F,
    marginBottom: 14,
  },
  containerButton: {
    marginTop: 18,
    backgroundColor: Colors.green_00A74C,
    borderRadius: 4,
  },
  textNormalGreen: {
    fontWeight: '700',
    fontSize: 14,
    marginStart: 6,
    color: Colors.green_00A74C,
    alignSelf: 'center',
    marginEnd: 8,
  },
  containerFooter: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 28,
  },
})
