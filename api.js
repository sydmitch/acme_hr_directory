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

router.get('/employees', async (req, res, next) => {
  try {
    const SQL = /*sql*/ `
      SELECT * FROM employees
    `;
    const response = await client.query(SQL);
    res.send(response.rows);
  } catch (error) {
    next(error);
  };
});

router.post('/employees', async (req, res, next) => {
  try {
    const SQL = /*sql*/ `
      INSERT INTO employees(txt, department_id)
      VALUES ($1, $2)
      RETURNING *
    `
    const response = await client.query(SQL, [req.body.txt, req.body.department_id]);
    res.send(response.rows[0]);
  } catch (error) {
    next(error);
  }
});

router.delete('/employees/:id', async (req, res, next) => {
  try {
    const SQL = /*sql*/ `
      DELETE FROM employees
      WHERE id=$1
    `
    const response = await client.query(SQL, [req.params.id]);
    res.sendStatus(204);
  } catch (error) {
    next(error);
  }
});

router.put('/employees/:id', async (req, res, next) => {
  try {
    const SQL = /*sql*/ `
      UPDATE employees
      SET txt=$1, department_id=$2, updated_at=now()
      WHERE id=$3
      RETURNING *
    `
    const response = await client.query(SQL, [req.body.txt, req.body.department_id, req.params.id]);
      res.send(response.rows[0]);
  } catch (error) {
    next(error);
  }
});

// export the router
module.exports = router;