const express = require('express');
const User = require('./userDb');
const router = express.Router();

router.use((req, res, next) => {
  console.log('user router!');
  next();
})

router.post('/', validateUser, requiredBody, (req, res) => {
  User
  .insert(req.body)
  .then((user) => {
    res.status(200).json(user);
  })
  .catch((error) => {
    res.status(500).json({ error: "Unable to create user"});
  });
});

router.post('/:id/posts', [ validateUserId, validatePost ,requiredBody ],  async (req, res) => {
  const post ={ ...req.body, user_id: req.params.id}
  try {
    const post = await User.add(post);
    res.status(201).json(post);
  } catch (err) {
    console.log(err);
    res.status(500).json({ err });
  }
});

router.get('/', getHandler);

router.get('/:id', validateUserId, (req, res) => {
  res.status(200).json(req.user);
});

router.get('/:id/posts', validatePost, (req, res) => {
  res.status(200).json(req.userPost);
});

router.delete('/:id', validateUserId, (req, res) => {
  User.remove(req.params.id)
  .then(user => {
    if (user > 0) {
      res.status(200).json({ message: 'User was deleted'})
    } else {
      res.status(404).json({ message: 'Post could not be located'})
    }
  })
  .catch(error => {
    console.log(error);
    res.status(500).json({message: 'Unable to delete post', error})
  })
});

router.put('/:id', [validateUser, validateUserId, requiredBody] ,(req, res) => {
  User.update(req.params.id, req.body)
  .then(user => {
    if (user) {
      res.status(200).json(req.body);
    } else {
      res.status(404).json({message: 'User ID is invalid'})
    }
  })
  .catch(error => {
    console.log(error);
    res.status(500).json({message: 'Could not update user information', error })
  })
});

//custom middleware

function validateUserId(req, res, next) {
  const { id } = req.params;
  User.getById(id)
  .then((user) => {
    if (user) {
      req.user = user;
      next();
    } else {
      next(new Error('This User does not exist '));
     }
    })
    .catch(err => {
      console.log(error);
      res.status(500).json({message: 'Error occurred', error});
  });
}

function validateUser(req, res, next) {
  const name = req.body;
  User.get(name)
  .then( user => {
    if(user){
      req.user = user
      next()
    } else {
      next(new Error('User name is required'))
    }
  })
  .catch( error => {
    console.log(err);
    res.status(500).json({message: 'Error Occurred' , error})
  })
}

function validatePost(req, res, next) {
  const { id } = req.params;
  User.getUserPosts(id)
  .then(userPost => {
    if(userPost){
      req.userPost = userPost;
      next()
    } else {
      next(new Error('This Post in missing vital information'));
    }
  })
  .catch(error => {
    console.log(error);
    res.status(500).json({message: 'Error occurren', error});
  });
}

function getHandler(req, res) {
  User.get(req.query)
    .then(user => {
      res.status(200).json(user);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({
        message: 'Could not retrieve post',
      });
    });
}


function requiredBody(req, res, next){
  if (req.body || req.body !== {}) {
    next();
  } else {
    res.status(400).json({message: 'Your request is missing vital information'})
  }
  }

module.exports = router;
