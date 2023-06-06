## 增加离线模式热点访问功能

设备默认启动执行bootstrap 14-wifiAP逻辑， 设备启动后用户通过手机wifi网络设置找到ssid(PI-AP),默认密码12345678连接设备，当手机连接到设备后
就可以扫描设备屏幕上的二维码，因为该二维码是固定的也可以将该二维码贴到设备的背面， 二维码地址是10.0.0.1， 打开网页可以做2件事情：
1. 查找home可用网络，提供ssid和password让设备能够连接home的wifi网络
2. 实现数码相册功能， 直接浏览器打开网页上传照片，支持照片多选，单选发布


### 实现wifi账户保存功能

#### 提供wifi设置页面

相关接口包括：

1. 获取ssid列表: /api/wifi/ssidlist
2. wifi设置页面选择ssid， 输入密码，点击“连接”按钮

/api/wifi/test
data:{ssid:'',password}
return {
    success:boolean
}

#### 相关命令

##### 获取ssid列表

```bash
apk add iwd
rc-service iwd start
iwctl device list
#iwctl station wlan0 scan && iwctl station wlp8s0 get-networks
iwlist wlan0 scan
#获取essid列表
iwlist wlan0 scan |  grep  'ESSID:'
返回结果

                              Available networks
--------------------------------------------------------------------------------
  Network name                    Security          Signal
--------------------------------------------------------------------------------
  valinor                         psk               ****
  arda                            psk               ****

```

##### 连接ssid

```bash
iwctl station wlan0 connect [ssid] --passphrase [password]
```

##### 检查连接是否ok

```bash
iwctl station wlan0 show

#输出结果
                               Station: wlan0
--------------------------------------------------------------------------------
  Settable  Property            Value
--------------------------------------------------------------------------------
            Scanning            no
            State               connected
            Connected network   arda
            ConnectedBss        10:13:31:53:26:11
            Frequency           2462
            Security            WPA2-Personal
            RSSI                -77                  dBm
            AverageRSSI         -76                  dBm
            TxMode              802.11n
            TxMCS               5
            TxBitrate           52000                Kbit/s
            RxBitrate           1000                 Kbit/s
            ExpectedThroughput  27375                Kbit/s
```

##### 断开连接

```bash
iwctl station wlan0 disconnect
```

##### 获取已经连接列表

```bash
iwctl known-networks list

输出内容

                         Known Networks
--------------------------------------------------------------------------------
  Name                            Security   Hidden   Last connected
--------------------------------------------------------------------------------
  arda                            psk                 Oct 16,  1:15 PM

```

##### 相关参考地址

[https://wiki.alpinelinux.org/wiki/Wi-Fi](https://linuxconfig.org/how-to-manage-wireless-connections-using-iwd-on-linux)

[Raspberry Pi 3 - Configuring it as wireless access point -AP Mode](https://wiki.alpinelinux.org/wiki/Raspberry_Pi_3_-_Configuring_it_as_wireless_access_point_-AP_Mode)