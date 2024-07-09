const express = require('express')
const mysql = require('mysql2')
const path = require('path');
const bodyParser = require('body-parser');
const app = express();
const PORT = process.env.PORT || 3000
app.use(bodyParser.json());

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root', 
    password: 'mysql@123',
    database: 'login_database'
  });
db.connect((err) => {
    if (err) {
      console.error('Error connecting to the database:', err);
      return;
    }
    console.log('Connected to the MySQL database.');
  });

app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});



  
//   db.query('SELECT email FROM users', (err, results) => {
//     if (err) {
//       console.error(err);
//     return res.status(500).send('Error on the server.');
//     }
//     const emails = results.map(user => user.email);
//     res.status(200).json(emails);
//     console.log(emails)
//   });

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    
    db.query('SELECT * FROM users WHERE email = ?', [email], async (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).send('Error on the server.');
      }
  
      if (results.length === 0) {
        return res.status(404).send('User not found.');
      }
  
      const user = results[0];
    //   console.log(results)
    //   console.log(password == user.password )
    //   console.log(typeof user.password)
    //   const isPasswordValid = await bcrypt.compare(password, user.password);
      const isPasswordValid = (password == user.userPassword)
      if (!isPasswordValid) {
        return res.status(401).send('Invalid password.');
      }
  
      res.status(200).send('Login successful.');
    });
  });


app.listen(PORT,function(){
    console.log(`Server is running on port ${PORT}`)
})