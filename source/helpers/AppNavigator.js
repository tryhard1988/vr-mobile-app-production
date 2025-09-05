import React, {useEffect} from 'react'
import {TouchableOpacity, View, Alert, Image} from 'react-native'
import {useSelector, useDispatch} from 'react-redux'
import {NavigationContainer} from '@react-navigation/native'
import {createStackNavigator, TransitionPresets} from '@react-navigation/stack'
import {createMaterialTopTabNavigator} from '@react-navigation/material-top-tabs'
import DropdownAlert from 'react-native-dropdownalert'
import {AlertHelper} from './AlertHelper'
import Colors from '../styles/Colors'
import FontSizes from '../styles/FontSizes'
import messaging from '@react-native-firebase/messaging'
import * as utilsActions from '../store/actions/UtilsActions'
import ProgressDialog from '../components/Progress/ProgressDialog'

import SplashScreen from '../features/splash/SplashScreen'
import LoginScreen from '../features/login/LoginScreen'
import HomeScreen from '../features/home/HomeScreen'
import ProductsScreen from '../features/products/ProductsScreen'
import NotificationScreen from '../features/notifications/NotificationScreen'
import RegisterScreen from '../features/register/RegisterScreen'
import VerificationCodeScreen from '../features/register/VerificationCodeScreen'
import Tab from '../components/Example/Tab'
import ProductDetailScreen from '../features/products/ProductDetailScreen'
import UserNameInputScreen from '../features/forgot_password/UserNameInputScreen'
import ResetPasswordScreen from '../features/forgot_password/ResetPasswordScreen'
import CartScreen from '../features/cart/CartScreen'
import OrderInformationScreen from '../features/cart/OrderInformationScreen'
import InputDeliveryAddressScreen from '../features/delivery-address/InputDeliveryAddressScreen'
import DeliveryAddressScreen from '../features/delivery-address/DeliveryAddressScreen'
import ProfileScreen from '../features/profile/ProfileScreen'
import EditProfileScreen from '../features/profile/EditProfileScreen'
import OrderHistoryScreen from '../features/order-history/OrderHistoryScreen'
import OrderHistoryDetailScreen from '../features/order-history/OrderHistoryDetailScreen'
import AppInformationScreen from '../features/profile/AppInformationScreen'
import HelpCenterScreen from '../features/profile/HelpCenterScreen'
import ChangePasswordScreen from '../features/profile/ChangePasswordScreen'
import PostScreen from '../features/post/PostScreen'
import PostDetailScreen from '../features/post/PostDetailScreen'
import ScanCodeScreen from '../features/scan-code/ScanCodeScreen'
import InputCodeScreen from '../features/scan-code/InputCodeScreen'
import CodeScreen from '../features/scan-code/CodeScreen'
import AppText from '../components/SwitchLanguage/AppText'
import I18n from '../config/LanguageConfig'

const MainStack = createStackNavigator()
const AuthStack = createStackNavigator()
const BottomTabs = createMaterialTopTabNavigator()
const ScanCodeTabs = createMaterialTopTabNavigator()

const AppNavigator = () => {
  const ref = React.useRef(null)
  const utilsState = useSelector(state => state.utils)
  const dispatch = useDispatch()

  useEffect(() => {
    requestUserPermission()
    const unsubscribe = messaging().onMessage(async remoteMessage => {
      Alert.alert(
        remoteMessage?.notification?.title,
        remoteMessage?.notification?.body,
      )
    })

    return unsubscribe
  }, [])

  requestUserPermission = async () => {
    const authStatus = await messaging().requestPermission()
    const enabled =
      authStatus === messaging.AuthorizationStatus.AUTHORIZED ||
      authStatus === messaging.AuthorizationStatus.PROVISIONAL

    if (enabled) {
      await messaging().getToken()
    }
  }

  useEffect(() => {
    if (utilsState.isError == true) {
      AlertHelper.showError(I18n.t('error'), I18n.t(utilsState.message))
      dispatch(utilsActions.clearError())
    }
  }, [utilsState.isError])

  useEffect(() => {
    if (utilsState.hasRawMessage == true) {
      AlertHelper.showError(I18n.t('error'), utilsState.message)
      dispatch(utilsActions.clearError())
    }
  }, [utilsState.hasRawMessage])

  useEffect(() => {
    if (utilsState.isSuccess) {
      AlertHelper.showSuccess('', I18n.t(utilsState.message))
      dispatch(utilsActions.clearSuccess())
    }
  }, [utilsState.isSuccess])

  useEffect(() => {
    if (utilsState.isLoginAgain) {
      // ref.current.resetRoot()
      dispatch(utilsActions.loginAgain(false))
    }
  }, [utilsState.isLoginAgain])

  return (
    <NavigationContainer ref={ref}>
      <NavStack />
      <DropdownAlert
        messageNumOfLines={2}
        closeInterval={3000}
        defaultContainer={{
          padding: 8,
          paddingTop: Platform.OS == 'ios' ? 30 : 0,
          flexDirection: 'row',
        }}
        ref={ref => AlertHelper.setDropDownModal(ref)}
        onClose={() => AlertHelper.invokeOnClose()}
      />
      {/* <ProgressDialog visible={utilsState.isLoading} /> */}
    </NavigationContainer>
  )
}

