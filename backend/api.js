import cors from 'cors';
import express from 'express';
import { database } from './database.js';

const app = express();
const port = 5000;
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => {
  res.send('Hello, World!');
});

app.get('/api/bog/users', (req, res) => {
    res.json(database).status(200);
});


app.get('/api/bog/users/:id', (req, res) => {
    const user = database.filter((user) => user.id === req.params.id)[0]
    res.json(user).status(200)
});

app.post('/api/bog/adduser', (req, res) => {
  const body = req.body;
  if (body === undefined || [body.name, body.avatar, body.hero_project, body.notes, body.email, body.phone, body.rating, body.status, body.id].includes(undefined)) {
    res.status(400).json({});
  }
  database.unshift(req.body);
  res.status(200).json({});
});

app.put('/api/bog/updateuser', (req, res) => {
  const body = req.body;
  if (body === undefined || [body.name, body.avatar, body.hero_project, body.notes, body.email, body.phone, body.rating, body.status, body.id].includes(undefined)) {
    res.status(400).json({});
  }
  //database = database.filter(user => user.id === body.id ? body : user);
  for (let i = 0; i < database.length; i++) {
    if (database[i].id === body.id) {
      database[i] = body;
    }
  }
  res.status(200).json({});
});

app.delete('/api/bog/deleteuser/:id', (req, res) => {
  const id = req.params.id;
  const oldLength = database.length;
  //database = database.filter(user => user.id !== id);
  let i = 0;
  while (i < database.length) {
    if (database[i].id === id) {
      database.splice(i, 1);
    } else {
      i++;
    }
  }
  if (database.length === oldLength) {
    res.status(400).json({});
  } else {
    res.status(200).json({});
  }
});

// Start the server
app.listen(port, () => {
  console.log(`Server is listening on port ${port}`);
});
