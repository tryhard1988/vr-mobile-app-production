import React, {useState, useEffect, Component} from 'react'
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Image,
  TouchableOpacity,
} from 'react-native'
import {connect} from 'react-redux'
import Colors from '../../styles/Colors'
import I18n from '../../config/LanguageConfig'

const InputViewp = ({
  isValid = true,
  title,
  onChangeText,
  value,
  keyboardType = 'default',
  displayType = 'normal',
  isHiddenIcon = false,
  header,
  isMultiline = false,
  isCompulsory = false,
  containerStyle,
  inputStyle,
  isDisable = false,
}) => {
  const [textValue, setTextValue] = useState(value)
  const [isVisibility, setVisibility] = useState(true)

  const _displayType = {
    normal: 'normal',
    userName: 'userName',
    password: 'password',
  }

  _onChangeText = value => {
    onChangeText(value)
  }

  useEffect(() => {
    setTextValue(value)
  }, [value])

  _renderVisibility = () => {
    return _isSecureTextEntry() ? (
      <TouchableOpacity
        style={styles.containerCenter}
        onPress={_inVisibitiliChange}>
        <Image
          style={styles.iconLarge}
          resizeMode='contain'
          source={
            isVisibility
              ? require('../../../source/assests/images/visibility_of.png')
              : require('../../../source/assests/images/visibility.png')
          }
        />
      </TouchableOpacity>
    ) : null
  }

  _renderIcon = () => {
    if (isHiddenIcon) {
      return null
    }
    switch (displayType) {
      case _displayType.userName:
        return (
          <Image
            style={styles.icon}
            resizeMode='contain'
            source={require('../../../source/assests/images/ic_username_gray.png')}
          />
        )
      case _displayType.password:
        return (
          <Image
            style={styles.icon}
            resizeMode='contain'
            source={require('../../../source/assests/images/ic_password_gray.png')}
          />
        )
      default:
        return null
    }
  }

  _isSecureTextEntry = () => {
    return displayType === _displayType.password
  }

  _inVisibitiliChange = () => {
    setVisibility(!isVisibility)
  }

  _renderHeader = () => {
    return header ? (
      <Text style={styles.headerText}>
        {header}
        {isCompulsory && <Text style={{color: Colors.red_DE3F4E}}> *</Text>}
      </Text>
    ) : null
  }

  return (
    <View style={[styles.containerView, containerStyle]}>
      {_renderHeader()}
      <View
        style={
          isValid
            ? [
                styles.containerInput,
                isDisable && {backgroundColor: Colors.gray_F2},
              ]
            : styles.requiredInput
        }>
        {_renderIcon()}
        <TextInput
          editable={!isDisable}
          style={[
            styles.containerTextInput,
            inputStyle,
            isMultiline && {marginTop: 0},
          ]}
          multiline={isMultiline}
          secureTextEntry={
            displayType === _displayType.password ? isVisibility : false
          }
          onChangeText={_onChangeText}
          keyboardType={keyboardType}
          value={textValue}
          placeholder={title}
        />
        {_renderVisibility()}
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  containerView: {
    flexDirection: 'column',
  },
  containerInput: {
    flexDirection: 'row',
    marginVertical: 8,
    borderWidth: 1,
    borderRadius: 6,
    borderColor: Colors.gray_BDBDBD,
  },
  containerTextInput: {
    // marginVertical: 8,
    height: 40,
    flex: 1,
    paddingHorizontal: 8,
    borderRadius: 6,
  },
  requiredInput: {
    marginVertical: 8,
    flexDirection: 'row',
    borderWidth: 1,
    borderRadius: 6,
    borderColor: Colors.red_DE3F4E,
  },
  labelInput: {
    textAlign: 'left',
    fontSize: 16,
    color: Colors.blue_4,
    marginTop: 12,
  },
  icon: {
    alignSelf: 'center',
    width: 16,
    height: 16,
    marginStart: 8,
  },
  iconLarge: {
    width: 18,
    height: 18,
    marginHorizontal: 12,
  },
  containerCenter: {
    alignSelf: 'center',
  },
  headerText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: '400',
    color: Colors.gray_4F4F4F,
  },
})

class InputView extends Component {
  constructor (props) {
    super(props)
    this.state = {
      i18n: I18n,
    }
  }

  componentWillMount () {
    const {language} = this.props
    if (language) this.setMainLocaleLanguage(language)
  }

  componentWillReceiveProps = nextProps => {
    const {language} = nextProps
    if (language) this.setMainLocaleLanguage(language)
  }

  setMainLocaleLanguage = language => {
    let i18n = this.state.i18n
    i18n.locale = language
    this.setState({i18n})
  }

  render () {
    const {
      title,
      value,
      isValid,
      onChangeText,
      keyboardType,
      displayType,
      isHiddenIcon,
      header,
      isMultiline,
      isCompulsory,
      containerStyle,
      inputStyle,
      isDisable,
    } = this.props
    const {i18n} = this.state
    return (
      <InputViewp
        title={title ? i18n.t(title) : this.props.children}
        value={value}
        isValid={isValid}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        displayType={displayType}
        isHiddenIcon={isHiddenIcon}
        header={header ? i18n.t(header) : this.props.children}
        isMultiline={isMultiline}
        isCompulsory={isCompulsory}
        containerStyle={containerStyle}
        inputStyle={inputStyle}
        isDisable={isDisable}
      />
    )
  }
}

const mapStateToProps = state => {
  return {
    language: state.lang.language,
  }
}

export default connect(mapStateToProps, null)(InputView)
