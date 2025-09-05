import React, {useEffect, useState, useRef} from 'react'
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Switch,
  Alert,
  TouchableWithoutFeedback,
} from 'react-native'
import Colors from '../../styles/Colors'
import FontSizes from '../../styles/FontSizes'
import Input from '../../components/Other/InputView'
import ToolbarNormal from '../../components/Other/ToolbarNormal'
import {checkValidatePassword} from '../../helpers/Utils'
import {Auth} from 'aws-amplify'
import {getUserLogged, saveAWS} from '../../helpers/Storages'
import I18n from '../../config/LanguageConfig'
import AppText from '../../components/SwitchLanguage/AppText'

export default ChangePasswordScreen = ({navigation}) => {
  const [currentPass, setCurrentPass] = useState('')
  const [newPass, setNewPass] = useState('')
  const [confirmPass, setConfirmPass] = useState('')
  const [errorMessage, setErrorMessage] = useState(null)
  const [isEdit, setIsEdit] = useState(false)

  useEffect(() => {}, [])

  _handleBack = () => {
    if (isEdit) {
      Alert.alert(null, I18n.t('not-save-yet'), [
        {text: I18n.t('no'), onPress: () => {}, style: 'default'},
        {
          text: I18n.t('yes'),
          onPress: () => {
            navigation.pop()
          },
          style: 'destructive',
        },
      ])
    } else {
      navigation.pop()
    }
  }

  useEffect(() => {
    if (errorMessage) {
      Alert.alert(null, I18n.t(errorMessage), [
        {
          text: '0k',
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
    if (currentPass == '' || newPass == '' || confirmPass == '') {
      setErrorMessage('lack-impotant-data')
      return false
    } else {
      if (
        !checkValidatePassword(currentPass) ||
        !checkValidatePassword(newPass) ||
        !checkValidatePassword(confirmPass)
      ) {
        setErrorMessage('weak-passwd')
        return false
      } else {
        if (newPass !== confirmPass) {
          setErrorMessage('pls-check-re-enter-pass')
          return false
        }
      }
      return true
    }
  }

  async function _onClickFinish () {
    let checked = await _checkErrorInput()
    if (checked) {
      await Auth.currentAuthenticatedUser()
        .then(user => {
          // saveAWS(user)
          return Auth.changePassword(user, currentPass, newPass)
        })
        .then(data =>
          Alert.alert(null, I18n.t('change-pass-suc'), [
            {
              text: I18n.t('0k'),
              onPress: () => {
                navigation.pop()
              },
              style: 'default',
            },
          ]),
        )
        .catch(err =>
          Alert.alert(null, err.message, [
            {
              text: I18n.t('0k'),
              onPress: () => {
                navigation.pop()
              },
              style: 'default',
            },
          ]),
        )
    }
  }

  _onChangeCurrentPass = value => {
    setCurrentPass(value)
    setIsEdit(true)
  }

  _onChangeNewPass = value => {
    setNewPass(value)
    setIsEdit(true)
  }

  _onChangeConfirmPass = value => {
    setConfirmPass(value)
    setIsEdit(true)
  }

  return (
    <View style={styles.container}>
      <ToolbarNormal titleToolbar='change-passwd' onClose={_handleBack} />
      <ScrollView style={styles.containerInput}>
        <View
          style={{
            backgroundColor: Colors.white,
            paddingHorizontal: 16,
            paddingBottom: 8,
          }}>
          <Input
            header='old-pass'
            title='enter-old-pass'
            onChangeText={_onChangeCurrentPass}
            value={currentPass}
            displayType='password'
          />

          <Input
            header='new-pass'
            title='enter-new-pass'
            onChangeText={_onChangeNewPass}
            value={newPass}
            displayType='password'
          />
          <Input
            header='new-pass-2'
            title='enter-new-pass-2'
            onChangeText={_onChangeConfirmPass}
            value={confirmPass}
            displayType='password'
          />
        </View>
      </ScrollView>
      <View
        style={{
          backgroundColor: Colors.white,
          paddingVertical: 10,
          paddingHorizontal: 16,
        }}>
        <TouchableOpacity
          onPress={_onClickFinish}
          activeOpacity={0.5}
          style={styles.containerButton}>
          <AppText style={styles.textButton} title={'update'} />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray_F2,
  },
  containerInput: {
    marginVertical: 8,
    backgroundColor: Colors.gray_F2,
  },
  containerButton: {
    height: 40,
    backgroundColor: Colors.green_00A74C,
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textButton: {
    fontSize: FontSizes.size16,
    color: 'white',
  },
  buttonAddressDefault: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingStart: 16,
    paddingEnd: 10,
    marginTop: 8,
    height: 40,
    backgroundColor: Colors.white,
  },
  titleGender: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '400',
    color: Colors.gray_4F4F4F,
  },
  viewGender: {
    zIndex: 1,
    height: 40,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
    paddingHorizontal: 8,
    borderWidth: 1,
    borderRadius: 6,
    borderColor: Colors.gray_BDBDBD,
  },
  genderPicker: {
    borderRadius: 6,
    borderColor: Colors.gray_E0E0E0,
    borderWidth: 0.5,
    position: 'absolute',
    left: 0,
    top: 75,
    zIndex: 0,
    width: '100%',
    backgroundColor: Colors.white,
  },
  itemGender: {
    height: 40,
    justifyContent: 'center',
    marginHorizontal: 16,
    borderBottomColor: Colors.gray_E0E0E0,
    borderBottomWidth: 0.5,
  },
})
