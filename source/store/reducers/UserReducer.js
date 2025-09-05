import Actions from '../actions/Actions'

const initialState = {
  token: null,
  userRegister: null,
  userResetPassword: null,
  userInfo: null,
  userAvatarUrl: null,
}

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case Actions.USER_REGISTER: {
      return {...state, userRegister: action.data}
    }
    case Actions.USER_RESET_PASSWORD: {
      return {...state, userResetPassword: action.data}
    }
    case Actions.SET_USER_INFO: {
      return {...state, userInfo: action.data}
    }
    case Actions.CREATE_CUSTOMER_SUCCESS: {
      return {...state, userInfo: action.data}
    }
    case Actions.FILTER_CURRENT_CUSTOMER_SUCCESS: {
      return {...state, userInfo: action.data}
    }
    case Actions.UPDATE_PROFILE_SUCCESS: {
      return {...state, userInfo: action.data}
    }
    case Actions.SET_AVATAR_URL: {
      return {...state, userAvatarUrl: action.data}
    }
    default:
      return state
  }
}

export default authReducer
