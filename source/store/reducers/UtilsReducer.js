import Actions from '../actions/Actions'
import {getErrorString} from '../../helpers/Utils'

const initialState = {
  message: null,
  isError: false,
  hasRawMessage: false,
  isLoginAgain: false,
  isLoading: false,
  isSuccess: false,
  homeBanner: [],
  isDoneBanner: false,
}

const utilsReducer = (state = initialState, action) => {
  switch (action.type) {
    case Actions.REQUEST_ERROR: {
      return {
        ...state,
        isError: true,
        // message: getErrorString(action.message)
        message: action.message,
      }
    }
    case Actions.REQUEST_ERROR_RAW: {
      return {
        ...state,
        hasRawMessage: true,
        message: action.message,
      }
    }
    case Actions.CLEAR_ERROR: {
      return {
        ...state,
        isError: false,
        message: null,
      }
    }
    case Actions.LOGIN_AGAIN: {
      return {
        ...state,
        isLoginAgain: action.status,
      }
    }
    case Actions.HANDLE_LOADING: {
      return {
        ...state,
        isLoading: action.status,
      }
    }
    case Actions.REQUEST_SUCCESS: {
      return {
        ...state,
        isSuccess: true,
        message: action.message,
      }
    }
    case Actions.CLEAR_SUCCESS: {
      return {
        ...state,
        isSuccess: false,
        message: null,
      }
    }
    case Actions.GET_HOME_BANNER_SUCCESS: {
      return {
        ...state,
        homeBanner: action.data,
        isDoneBanner: true,
      }
    }
    default:
      return state
  }
}

export default utilsReducer
