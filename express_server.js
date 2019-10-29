const express = require("express");
const app = express();
const PORT = 8080; // default port 8080

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
  let templateVars = { urls: urlDatabase };
  res.render("urls_index", templateVars);
});

app.get("/urls/new", (req, res) => {
  res.render("urls_new");
});

app.get("/urls/:shortURL", (req, res) => {
  let templateVars = { shortURL: req.params.shortURL, longURL: urlDatabase[req.params.shortURL] };
  console.log([req.params]);
  res.render("urls_show", templateVars);
});

app.post("/urls", (req, res) => {
  let id = generateRandomString()
  console.log(req.body);  // Log the POST request body to the console
  urlDatabase[id] = req.body.longURL;  
  res.redirect(`/urls/${id}`)
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