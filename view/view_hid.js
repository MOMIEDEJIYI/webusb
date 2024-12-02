import { hid } from '../js/hid.js';

// HID 过滤器示例
const filters = {
  Keyboard: new hid.Filter({ usagePage: 0x01, usage: 0x06 }),
  Mouse: new hid.Filter({ usagePage: 0x01, usage: 0x02 }),
  Gamepad: new hid.Filter({ usagePage: 0x01, usage: 0x05 }),
  Joystick: new hid.Filter({ usagePage: 0x01, usage: 0x04 }),
};

// 创建 UI 元素
const buttonConnect = document.createElement('button');
buttonConnect.textContent = '连接 HID 设备';
document.body.appendChild(buttonConnect);

const buttonDisconnect = document.createElement('button');
buttonDisconnect.textContent = '断开 HID 设备';
document.body.appendChild(buttonDisconnect);

const deviceList = document.createElement('ul');
document.body.appendChild(deviceList);

// **更新设备列表 UI**
async function updateDeviceList() {
  deviceList.innerHTML = ''; // 清空设备列表
  try {
    const devices = await hid.getConnectedDevices();
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
      noDevices.textContent = '没有连接 HID 设备';
      deviceList.appendChild(noDevices);
    }
  } catch (error) {
    console.error('获取已连接设备失败:', error);
  }
}

// **连接设备事件**
buttonConnect.addEventListener('click', async () => {
  try {
    const devices = await hid.init();
    if (devices.length > 0) {
      hid.openMultiple(devices);
      console.log('已连接的 HID 设备:', devices);
      alert(`连接成功: ${devices.map(d => d.productName).join(', ')}`);
    } else {
      console.log('没有连接 HID 设备');
    }
    updateDeviceList();
  } catch (error) {
    console.error('连接 HID 设备失败:', error);
  }
});

// **断开设备事件**
buttonDisconnect.addEventListener('click', async () => {
  try {
    const devices = await hid.getConnectedDevices();
    if (devices.length > 0) {
      devices.forEach(device => {
        console.log('断开设备:', device);
        // HID API 没有提供直接断开连接的功能，需通过业务逻辑模拟
        if (device.opened) {
          hid.disconnect(device);
        }
      });
      alert(`设备${devices.map(d => d.productName).join(', ')}关闭`);
    } else {
      alert('HID设备无法断开');
    }
    updateDeviceList();
  } catch (error) {
    console.error('断开设备失败:', error);
  }
});

// 初始化设备列表
updateDeviceList();
