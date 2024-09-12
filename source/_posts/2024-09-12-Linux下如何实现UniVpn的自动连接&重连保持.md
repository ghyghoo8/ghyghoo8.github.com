---
title: Linux下如何实现UniVpn的自动连接/重连保持
date: 2024-09-12
categories: 
- 运维
tags:
- UniVpn
- shell
- linux
- 新手教程
------

在使用 [UniVpn](https://www.leagsoft.com/doc/article/103197.html) 进行 SSL VPN 连接时，为了确保网络连接的稳定性和可靠性，您可能需要启用自动重连功能。该功能可以在 VPN 连接意外中断时自动重新建立连接，从而减少因网络中断带来的不便。本文将介绍如何在 Linux 操作系统下，通过结合 `expect` 脚本和 `ping` 探测来实现自动重连功能。


### 环境准备
以 UniVpn 为例，我们将通过以下步骤实现自动重连：

#### 启动 VPN 客户端
首先，在 shell 命令行中运行以下命令来启动 `UniVpn`，并创建一个 VPN 连接：

```bash
/usr/local/UniVPN/serviceclient/UniVPNCS
```

#### 编写 `expect` 脚本
由于需要自动处理 VPN 连接，您需要安装 expect 程序。该工具能够自动化与命令行交互的操作。

安装 `expect` 
```
apt install expect

```

然后，编写一个 `expect` 脚本（例如 univpn_run.sh），用于监控并自动重连 VPN。

```bash

#!/bin/bash
while true 
do
expect <<EOF
set timeout -1
spawn /usr/local/UniVPN/serviceclient/UniVPNCS

# 等待欢迎信息
expect "Welcome to UniVPN"
send "3\r"

# 等待连接选项
expect "*1:Connect*"
send "1\r"

# 等待连接成功提示
expect "*Please input the login user name*"
send "[username]\r"  #这里输入vpn用户名

# 等待输入密码提示
expect "*Please input the login user password*"
send "[password]\r"  #这里输入vpn密码

# 等待最终连接成功提示
expect "*Connect Success,Enjoy*"

spawn sh ./testping.sh   #这里是一个探测ping的代码
expect "*IP testing error*"

send "q\n"
expect "*Logout succeeded.*"

EOF

sleep 2
done


```

#### 编写 `ping` 探测脚本
接下来，编写一个用于检测网络连通性的 `ping` 脚本（例如 testping.sh）。该脚本会定期检测 VPN 连接是否正常，若检测到连接中断，则会触发自动重连。

```bash

#!/bin/bash
while true
do
            # 要ping的IP地址  
            IP_ADDRESS="xxx.xxx.xxx.xxx"  #vpn连接上以后能ping通的一个ip
            
            # 执行ping命令，检查IP地址是否可达  
            ping -c 1 $IP_ADDRESS > /dev/null 2>&1  
            
            # 检查ping命令的退出状态  
            if [ $? -eq 0 ]; then  
                echo "IP testing success"    #如果ping通了，输出
            else  
                echo "IP testing error"   #如果ping不通了，输出
                    exit
            fi
sleep 20   #每20秒ping一次
done



```

#### 执行自动重连
最后，执行以下命令运行自动重连脚本：

```bash

chmod +x univpn_run.sh testping.sh &  ./univpn_run.sh

```

该脚本将持续检测网络状态，若 `ping` 不通，则会结束当前 VPN 连接并尝试重新连接。

### 注意事项
在多次连接后，可能会出现 VPN 无法正常连接的情况，这通常是由于网卡问题导致的。为解决这一问题，您可以编写一个脚本，在探测到网络故障后，自动重启网络服务。

此外，若重启网络服务后某些依赖网络的服务（如 Docker）出现问题，您可以在脚本中加入这些服务的重启命令。

```bash

#!/bin/bash

# crontab设置： 30分钟执行一次检查
# */30 * * * * /root/dashboard/v2-web/docs/network_check.sh

# 目标IP地址
TARGET_IP="127.0.0.1"   #这里换成你的IP地址

# 使用ping命令连续ping指定次数（例如每10秒一次，共ping 3次）
COUNT=1    #这里探测多少次
INTERVAL=10   #这是每次探测的间隔时间

# 使用ping命令进行测试
RESULT=$(ping -c $COUNT -i $INTERVAL $TARGET_IP | grep 'Destination Host Unreachable')    

# 如果ping的结果包含"Destination Host Unreachable"
if [[ "$RESULT" != "" ]]; then
    echo "$(date) - Ping to $TARGET_IP failed. Restarting network service..."
 
    # 使用systemctl命令重启网络服务
    systemctl restart network
    #systemctl restart docker    #这里是因为重启了network以后，docker的网络会出现问题，所以就重启一下docker。如果你有其他服务也可以这样重启一下。

fi
exit 0


```




### 定时检测

为了确保 VPN 的稳定性，您可以将上述脚本与定时任务（如 `cron`）结合，定期执行 `ping` 探测，确保在网络异常时及时恢复连接。


---
通过上述步骤，您可以在 Linux 操作系统下实现 `UniVpn` 的自动重连功能，从而提升网络连接的稳定性和可靠性。