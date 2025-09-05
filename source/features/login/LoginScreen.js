import React, {useEffect, useState, useRef} from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  TouchableWithoutFeedback,
  Keyboard,
  ImageBackground,
} from 'react-native';
import {useDispatch} from 'react-redux';
import Colors from '../../styles/Colors';
import Input from '../../components/Other/InputView';
import ErrorLabel from '../../components/Other/ErrorLabel';
import Loading from '../../components/Progress/ProgressDialog';
import {Auth, facebookSignInButton} from 'aws-amplify';
import {
  getAccountLogin,
  getStatePassword,
  saveAccountLogin,
  saveAvatar,
  saveAWS,
  saveStatePassword,
  saveUserLogged,
} from '../../helpers/Storages';
import {
  createCustomer,
  filterCurrentUser,
  sendTokenFCMToAmazonServer,
  setAvatarUrl,
} from '../../store/actions/UserAction';
import {handleLoading} from '../../store/actions/UtilsActions';
import messaging from '@react-native-firebase/messaging';
import {KeyboardAwareScrollView} from 'react-native-keyboard-aware-scroll-view';
import AppText from '../../components/SwitchLanguage/AppText';

export default LoginScreen = ({navigation}) => {
  const dispatch = useDispatch();
  const [isFirstTime, setIsFirstTime] = useState(true);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const [message, setMessage] = useState('');
  const [isFaild, setIsFaild] = useState(false);

  const [fullNameIsValid, setValidFullName] = useState(true);
  const [passwordIsValid, setValidPassword] = useState(true);

  const [isRememberAccount, setRememberAccount] = useState(false);

  const pushView = () => {
    navigation.pop();
  };

  useEffect(() => {
    async function getStateRemember() {
      let state = await getStatePassword();
      setRememberAccount(state);
      if (state == true) {
        getAccountSave();
      }
    }
    async function getAccountSave() {
      let account = await getAccountLogin();
      if (account) {
        setUsername(account.username);
        setPassword(account.password);
        setIsFirstTime(false);
      }
    }

    getStateRemember();
  }, []);

  _signInTap = () => {
    isLoginValid() ? _signIn() : null;
  };

  _signIn = async () => {
    dispatch(handleLoading(true));
    return new Promise((resolve) => _authSignIn());
  };

  const _filterCurrentUser = (userName) => {
    if (userName == '') {
      pushView();
    } else {
      dispatch(filterCurrentUser(userName, pushView));
    }
  };

  const _loginSuccess = (userName, email, password, imageUrl) => {
    dispatch(setAvatarUrl(imageUrl));
    saveAvatar(imageUrl);
    saveAccountLogin({
      username: userName,
      password: password,
    });
    if (isFirstTime) {
      dispatch(createCustomer(userName, email, password, _filterCurrentUser));
    } else {
      _filterCurrentUser(userName);
    }
  };

  _loginFailure = (msg) => {
    dispatch(handleLoading(false));
    setIsFaild(true);
    setMessage(msg ? msg : 'un-known-error');
  };

  isLoginValid = () => {
    return !isLoginEmpty();
  };

  isLoginEmpty = (empty = '') => {
    var flag = false;

    username == empty ? (flag = true) : null;
    password == empty ? (flag = true) : null;

    setValidFullName(username != empty);
    setValidPassword(password != empty);
    switch (empty) {
      case username: {
        setMessage('lack-info-error');
        break;
      }
      case password: {
        setMessage('wrong-passwd');
        break;
      }
    }
    setIsFaild(flag);
    return flag;
  };

  const _authSignIn = async () => {
    let fcmToken = await messaging().getToken();
    await Auth.signIn(username, password)
      .then((data) => {
        Auth.currentAuthenticatedUser()
          .then((data) => {
            _loginSuccess(
              data?.username,
              data?.attributes?.email,
              password,
              data?.attributes?.picture,
            );
            // saveAWS(data)
          })
          .catch((err) => {
            return _loginFailure();
          });
        if (fcmToken) {
          dispatch(
            sendTokenFCMToAmazonServer(
              fcmToken,
              data?.signInUserSession?.idToken?.payload['cognito:username'],
              data?.signInUserSession?.idToken?.payload['cognito:groups'],
            ),
          );
        }
      })
      .catch((err) => {
        if (err['code'] === 'UsernameExistsException') {
          return _loginFailure();
        }
        if (err['code'] === 'InvalidParameterException') {
          return _loginFailure('invalid-usr-name');
        }
        if (!err.message) {
          return _loginFailure();
        } else {
          if (err.message === 'Incorrect username or password.') {
            return _loginFailure('wrong-usrname-passwd');
          }
          return _loginFailure();
        }
      });
  };

  onUsernameChange = (value) => {
    !isFirstTime && setIsFirstTime(true);
    setUsername(value);
  };

  onPasswordChange = (value) => {
    !isFirstTime && setIsFirstTime(true);
    setPassword(value);
  };

  _renderRememberAccount = () => {
    return (
      <Image
        style={styles.containerIcon}
        source={
          isRememberAccount
            ? require('../../../source/assests/images/ic_check_green.png')
            : require('../../../source/assests/images/ic_uncheck_gray.png')
        }
      />
    );
  };

  const _rememberAccountChange = () => {
    setRememberAccount(!isRememberAccount);
  };

  useEffect(() => {
    if (isRememberAccount) {
      saveStatePassword(true);
    } else {
      saveStatePassword(false);
    }
  }, [isRememberAccount]);

  const _onSignUp = () => {
    navigation?.push('Register');
  };

  const _onBackHome = () => {
    navigation?.navigate('Main', {screen: 'Home'});
  };

  return (
    <ImageBackground
      style={styles.containerImageBackground}
      source={require('../../../source/assests/images/ic_login_background.png')}>
      <KeyboardAwareScrollView
        style={styles.container}
        showsVerticalScrollIndicator={false}>
        {/* <Image
                        style={styles.containerImageBackground}
                        source={require("../../../source/assests/images/ic_login_background.png")} /> */}
        <View style={styles.containerContentView}>
          <Image
            style={styles.containerLogo}
            resizeMode="contain"
            source={require('../../../source/assests/images/ic_logo.png')}
          />
          <View style={styles.containerInput}>
            <AppText style={styles.textHightlight} title={'sign-in'} />
            {isFaild ? <ErrorLabel message={message} /> : null}
            <Input
              title="user-name"
              onChangeText={(text) => onUsernameChange(text)}
              isValid={fullNameIsValid}
              value={username}
              displayType="userName"
            />
            <Input
              title="pass-wd"
              onChangeText={(text) => onPasswordChange(text)}
              isValid={passwordIsValid}
              value={password}
              displayType="password"
            />
            <TouchableOpacity onPress={_signInTap}>
              <View style={styles.containerButton}>
                <AppText style={styles.textWhiteHightlight} title={'sign-in'} />
              </View>
            </TouchableOpacity>
            <View style={styles.containerFooterInput}>
              <TouchableOpacity
                onPress={_rememberAccountChange}
                activeOpacity={1}>
                <View style={styles.containerRememberAccount}>
                  {_renderRememberAccount()}
                  <AppText style={styles.textNormal} title={'remember-me'} />
                </View>
              </TouchableOpacity>
              <View style={styles.containerForgotPassword}>
                <TouchableOpacity
                  onPress={() => {
                    navigation.push('UserNameInput');
                  }}>
                  <AppText
                    style={styles.textNormalGreen}
                    title={'forgot-passwd'}
                  />
                </TouchableOpacity>
                <Image
                  style={styles.containerIcon}
                  source={require('../../../source/assests/images/ic_question_green.png')}
                />
              </View>
            </View>
            <View style={styles.containerRegister}>
              <AppText style={styles.textNormal} title={'dont-have-acc'} />
              <TouchableOpacity style={styles.containerTextRegister}>
                <TouchableOpacity onPress={_onSignUp}>
                  <AppText style={styles.textBoldGreen} title={'sign-up'} />
                </TouchableOpacity>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={_onBackHome}
              style={{margin: 8, marginTop: 12}}>
              <AppText style={styles.textBoldGreen} title={'back-to-home'} />
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>
    </ImageBackground>
  );
};

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
    marginVertical: 65,
  },
  containerInput: {
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 16,
    backgroundColor: 'white',
    shadowColor: Colors.gray_BDBDBD,
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 4,
  },
  textHightlight: {
    fontWeight: '700',
    fontSize: 18,
    marginBottom: 8,
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
    fontWeight: '400',
    fontSize: 14,
    color: Colors.green_00A74C,
    alignSelf: 'center',
    marginEnd: 8,
  },
  textBoldGreen: {
    fontWeight: '700',
    fontSize: 14,
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
  containerTextRegister: {
    marginStart: 8,
  },
  containerRegister: {
    justifyContent: 'center',
    marginTop: 16,
    flexDirection: 'row',
  },
});
