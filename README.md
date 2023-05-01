# Alpine Raspberry P I

建立alpine测试环境.

在wsl环境下构建alpine docker开发环境模拟respberry环境:

* 构建alpine docker
* 安装chroumin
* 启动alpine docker run


 ### 构建alpine docker

启动ubuntu虚拟机,执行以下命令

 ```bash
 docker run \
-it \
--net=host \
-e DISPLAY=$DISPLAY \
-v $PWD:/dsclient \
-v /tmp/.X11-unix:/tmp/.X11-unix \
--name alpine-chromium \
alpine sh && \
\
docker start alpine-chromium && \
docker exec -it alpine-chromium sh
 ```

 ### 在alpine-chromium内安装chromium
 ```bash
sed -i 's/dl-cdn.alpinelinux.org/mirrors.tuna.tsinghua.edu.cn/g' /etc/apk/repositories
sed -i '$a https://mirrors.tuna.tsinghua.edu.cn/alpine/edge/testing/' /etc/apk/repositories
apk update
apk add wqy-zenhei chromium nodejs npm
apk add mesa-egl dbus setxkbmap kbd xrandr xset
sed -i '$d' /etc/apk/repositories
apk update
export DISPLAY=:0 && chromium-browser --no-sandbox&
 ```

### 在开发环境下调试修改代码

