import React, {useEffect, useState, useRef, useCallback} from 'react'
import {
  Text,
  ScrollView,
  StyleSheet,
  View,
  TouchableOpacity,
  Image,
  FlatList,
  Dimensions,
  ActivityIndicator,
} from 'react-native'
import Colors from '../../styles/Colors'
import FontSizes from '../../styles/FontSizes'
import {MenuProvider} from 'react-native-popup-menu'
import ToolbarNormal from '../../components/Other/ToolbarNormal'
import ItemPost from '../../components/Post/ItemPost'
import {getListPosts, getMoreListPosts} from '../../store/actions/PostsActions'
import {useDispatch, useSelector} from 'react-redux'

const {width} = Dimensions.get('screen')

export default DishScreen = ({navigation}) => {
  const dispatch = useDispatch()
  const postsState = useSelector(state => state.posts)
  const [loadingMore, setLoadingMore] = useState(false)
  const language = useSelector(state => state.lang.language)

  _handleRefresh = () => {
    dispatch(getListPosts(true, language))
  }

  useEffect(() => {
    dispatch(getListPosts(true, language))
  }, [language])

  useEffect(() => {
    if (postsState.listPosts.length > 0) {
      setLoadingMore(false)
    }
  }, [postsState.listPosts])

  useEffect(() => {
    if (!postsState.isMore) {
      loadingMore && setLoadingMore(false)
    }
  }, [postsState.isMore])

  _handleClickCategoryItem = item => {
    setCategorySelected(item.id)
  }

  const _renderPostItem = useCallback(
    ({item, index}) => (
      <ItemPost
        index={index}
        value={item}
        onClickItem={_onClickItem}
        isDate={true}
        itemStyle={styles.containerPost}
        imageStyle={styles.imageView}
      />
    ),
    [],
  )

  _onClickItem = (value, index) => {
    navigation.push('PostDetail', {item: value, index: index})
  }

  _handleBack = () => {
    navigation.pop()
  }

  _handleLoadMore = () => {
    if (postsState.isMore) {
      setLoadingMore(true)
      dispatch(getMoreListPosts(postsState.pageIndex + 1))
    }
  }

  const _renderFooter = useCallback(() => {
    if (!loadingMore) return <View style={{height: 10}} />
    return (
      <View style={styles.containerLoadMore}>
        <ActivityIndicator animating color={Colors.gray_4F4F4F} size='large' />
      </View>
    )
  }, [loadingMore])

  return (
    <View style={styles.container}>
      <ToolbarNormal titleToolbar='post-list' onClose={_handleBack} />
      <FlatList
        style={{marginTop: 10, marginHorizontal: 10}}
        numColumns={2}
        showsVerticalScrollIndicator={false}
        data={postsState.listPosts}
        renderItem={_renderPostItem}
        extraData={(e, i) => i.toString()}
        keyExtractor={(e, i) => i.toString()}
        onEndReached={_handleLoadMore}
        onEndReachedThreshold={0.1}
        ListFooterComponent={_renderFooter}
        onRefresh={_handleRefresh}
        refreshing={false}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.gray_F2,
  },
  headerBar: {
    flexDirection: 'row',
    paddingTop: 14,
    marginBottom: 4,
    marginHorizontal: 16,
  },
  iconCart: {
    marginLeft: 10,
    height: 40,
    width: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  containerPost: {
    backgroundColor: Colors.white,
    flex: 1,
    marginHorizontal: 6,
    marginBottom: 12,
    maxWidth: width / 2 - 22,
    borderRadius: 6,
  },
  imageView: {
    height: width / 2 - 50,
    borderRadius: 6,
  },
  containerLoadMore: {
    marginBottom: 15,
  },
})
