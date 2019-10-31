const express = require("express");
const cookieParser = require('cookie-parser')
const app = express();
const PORT = 8080; // default port 8080

const users = { 
  "userRandomID": {
    id: "userRandomID", 
    email: "user@example.com", 
    password: "purple-monkey-dinosaur"
  },
 "user2RandomID": {
    id: "user2RandomID", 
    email: "user2@example.com", 
    password: "dishwasher-funk"
  }
}

function getUserByEmail(email, database) {
  for (let key in database){
if (email === database[key][`email`]) {
  return database[key][`id`];
   }
  }
  return undefined;
}

function matchPassword(actual,expected) {
  if (expected === actual) {
    return actual;
  } else {
    return false;
  }
}

function makeid(length) {
  var result = '';
  var characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  var charactersLength = characters.length;
  for ( var i = 0; i < length; i++ ) {
     result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

function generateRandomString() {
  return makeid(6);
}

app.set('view engine', 'ejs');
app.use(cookieParser())

const urlDatabase = {
  "b2xVn2": "http://www.lighthouselabs.ca",
  "9sm5xK": "http://www.google.com"
};

app.get("/", (req, res) => {
  res.send("Hello!");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

const bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: true}));

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls", (req, res) => {
  let templateVars = { urls: urlDatabase, user : users[req.cookies.userid]};
  console.log(`logging cookie`, req.cookies);
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new", templateVars = {user: users[req.cookies.userid]});
});

app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL], user: users[req.cookies.userid] };
  console.log([req.params]);
  res.render("urls_show", templateVars);
});

app.post("/urls", (req, res) => {
  let id = generateRandomString()
  console.log(req.body);  // Log the POST request body to the console
  urlDatabase[id] = req.body.longURL;  
  res.redirect(`/urls`)
});

app.get(`/u/:shortURL`, (req, res) => {
  const shortcut = req.params.shortURL;
  res.redirect(`http://${urlDatabase[shortcut]}`)
  console.log(shortcut + urlDatabase[shortcut]);
});

app.post(`/urls/:shortURL/delete`,(req, res) => {
delete urlDatabase[req.params.shortURL];
res.redirect(`/urls`)
});


app.post(`/urls/:shortURL`, (req, res) => {
  shortURL = req.params.shortURL;
  urlDatabase[shortURL] = req.body.longURL
  res.redirect(`/urls`);
});


app.post(`/logout`, (req, res) => {
  res.clearCookie(`userid`);
  res.redirect(`/urls`);
});

app.post(`/register`, (req, res) => {
  let randomid = generateRandomString();
  users[randomid] = {
    id : randomid,
    email : req.body.email,
    password : req.body.password
  }
  res.cookie(`userid`, randomid);
  console.log(users[randomid]);
  console.log(users);
  if (req.body.email === "" || req.body.password === "" || !getUserByEmail(req.body.email, users)) {
    res.status(404).send('Please enter a valid and non pre-existing email')
  }
  res.redirect(`/urls`);
});

app.get(`/register`, (req, res) => {
  let templateVars = {user : users[req.cookies.userid]};
  res.render(`registration`, templateVars);
});

app.get(`/login`, (req, res) => {
res.render(`login`, templateVars = {user : users[req.cookies.userid]});
});

app.post(`/login`, (req, res) => {
  if (!req.body.userid || !req.body.password) {
    res.status(404).send(`Please ensure both fields are filled.`)
  };
  if (getUserByEmail(req.body.email, users) = undefined) {
    res.status(404).send(`That is not a registered email address.`)
  } else {
    userid = getUserByEmail(req.body.email);
  };
  if (users[userid][`password`] === req.body.password) {
    res.cookie(`userid`, users[userid]);
  } else {
    res.status(404).send(`Wrong password!`);
  };
});


//getUserByEmail(req.body.email,users) 





//res.cookie(`userid`, users[]);
//res.redirect(`/urls`);
//});
