const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;
const axios = require('axios');

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))


app.use("/customer/auth/*", function auth(req,res,next){
    if(req.session.authorization) {
        token = req.session.authorization['accessToken'];
        jwt.verify(token, "access",(err,user)=>{
            if(!err){
                req.user = user;
                next();
            }
            else{
                return res.status(403).json({message: "User not authenticated"})
            }
         });
     } else {
         return res.status(403).json({message: "User not logged in"})
     }
    
});

const PORT =5000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log("Server is running"));




async function getBooks() {
  return new Promise((resolve, reject) => {
    axios.get('http://localhost:5000/')
      .then(response => resolve(response.data))
      .catch(error => reject(error));
  });
}

// getBooks()
//     .then(bookDetails => {
//     console.log(`Books details :`, bookDetails);
//     })
//     .catch(error => {
//     // Handle error
//     console.error('Error fetching book details:', error.message);
// });

async function getBookDetailsByISBN(isbn) {
    try {
      const response = await axios.get(`http://localhost:5000/isbn/${isbn}`);
      return response.data;
    } catch (error) {
      // Handle error
      console.error('Error fetching book details:', error.message);
      throw error; // You might want to handle or log the error appropriately in your application
    }
  }

const isbn = 1;
    getBookDetailsByISBN(isbn)
    .then(bookDetails => {
    console.log(`Book details for isbn ${isbn}:`, bookDetails);
    })
    .catch(error => {
    // Handle error
    console.error('Error fetching book details:', error.message);
});

async function getBooksByAuthor(author) {
try {
    const response = await axios.get(`http://localhost:5000/author/${author}`);
    return response.data;
} catch (error) {
    // Handle error
    console.error('Error fetching book details:', error.message);
    throw error; // You might want to handle or log the error appropriately in your application
}
}

// const author = 'Jane Austen';
// getBooksByAuthor(author)
//   .then(bookDetails => {
//     console.log(`Book details for author ${author}:`, bookDetails);
//   })
//   .catch(error => {
//     // Handle error
//     console.error('Error fetching book details:', error.message);
//   });





// Function to get book details by title using Promise callbacks
function getBooksByTitle(title) {
  return new Promise((resolve, reject) => {
    axios.get(`http://localhost:5000/title/${title}`)
      .then(response => resolve(response.data))
      .catch(error => reject(error));
  });
}

// const titleToFetch = 'Pride and Prejudice';
// getBooksByTitle(titleToFetch)
//   .then(bookDetails => {
//     console.log(`Book details for title ${titleToFetch}:`, bookDetails);
//   })
//   .catch(error => {
//     // Handle error
//     console.error('Error fetching book details:', error.message);
//   });
