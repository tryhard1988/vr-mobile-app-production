import {Auth} from 'aws-amplify'
import React, {useEffect} from 'react'
import {
  View,
  Image,
  StyleSheet,
  ImageBackground,
  Text,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native'
import ProfileCategory from '../../components/Category/ProfileCategory'
import {clearUserLogged, getUserLogged} from '../../helpers/Storages'
import Colors from '../../styles/Colors'
import FontSizes from '../../styles/FontSizes'
import {useSelector, useDispatch} from 'react-redux'
import {deleteCustomer, setUserInfo} from '../../store/actions/UserAction'
import SwitchLang from '../../components/SwitchLanguage/SwitchLang'
import AppText from '../../components/SwitchLanguage/AppText'
import I18n from '../../config/LanguageConfig'

export default ProfileScreen = ({navigation}) => {
  const dispatch = useDispatch()
  const userState = useSelector(state => state.user)

  useEffect(() => {}, [])

  _onClickOrderHistory = () => {
    navigation.push('OrderHistory')
  }

  _onClickDeliveryAddress = () => {
    navigation.push('DeliveryAddress')
  }

  _onClickChangePassword = () => {
    navigation.push('ChangePassword')
  }

  _onClickHelpCenter = () => {
    navigation.push('HelpCenter')
  }

  _onClickAppInformation = () => {
    navigation.push('AppInformation')
  }

  _onClickLogout = () => {
    Alert.alert(null, I18n.t('are-you-sure-logout'), [
      {text: I18n.t('no'), onPress: () => {}, style: 'default'},
      {
        text: I18n.t('yes'),
        onPress: () => {
          Auth.signOut()
          clearUserLogged()
          dispatch(setUserInfo(null))
        },
        style: 'destructive',
      },
    ])
  }

  _onClickDeactiveAccount = () => {
    Alert.alert(null, I18n.t('delete-account'), [
      {text: I18n.t('no'), onPress: () => {}, style: 'default'},
      {
        text: I18n.t('ok'),
        onPress: () => {
          dispatch(deleteCustomer(userState.userInfo?.id))      
        },
        style: 'destructive',
      },
    ])
  }

  _onClickProfile = () => {
    navigation.push('EditProfile')
  }

  _onClickLogin = () => {
    navigation.push('Auth', {screen: 'Login'})
  }

  _onClickRegister = () => {
    navigation.push('Auth', {screen: 'Register'})
  }

  return userState.userInfo ? (
    <View style={styles.container}>
      <ImageBackground
        source={require('../../assests/images/bg_profile.png')}
        resizeMode='cover'
        style={{height: 90, width: '100%'}}>
        <TouchableOpacity
          onPress={_onClickProfile}
          activeOpacity={1}
          style={styles.viewHeader}>
          <Image
            source={
              userState.userAvatarUrl
                ? {uri: userState.userAvatarUrl}
                : require('../../assests/images/img_empty_avatar.png')
            }
            style={{
              height: 60,
              width: 60,
              borderRadius: 30,
              borderColor: Colors.gray_F2,
              borderWidth: 2,
            }}
          />
          <View style={{marginStart: 16, flex: 1}}>
            <Text style={styles.textName}>
              {userState.userInfo?.first_name && userState.userInfo?.last_name
                ? `${userState.userInfo?.last_name} ${userState.userInfo?.first_name}`
                : userState.userInfo?.username}
            </Text>
            <Text style={styles.textCode}>
              {<AppText title='customer-code' />} {userState.userInfo?.id}
            </Text>
          </View>
          <Image
            source={require('../../assests/images/ic_arrow_right_white.png')}
            style={{height: 28, width: 28}}
          />
        </TouchableOpacity>
      </ImageBackground>
      <View style={styles.group}>
        <View
          style={{
            flexDirection: 'row',
            height: 50,
            backgroundColor: Colors.white,
            alignItems: 'center',
            paddingLeft: 16,
            paddingRight: 10,
          }}>
          <Image
            source={require('../../assests/images/ic_language.png')}
            resizeMode='contain'
            style={{height: 20, width: 20}}
          />
          <AppText
            style={{
              flex: 1,
              paddingStart: 12,
              color: Colors.gray_4F4F4F,
              fontSize: FontSizes.size16,
            }}
            title={'language'}
          />
          <SwitchLang />
        </View>
        <View style={styles.line} />
        <ProfileCategory
          onClick={_onClickOrderHistory}
          title='order-history'
          icon={require('../../assests/images/ic_line_order_history.png')}
        />
        <View style={styles.line} />
        <ProfileCategory
          onClick={_onClickDeliveryAddress}
          title='delivery-addr'
          icon={require('../../assests/images/ic_line_location.png')}
        />
        <View style={styles.line} />
        <ProfileCategory
          onClick={_onClickChangePassword}
          title='change-passwd'
          icon={require('../../assests/images/ic_line_change_password.png')}
        />
      </View>
      <View style={[styles.group, {marginBottom: 8}]}>
        <ProfileCategory
          onClick={_onClickHelpCenter}
          title='support'
          icon={require('../../assests/images/ic_line_help.png')}
        />
        <View style={styles.line} />
        <ProfileCategory
          onClick={_onClickAppInformation}
          title='about'
          icon={require('../../assests/images/ic_line_app_info.png')}
        />
        <View style={styles.line} />
        <ProfileCategory
          onClick={_onClickDeactiveAccount}
          title='deactivate'
          icon={require('../../assests/images/deactive.png')}
        />
        <View style={styles.line} />
        <ProfileCategory
          onClick={_onClickLogout}
          title='sign-out'
          icon={require('../../assests/images/ic_line_logout.png')}
        />
      </View>
    </View>
  ) : (
    <View
      style={{
        justifyContent: 'center',
        alignItems: 'center',
        flex: 1,
        marginBottom: 50,
      }}>
      <SwitchLang />
      <AppText style={styles.textNoteLogin} title={'dont-have-acc'} />
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <TouchableOpacity onPress={_onClickLogin} activeOpacity={0.5}>
          <AppText style={styles.textTouchLogin} title={'sign-in'} />
        </TouchableOpacity>
        <Text style={styles.textNoteLogin}>/</Text>
        <TouchableOpacity onPress={_onClickRegister} activeOpacity={0.5}>
          <AppText style={styles.textTouchLogin} title={'sign-up'} />
        </TouchableOpacity>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    flex: 1,
    backgroundColor: Colors.gray_F2,
  },
  viewHeader: {
    ...StyleSheet.absoluteFillObject,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  textName: {
    color: Colors.gray_FEFFFE,
    fontSize: FontSizes.size16,
    fontWeight: '700',
    marginBottom: 4,
  },
  textCode: {
    color: Colors.gray_FEFFFE,
    fontSize: FontSizes.size12,
  },
  group: {
    backgroundColor: Colors.white,
    marginTop: 8,
    paddingBottom: 8,
  },
  line: {
    height: 1,
    backgroundColor: Colors.gray_E0E0E0,
    marginEnd: 14,
    marginStart: 45,
    marginBottom: 8,
  },
  viewEditImage: {
    position: 'absolute',
    bottom: 0,
    width: 120,
    height: 30,
    backgroundColor: '#f80',
    borderBottomEndRadius: 120,
    borderBottomStartRadius: 120,
    transform: [{scaleX: 0.5}],
  },
  textNoteLogin: {
    color: Colors.gray_4F4F4F,
    fontSize: FontSizes.size16,
  },
  textTouchLogin: {
    padding: 8,
    color: Colors.green_00A74C,
    fontSize: FontSizes.size16,
    fontWeight: '700',
  },
})
