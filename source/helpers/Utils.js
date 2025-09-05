export const errorList = {
  USER_NOT_FOUND: 'Tài khoản không đúng hoặc không tồn tại.',
  USER_ERROR: 'Tên đăng nhập hay mật khẩu không đúng.',
  AUTHENTICATION: 'Người dùng không có quyền vào hệ thống.',
  PASSWORD_AND_REPASSWORD_NOT_SAME: 'Mật khẩu mới không giống nhau!',
  UNAUTHORIZED: 'Có lỗi xảy ra, vui lòng đăng nhập lại!',
  SEVER_ERROR: 'Hệ thống đang bảo trì, vui lòng thử lại!',
  OTHER_ERROR: 'Có lỗi xảy ra,vui lòng thử lại!',
  NOT_FOUND: 'Không tìm thấy dữ liệu, vui lòng thử lại!',
  NOT_PERMISSION: 'Bạn không có quyền truy cập, vui lòng thử lại sau!',
  FORGOT_SUCCESS: 'Thay đổi mật khẩu thành công!',
  REGISTER_SUCCESS: 'Đăng ký thành công!',
  ACCOUNT_DELETED: 'account-deleted',
  GET_INFO_ERROR: 'get-info-error',
  GET_INFO_PRODUCT_FAIL: 'get-info-product-fail',
  NO_NEW_PRODUCT: 'no-new-product',
  FAIL_TO_SEND_COMMENT:'fail-to-send-comment',
  AVATAR_FAIL: 'avatar-fail',
}

export const successMessage = {
  SUPPORT_REQUEST: 'support-request',
  SEND_MESSAGE_SUCCESS:'send-message-success',
  EDIT_SUCCESS: 'edit-success',
  ADD_PRODUCT_SUCCESS: 'add-product-success',
  LOGIN_SUCCESS: 'login-success',
}

export const getErrorString = errorCode => {
  return errorList[errorCode] || 'Có lỗi xảy ra vui lòng thử lại sau'
}

export const convertStringToPrice = s => {
  return s ? s.toLocaleString('en-us', {minimumFractionDigits: 0}) : 0
}

export const checkValidatePhone = text => {
  let reg = /^[0-9]{8,12}$/
  if (reg.test(text.replace(/\s/g, '')) === false) {
    return false
  } else {
    return true
  }
}

export const checkValidateEmail = text => {
  let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/
  if (reg.test(text) === false) {
    return false
  } else {
    return true
  }
}

export const checkValidatePassword = text => {
  let reg = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/
  if (reg.test(text.replace(/\s/g, '')) === false) {
    return false
  } else {
    return true
  }
}
