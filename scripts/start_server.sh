echo "Starting the server"

sudo npm set progress=false
sudo npm config set registry http://registry.npmjs.org/
sudo npm install --prefix /home/ubuntu/Code/coffee-supply-chain
sudo systemctl restart cf.service