## Creating SSH Key

### For MAC OS & Ubuntu

1. Launch Terminal app.
2. `ssh-keygen -t rsa`
3. `pbcopy < ~/.ssh/id_rsa.pub` Mac
4. `cat ~/.ssh/id_rsa.pub` Ubuntu
5. Add Mac SSH key to host.
6. Add Ubuntu SSH key to Github.

## SSH

```bash
ssh root@<server ip address>
```

## Update server

```
apt clean all && sudo apt update && sudo apt dist-upgrade
```

```
rm -rf /var/www/html
```

## Setup

### Deleting apache server (if necessary)

```
systemctl stop apache2
```

```
systemctl disable apache2
```

```
apt remove apache2
```

to delete related dependencies:

```
apt autoremove
```

### Install Dependencies

```
apt install nginx
```

```
apt install git
```

#### Install NVM (Node & NPM)

```
sudo apt install curl
curl https://raw.githubusercontent.com/creationix/nvm/master/install.sh | bash
source ~/.bashrc
```

Place `source ~/.nvm/nvm.sh` in `~/.bash_profile`

```
source ~/.bash_profile
```

```
nvm install 18
```

#### yarn

```
sudo apt install --no-install-recommends yarn
```

#### pm2

```
npm i -g pm2
```

#### Redis

```
sudo apt install redis-server
```

```
nano /etc/redis/redis.conf
```

Change `supervised` to `systemd`

```
. . .

# If you run Redis from upstart or systemd, Redis can interact with your
# supervision tree. Options:
#   supervised no      - no supervision interaction
#   supervised upstart - signal upstart by putting Redis into SIGSTOP mode
#   supervised systemd - signal systemd by writing READY=1 to $NOTIFY_SOCKET
#   supervised auto    - detect upstart or systemd method based on
#                        UPSTART_JOB or NOTIFY_SOCKET environment variables
# Note: these supervision methods only signal "process is ready."
#       They do not enable continuous liveness pings back to your supervisor.
supervised systemd

. . .
```

```
systemctl restart redis.service
```

Check status

```
systemctl status redis
```

```
redis-cli
> ping
```

### Installing and configure Firewall

```
apt install ufw
```

```
ufw enable
```

```
ufw allow "Nginx Full"
```

## Domain (DNS)

1. Make sure that you created your A records on your domain provider website.

```
A      @        ip address
A      www      ip address
A      admin    ip address
```

## NGINX

#### Delete the default server configuration

```
 rm /etc/nginx/sites-available/default
```

```
 rm /etc/nginx/sites-enabled/default
```

#### Configuration (based on cloud panel vHost)

```
 nano /etc/nginx/sites-available/<app-name>
```

```
map $http_upgrade $connection_upgrade {
	default upgrade;
	'' close;
}

upstream websocket {
	server 127.0.0.1:3333;
}

server {
	listen 80;
	listen [::]:80;
	listen 443 ssl http2;
	listen [::]:443 ssl http2;
	{{ssl_certificate_key}}
	{{ssl_certificate}}
	server_name 930south.com;
	return 301 https://www.930south.com$request_uri;
}

server {
	listen 80;
	listen [::]:80;
	listen 443 ssl http2;
	listen [::]:443 ssl http2;
	{{ssl_certificate_key}}
	{{ssl_certificate}}
	server_name www.930south.com www1.930south.com;

	location / {
		{{root}}
		index  index.html index.htm;
		proxy_http_version 1.1;
		proxy_set_header Upgrade $http_upgrade;
		proxy_set_header Connection 'upgrade';
		proxy_set_header Host $host;
		proxy_cache_bypass $http_upgrade;
		try_files $uri $uri/ /index.html;
	}

	location  ~ ^/api/(.*)$ {
		proxy_pass http://127.0.0.1:{{app_port}}/api/$1;
		proxy_http_version 1.1;
		proxy_set_header X-Forwarded-Host $host;
		proxy_set_header X-Forwarded-Server $host;
		proxy_set_header X-Real-IP $remote_addr;
		proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
		proxy_set_header X-Forwarded-Proto $scheme;
		proxy_set_header Host $http_host;
		proxy_set_header Upgrade $http_upgrade;
		proxy_set_header Connection "Upgrade";
		proxy_pass_request_headers on;
		proxy_max_temp_file_size 0;
		proxy_connect_timeout 900;
		proxy_send_timeout 900;
		proxy_read_timeout 900;
		proxy_buffer_size 128k;
		proxy_buffers 4 256k;
		proxy_busy_buffers_size 256k;
		proxy_temp_file_write_size 256k;
	}

	location /socket.io/ {
		proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
		proxy_set_header Host $host;
		proxy_pass http://127.0.0.1:{{app_port}};
		proxy_http_version 1.1;
		proxy_set_header Upgrade $http_upgrade;
		proxy_set_header Connection "upgrade";
	}
}
```

```
ln -s /etc/nginx/sites-available/<app-name> /etc/nginx/sites-enabled/<app-name>
```

```
systemctl start nginx
```

## Uploading App from Git

```
mkdir <app_name>
```

```
cd <app_name>
```

```
git clone <your repository> .
```

## React App Deployment

Create .env file

```
nano .env (client)
```

Install dependencies and build the client.

```
cd client
yarn
npm run build
```

## Node App Deployment

Create .env file

```
nano production.env (server)
```

Install dependencies and build the client.

```
cd server
yarn
npm start
```

### Run with pm2

```
pm2 start npm --name “portal-server” -- start
pm2 save
pm2 startup ubuntu
```

#### Kill all pm2 instances

```
pm2 delete all
```

#### Reboot saved instances

```
pm2 resurrect
```

## SSL Certification

```
apt install certbot python3-certbot-nginx
```

Make sure that Nginx Full rule is available

```
ufw status
```

```
certbot --nginx -d example.com -d www.example.com
```

Let’s Encrypt’s certificates are only valid for ninety days. To set a timer to validate automatically:

```
systemctl status certbot.timer
```
