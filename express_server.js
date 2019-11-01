const express = require("express");
const cookieSession = require('cookie-session');
const bcrypt = require('bcrypt');
const bodyParser = require("body-parser");
const {
  matchPassword,
  generateRandomString,
  makeid,
  urlsForUser,
  getUserByEmail
} = require(`./helpers`);

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

const urlDatabase = {
  b6UTxQ: { longURL: "https://www.tsn.ca", userid: "aJ48lW" },
  i3BoGr: { longURL: "https://www.google.ca", userid: "qeTY65" }
};


app.set('view engine', 'ejs');
app.use(bodyParser.urlencoded({extended: true}));
app.use(cookieSession({
  name: 'session',
  keys: ['key1', 'key2']
 }));
 
 app.use('/urls', function (req, res, next) {
   if (!req.session.userid) {
     res.redirect('/login');
   } else {
     next();
   }
 });


 app.get("/", (req, res) => {
  res.send("Hello!");
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}!`);
});

app.get("/urls.json", (req, res) => {
  res.json(urlDatabase);
});

app.get("/urls", (req, res) => {
  let filteredURLS = urlsForUser(req.session.userid, urlDatabase);
  let templateVars = { urls: filteredURLS, user : users[req.session.userid]};
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  if (!req.session.userid) {
    res.redirect(`/register`);
    return;
  }
  res.render("urls_new", templateVars = {user: users[req.session.userid]});
});

app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL].longURL, user: users[req.session.userid] };
  console.log([`-------------` + req.params]);
  res.render("urls_show", templateVars);
});

app.post("/urls", (req, res) => {
  let urlObj = {}
  urlObj[`longURL`] = req.body.longURL;
  urlObj[`userid`] = req.session.userid;
  urlDatabase[generateRandomString()] = urlObj;
  console.log(urlDatabase);
  res.redirect(`/urls`)
});

app.get(`/u/:shortURL`, (req, res) => {
  const shortcut = req.params.shortURL;
  if (!urlDatabase[shortcut]) {
    res.status(404).send(`<h1>TinyURL not found in database, screw you.</h1>`)
  }
  res.redirect(urlDatabase[shortcut].longURL);
  //console.log(shortcut + urlDatabase[shortcut]);
});

app.post(`/urls/:shortURL/delete`,(req, res) => {
  if (!req.session.userid === req.params.shortURL) {
    res.status(404).send(`You are not the owner of this shortURL. Login to edit or delete`);
    return;
  }
  delete urlDatabase[req.params.shortURL];
  res.redirect(`/urls`)
});

app.post(`/urls/:shortURL`, (req, res) => {
  shortURL = req.params.shortURL;
  urlDatabase[shortURL].longURL = req.body.longURL
  console.log(`***** URL DATABASE ******`)
  res.redirect(`/urls`);
});

app.post(`/logout`, (req, res) => {
  req.session = null;
  res.redirect(`/urls`);
});

app.post(`/register`, (req, res) => {
  let randomid = generateRandomString();
  console.log((getUserByEmail(req.body.email, users)));
  if (getUserByEmail(req.body.email, users)) {
    res.redirect(`/login`);
    return;
  }
  
  console.log(users[randomid]);
  console.log(users);
  if (req.body.email === "" || req.body.password === "" ) {
    res.status(404).send('Please enter a valid and non pre-existing email')
    return;
  }
  req.session.userid = randomid;
  users[randomid] = {
    id : randomid,
    email : req.body.email,
    password : bcrypt.hashSync(req.body.password, 10)
  }
  res.redirect(`/urls`);
});

app.get(`/register`, (req, res) => {
  let templateVars = {user : users[req.session.userid]};
  res.render(`registration`, templateVars);
});

app.get(`/login`, (req, res) => {
res.render(`login`, templateVars = {user : users[req.session.userid]});
});

app.post(`/login`, (req, res) => {
  let user = getUserByEmail(req.body.email, users);
  if (!req.body.email || !req.body.password) {
    res.status(404).send(`Please ensure both fields are filled.`)
  };
  if (user === undefined) {
    res.status(404).send(`That is not a registered email address.`)
  };
  if (bcrypt.compareSync(req.body.password, user.password)) {
    req.session.userid = user.id;
    res.redirect(`/urls`);
  } else {
    res.status(404).send(`Wrong password!`);
  };
});


//getUserByEmail(req.body.email,users) 





//res.cookie(`userid`, users[]);
//res.redirect(`/urls`);
//});


// bugs to fix = edit a link deletes it, edit link pasge displays {object, object} instead of longURL
//