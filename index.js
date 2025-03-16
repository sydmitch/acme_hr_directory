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
    DROP TABLE IF EXISTS departmemts;
    CREATE TABLE departments(
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL
    );
    CREATE TABLE employees(
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT now(),
      updated_at TIMESTAMP DEFAULT now(),
      department_id INTEGER REFERENCES departments(id) NOT NULL
    );

    INSERT INTO departments(name) VALUES('HR');
    INSERT INTO departments(name) VALUES('Accounting');
    INSERT INTO departments(name) VALUES('IT');
    INSERT INTO employees(name, department_id) VALUES('Jane Doe', 1,
      (SELECT id FROM departments WHERE name = 'HR');
    );
    INSERT INTO employees(name, department_id) VALUES('John Smith', 2
      (SELECT id FROM departments WHERE name = 'Accounting');
    );
    INSERT INTO employees(name, department_id) VALUES('Harry Potter', 3
      (SELECT id FROM departments WHERE name = 'IT');
    );
  `
  await client.query(SQL);
  // start the server
  app.listen(process.env.PORT, () => {
    console.log(`Server is running on port ${process.env.PORT}`);
  });
}
init();