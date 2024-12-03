import { usb } from '../js/usb.js';

// 创建 UI 元素
const buttonConnect = document.createElement('button');
buttonConnect.textContent = '连接 USB 设备';
document.body.appendChild(buttonConnect);

const buttonDisconnect = document.createElement('button');
buttonDisconnect.textContent = '断开 USB 设备';
document.body.appendChild(buttonDisconnect);

// 创建设备列表表格
const table = document.createElement('table');
table.id = 'usb-table';
const thead = document.createElement('thead');
const headerRow = document.createElement('tr');
headerRow.innerHTML = `
  <th>设备名称</th>
  <th>厂商 ID</th>
  <th>产品 ID</th>
  <th>类别</th>
  <th>子类</th>
  <th>协议</th>
  <th>序列号</th>
  <th>状态</th>
  <th>接口</th>
  <th>配置</th>
  <th>操作</th>
`;
thead.appendChild(headerRow);
table.appendChild(thead);
const tbody = document.createElement('tbody');
table.appendChild(tbody);
document.body.appendChild(table);



// 定义过滤器
const filters = [
  { usbVendorId: 0x2341, usbProductId: 0x0043 },
  { usbVendorId: 0x2341, usbProductId: 0x0001 }
];

// **更新设备列表 UI**
async function updateDeviceList() {
  tbody.innerHTML = ''; // 清空表格内容
  try {
    const devices = await usb.getConnectedDevices();
    if (devices.length > 0) {
      devices.forEach(device => {
        const row = document.createElement('tr');
        row.innerHTML = ` 
          <td>${device.productName}</td>
          <td>${device.vendorId}</td>
          <td>${device.productId}</td>
          <td>${device.deviceClass}</td>
          <td>${device.deviceSubClass}</td>
          <td>${device.deviceProtocol}</td>
          <td>${device.serialNumber}</td>
          <td id="${device.opened ? 'device-connected' : 'device-disconnected'}">${device.opened ? '已连接' : '未连接'}</td>
          <td>${getInterfacesInfo(device.configuration.interfaces)}</td>
          <td>${device.configuration.configurationName}</td>
          <td>
            <!-- 根据设备的打开状态显示连接或断开按钮 -->
            ${device.opened 
              ? `<button class="disconnect-button" data-product-id="${device.productId}">断开</button>` 
              : `<button class="connect-button" data-product-id="${device.productId}">连接</button>`
            }
          </td>
        `;
        tbody.appendChild(row);
      });
    } else {
      const noDevicesRow = document.createElement('tr');
      noDevicesRow.innerHTML = '<td colspan="9">没有连接 usb 设备</td>';
      tbody.appendChild(noDevicesRow);
    }
  } catch (error) {
    console.error('获取已连接设备失败:', error);
  }
}

// 使用事件委托绑定事件监听器
tbody.addEventListener('click', (e) => {
  if (e.target && e.target.classList.contains('connect-button')) {
    const productId = e.target.dataset.productId;
    connectDevice(productId);
  } else if (e.target && e.target.classList.contains('disconnect-button')) {
    const productId = e.target.dataset.productId;
    disconnectDevice(productId);
  }
});

// 获取接口信息的函数
function getInterfacesInfo(interfaces) {
  if (!interfaces || interfaces.length === 0) return '无接口';

  // 格式化接口信息，显示接口数量和部分接口的详细信息
  return interfaces.map(item => {
    return `接口编号: ${item.interfaceNumber}, 备用设置: ${item.alternateSetting}`;
  }).join('<br>');  // 使用 <br> 来换行显示多个接口
}

// **连接设备事件**
buttonConnect.addEventListener('click', async () => {
  try {
    const device = await usb.init(filters);
    if (device !== null) {
      usb.open(device)
        .then(() => {
          console.log('已连接 usb 设备:', device.productName);
        })
        .catch(error => {
          console.error(error); // 处理具体的错误信息
        });
    } else {
      console.log('没有连接 usb 设备');
    }
    updateDeviceList();
  } catch (error) {
    console.error(error);
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
          usb.disconnect(device)
            .then(() => {
              msg += ` ${device.productName} 已断开连接`;
            })
            .catch(error => {
              console.error('断开设备失败:', error);
            });
        }
      });
      if (msg === '') {
        msg = '没有设备可断开';
      }
      console.log(msg);
    } else {
      console.log('没有设备可断开');
    }
    updateDeviceList();  // 更新设备列表
  } catch (error) {
    console.error('断开设备失败:', error);
  }
});


async function connectDevice(productId) {
  try {
    const device = await usb.getDeviceByProductId(productId);
    if (device) {
      await usb.connect(device).then(() => {
        updateDeviceList();  // 更新设备列表
      });  // 连接设备
    } else {
      console.log('未找到设备');
    }
  } catch (error) {
    console.error('连接设备失败:', error);
  }
}

async function disconnectDevice(productId) {
  try {
    const device = await usb.getDeviceByProductId(productId);
    if (device) {
      await usb.disconnect(device);  // 断开设备
      updateDeviceList();  // 更新设备列表
    } else {
      console.log('未找到设备');
    }
  } catch (error) {
    console.error('断开设备失败:', error);
  }
}


// 初始化设备列表
updateDeviceList();
