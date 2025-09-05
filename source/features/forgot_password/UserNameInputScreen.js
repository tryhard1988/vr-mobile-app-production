import React, {useEffect, useState, useRef} from 'react'
import {
  View,
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
import * as userActions from '../../store/actions/UserAction'
import I18n from '../../config/LanguageConfig'
import AppText from '../../components/SwitchLanguage/AppText'

export default usernameForgotInput = ({navigation}) => {
  const [usernameForgot, setusernameForgot] = useState('')
  const [message, setMessage] = useState('')
  const [isFaild, setIsFaild] = useState(false)
  const [isLoading, setLoading] = useState(false)
  const [usernameForgotValid, setValidusernameForgot] = useState(true)

  const userState = useSelector(state => state.user)

  const dispatch = useDispatch()

  _resetPassword = () => {
    !this._usernameForgotEmpty() ? this._validationCode() : null
  }

  _validationCode = async time => {
    return new Promise(resolve => this.handleConfirmationSubmit())
  }

  _usernameForgotEmpty = (empty = '') => {
    var flag = false
    usernameForgot == empty ? (flag = true) : null
    setValidusernameForgot(usernameForgot != empty)
    switch (empty) {
      case usernameForgot: {
        setMessage('lack-info-error')
        break
      }
    }
    setIsFaild(flag)
    return flag
  }

  onusernameForgotChange = value => {
    setusernameForgot(value)
  }

  handleConfirmationSubmit = async () => {
    setLoading(true)
    Auth.forgotPassword(usernameForgot)
      .then(data => this._forgotPasswordSuccess(data))
      .catch(err => this._forgotPasswordFailure(err.message))
  }

  _forgotPasswordFailure = err => {
    setMessage(err)
    setLoading(false)
    setIsFaild(true)
  }

  _forgotPasswordSuccess = data => {
    setLoading(false)
    dispatch(
      userActions.setUserResetPassword({
        username: usernameForgot,
        email: data?.CodeDeliveryDetails?.Destination,
      }),
    )
    this._pushView()
  }

  _pushView = () => {
    navigation.push('ResetPassword')
  }

  _onBackTap = () => {
    navigation.pop()
  }

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <ToolbarNormal titleToolbar='reset-passwd' onClose={this._onBackTap} />
        <View style={styles.containerContentView}>
          <View style={styles.containerInput}>
            <View style={styles.headerContainerView}>
              <Image
                style={styles.containerLogo}
                resizeMode='contain'
                source={require('../../../source/assests/images/ic_lock_green.png')}
              />
              <AppText
                style={styles.textGrayHightlight}
                title={'forgot-passwd'}
              />
              <AppText
                style={styles.textGrayNormal}
                title={'input-usr-to-reset'}
              />
            </View>
            {isFaild ? <ErrorTitle message={message} /> : null}
            <Input
              title='user-name'
              onChangeText={text => onusernameForgotChange(text)}
              isValid={usernameForgotValid}
              value={usernameForgot}
              displayType='usernameForgot'
            />
            <TouchableOpacity onPress={this._resetPassword}>
              <View style={styles.containerButton}>
                <AppText
                  style={styles.textWhiteHightlight}
                  title={'reset-passwd'}
                />
              </View>
            </TouchableOpacity>
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
