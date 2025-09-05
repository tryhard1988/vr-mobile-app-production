import React, {useState, useEffect} from 'react'
import {View, Text, Image, TouchableOpacity, StyleSheet} from 'react-native'
import DateTimePickerModal from 'react-native-modal-datetime-picker'
import Colors from '../../styles/Colors'
import moment from 'moment'

export default DateTimePicker = ({
  customStyle,
  titleStyle,
  touchStyle,
  textDateStyle,
  onChangeDate,
  isRequire = false,
  title,
  valueInit = null,
  type = 'date',
  minimum,
  maximum,
}) => {
  const [value, setValue] = useState(null)
  const [isShowPicker, setIsShowPicker] = useState(false)
  const [isError, setIsError] = useState(false)

  useEffect(() => {
    if (value && onChangeDate) {
      onChangeDate(value)
    }
  }, [value])

  useEffect(() => {
  }, [isShowPicker])

  useEffect(() => {
    if (valueInit) {
      setValue(moment(valueInit, 'DD/MM/YYYY').toDate())
    }
  }, [valueInit])

  _handlePickDate = date => {
    _changeStatePicker()
    setValue(date)
  }

  _changeStatePicker = () => {
    setIsShowPicker(!isShowPicker)
  }

  return (
    <View style={[customStyle]}>
      <Text style={[styles.textTitle, titleStyle]}>
        {title} {isRequire && <Text style={styles.textRequire}>*</Text>}
      </Text>
      <TouchableOpacity
        onPress={_changeStatePicker}
        style={[styles.containerBorder, touchStyle]}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <View style={{flex: 1}}>
            <Text
              style={[
                styles.input,
                !value && {color: Colors.gray_BDBDBD},
                textDateStyle,
              ]}>
              {value
                ? moment(value).format(type == 'date' ? 'DD/MM/YYYY' : 'HH:mm')
                : 'Chọn ngày sinh'}
            </Text>
          </View>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
              marginRight: 12,
            }}>
            <Image
              style={styles.icon}
              resizeMode='cover'
              source={require('../../assests/images/ic_calendar_gray.png')}
            />
          </View>
        </View>
      </TouchableOpacity>
      <DateTimePickerModal
        isVisible={isShowPicker}
        mode={type}
        date={value || new Date()}
        minimumDate={minimum}
        maximumDate={maximum}
        onConfirm={_handlePickDate}
        onCancel={_changeStatePicker}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  containerBorder: {
    // flex : 1,
    backgroundColor: Colors.white,
    height: 40,
    borderWidth: 1,
    borderColor: Colors.gray_BDBDBD,
    borderRadius: 6,
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  icon: {
    width: 18,
    height: 18,
  },
  input: {
    paddingHorizontal: 8,
  },
  containerAge: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute',
    right: 8,
    alignSelf: 'center',
  },
  textMessageError: {
    color: Colors.red,
    fontSize: FontSizes.size14,
    marginTop: 4,
  },
  textTitle: {
    color: Colors.gray_4F4F4F,
    fontSize: FontSizes.size14,
    marginTop: 8,
  },
  textRequire: {
    color: Colors.red_DE3F4E,
  },
})
