import { createStore, applyMiddleware } from 'redux'
import { allReducers } from './reducers/AllReducer'
import thunk from 'redux-thunk'
import { createNetworkMiddleware } from 'react-native-offline'

const networkMiddleware = createNetworkMiddleware({
    regexActionType: /.*REQUEST/,
    queueReleaseThrottle: 500
})

export default function () {
    let store = createStore(allReducers, applyMiddleware(networkMiddleware, thunk))
    // let store = createStore(allReducers, applyMiddleware(thunk))
    return store
}