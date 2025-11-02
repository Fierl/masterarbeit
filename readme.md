# htpasswd
sudo apt install apache2-utils
sudo htpasswd -c /etc/nginx/.htpasswd admin
sudo htpasswd /etc/nginx/.htpasswd anderer_user


# update
pip install -r requirements.txt
sudo systemctl restart masterarbeit
sudo systemctl status masterarbeit

# database
sudo -u postgres psql
\c test
ALTER TABLE chats ADD COLUMN chat_type VARCHAR(10) DEFAULT 'generate' NOT NULL;