export default AppNavigator

const NavStack = () => {
  return (
    <MainStack.Navigator
      initialRouteName='Splash'
      screenOptions={{
        headerShown: false,
        ...TransitionPresets.SlideFromRightIOS,
      }}>
      <AuthStack.Screen name='Splash' component={SplashScreen} />
      <MainStack.Screen name='Auth' component={NavAuthStack} />
      <MainStack.Screen name='Main' component={NavBottomTabs} />
      <MainStack.Screen name='Scan' component={Tab} />
      <MainStack.Screen name='ProductDetail' component={ProductDetailScreen} />
      <MainStack.Screen name='Cart' component={CartScreen} />
      <MainStack.Screen
        name='OrderInformation'
        component={OrderInformationScreen}
      />
      <MainStack.Screen
        name='InputDeliveryAddress'
        component={InputDeliveryAddressScreen}
      />
      <MainStack.Screen
        name='DeliveryAddress'
        component={DeliveryAddressScreen}
      />
      <MainStack.Screen name='EditProfile' component={EditProfileScreen} />
      <MainStack.Screen name='OrderHistory' component={OrderHistoryScreen} />
      <MainStack.Screen
        name='OrderHistoryDetail'
        component={OrderHistoryDetailScreen}
      />
      <MainStack.Screen
        name='AppInformation'
        component={AppInformationScreen}
      />
      <MainStack.Screen name='HelpCenter' component={HelpCenterScreen} />
      <MainStack.Screen
        name='ChangePassword'
        component={ChangePasswordScreen}
      />
      <MainStack.Screen name='Post' component={PostScreen} />
      <MainStack.Screen name='PostDetail' component={PostDetailScreen} />
    </MainStack.Navigator>
  )
}

const NavAuthStack = () => {
  return (
    <AuthStack.Navigator
      initialRouteName='Login'
      screenOptions={{
        headerShown: false,
        ...TransitionPresets.SlideFromRightIOS,
      }}>
      <AuthStack.Screen name='Login' component={LoginScreen} />
      <AuthStack.Screen name='Register' component={RegisterScreen} />
      <AuthStack.Screen
        name='VerificationCode'
        component={VerificationCodeScreen}
      />
      <AuthStack.Screen name='UserNameInput' component={UserNameInputScreen} />
      <AuthStack.Screen name='ResetPassword' component={ResetPasswordScreen} />
    </AuthStack.Navigator>
  )
}

export function NavScanCodeTopTabs () {
  return (
    <ScanCodeTabs.Navigator
      tabBar={props => <CustomTextTab {...props} />}
      backBehavior='none'>
      <ScanCodeTabs.Screen
        name='ScanCode'
        component={ScanCodeScreen}
        options={{title: 'scan-qr-tab'}}
      />
      <ScanCodeTabs.Screen
        name='InputCode'
        component={InputCodeScreen}
        options={{title: 'text-qr-tab'}}
      />
    </ScanCodeTabs.Navigator>
  )
}

const NavBottomTabs = ({navigation}) => {
  _handleClickScan = () => {
    navigation.push('Scan')
  }

  return (
    <BottomTabs.Navigator
      tabBarPosition='bottom'
      swipeEnabled={false}
      backBehavior='none'
      initialRouteName='Home'
      screenOptions={{...TransitionPresets.SlideFromRightIOS}}
      tabBar={props => <CustomTab {...props} onScan={_handleClickScan} />}>
      <BottomTabs.Screen name='Home' component={HomeScreen} />
      <BottomTabs.Screen name='Products' component={ProductsScreen} />
      <BottomTabs.Screen name='ButtonScan' component={CodeScreen} />
      <BottomTabs.Screen name='Notifications' component={NotificationScreen} />
      <BottomTabs.Screen name='Profile' component={ProfileScreen} />
    </BottomTabs.Navigator>
  )
}

