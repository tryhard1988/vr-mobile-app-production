import React, {useEffect, useState, useRef} from 'react'
import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  ImageBackground,
} from 'react-native'
import Colors from '../../styles/Colors'
import Input from '../../components/Other/InputView'
import ErrorTitle from '../../components/Other/ErrorLabel'
import Loading from '../../components/Progress/ProgressDialog'
import {useSelector, useDispatch} from 'react-redux'
import {Auth} from 'aws-amplify'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import AppText from '../../components/SwitchLanguage/AppText'
import {setUserRegister} from '../../store/actions/UserAction'

export default RegisterScreen = ({navigation}) => {
  const [username, setUserName] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')

  const [message, setMessage] = useState('')
  const [isFaild, setIsFaild] = useState(false)
  const [isLoading, setLoading] = useState(false)

  const [usernameIsValid, setValidUsername] = useState(true)
  const [passwordIsValid, setValidPassword] = useState(true)
  const [emailIsValid, setValidEmail] = useState(true)

  const dispatch = useDispatch()

  useEffect(() => {}, [])

  _signUpTap = () => {
    this._signUpIsValid() ? this._onSignUp() : null
  }

  _onSignUp = async time => {
    setLoading(true)
    return new Promise(resolve => this._signUp())
  }

  _signUp = async () => {
    await Auth.signUp({
      username,
      password,
      attributes: {
        email,
      },
    })
      .then(data => {
        this._signUpSuccess()
      })
      .catch(err => {
        switch (err.message) {
          case 'User already exists':
            return _signUpfailure('usr-exists')
          default:
            return _signUpfailure()
        }
      })
  }

  _signUpSuccess = () => {
    setLoading(false)
    let data = {username: username, email: email}
    dispatch(setUserRegister(data))
    navigation.push('VerificationCode')
  }

  _signUpfailure = msg => {
    setLoading(false)
    setIsFaild(true)
    setMessage(msg ? msg : 'un-known-error')
  }

  _signUpIsValid = () => {
    return !this._signUpEmpty() && this._inputIsValid()
  }

  _signUpEmpty = (empty = '') => {
    var flag = false

    username == empty ? (flag = true) : null
    password == empty ? (flag = true) : null
    email == empty ? (flag = true) : null

    setValidUsername(username != empty)
    setValidPassword(password != empty)
    setValidEmail(email != empty)

    switch (empty) {
      case username: {
        setMessage('lack-info-error')
        break
      }
      case email: {
        setMessage('lack-info-error')
        break
      }
      case password: {
        setMessage('wrong-passwd')
        break
      }
    }
    setIsFaild(flag)
    return flag
  }

  onUsernameChange = value => {
    setUserName(value.trim())
  }

  onPasswordChange = value => {
    setPassword(value.trim())
  }

  onEmailChange = value => {
    setEmail(value.trim())
  }

  _onSignIn = () => {
    navigation.push('Auth', {screen: 'Login'})
  }

  _inputIsValid = () => {
    var flag = true
    let regEmail = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
    let regPasswrod = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/
    if (regEmail.test(email) === false) {
      setIsFaild(flag)
      setMessage('wrong-email-format')
      setValidEmail(false)
      flag = false
      return flag
    }
    if (regPasswrod.test(password) === false) {
      setIsFaild(flag)
      setMessage('weak-passwd')
      setValidPassword(false)
      flag = false
      return flag
    }
    return flag
  }

  _onBackHome = () => {
    navigation?.navigate('Main', {screen: 'Home'})
  }

  return (
    <ImageBackground
      style={styles.containerImageBackground}
      source={require('../../../source/assests/images/ic_login_background.png')}>
      <KeyboardAwareScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}
        enableOnAndroid={true}>
        <View style={styles.containerContentView}>
          <Image
            style={styles.containerLogo}
            resizeMode='contain'
            source={require('../../../source/assests/images/ic_logo.png')}
          />
          <View style={styles.containerInput}>
            <AppText style={styles.textHightlight} title={'sign-up'} />

            {isFaild ? <ErrorTitle message={message} /> : null}
            <Input
              header='user-name'
              title='user-name'
              onChangeText={text => onUsernameChange(text)}
              isValid={usernameIsValid}
              value={username}
            />
            <Input
              header='input-email'
              title='input-email'
              onChangeText={text => onEmailChange(text)}
              isValid={emailIsValid}
              value={email}
              isHiddenIcon={true}
            />
            <Input
              header='pass-wd'
              title='pass-wd'
              onChangeText={text => onPasswordChange(text)}
              isValid={passwordIsValid}
              value={password}
              isHiddenIcon={true}
              displayType='password'
            />
            <TouchableOpacity onPress={this._signUpTap}>
              <View style={styles.containerButton}>
                <AppText style={styles.textWhiteHightlight} title={'sign-up'} />
              </View>
            </TouchableOpacity>
            <View style={styles.containerFooter}>
              <AppText style={styles.textNormal} title={'already-have-acc'} />
              <TouchableOpacity onPress={this._onSignIn}>
                <AppText style={styles.textNormalGreen} title={'sign-in'} />
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={_onBackHome}
              style={{margin: 8, marginTop: 12}}>
              <AppText style={styles.textNormalGreen} title={'back-to-home'} />
            </TouchableOpacity>
          </View>
        </View>
        <Loading visible={isLoading} />
      </KeyboardAwareScrollView>
    </ImageBackground>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  containerImageBackground: {
    width: '100%',
    height: '100%',
  },
  containerContentView: {
    flex: 1,
  },
  containerLogo: {
    width: 120,
    height: 94,
    alignSelf: 'center',
    marginVertical: 20,
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
  textNormalGreen: {
    fontWeight: '700',
    fontSize: 14,
    marginStart: 6,
    color: Colors.green_00A74C,
    alignSelf: 'center',
    marginEnd: 8,
  },
  containerButton: {
    marginTop: 18,
    backgroundColor: Colors.green_00A74C,
    borderRadius: 4,
  },
  containerFooterInput: {
    marginTop: 18,
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  containerRememberAccount: {
    flexDirection: 'row',
  },
  containerForgotPassword: {
    flexDirection: 'row',
  },
  containerIcon: {
    width: 18,
    height: 18,
  },
  containerFooter: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 28,
  },
})
