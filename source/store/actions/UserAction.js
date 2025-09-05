import Actions from './Actions'
import WooCommerce from '../../config/ApiWooCommerce'
import {handleLoading, rawError, requestError, requestSuccess} from './UtilsActions'
import {clearUserLogged, getAWS, getUserLogged, saveUserLogged} from '../../helpers/Storages'
import {apiFormData, apiJson} from '../../config/ApiConfig'
import axios from 'axios'
import {Auth} from 'aws-amplify'
import AWS from 'aws-sdk'
import { errorList, successMessage } from '../../helpers/Utils'

export function setUserRegister (data) {
  return {
    type: Actions.USER_REGISTER,
    data,
  }
}

export function setUserResetPassword (data) {
  return {
    type: Actions.USER_RESET_PASSWORD,
    data,
  }
}

export const setUserInfo = data => {
  return {
    type: Actions.SET_USER_INFO,
    data,
  }
}

// create customer on Woo
const createCustomerSuccess = data => {
  return {
    type: Actions.CREATE_CUSTOMER_SUCCESS,
    data,
  }
}

export const createCustomer = (username, email, password, continueAction) => {
  return dispatch => {
    WooCommerce.post('customers', {
      username: username,
      email: email,
      password: password,
    })
      .then(res => {
        if (res?.id) {
          dispatch(createCustomerSuccess(res))
          dispatch(handleLoading(false))
          continueAction ? continueAction('') : null
        } else {
          continueAction ? continueAction(username) : null
        }
      })
      .catch(err => {
        dispatch(handleLoading(false))
        dispatch(
          requestError(errorList.GET_INFO_ERROR),
        )
      })
  }
}

export const deleteCustomer = (id) => {
  return dispatch => {
    username = id
    Auth.currentAuthenticatedUser()
      .then(user => {
        let region = user.pool.userPoolId.split('_')[0]
        var provider = new AWS.CognitoIdentityServiceProvider({
          region: region
        })
        var params = {
          AccessToken: user.signInUserSession.accessToken.jwtToken
        }
        provider.deleteUser(params)
        username=user?.pool?.clientId
        WooCommerce.put(`customers/${id}`, {
          email: `Guest@dispostable.com`,
          first_name: `${id}`,
          last_name: 'Guest',
          billing: {
            first_name: '',
            last_name: '',
            company: '',
            address_1: '',
            address_2: '',
            city: '',
            postcode: '',
            country: '',
            state: '',
            phone: '',
          },
          avatar_url: ''
        })
          .then(res => {  
            dispatch(updateProfileSuccess(res))
            clearUserLogged()
            dispatch(setUserInfo(null))
          })
          .catch(err => {
            dispatch(handleLoading(false))
            dispatch(rawError(err?.message))
          })
      })    
  }
}

// filter current customer on Woo
const filterCurrentCustomerSuccess = data => {
  return {
    type: Actions.FILTER_CURRENT_CUSTOMER_SUCCESS,
    data,
  }
}

export const filterCurrentUser = (username, actionFinish) => {
  return dispatch => {
    WooCommerce.get('customers', {role: 'all', search: username})
      .then(res => {
        let result = res.find(item => item.username === username)
        if (result) {
          if(result.email === `Guest@dispostable.com`){
            dispatch(requestError(errorList.ACCOUNT_DELETED))
          }
          else {
            dispatch(filterCurrentCustomerSuccess(result))
            saveUserLogged(result)
            actionFinish ? actionFinish() : null
            dispatch(requestSuccess(successMessage.LOGIN_SUCCESS))
          }
        } else {
          dispatch(
            requestError(errorList.GET_INFO_ERROR),
          )
        }
        dispatch(handleLoading(false))
      })
      .catch(err => {
        dispatch(handleLoading(false))
        dispatch(
          requestError(errorList.GET_INFO_ERROR),
        )
      })
  }
}

// update profile (customer on Woo)
const updateProfileSuccess = data => {
  return {
    type: Actions.UPDATE_PROFILE_SUCCESS,
    data,
  }
}

export const submitUpdateProfile = (idProfile, params, onSuccess) => {
  return dispatch => {
    WooCommerce.put(`customers/${idProfile}`, params)
      .then(res => {
        if (res?.message) {
          dispatch(handleLoading(false))
          dispatch(rawError(res?.message))
        } else {
          dispatch(updateProfileSuccess(res))
          saveUserLogged(res)
          onSuccess ? onSuccess() : null
        }
      })
      .catch(err => {
        dispatch(handleLoading(false))
        dispatch(rawError(err?.message))
      })
  }
}

export const sendContactForm = (params, onSuccess) => {
  return dispatch => {
    dispatch(handleLoading(true))
    apiFormData
      .post(`contact-form-7/v1/contact-forms/170/feedback`, params)
      .then(res => {
        dispatch(requestSuccess(successMessage.SUPPORT_REQUEST))
        onSuccess ? onSuccess() : null
        dispatch(handleLoading(false))
      })
      .catch(err => {
        dispatch(handleLoading(false))
        dispatch(rawError(err?.message))
      })
  }
}

export const uploadAvatar = (imageContent, fileName, onSuccess) => {
  return dispatch = async () => {
    let auth = await Auth.currentAuthenticatedUser()
    axios
      .post(
        'https://oftg3wa2te.execute-api.ap-southeast-1.amazonaws.com/vietrauapp/images/upload',
        {
          content: imageContent,
          fileName: fileName,
          Bucket: 'vietraumobileapp',
        },
        {
          headers: {
            Authorization: `Bearer ${auth?.signInUserSession?.idToken?.jwtToken}`,
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        },
      )
      .then(res => {
        if (res.data?.data?.Location) {
          onSuccess ? onSuccess(auth, res.data?.data?.Location) : null
        }
      })
      .catch(err => {
        dispatch(handleLoading(false))
        dispatch(rawError(err?.message))
      })
  }
}

export const setAvatarUrl = data => {
  return {
    type: Actions.SET_AVATAR_URL,
    data,
  }
}

export const sendTokenFCMToAmazonServer = (
  fcmToken,
  username,
  groups,
  onSuccess,
) => {
  return dispatch => {
    axios
      .post(
        'https://oftg3wa2te.execute-api.ap-southeast-1.amazonaws.com/vietrauapp/divicetoken',
        {
          key: '$2y$12$4T5bF.R4oLdFHWrcSvrfU.judYiMuhgwIYD9.Fc61uxqpeyp4C3Iy',
          deviceToken: fcmToken,
          userId: username,
          groupId: groups,
        },
        {
          headers: {
            'X-Requested-With': 'XMLHttpRequest',
            'Content-Type': 'application/json',
            Accept: 'application/json',
          },
        },
      )
      .then(res => {})
      .catch(err => {})
  }
}
