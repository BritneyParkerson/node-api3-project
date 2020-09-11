const express = require('express');
const router = express.Router();
const Post = require("./postDb");

router.use((req, res, next) => {
  console.log('Lets post it!');
  next();
});

router.get('/', getHandler);

router.get("/:id", validatePostId, (req, res) => {
  res.status(200).json(req.post);
});

router.delete("/:id", validatePostId, (req, res) => {
 Post.remove(req.params.id)
  .then((post) => {
    if (post > 0) {
      res.status(200).json({ message: 'Post Deleted'});
    } else {
      res.status(404).json({ message: 'Post could not be located'})
    }
  })
  .catch(error => {
    console.log(error);
    res.status(500).json({ message: 'An error occured. Could not delete post', error})
  })
  });


router.put('/:id', [validatePostId, requiredBody ], (req, res) => {
  Post.update(req.params.id, req.body)
  .then(post => {
    if (post) {
      res.status(200).json(req.body);
    } else {
      res.status(404).json({message: 'Post could not be located'})
    }
  })
  .catch(error => {
    console.log(error);
    res.status(500).json({message: 'An error occurred. Could not delete post', error })
  })
});

// custom middleware

function validatePostId(req,res,next) {
  const { id } = req.params;
  Post.getById(id)
  .then(post => {
    if(post){
      req.post = post;
      next()
    } else {
      next(new Error('This post does not exist'));
    }
  })
  .catch(error => {
    console.log(error);
    res.status(500).json({message: 'An error occurred', error});
  });
}

function getHandler(req, res) {
  Post.get(req.query)
    .then(post => {
      res.status(200).json(post);
    })
    .catch(error => {
      console.log(error);
      res.status(500).json({message: 'Could not retrieve posts'});
    });
} 

function requiredBody(req, res, next){
  if (req.body || req.body !== {}) {
    next();
  } else {
    res.status(400).json({message: 'Oops! Looks like your request needs a little more information.'})
  }
  }

module.exports = router;
