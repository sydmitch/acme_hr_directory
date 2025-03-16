// API routes
const router = require('express').Router();
const client = require('./db');

// router - localhost:3000/api
router.get('/departments', async (req, res, next) => {
  try {
    const SQL = /*sql*/ `
      SELECT * FROM departments
      `;
    const response = await client.query(SQL);
    res.send(response.rows);
  } catch (error) {
    next(error);
  }
});



// export the router
module.exports = router;