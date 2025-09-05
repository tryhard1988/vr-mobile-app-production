import React, {useEffect} from 'react'
import {View, Image, StyleSheet, SafeAreaView, Dimensions} from 'react-native'
import {getUserLogged} from '../../helpers/Storages'
import Colors from '../../styles/Colors'
import {useSelector} from 'react-redux'

export default SplashScreen = ({navigation}) => {
  const userState = useSelector(state => state.user)

  performTimeConsumingTask = async time => {
    return new Promise(resolve => checkUser())
  }

  async function checkUser () {
    let user = await getUserLogged()
    userState.userInfo = user
    if (user != null) {
      setTimeout(() => {
        navigation.replace('Main')
      }, 2000)
    } else {
      setTimeout(() => {
        navigation.replace('Login')
      }, 2000)
    }
  }

  useEffect(() => {
    setTimeout(() => {
      navigation.replace('Main')
    }, 2000)
    // this.performTimeConsumingTask()
  }, [])

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeAreaContainerView}>
        <Image
          style={styles.logoCenter}
          source={require('../../../source/assests/images/ic_logo.png')}
        />
        <Image
          style={styles.backgroundFooter}
          resizeMode='contain'
          source={require('../../../source/assests/images/ic_background_footer.png')}
        />
      </SafeAreaView>
      <Image
        style={styles.backgroundFooterBlur}
        source={require('../../../source/assests/images/ic_background_footer_blur.png')}
      />
    </View>
  )
}
const {width, height} = Dimensions.get('window')

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.green_F4FCE9,
    paddingTop: '50%',
    paddingBottom: '20%',
    flexDirection: 'column',
  },
  safeAreaContainerView: {
    flexDirection: 'column',
    flex: 1,
    paddingHorizontal: 12,
  },
  logoCenter: {
    width: 167,
    height: 135,
    alignSelf: 'center',
  },
  backgroundFooter: {
    height: height * 0.3,
    width: '100%',
    position: 'absolute',
    bottom: 0,
  },
  backgroundFooterBlur: {
    width: '100%',
    height: height * 0.2,
    position: 'absolute',
    opacity: 0.5,
    bottom: 0,
  },
})
