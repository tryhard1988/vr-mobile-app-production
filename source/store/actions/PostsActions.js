import {apiJson} from '../../config/ApiConfig'
import Actions from './Actions'
import {handleLoading, rawError, requestError, requestSuccess} from './UtilsActions'
import I18n from '../../config/LanguageConfig'
import {errorList, successMessage} from '../../helpers/Utils'

// list posts
const getListPostsRequest = () => {
  return {
    type: Actions.GET_LIST_POSTS_REQUEST,
  }
}

const getListPostsSuccess = data => {
  return {
    type: Actions.GET_LIST_POSTS_SUCCESS,
    data,
  }
}

const getListPostsFailure = () => {
  return {
    type: Actions.GET_LIST_POSTS_FAILURE,
  }
}

export const getListPosts = (hasLoading = true, lang) => {
  return dispatch => {
    let params = 'lang=vi'
    lang
      ? lang === 'en'
        ? (params = `lang=${lang}-gb`)
        : (params = 'lang=vi')
      : null
    hasLoading && dispatch(handleLoading(true))
    dispatch(getListPostsRequest())
    apiJson
      .get(`wp/v2/posts?per_page=10&page=1&_embed&${params}`)
      .then(res => {
        dispatch(getListPostsSuccess(res.data))
        hasLoading && dispatch(handleLoading(false))
      })
      .catch(err => {
        dispatch(getListPostsFailure())
        dispatch(rawError(err?.message))
        hasLoading && dispatch(handleLoading(false))
      })
  }
}

// list posts more
const getMoreListPostsRequest = () => {
  return {
    type: Actions.GET_MORE_LIST_POSTS_REQUEST,
  }
}

const getMoreListPostsSuccess = data => {
  return {
    type: Actions.GET_MORE_LIST_POSTS_SUCCESS,
    data,
  }
}

const getMoreListPostsFailure = () => {
  return {
    type: Actions.GET_MORE_LIST_POSTS_FAILURE,
  }
}

export const getMoreListPosts = (page, lang) => {
  return dispatch => {
    let params = 'lang=vi'
    lang ? (params = `lang=${lang}-gb`) : null
    dispatch(getMoreListPostsRequest())
    apiJson
      .get(`wp/v2/posts?per_page=10&page=${page}&${params}&_embed`)
      .then(res => {
        dispatch(getMoreListPostsSuccess(res.data))
      })
      .catch(err => {
        dispatch(getMoreListPostsFailure())
      })
  }
}

// comment post
export const commentPost = (
  authorEmail,
  authorName,
  content,
  postId,
  onSuccess,
) => {
  return dispatch => {
    dispatch(handleLoading(true))
    apiJson
      .post(
        `wp/v2/comments?author_email=${authorEmail}&author_name=${authorName}&content=${content}&post=${postId}`,
      )
      .then(res => {
        onSuccess ? onSuccess(res.data) : null
        dispatch(handleLoading(false))
        dispatch(requestSuccess(successMessage.SEND_MESSAGE_SUCCESS))
      })
      .catch(err => {
        const message =
          err.response?.data?.message || err.message || I18n.t(errorList.FAIL_TO_SEND_COMMENT)
        dispatch(rawError(message))
        dispatch(handleLoading(false))
      })
  }
}

export const getProductsOfPost = (postId, onSuccess) => {
  return dispatch => {
    dispatch(handleLoading(true))
    apiJson
      .get(`wl/v1/get_product_list_by_tag_name/?post_id=${postId}`)
      .then(res => {
        onSuccess ? onSuccess(res.data) : null
        dispatch(handleLoading(false))
      })
      .catch(err => {
        const message = err.response?.data?.message || err.message
        dispatch(rawError(message))
        dispatch(handleLoading(false))
      })
  }
}

export const getPostDetail = (postId, onSuccess) => {
  return dispatch => {
    dispatch(handleLoading(true))
    apiJson
      .get(`wp/v2/posts/${postId}?_embed`)
      .then(res => {
        onSuccess ? onSuccess(res.data) : null
      })
      .catch(err => {
        const message = err.response?.data?.message || err.message
        dispatch(rawError(message))
        dispatch(handleLoading(false))
      })
  }
}
