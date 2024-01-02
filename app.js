const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const zod = require("zod");
const path = require("path");

const app = express();
const port = 3000;

// Importing userDatabase and addUser from db.js
const userDatabase = require('./data/db').getItems();
const addUser = require('./data/db').addItem;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));

function validateInput(obj) {
  const schema = zod.object({
    email: zod.string().email(),
    password: zod.string().min(8),
  });

  return schema.safeParse(obj);
}

function authenticateUser(email, password) {
  return userDatabase.some(user => user.email === email && user.password === password);
}

function signupUser(email, password) {
  const doesExist = userDatabase.some(user => user.email === email);

  if (doesExist) {
    console.log('User already exists. Cannot sign up with the same email.');
    return { success: false, message: 'User already exists' };
  }

  const newUser = {
    email: email,
    password: password,
  };

  addUser(newUser);

  console.log('User signed up successfully:', newUser);
  console.log(addUser)
  console.log(userDatabase)
  return { success: true, message: 'User signed up successfully' };
}

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get("/signin", (req, res) => {
  res.render('signin');
});

app.get('/signup', (req, res) => {
  res.render('signup');
});

app.post("/login", (req, res) => {
  console.log(req.body);
  const { email, password } = req.body;
  const validationResult = validateInput({ email, password });

  if (!validationResult.success) {
    const errorMessages = validationResult.error.errors.map((err) => err.message);
    res.status(400).json({ success: false, errors: errorMessages });
  } else {
    const isAuthenticated = authenticateUser(email, password);

    if (isAuthenticated) {
      res.json({ success: true, message: "Login successful" });
    } else {
      res.status(401).json({ success: false, errors: ["Invalid credentials"] });
    }
  }
});

app.post('/signup', (req, res) => {
  const { email, password } = req.body;
  const result = signupUser(email, password);

  res.json(result);
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
