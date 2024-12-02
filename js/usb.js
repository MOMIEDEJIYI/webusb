/**
 * 初始化USB设备连接
 * @param {Array<Filter>} filters - USB设备过滤器数组
 * @returns {Promise<USBDevice>} - 解析为USBDevice对象的Promise，或在出错时拒绝
 */
async function init(filters = []) {
  // 检查浏览器是否支持WebUSB
  if (!checkUSBSupport()) {
    return Promise.reject(new Error("Browser does not support WebUSB."));
  }
 
  // 验证过滤器（这里假设checkFilters会抛出错误或返回布尔值）
  try {
    checkFilters(filters);
  } catch (filterError) {
    return Promise.reject(new Error(`Invalid filters: ${filterError.message}`));
  }
  // 请求用户选择授权一个USB设备
  return navigator.usb.requestDevice({ filters })
    .then(device => {
      // 成功获取设备
      return Promise.resolve(device);
    })
    .catch(error => {
      return exception(error);
    });
}

// USB过滤器
class Filter {
  constructor({ vendorId, productId, classCode, subclassCode, protocolCode, serialNumber } = {}) {
    this.vendorId = vendorId || null; // 厂商 ID
    this.productId = productId || null; // 产品 ID
    this.classCode = classCode || null; // 类别
    this.subclassCode = subclassCode || null; // 子类
    this.protocolCode = protocolCode || null; // 协议
    this.serialNumber = serialNumber || null; // 序列号
  }

  // 返回当前过滤器对象
  toObject() {
    return {
      ...(this.vendorId ? { vendorId: this.vendorId } : {}),
      ...(this.productId ? { productId: this.productId } : {}),
      ...(this.classCode ? { classCode: this.classCode } : {}),
      ...(this.subclassCode ? { subclassCode: this.subclassCode } : {}),
      ...(this.protocolCode ? { protocolCode: this.protocolCode } : {}),
      ...(this.serialNumber ? { serialNumber: this.serialNumber } : {}),
    };
  }
}

// 连接 USB 设备
function connect(device) {
  console.log('connect to device:', device);
  return new Promise((resolve, reject) => {
    device.open()
      .then(() => {
        resolve(device);
      })
      .catch(error => {
        return exception(error);
      });
  });
}

// 关闭 USB 设备
function disconnect(device) {
  return new Promise((resolve, reject) => {
    if (!device.opened) {
      console.log(`device not opened: ${device.productName}`);
      return;
    }
    device.close()
      .then(() => {
        if (!device.opened) {
          console.log(`device closed: ${device.productName}`);
        }
        resolve(device);
      })
      .catch(error => {
        return exception(error);
      });
  });
}

// 获取所有已连接的 USB 设备
function getConnectedDevices() {
  return new Promise((resolve, reject) => {
    // 获取所有已连接的 USB 设备
    navigator.usb.getDevices()
      .then(devices => {
        resolve(devices);  // 返回设备列表
      })
      .catch(error => {
        return exception(error);
      });
  });
}

// 打开 USB 设备
function open(device) {
  if (device === null) {
    return;
  }
  return new Promise((resolve, reject) => {
    device.open()
      .then(() => {
        resolve(device);
      })
      .catch(error => {
        return exception(error);
      });
  });
}

// 打开多个 usb 设备
function openMultiple(devices) {
  // 使用 Promise.all 并行打开所有设备
  return Promise.all(devices.map(device => {
    // 只有未打开的设备才会调用 open
    if (!device.opened) {
      return open(device);  // 打开设备并返回 Promise
    }
    return Promise.resolve(device); // 如果设备已经打开，直接返回 Promise
  }));
}


// 检查传入filters是否符合要求
function checkFilters(filters) {
  if (!Array.isArray(filters)) {
    throw new Error(`filters type must be array, but got ${typeof filters}`);
  }
}

// 检查 USB 支持
function checkUSBSupport() {
  if ("usb" in navigator) {
    return true
  } else {
    console.log("browser does not support Web USB API");
    return false
  }
}

// 处理错误
function exception(error) {
  // 处理错误情况
  if (error.name === 'NotFoundError') {
    // 没有设备被选中或没有匹配的设备
    return Promise.reject(new Error("No device selected or no matching devices found."));
  } else if (error.name === 'SecurityError') {
    // 用户拒绝访问设备或没有足够的权限
    return Promise.reject(new Error("Access to the device was denied."));
  } else {
    // 其他类型的错误
    return Promise.reject(new Error(`An unexpected error occurred: ${error.message}`));
  }
}

export const usb = {
  init,
  connect,
  disconnect,
  getConnectedDevices,
  checkUSBSupport,
  Filter,
  open,
  openMultiple
};
