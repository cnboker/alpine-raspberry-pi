# Alpine Raspberry P I

This is a system install of Alpine linux for Raspberry Pi 3B, 3B+ and 4 image ready to burn to an SD card via [balenaEtcher](https://www.balena.io/etcher/) (there's no need to gunzip image).

The image automatically setup and configures:

* root user [pwd: raspberry]
* pi user [pwd: raspberry]
* ethernet
* wifi (edit `wpa_supplicant.conf` in the boot partition, on first boot it will be copied)
* bluetooth
* avahi
* swap
* openssh server
* root partition auto-expand on first boot

sudo bash ./appbuild.sh && sudo ./bin/act --platform ubuntu-latest=lucasalt/act_base:latest 

 ### 推送docker image 到服务器

 "./appbuild.sh" && "./apprun.sh" 