import React, {PureComponent} from 'react'
import {View, Text, TouchableOpacity, Image, StyleSheet} from 'react-native'
import {connect} from 'react-redux'
import {changeLanguage} from '../../store/actions/ChangeLang'

class SwitchLang extends PureComponent {
  setLanguage = language => {
    this.setState({language})
    this.props.setLanguage(language)
  }
  render () {
    const {language, styles} = this.props
    const isVNLang = language === 'vi' ? true : false
    return (
      <View style={[{flexDirection: 'row'}, styles]}>
        <TouchableOpacity
          onPress={() => this.setLanguage('vi')}
          style={isVNLang ? s_styles.bg1 : s_styles.bg2}>
          <Image
            resizeMode='contain'
            style={{width: 24, height: 24}}
            source={require('../../assests/images/ic_flag_vietnam.png')}
          />
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => this.setLanguage('en')}
          style={isVNLang ? s_styles.bg2 : s_styles.bg1}>
          <Image
            resizeMode='contain'
            style={{width: 24, height: 24}}
            source={require('../../assests/images/ic_flag_en.png')}
          />
        </TouchableOpacity>
      </View>
    )
  }
}

const mapStateToProps = state => {
  return {
    language: state.lang.language,
  }
}

const mapDispatchToProps = dispatch => {
  return {
    setLanguage: language => {
      dispatch(changeLanguage(language))
    },
  }
}

const s_styles = StyleSheet.create({
  bg1: {
    width: 30,
    height: 25,
    margin: 10,
    backgroundColor: '#BBF4FD',
    alignItems: 'center',
    borderRadius: 8,
  },
  bg2: {
    width: 30,
    height: 25,
    margin: 10,
    alignItems: 'center',
    borderRadius: 8,
  },
})

export default connect(mapStateToProps, mapDispatchToProps)(SwitchLang)
