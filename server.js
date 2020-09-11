const express = require('express');
const server = express();

const helmet = require('helmet');
const postRouter = require('./posts/postRouter');
const userRouter = require('./users/userRouter');


server.use(express.json());
server.use(helmet());
server.use('/api/post', postRouter);
server.use('/api/user', userRouter);
server.use(logger);


server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

//custom middleware
function logger(req, res, next) {
  console.log(`${req.method} Request`);
  next();
}

module.exports = server;