function CustomTab ({state, descriptors, navigation}) {
  const focusedOptions = descriptors[state.routes[state.index].key].options

  if (focusedOptions.tabBarVisible === false) {
    return null
  }
  return (
    <View
      style={{
        flexDirection: 'row',
        paddingTop: 4,
        paddingBottom: 2,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
        height: 55,
        backgroundColor: Colors.gray_FEFFFE,
        shadowRadius: 20,
        shadowOffset: {
          width: 0,
          height: -3,
        },
        shadowColor: Colors.gray_BDBDBD,
        elevation: 2,
        shadowOpacity: 0.5,
      }}>
      {state.routes.map((route, index) => {
        const {options} = descriptors[route.key]
        let label = route.name

        const isFocused = state.index === index

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          })

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name)
          }
        }

        let icon = ''
        switch (index) {
          case 0: {
            label = 'home-tab'
            if (isFocused) {
              icon = require('../assests/images/ic_home_active.png')
            } else {
              icon = require('../assests/images/ic_home_unactive.png')
            }
            break
          }
          case 1: {
            label = 'product-tab'
            if (isFocused) {
              icon = require('../assests/images/ic_product_active.png')
            } else {
              icon = require('../assests/images/ic_product_unactive.png')
            }
            break
          }
          case 2: {
            label = 'Scan'
            icon = require('../assests/images/ic_barcode.png')
            break
          }
          case 3: {
            label = 'noti-tab'
            if (isFocused) {
              icon = require('../assests/images/ic_notification_active.png')
            } else {
              icon = require('../assests/images/ic_notification_unactive.png')
            }
            break
          }
          case 4: {
            label = 'account-tab'
            if (isFocused) {
              icon = require('../assests/images/ic_user_active.png')
            } else {
              icon = require('../assests/images/ic_user_unactive.png')
            }
            break
          }
        }

        return (
          <TouchableOpacity
            key={index}
            activeOpacity={1}
            accessibilityRole='button'
            accessibilityState={isFocused ? {selected: true} : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            style={{flex: 1}}>
            {index != 2 ? (
              <View
                style={{
                  flex: 1,
                  justifyContent: 'space-around',
                  alignItems: 'center',
                }}>
                <Image
                  style={{width: 22, height: 22}}
                  resizeMode='contain'
                  source={icon}
                />
                <AppText
                  style={{
                    color: isFocused ? Colors.green_00A74C : Colors.gray_BDBDBD,
                    fontSize: FontSizes.size14,
                  }}
                  title={label}
                />
              </View>
            ) : (
              <View
                style={{
                  flex: 1,
                  width: 55,
                  height: 55,
                  borderRadius: 28,
                  backgroundColor: Colors.orange_F68B1F,
                  justifyContent: 'center',
                  alignItems: 'center',
                  alignSelf: 'center',
                  position: 'absolute',
                  bottom: 10,
                }}>
                <Image
                  style={{width: 38, height: 22}}
                  resizeMode='contain'
                  source={icon}
                />
              </View>
            )}
          </TouchableOpacity>
        )
      })}
    </View>
  )
}

function CustomTextTab ({state, descriptors, navigation}) {
  return (
    <View style={{flexDirection: 'row', height: 40}}>
      {state.routes.map((route, index) => {
        const {options} = descriptors[route.key]
        let label =
          options.tabBarLabel !== undefined
            ? options.tabBarLabel
            : options.title !== undefined
            ? options.title
            : route.name

        const isFocused = state.index === index

        const onPress = () => {
          const event = navigation.emit({
            type: 'tabPress',
            target: route.key,
            canPreventDefault: true,
          })

          if (!isFocused && !event.defaultPrevented) {
            navigation.navigate(route.name)
          }
        }

        return (
          <TouchableOpacity
            key={index}
            activeOpacity={1}
            accessibilityRole='button'
            accessibilityState={isFocused ? {selected: true} : {}}
            accessibilityLabel={options.tabBarAccessibilityLabel}
            testID={options.tabBarTestID}
            onPress={onPress}
            style={{flex: 1}}>
            <View
              style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
              <AppText
                style={{
                  color: isFocused ? Colors.green_00A74C : Colors.gray_828282,
                  fontSize: FontSizes.size14,
                  fontWeight: isFocused ? '700' : 'normal',
                }}
                title={label}
              />
              <View
                style={{
                  position: 'absolute',
                  bottom: 1,
                  height: 2,
                  width: '30%',
                  backgroundColor: isFocused
                    ? Colors.green_00A74C
                    : 'transparent',
                }}
              />
            </View>
          </TouchableOpacity>
        )
      })}
    </View>
  )
}
