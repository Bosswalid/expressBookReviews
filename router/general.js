const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();


public_users.post("/register", (req,res) => {
  const username = req.body.username;
  const password = req.body.password;

  const doesExist = (username)=>{
    let userswithsamename = users.filter((user)=>{
      return user.username === username
    });
    if(userswithsamename.length > 0){
      return true;
    } else {
      return false;
    }
  }

  if (!doesExist(username)) {
    users.push({'username': username,'password' : password})
    res.status(206).send('Registred')
  }

  //Write your code here
  else {
    res.status(400).json({message: "user has been existed"});
  }
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
  res.send(JSON.stringify(books))
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
  const isbn = req.params.isbn
  if (isbn) {
    const book = books[isbn]
    res.status(201).json(book);
  }
  else {
    res.status(401).json({message: "book not found"});
  } 
 });
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
  //Write your code here
  const author = req.params.author
  if (author) {
    const book = Object.values(books).find(book => book.author === author);
    res.status(201).json({book: book});
  }
  else {
    res.status(401).json({message: "book not found"});
  } 
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
  const title = req.params.title
  if (title) {
    const allBooks = Object.values(books).filter(book => book.title === title);
    res.status(201).json({book: allBooks});
  }
  else {
    res.status(401).json({message: "book not found"});
  }
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
  //Write your code here
  const isbn = req.params.isbn
  if (isbn) {
    const bookReview = books[isbn].reviews;
    res.status(201).json({review: bookReview});
  }
  else {
    res.status(401).json({message: "book not found"});
  }
});

module.exports.general = public_users;
