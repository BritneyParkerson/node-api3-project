const server = require('./server.js');


const PORT = 3000;
server.listen(PORT, () => {
  console.log(`\n*** Welcome to Port 3000 ***\n`);
});