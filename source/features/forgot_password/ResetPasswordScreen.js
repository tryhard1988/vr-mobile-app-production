import React, {useEffect, useState, useRef} from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
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
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import I18n from '../../config/LanguageConfig'
import AppText from '../../components/SwitchLanguage/AppText'

export default ResetPasswordScreen = ({navigation}) => {
  const [message, setMessage] = useState('')
  const [isFaild, setIsFaild] = useState(false)
  const [isLoading, setLoading] = useState(false)

  const [code, setCode] = useState('')
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')

  const [codeValid, setValidCode] = useState(true)
  const [passwordIsValid, setValidPassword] = useState(true)
  const [confirmPasswordIsValid, setconfirmPasswordIsValid] = useState(true)

  const [headerTitle, setHeaderTitle] = useState()

  const userState = useSelector(state => state.user)

  _resetPasswordTap = () => {
    this._resetPasswordIsValid() ? this._resetPassword() : null
  }

  _resetPasswordIsValid = () => {
    return !this._resetPasswordEmpty() && this._inputIsValid()
  }

  _resetPassword = async time => {
    return new Promise(resolve => this._handleResetpassword())
  }

  _handleResetpassword = async () => {
    setLoading(true)
    Auth.forgotPasswordSubmit(username, code, password)
      .then(data => _resetSuccess())
      .catch(err => _resetFailure(err))
  }

  _resetSuccess = () => {
    navigation.popToTop()
  }

  _resetFailure = error => {
    setLoading(false)
    setIsFaild(true)
    switch (error.message) {
      case 'Invalid verification code provided, please try again.':
        return setMessage('invalid-verify-code')
      default:
        return setMessage('un-known-error')
    }
  }

  _inputIsValid = () => {
    var flag = true
    let regPasswrod = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    if (regPasswrod.test(password) === false) {
      setIsFaild(flag)
      setMessage('weak-passwd')
      setValidPassword(false)
      flag = false
      return flag
    }
    if (password !== confirmPassword) {
      setIsFaild(flag)
      setMessage('re-enter-passwd-wrong')
      setconfirmPasswordIsValid(false)
      flag = false
      return flag
    }
    return flag
  }

  useEffect(() => {
    setUsername(userState.userResetPassword?.username)
    setHeaderTitle(this._renderHeaderText(userState.userResetPassword?.email))
  }, [userState.userResetPassword])

  _resetPasswordEmpty = (empty = '') => {
    var flag = false

    code == empty ? (flag = true) : null
    password == empty ? (flag = true) : null
    confirmPassword == empty ? (flag = true) : null

    setValidCode(code != empty)
    setValidPassword(password != empty)
    setconfirmPasswordIsValid(confirmPassword != empty)

    switch (empty) {
      case (code, password, confirmPassword): {
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

  onPasswordChange = value => {
    setPassword(value)
  }

  onPasswordConfrimChange = value => {
    setConfirmPassword(value)
  }

  _renderHeaderText = email => {
    var prefix = I18n.t('reset-message-prefix')
    var email = email
    var subfix = I18n.t('reset-message-suffix')
    return prefix + email + subfix
  }

  _pushView = () => {
    navigation.reset({
      index: 0,
      routes: [{name: 'Main'}],
    })
  }

  _onBackTap = () => {
    navigation.pop()
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <ToolbarNormal titleToolbar='reset-passwd' onClose={this._onBackTap} />
        <KeyboardAwareScrollView
          style={styles.containerInput}
          showsVerticalScrollIndicator={false}>
          {isFaild ? <ErrorTitle message={message} /> : null}
          <Text style={styles.textNormal2}>{headerTitle}</Text>
          <Input
            header='enter-reset-code'
            title='enter-reset-code'
            onChangeText={text => onCodeChange(text)}
            isValid={codeValid}
            value={code}
          />
          <Input
            header='new-passwd'
            title='new-passwd'
            onChangeText={text => onPasswordChange(text)}
            isValid={passwordIsValid}
            value={password}
            isHiddenIcon={true}
            displayType='password'
          />
          <Input
            header='re-enter-new-passwd'
            title='re-enter-new-passwd'
            onChangeText={text => onPasswordConfrimChange(text)}
            isValid={confirmPasswordIsValid}
            value={confirmPassword}
            isHiddenIcon={true}
            displayType='password'
          />
          <TouchableOpacity onPress={this._resetPasswordTap}>
            <View style={styles.containerButton}>
              <AppText
                style={styles.textWhiteHightlight}
                title={'reset-passwd'}
              />
            </View>
          </TouchableOpacity>
        </KeyboardAwareScrollView>
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
  containerInput: {
    flex: 1,
    borderRadius: 16,
    padding: 16,
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
    fontSize: 14,
    color: Colors.gray_4F4F4F,
    marginBottom: 8,
  },
  containerButton: {
    marginTop: 18,
    backgroundColor: Colors.green_00A74C,
    borderRadius: 4,
  },
  headerContainerView: {
    alignItems: 'center',
    flexDirection: 'column',
  },
  containerLogo: {
    width: 48,
    height: 48,
    alignSelf: 'center',
    marginBottom: 18,
  },
  textGrayHightlight: {
    fontSize: 18,
    color: Colors.gray_4F4F4F,
    fontWeight: '700',
    textAlign: 'center',
  },
  textGrayNormal: {
    marginTop: 8,
    fontSize: 16,
    marginBottom: 46,
    color: Colors.gray_4F4F4F,
    textAlign: 'center',
  },
})
