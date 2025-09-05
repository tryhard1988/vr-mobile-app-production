import {combineReducers} from 'redux'
import {reducer as network} from 'react-native-offline'

import userReducer from './UserReducer'
import utilsReducer from './UtilsReducer'
import cartReducer from './CartReducer'
import deliveryAddressReducer from './DeliveryAddressReducer'
import productsReducer from './ProductsReducer'
import postsReducer from './PostsReducer'
import orderReducer from './OrderReducer'
import languageReducer from './LangReducer'

export const allReducers = combineReducers({
  network,
  user: userReducer,
  utils: utilsReducer,
  cart: cartReducer,
  deliveryAddress: deliveryAddressReducer,
  products: productsReducer,
  posts: postsReducer,
  order: orderReducer,
  lang: languageReducer,
})
