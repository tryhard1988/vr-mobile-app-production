import Actions from './Actions'
import {apiJson} from '../../config/ApiConfig'

export const requestError = message => {
  return {
    type: Actions.REQUEST_ERROR,
    message,
  }
}

export const rawError = message => {
  return message
  ? {
    type: Actions.REQUEST_ERROR_RAW,
    message,
  } 
  : undefined
}

export const clearError = () => {
  return {
    type: Actions.CLEAR_ERROR,
  }
}

export const loginAgain = status => {
  return {
    type: Actions.LOGIN_AGAIN,
    status,
  }
}

export const handleLoading = status => {
  return {
    type: Actions.HANDLE_LOADING,
    status,
  }
}

export const requestSuccess = message => {
  return {
    type: Actions.REQUEST_SUCCESS,
    message,
  }
}

export const clearSuccess = () => {
  return {
    type: Actions.CLEAR_SUCCESS,
  }
}

// home banner
const getHomeBannerSuccess = data => {
  return {
    type: Actions.GET_HOME_BANNER_SUCCESS,
    data,
  }
}

export const getHomeBanner = () => {
  return dispatch => {
    apiJson
      .get('wp/v2/media?media_type=image&orderby=title&search=banner-')
      .then(res => {
        dispatch(getHomeBannerSuccess(res.data))
      })
      .catch(err => {
        dispatch(requestError('not-get-banner'))
        dispatch(handleLoading(false))
      })
  }
}
