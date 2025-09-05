import AsyncStorage from '@react-native-async-storage/async-storage';

export const saveUserLogged = async (value) => {
    try {
        await AsyncStorage.setItem(`USER_LOGGED`, JSON.stringify(value))
        return true
    } catch (error) {
        return false
    }
};

export const saveAWS = async (token) => {
    try {
        await AsyncStorage.setItem(`AWS_USER`, JSON.stringify(token))
        return true
    } catch (error) {
        return false
    }
}

export const getAWS = async () => {
    try {
        const value = await AsyncStorage.getItem(`AWS_USER`)
        if (value !== null) {
            return JSON.parse(value)
        }
        return null
    } catch (error) {
        return null
    }
}

export const clearUserLogged = async () => {
    return await saveUserLogged(null)
}

export const getUserLogged = async () => {
    try {
        const value = await AsyncStorage.getItem(`USER_LOGGED`)
        if (value !== null) {
            return JSON.parse(value)
        }
        return null
    } catch (error) {
        return null
    }
}

export const saveAvatar = async (value) => {
    try {
        await AsyncStorage.setItem(`AVATAR`, JSON.stringify(value))
        return true
    } catch (error) {
        return false
    }
}

export const getAvatar = async () => {
    try {
        const value = await AsyncStorage.getItem(`AVATAR`)
        if (value !== null) {
            return JSON.parse(value)
        }
        return null
    } catch (error) {
        return null
    }
}

export const saveAccountLogin = async (value) => {
    try {
        await AsyncStorage.setItem(`ACCOUNT_LOGIN`, JSON.stringify(value))
        return true
    } catch (error) {
        return false
    }
}

export const getAccountLogin = async () => {
    try {
        const value = await AsyncStorage.getItem(`ACCOUNT_LOGIN`)
        if (value !== null) {
            return JSON.parse(value)
        }
        return null
    } catch (error) {
        return null
    }
}

export const saveStatePassword = async (value) => {
    try {
        await AsyncStorage.setItem(`STATE_SAVE_PASSWORD`, JSON.stringify(value))
        return true
    } catch (error) {
        return false
    }
}

export const getStatePassword = async () => {
    try {
        const value = await AsyncStorage.getItem(`STATE_SAVE_PASSWORD`)
        if (value !== null) {
            return JSON.parse(value)
        }
        return false
    } catch (error) {
        return false
    }
}

export const saveCart = async (value) => {
    try {
        await AsyncStorage.setItem(`CART`, JSON.stringify(value))
        return true
    }
    catch (error) {
        return false
    }
}

export const clearCart = async () => {
    await saveCart(null)
}

export const getCart = async () => {
    try {
        const value = await AsyncStorage.getItem(`CART`)
        if (value !== null) {
            return JSON.parse(value)
        }
        return null
    }
    catch (error) {
        return null
    }
}
