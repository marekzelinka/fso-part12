const express = require('express');
const redis = require('../redis')
const router = express.Router();

/* GET statistics. */
router.get('/', async (_, res) => {
   const todosCount = await redis.getAsync('todos:count')
 
  res.send({
    "added_todos": parseInt(todosCount, 10) ?? 0
  });
});

module.exports = router;
