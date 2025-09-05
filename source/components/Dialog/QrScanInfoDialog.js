import moment from 'moment'
import React, {useState, useEffect, useCallback} from 'react'
import {
  View,
  Text,
  Modal,
  TouchableHighlight,
  Image,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from 'react-native'
import Colors from '../../styles/Colors'
import AppText from '../SwitchLanguage/AppText'

export default QrScanInfoDialog = React.memo(
  ({modalVisible, closeDialog, data}) => {
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
      setIsLoading(modalVisible)
    }, [modalVisible])

    _handleClose = () => {
      if (closeDialog) {
        closeDialog()
      }
    }

    const _renderChemicalsUsedItem = useCallback(
      ({item, index}) => (
        <View style={{marginStart: 20, flexDirection: 'row'}}>
          <Text style={{color: Colors.green_00A74C, paddingEnd: 4}}>●</Text>
          <View>
            <Text>Name of the Chemical: {item?.tenhoachat}</Text>
            <Text>
              When use the Chemical:{' '}
              {item?.thoigiansudung &&
                moment(item.thoigiansudung, 'YYYY-MM-DD').format('DD/MM/YYYY')}
            </Text>
            <Text>How use the Chemical: {item?.phuongthucsudung}</Text>
          </View>
        </View>
      ),
      [],
    )

    return (
      <Modal
        style={styles.containerView}
        animationType='fade'
        transparent={true}
        visible={isLoading}
        onRequestClose={() => {}}>
        <TouchableOpacity activeOpacity={1} style={[styles.view]}>
          <View style={[styles.container]}>
            <View style={[styles.line]} />
            <View style={[styles.containerFull]}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingVertical: 2,
                }}>
                <Text style={{color: Colors.green_00A74C, paddingEnd: 8}}>
                  LOT:
                </Text>
                <Text>{data?.id}</Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingVertical: 2,
                }}>
                <Text style={{color: Colors.green_00A74C, paddingEnd: 8}}>
                  SKU:
                </Text>
                <Text>{data?.masanpham}</Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingVertical: 2,
                }}>
                <Text style={{color: Colors.green_00A74C, paddingEnd: 8}}>
                  Name of product:
                </Text>
                <Text>{data?.englishname}</Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingVertical: 2,
                }}>
                <Text style={{color: Colors.green_00A74C, paddingEnd: 8}}>
                  Vietnamese name:
                </Text>
                <Text>{data?.tensanpham}</Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingVertical: 2,
                }}>
                <Text style={{color: Colors.green_00A74C, paddingEnd: 8}}>
                  Botanical name:
                </Text>
                <Text>{data?.botanicalname}</Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingVertical: 2,
                }}>
                <Text style={{color: Colors.green_00A74C, paddingEnd: 8}}>
                  Seeded/Planted:
                </Text>
                <Text>{data?.planted}</Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingVertical: 2,
                }}>
                <Text style={{color: Colors.green_00A74C, paddingEnd: 8}}>
                  Harvest:
                </Text>
                <Text>{data?.harvest}</Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingVertical: 2,
                }}>
                <Text style={{color: Colors.green_00A74C, paddingEnd: 8}}>
                  Field Nr:
                </Text>
                <Text>{data?.fieldnr}</Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingVertical: 2,
                }}>
                <Text style={{color: Colors.green_00A74C, paddingEnd: 8}}>
                  Name of the farm:
                </Text>
                <Text>{data?.tencuafarm}</Text>
              </View>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  paddingVertical: 2,
                }}>
                <Text style={{color: Colors.green_00A74C, paddingEnd: 8}}>
                  Address:
                </Text>
                <Text style={{flex: 1, textAlign: 'right'}}>
                  {data?.vitricuafarm}
                </Text>
              </View>
              {data?.ChemicalsUsed.length > 0 ? (
                <View>
                  <View style={{paddingVertical: 2}}>
                    <Text style={{color: Colors.green_00A74C, paddingEnd: 8}}>
                      ChemicalsUsed:
                    </Text>
                  </View>
                  <FlatList
                    style={{maxHeight: 150}}
                    data={data.ChemicalsUsed}
                    renderItem={_renderChemicalsUsedItem}
                    keyExtractor={(e, i) => i.toString()}
                    extraData={(e, i) => i.toString()}
                  />
                </View>
              ) : (
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    paddingVertical: 2,
                  }}>
                  <Text style={{color: Colors.green_00A74C, paddingEnd: 8}}>
                    ChemicalsUsed:
                  </Text>
                  <Text style={{flex: 1, textAlign: 'right'}}>N/A</Text>
                </View>
              )}
            </View>
            <TouchableOpacity
              onPress={closeDialog}
              activeOpacity={1}
              style={{
                margin: 16,
                borderRadius: 4,
                paddingVertical: 10,
                paddingHorizontal: 20,
                backgroundColor: Colors.green_00A74C,
                alignSelf: 'flex-end',
              }}>
              <AppText style={{color: Colors.white}} title={'close'} />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    )
  },
)

const styles = StyleSheet.create({
  containerView: {
    flex: 1,
  },
  view: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(52, 52, 52, 0.7)',
  },
  container: {
    width: '90%',
    backgroundColor: Colors.white,
    borderRadius: 2,
  },
  line: {
    height: 6,
    backgroundColor: Colors.green_00A74C,
  },
  containerFull: {
    marginTop: 12,
    paddingHorizontal: 16,
  },
  textMessage: {
    color: Colors.black_22281F,
    fontSize: 14,
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 16,
  },
})
