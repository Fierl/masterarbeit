# htpasswd
sudo apt install apache2-utils
sudo htpasswd -c /etc/nginx/.htpasswd admin
sudo htpasswd /etc/nginx/.htpasswd anderer_user


# update
pip install -r requirements.txt
sudo systemctl restart masterarbeit
sudo systemctl status masterarbeit