export class AlertHelper {
    static dropDown;
    static dropDownModal;
    static onClose;
  
    static setDropDown(dropDown) {
      this.dropDown = dropDown;
    }
    static setDropDownModal(dropDown) {
      this.dropDownModal = dropDown;
    }
  
    static showError(title, message) {
        if (this.dropDown) {
          this.dropDown.alertWithType('error', title, message);
        }
        if (this.dropDownModal) {
          this.dropDownModal.alertWithType('error', title, message);
        }
    }
    
    static showSuccess(title, message) {
        if (this.dropDown) {
          this.dropDown.alertWithType('success', title, message);
        }
        if (this.dropDownModal) {
          this.dropDownModal.alertWithType('success', title, message);
        }
    }
    static showWarning(title, message) {
        if (this.dropDown) {
          this.dropDown.alertWithType('warn', title, message);
        }
        if (this.dropDownModal) {
          this.dropDownModal.alertWithType('warn', title, message);
        }
    }
    static showInfo(title, message, dropDownRef = null) {
        if (this.dropDown) {
          this.dropDown.alertWithType('info', title, message);
        }
        if (this.dropDownModal) {
          this.dropDownModal.alertWithType('info', title, message);
        }
    }
  
    static setOnClose(onClose) {
      this.onClose = onClose;
    }
  
    static invokeOnClose() {
      if (typeof this.onClose === 'function') {
        this.onClose();
      }
    }
  }