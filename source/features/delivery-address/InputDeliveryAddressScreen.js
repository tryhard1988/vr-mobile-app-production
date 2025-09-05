import React, {useEffect, useState, useRef} from 'react'
import {
  View,
  TouchableOpacity,
  StyleSheet,
  Image,
  ScrollView,
  Switch,
  Alert,
} from 'react-native'
import Colors from '../../styles/Colors'
import FontSizes from '../../styles/FontSizes'
import {useDispatch, useSelector} from 'react-redux'
import Input from '../../components/Other/InputView'
import ErrorTitle from '../../components/Other/ErrorLabel'
import ToolbarNormal from '../../components/Other/ToolbarNormal'
import SearchableDialogPicker from '../../components/Picker/SearchableDialogPicker'
import {checkValidateEmail, checkValidatePhone} from '../../helpers/Utils'
import {submitUpdateProfile} from '../../store/actions/UserAction'
import {handleLoading} from '../../store/actions/UtilsActions'
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view'
import I18n from '../../config/LanguageConfig'
import AppText from '../../components/SwitchLanguage/AppText'

export default InputDeliveryAddressScreen = ({navigation}) => {
  const dispatch = useDispatch()
  const userState = useSelector(state => state.user)

  const [isDefault, setIsDefault] = useState(false)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [phone, setPhone] = useState('')
  const [email, setEmail] = useState('')
  const [address, setAddress] = useState('')
  const [provinceSelected, setProvinceSelected] = useState({
    id: null,
    name: null,
  })
  const [districtSelected, setDistrictSelected] = useState({
    id: null,
    name: null,
  })
  const [wardSelected, setWardSelected] = useState({id: null, name: null})
  const [errorMessage, setErrorMessage] = useState(null)

  // const dataTest = [
  //     { "id": 89, "name": "An Giang" },
  //     { "id": 95, "name": "Bạc Liêu" },
  //     { "id": 77, "name": "Bà Rịa - Vũng Tàu" },
  //     { "id": 83, "name": "Bến Tre" },
  //     { "id": 74, "name": "Bình Dương" },
  //     { "id": 70, "name": "Bình Phước" },
  //     { "id": 96, "name": "Cà Mau" },
  //     { "id": 92, "name": "Cần Thơ" },
  //     { "id": 87, "name": "Đồng Tháp" },
  //     { "id": 93, "name": "Hậu Giang" },
  //     { "id": 91, "name": "Kiên Giang" },
  //     { "id": 80, "name": "Long An" },
  //     { "id": 94, "name": "Sóc Trăng" },
  //     { "id": 2, "name": "Tây Ninh" },
  //     { "id": 82, "name": "Tiền Giang" },
  //     { "id": 79, "name": "TP. Hồ Chí Minh" },
  //     { "id": 84, "name": "Trà Vinh" },
  //     { "id": 86, "name": "Vĩnh Long" }
  // ]

  useEffect(() => {
    if (userState.userInfo) {
      setFirstName(userState.userInfo?.billing?.first_name)
      setLastName(userState.userInfo?.billing?.last_name)
      setAddress(userState.userInfo?.billing?.address_1)
      setPhone(userState.userInfo?.billing?.phone)
      setEmail(
        userState.userInfo?.billing?.email || userState.userInfo?.email || '',
      )
    }
  }, [userState.userInfo])

  _handleBack = () => {
    navigation.pop()
  }

  _onSetAddressDefault = () => {
    setIsDefault(!isDefault)
  }

  _onConfirmDeleteAddress = () => {
    Alert.alert(null, I18n.t('wanna-del-addr'), [
      {text: I18n.t('no'), onPress: () => {}, style: 'default'},
      {
        text: I18n.t('yes'),
        onPress: () => {
          _handleDelete()
        },
        style: 'destructive',
      },
    ])
  }

  useEffect(() => {
    if (errorMessage) {
      Alert.alert(null, errorMessage, [
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
      firstName.trim() == '' ||
      lastName.trim() == '' ||
      phone.trim() == '' ||
      address.trim() == '' ||
      email.trim() == ''
    ) {
      setErrorMessage(I18n.t('lack-impotant-data'))
      return false
    } else {
      if (!checkValidatePhone(phone)) {
        setErrorMessage(I18n.t('wrong-phone-lenght'))
        return false
      }
      if (!checkValidateEmail(email)) {
        setErrorMessage(I18n.t('wrong-email-format'))
        return false
      }
    }
    return true
  }

  async function _onClickFinish () {
    let checked = await _checkErrorInput()
    if (checked) {
      // navigation.pop()
      dispatch(handleLoading(true))
      let params = {
        billing: {
          first_name: firstName,
          last_name: lastName,
          address_1: address,
          phone: phone,
          email: email,
        },
      }
      dispatch(
        submitUpdateProfile(userState.userInfo?.id, params, _actionFinish),
      )
    }
  }

  _handleDelete = () => {
    dispatch(handleLoading(true))
    let params = {
      billing: {
        first_name: '',
        last_name: '',
        company: '',
        address_1: '',
        address_2: '',
        city: '',
        postcode: '',
        country: '',
        state: '',
        phone: '',
      },
    }
    dispatch(submitUpdateProfile(userState.userInfo?.id, params, _actionFinish))
  }

  _actionFinish = () => {
    dispatch(handleLoading(false))
    navigation.pop()
  }

  _onChangeFirstName = value => {
    setFirstName(value)
  }

  _onChangeLastName = value => {
    setLastName(value)
  }

  _onChangePhone = value => {
    setPhone(value)
  }

  _onChangeAddress = value => {
    setAddress(value)
  }

  _onChangeEmail = value => {
    setEmail(value)
  }

  return (
    <View style={styles.container}>
      <ToolbarNormal titleToolbar='addr-info-toolbar' onClose={_handleBack} />
      <KeyboardAwareScrollView
        style={styles.containerInput}
        showsVerticalScrollIndicator={false}>
        <View
          style={{
            backgroundColor: Colors.white,
            paddingHorizontal: 16,
            paddingBottom: 8,
          }}>
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
            header='phone'
            isCompulsory
            keyboardType='numeric'
            title='phone-numb'
            onChangeText={_onChangePhone}
            value={phone}
          />
          <Input
            header='email'
            isCompulsory
            title='input-email'
            onChangeText={_onChangeEmail}
            value={email}
          />
          {/* <SearchableDialogPicker
                        title='Tỉnh/Thành phố'
                        isCompulsory
                        placeHolderLabel={'Chọn tỉnh/thành phố'}
                        dataSource={dataTest}
                        searchBarPlaceHolder={"Nhập thông tin tìm kiếm"}
                        selectedLabel={provinceSelected.name}
                        selectedValue={(item) => {
                            setProvinceSelected({ id: item.id, name: item.name })
                            setDistrictSelected({ id: null, name: null })
                            setWardSelected({ id: null, name: null })
                        }}
                    />
                    <SearchableDialogPicker
                        title='Quận/Huyện'
                        isCompulsory
                        placeHolderLabel={'Chọn quận/huyện'}
                        dataSource={dataTest}
                        searchBarPlaceHolder={"Nhập thông tin tìm kiếm"}
                        selectedLabel={districtSelected.name}
                        selectedValue={(item) => {
                            setDistrictSelected({ id: item.id, name: item.name })
                            setWardSelected({ id: null, name: null })
                        }}
                    />
                    <SearchableDialogPicker
                        title='Phường/Xã'
                        isCompulsory
                        placeHolderLabel={'Chọn phường/xã'}
                        dataSource={dataTest}
                        searchBarPlaceHolder={"Nhập thông tin tìm kiếm"}
                        selectedLabel={wardSelected.name}
                        selectedValue={(item) => {
                            setWardSelected({ id: item.id, name: item.name })
                        }}
                    /> */}
          <Input
            header='addr'
            isCompulsory
            isMultiline
            inputStyle={{
              height: 60,
              textAlignVertical: 'top',
              paddingVertical: 5,
            }}
            title='input-addr'
            onChangeText={_onChangeAddress}
            value={address}
          />
        </View>
        {/* <TouchableOpacity onPress={_onSetAddressDefault} activeOpacity={1} style={styles.buttonAddressDefault}>
                    <Text style={{ color: Colors.black_22281F }}>Đặt thành địa chỉ mặc định</Text>
                    <Switch
                        style={{ transform: [{ scaleX: .5 }, { scaleY: .5 }] }}
                        trackColor={{ false: Colors.gray_BDBDBD, true: Colors.green_00A74C }}
                        thumbColor={Colors.white}
                        ios_backgroundColor={Colors.gray_BDBDBD}
                        onValueChange={_onSetAddressDefault}
                        value={isDefault}
                    />
                </TouchableOpacity> */}
        <TouchableOpacity
          onPress={_onConfirmDeleteAddress}
          activeOpacity={1}
          style={styles.buttonAddressDefault}>
          <AppText style={{color: Colors.red_DE3F4E}} title={'del-addr'} />
        </TouchableOpacity>
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
          <AppText style={styles.textButton} title={'confirm'} />
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
})
