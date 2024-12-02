import { usb } from '../js/usb.js';

// 创建 UI 元素
const buttonConnect = document.createElement('button');
buttonConnect.textContent = '连接 USB 设备';
document.body.appendChild(buttonConnect);

const buttonDisconnect = document.createElement('button');
buttonDisconnect.textContent = '断开 USB 设备';
document.body.appendChild(buttonDisconnect);

const deviceList = document.createElement('ul');
document.body.appendChild(deviceList);

const filters = [
  { vendorId: 0x1209, productId: 0xa800 },
  { vendorId: 0x1209, productId: 0xa850 },
];

// **更新设备列表 UI**
async function updateDeviceList() {
  deviceList.innerHTML = ''; // 清空设备列表
  try {
    const devices = await usb.getConnectedDevices();
    console.log('已连接的 usb 设备:', devices);
    
    if (devices.length > 0) {
      devices.forEach(device => {
        if (device.opened) {
          const deviceItem = document.createElement('li');
          deviceItem.textContent = `${device.productName} (${device.vendorId}:${device.productId})`;
          deviceList.appendChild(deviceItem);
        }
      });
    } else {
      const noDevices = document.createElement('li');
      noDevices.textContent = '没有连接 usb 设备';
      deviceList.appendChild(noDevices);
    }
  } catch (error) {
    console.error('获取已连接设备失败:', error);
  }
}

// **连接设备事件**
buttonConnect.addEventListener('click', async () => {
  try {
    const devices = await usb.init(filters);
    if (devices !== null) {
      usb.open(devices);
      console.log('已配对授权的 usb 设备:', devices);
    } else {
      console.log('没有连接 usb 设备');
    }
    updateDeviceList();
  } catch (error) {
    console.error('连接 usb 设备失败:', error);
  }
});

// **断开设备事件**
buttonDisconnect.addEventListener('click', async () => {
  try {
    const devices = await usb.getConnectedDevices();
    let msg = '';
    if (devices.length > 0) {
      devices.forEach(device => {
        if (device.opened) {
          usb.disconnect(device);
          msg += ` ${device.productName}`;
        }
      });
      if (msg === '') {
        msg = '没有设备可断开';
      }
      alert(msg);
    } else {
      alert('没有设备可断开');
    }
    updateDeviceList();
  } catch (error) {
    console.error('断开设备失败:', error);
  }
});

// 初始化设备列表
updateDeviceList();
