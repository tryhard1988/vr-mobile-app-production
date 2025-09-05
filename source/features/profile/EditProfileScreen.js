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
import {checkValidatePhone, errorList, successMessage} from '../../helpers/Utils'
import DateTimePicker from '../../components/Picker/DateTimePicker'
import * as ImagePicker from 'react-native-image-picker'
import {
  setAvatarUrl,
  submitUpdateProfile,
  uploadAvatar,
} from '../../store/actions/UserAction'
import {useDispatch, useSelector} from 'react-redux'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import {Auth} from 'aws-amplify'
import moment from 'moment'
import {
  handleLoading,
  requestError,
  requestSuccess,
} from '../../store/actions/UtilsActions'
import {getAWS, saveAvatar} from '../../helpers/Storages'
import I18n from '../../config/LanguageConfig'
import AppText from '../../components/SwitchLanguage/AppText'

export default EditProfileScreen = ({navigation}) => {
  const dispatch = useDispatch()
  const userState = useSelector(state => state.user)

  const [isDefault, setIsDefault] = useState(false)
  // const [avatar, setAvatar] = useState(userState.userAvatarUrl)
  const [firstName, setFirstName] = useState(
    userState.userInfo?.first_name || '',
  )
  const [lastName, setLastName] = useState(userState.userInfo?.last_name || '')

  const [phone, setPhone] = useState(userState.userInfo?.billing?.phone || '')
  const [email, setEmail] = useState(userState.userInfo?.email || '')
  const [address, setAddress] = useState(
    userState.userInfo?.billing?.address_1 || '',
  )
  const [errorMessage, setErrorMessage] = useState(null)
  const [isEdit, setIsEdit] = useState(false)
  // const [isEditAvatar, setIsEditAvatar] = useState(false)
  const [isShow, setIsShow] = useState(false)
  // const [gender, setGender] = useState('Chọn giới tính')
  const avatar = useSelector(state => state.user.userAvatarUrl)

  const options = {
    mediaType: 'photo',
    quality: 0.5,
    title: 'Thay đổi ảnh đại diện',
    takePhotoButtonTitle: 'Chụp ảnh mới...',
    chooseFromLibraryButtonTitle: 'Lấy ảnh từ thư viện...',
    cancelButtonTitle: 'Hủy bỏ',
    storageOptions: {
      skipBackup: true,
      cameraRoll: false,
    },
  }

  const includeExtra = true

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
      ])
    }
  }, [errorMessage])

  _checkErrorInput = () => {
    if (
      firstName.trim() == '' ||
      lastName.trim() == '' ||
      phone.trim() == '' ||
      address.trim() == ''
    ) {
      setErrorMessage('lack-impotant-data')
      return false
    } else {
      if (!checkValidatePhone(phone)) {
        setErrorMessage('wrong-phone-lenght')
        return false
      }
    }
    return true
  }

  async function _onClickFinish () {
    let checked = await _checkErrorInput()
    if (checked) {
      dispatch(handleLoading(true))
// bug when upload avatar
      // if (isEditAvatar) {
      //   let auth = await Auth.currentAuthenticatedUser()
      //   let fileName = `user_id_${userState.userInfo?.id}_${moment()}`
      //   dispatch(
      //     uploadAvatar(auth, avatar, fileName, _updateAvatarUrlOfCognito),
      //   )
      // }
///////////////
      let params = {
        first_name: firstName,
        last_name: lastName,
        billing: {
          address_1: address,
          phone: phone,
        },
      }
      dispatch(
        submitUpdateProfile(userState.userInfo?.id, params, _updateSuccess),
      )
    }
  }

  _updateSuccess = () => {
    setIsEdit(false)
    dispatch(handleLoading(false))
    dispatch(requestSuccess(successMessage.EDIT_SUCCESS))
    navigation.pop()
  }

  _updateAvatarUrlOfCognito = async (auth, imageUrl) => {
    let result = await Auth.updateUserAttributes(auth, {
      picture: imageUrl,
    })
    if (result == 'SUCCESS') {
      saveAvatar(imageUrl)
      dispatch(setAvatarUrl(imageUrl))
    } else dispatch(requestError(errorList.AVATAR_FAIL))
    dispatch(handleLoading(false))
    navigation.pop()
  }

  _onChangeFirstName = value => {
    setFirstName(value)
    setIsEdit(true)
  }

  _onChangeLastName = value => {
    setLastName(value)
    setIsEdit(true)
  }

  _onChangePhone = value => {
    setPhone(value)
    setIsEdit(true)
  }

  _onChangeAddress = value => {
    setAddress(value)
    setIsEdit(true)
  }

  // _pickMale = () => {
  //   setGender('Nam')
  //   setIsShow(false)
  // }

  // _pickFemale = () => {
  //   setGender('Nữ')
  //   setIsShow(false)
  // }

  _onClickAvatar = () => {
    setIsEdit(true)
    new ImagePicker.launchImageLibrary(
      {
        mediaType: 'photo',
        includeBase64: true,
        selectionLimit: 1,
        includeExtra,
      },
      response => {
        if (response.errorCode) {
          dispatch(requestError('activate-permission'))
        } else if (response.didCancel) {
        } else if (response.customButton) {
        } else {
          var base64Img = response.assets[0].base64
          // setAvatar(`data:image/jpeg;base64,${base64Img}`)
          // setIsEditAvatar(true)
          let fileName = `user_id_${userState.userInfo?.id}_${moment()}`
          dispatch(
            uploadAvatar(`data:image/jpeg;base64,${base64Img}`, fileName, _updateAvatarUrlOfCognito),
          )
        }
      },
    )
  }

  return (
    <TouchableWithoutFeedback onPress={() => setIsShow(false)}>
      <View style={styles.container}>
        <ToolbarNormal
          titleToolbar='edit-profile-toolbar'
          onClose={_handleBack}
        />
        <KeyboardAwareScrollView
          style={styles.containerInput}
          showsVerticalScrollIndicator={false}>
          <View
            style={{
              backgroundColor: Colors.white,
              paddingHorizontal: 16,
              paddingBottom: 8,
            }}>
            <TouchableOpacity
              onPress={_onClickAvatar}
              activeOpacity={0.5}
              style={{alignSelf: 'center', marginTop: 12}}>
              <Image
                source={
                  avatar
                    ? {uri: avatar}
                    : require('../../assests/images/img_empty_avatar.png')
                }
                resizeMode='contain'
                style={{height: 70, width: 70, borderRadius: 35}}
              />
              <View
                style={{
                  position: 'absolute',
                  bottom: 0,
                  right: 0,
                  width: 24,
                  height: 24,
                  backgroundColor: Colors.white,
                  borderRadius: 12,
                  justifyContent: 'center',
                  alignItems: 'center',
                }}>
                <Image
                  source={require('../../assests/images/ic_camera_gray.png')}
                  style={{height: 18, width: 18, borderRadius: 10}}
                />
              </View>
            </TouchableOpacity>
            <Input
              header='first-name'
              isCompulsory
              title='input-fname'
              onChangeText={_onChangeFirstName}
              value={firstName}
            />
            <Input
              header='last-name'
              isCompulsory
              title='input-lname'
              onChangeText={_onChangeLastName}
              value={lastName}
            />
            <Input
              header='email'
              title='add-mail-via-adm'
              isDisable
              value={email}
            />
            {/* <View style={{ zIndex: 2 }}>
                            <Text style={styles.titleGender}>Giới tính</Text>
                            <TouchableOpacity onPress={() => setIsShow(!isShow)} activeOpacity={1} style={styles.viewGender}>
                                <Text style={[{ flex: 1 }, (gender == 'Chọn giới tính') && { color: Colors.gray_BDBDBD }]}>{gender}</Text>
                                <Image
                                    source={require('../../assests/images/ic_arrow_down_gray.png')}
                                    style={{ height: 16, width: 16 }}
                                />
                            </TouchableOpacity>
                            {isShow && <View style={styles.genderPicker}>
                                <TouchableOpacity onPress={_pickMale} activeOpacity={0.5} style={styles.itemGender}>
                                    <Text>Nam</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={_pickFemale} activeOpacity={0.5} style={styles.itemGender}>
                                    <Text>Nữ</Text>
                                </TouchableOpacity>
                            </View>}
                        </View> */}
            <Input
              header='phone'
              isCompulsory
              title='phone-numb'
              onChangeText={_onChangePhone}
              keyboardType='numeric'
              value={phone}
            />
            <Input
              header='addr'
              isCompulsory
              title='input-addr'
              isMultiline
              inputStyle={{
                height: 60,
                textAlignVertical: 'top',
                paddingVertical: 5,
              }}
              onChangeText={_onChangeAddress}
              value={address}
            />

            {/* <DateTimePicker
                            title='Ngày sinh'
                        /> */}
          </View>
        </KeyboardAwareScrollView>
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
    </TouchableWithoutFeedback>
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
