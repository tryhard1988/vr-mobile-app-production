import React, {useState, useEffect, Component} from 'react';
import {
  View,
  Text,
  TextInput,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import Colors from '../../styles/Colors';
import I18n from '../../config/LanguageConfig';

export default SearchInput = ({
  valueSearch,
  onTextChange,
  containerStyle,
  onSubmitSearch,
  onCleanSearch,
  placeholderText,
}) => {
  const [value, setValue] = useState(null);

  useEffect(() => {
    setValue(valueSearch);
  }, [valueSearch]);

  _handleChangeText = (text) => {
    if (text == '') {
      setValue(null);
    } else {
      setValue(text);
    }
  };

  useEffect(() => {
    if (onTextChange) {
      onTextChange(value);
    }
  }, [value]);

  _submitSearch = () => {
    if (onSubmitSearch) {
      onSubmitSearch();
    }
  };

  _cleanSearch = () => {
    setValue(null);
    if (onCleanSearch) {
      onCleanSearch();
    }
  };

  return (
    <View style={[styles.containerSearchBorder, containerStyle]}>
      <TouchableOpacity
        style={styles.containerSearchIcon}
        onPress={_submitSearch}>
        <Image
          resizeMode="contain"
          style={{width: 18, height: 18}}
          source={require('../../assests/images/ic_search_gray.png')}
        />
      </TouchableOpacity>
      <TextInput
        value={value}
        keyboardType="default"
        placeholder={I18n.t(placeholderText)}
        style={styles.searchInput}
        onChangeText={_handleChangeText}
        returnKeyType="search"
        onSubmitEditing={_submitSearch}
      />
      {value && (
        <TouchableOpacity
          style={styles.containerCleanIcon}
          onPress={_cleanSearch}>
          <Image
            resizeMode="contain"
            style={{width: 14, height: 14}}
            source={require('../../assests/images/ic_close_gray.png')}
          />
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  containerSearchBorder: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 40,
    borderRadius: 4,
    backgroundColor: Colors.white,
  },
  containerSearchIcon: {
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerCleanIcon: {
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  searchInput: {
    flex: 1,
    marginHorizontal: 5,
    fontSize: FontSizes.size14,
    color: Colors.black,
  },
});
