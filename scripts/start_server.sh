echo "Starting the server"

sudo npm install --prefix /home/ubuntu/Code/coffee-supply-chain
npm run dev --prefix /home/ubuntu/Code/coffee-supply-chain
sudo systemctl restart cf.service