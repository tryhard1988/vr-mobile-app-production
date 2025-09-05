import {getCart, saveCart} from '../../helpers/Storages'
import Actions from './Actions'

/**
 * get products cart
 */
const getProductsCart = data => {
  return {
    type: Actions.GET_CART,
    data,
  }
}
export const handleGetProductsCart = () => {
  let data = []
  return dispatch => {
    async function _getData () {
      let cart = await getCart()
      cart ? (data = cart) : (data = [])
      dispatch(getProductsCart(data))
    }
    _getData()
  }
}

const addProductToCart = data => {
  return {
    type: Actions.ADD_PRODUCT_TO_CART,
    data,
  }
}

export const handleAddProductToCart = (params, onSuccess) => {
  let isNew = true
  let data = []
  return dispatch => {
    async function _addToCart () {
      let currentCart = await getCart()
      if (currentCart) {
        data = currentCart
      }
      data.forEach(element => {
        if (element?.variation_id) {
          if (
            element.variation_id == params.variation_id &&
            element.name == params.name
          ) {
            element.quantity += params.quantity
            isNew = false
          }
        } else {
          if (element.name == params.name) {
            element.quantity += params.quantity
            isNew = false
          }
        }
      })
      isNew && data.push(params)
      await saveCart(data)
      onSuccess ? onSuccess() : null
      dispatch(addProductToCart(data))
    }
    _addToCart()
  }
}

export const handleEditCart = value => {
  return {
    type: Actions.HANDLE_EDIT_CART,
    value,
  }
}
