require('dotenv').config();
const express = require('express');
const client = require('./db');
const morgan = require('morgan');
const apiRouter = require('./api');

const app = express();
// middleware
app.use(morgan('dev'));
app.use(express.json());

app.use('/api', apiRouter);

app.use((error, req, res, next) => {
  res.status(500).send('Internal server error');
});

// init
async function init() {
  await client.connect();
  console.log('Database connected');
  // seed database
  const SQL = /*sql*/ `
    DROP TABLE IF EXISTS employees;
    DROP TABLE IF EXISTS departments;
    CREATE TABLE departments(
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL
    );
    CREATE TABLE employees(
      id SERIAL PRIMARY KEY,
      txt VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT now(),
      updated_at TIMESTAMP DEFAULT now(),
      department_id INTEGER REFERENCES departments(id) NOT NULL
    );

    INSERT INTO departments(name) VALUES('HR');
    INSERT INTO departments(name) VALUES('Accounting');
    INSERT INTO departments(name) VALUES('IT');
    INSERT INTO employees(txt, department_id) VALUES('Jane Doe',
      (SELECT id FROM departments WHERE name = 'HR'));
    INSERT INTO employees(txt, department_id) VALUES('John Smith',
      (SELECT id FROM departments WHERE name = 'Accounting'));
    INSERT INTO employees(txt, department_id) VALUES('Harry Potter',
      (SELECT id FROM departments WHERE name = 'IT'));
  `
  await client.query(SQL);
  // start the server
  app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
  });
}
init();