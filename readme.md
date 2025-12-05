# htpasswd
sudo apt install apache2-utils
sudo htpasswd -c /etc/nginx/.htpasswd admin
sudo htpasswd /etc/nginx/.htpasswd anderer_user


# update
pip install -r requirements.txt
sudo systemctl restart masterarbeit
sudo systemctl status masterarbeit

# mistrail
console.mistral.ai

# database
sudo -u postgres psql
\c test
ALTER TABLE chats ADD COLUMN chat_type VARCHAR(10) DEFAULT 'generate' NOT NULL;
ALTER TABLE articles ADD COLUMN is_hidden BOOLEAN DEFAULT FALSE;
ALTER TABLE articles ADD COLUMN IF NOT EXISTS teaser TEXT;
ALTER TABLE users ADD COLUMN custom_system_prompts TEXT;

# logs
sudo journalctl -u masterarbeit
sudo journalctl -u masterarbeit -f
sudo journalctl -u masterarbeit -n 100
sudo journalctl -u masterarbeit --since today