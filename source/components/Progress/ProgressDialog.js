import React from 'react'
import {Modal, View, StyleSheet, Text, ActivityIndicator} from 'react-native'
import Colors from '../../styles/Colors'
import AppText from '../SwitchLanguage/AppText'

const ProgressDialog = ({visible}) => (
  <Modal transparent={true} visible={visible}>
    <View style={styles.container}>
      <View style={styles.content}>
        <AppText style={styles.title} title={'processing'} />
        <View style={styles.loading}>
          <View style={styles.loader}>
            <ActivityIndicator color={Colors.green_00A74C} size='large' />
          </View>
        </View>
      </View>
    </View>
  </Modal>
)

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,.4)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: 35,
    borderRadius: 8,
    backgroundColor: 'white',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.orange_2,
  },
  loading: {
    flexDirection: 'row',
    marginTop: 12,
    alignItems: 'center',
  },
  loader: {
    flex: 1,
  },
  loadingContent: {
    flex: 3,
    fontSize: 16,
    paddingHorizontal: 10,
  },
})

export default ProgressDialog
