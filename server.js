const express = require("express");
const ejs = require("ejs")
const http = require("http")
const bodyParser = require("body-parser")
const session = require('express-session');

const app = express();
const server = http.createServer(app)
const io = require("socket.io")(server)

const { isAuthenticated, isAlreadyLoggedIn } = require("./middleware.js");

// App configs
app.set("view engine", "ejs")
app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static('public'));

// For authentication
app.use(session({
  secret: 'rungkad',
  resave: false,
  saveUninitialized: true
}));

// Middleware
let jsonParser = bodyParser.json()
let urlencodedParser = bodyParser.urlencoded({ extended: false })

// Routes
app.get("/", isAuthenticated, (req, res) => {
  res.render('chatpage');
})


// Authentication
app.get("/login", isAlreadyLoggedIn, (req, res) => {
  if (req.session.user) {
    return res.redirect('/');
  }
  res.render("login")
})

app.post("/login", isAlreadyLoggedIn, (req, res) => {
  const { username } = req.body;
  console.log(username)

  req.session.user = username;
  req.session.device = req.headers['user-agent'];

  console.log(`
Client IP address: ${req.ip}
Client user agent: ${req.headers["user-agent"]}
Request body: ${req.body.username}
    `)

  // Save the username with the session
  res.redirect('/'); //  Redirect to home page
});

// GET username
app.get("/get-username", isAuthenticated, (req, res) => {
  const data = req.session.user;
  res.send(data)
})


app.get('/logout', (req, res) => {
  req.session.destroy();
  res.redirect('/login');
});

var name;

// Socket io
io.on('connection', (socket) => {
  console.log('new user connected');
  
  socket.on('joining msg', (username) => {
  	name = username;
  });
  
  socket.on('disconnect', () => {
    console.log('user disconnected');
    
  });
  socket.on('chat message', (msg) => {
    socket.broadcast.emit('chat message', msg);         //sending message to all except the sender
    console.log(msg)
  });
});

server.listen(8080, () => {
	console.log("Listening to port 8080")
})
