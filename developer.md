ps -o pid,user,%mem,command ax | sort -b -k3 -r

git config credential.helper store

sysctl net.ipv4.ip_local_port_range="10000 60000"
sysctl net.ipv4.tcp_fin_timeout=30
sysctl net.ipv4.tcp_tw_recycle=1
sysctl net.ipv4.tcp_tw_reuse=1
sysctl net.core.somaxconn=1024
ifconfig eth0 txqueuelen 5000
echo "/sbin/ifconfig eth0 txqueuelen 5000" >> /etc/rc.loca
sysctl net.core.netdev_max_backlog=2000
sysctl net.ipv4.tcp_max_syn_backlog=2048



systemctl status mongodb.service
systemctl stop mongodb.service
systemctl restart mongodb.service

db.copyDatabase('smart_code_pos_111', 'smart_db_pos111')

--wiredTigerCacheSizeGB 1

service nginx configtest
nginx -t
service nginx status


## Tracking
  - Cookies [ hide by block ads  urls ]
  - Browser fingerprinting [ hide by social browser ]
  - Web beacons [images loaded like https://site.com/img.png?code=12345677895214]
  - IP [ hide by vpn]


// logo
https://editor.freelogodesign.org/?lang=en&logo=0fca3de4-641b-4e4e-a144-c396a3d01d14
font : RYE


// https://www.regextester.com/99810

  ## need update
  app tracking urls [ generate new url redirect to old url and save user ip]
  browser fingerprint update
  site time watching
  show bookmark on google main page
  ## new features add
  
  block browser finger:
    WebGL like vega name
    screen size
    cpu count
    ram size
    touch screen
    language
    user agent
    plugins
    mimetypes
    media devices [ camera , mic , ...]
    connection information
    permissions status
    battery information [ status , ...]
    social logins info [favicons hacks]
    

  GA cookie reuse //change cookies before send to site
  favicon from local disk nativeimage
  download is_hidden property
  iframe preload js
  remove empty frame
  site menu
  bookmark manager
  permission allow for fullscreen and openexternal and deey all other permissions
  setting faster open
  safty mode update
  ads block update
  play video & iframe updates
  