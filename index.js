const express = require('express');
const jwt = require('jsonwebtoken');

const app = express();

app.get('/api', (req, res) => {
    res.json({
        message: 'Welcome to the API'
    });
});

app.post('/api/posts', verifyToken, (req, res)=> {
    jwt.verify(req.token, 'secretkey',{ expiresIn: '30s'}, (err, authData) => {
        if(err) {
            res.sendStatus(403);
        } else {
            res.json({
                message: 'Post created...',
                authData
            });
        }
    })
});

app.post('/api/login', (req,res) => {
    // Mock user
    const user = {
        id: 1,
        username: 'brad',
        email: 'Brad@gmail.com'
    }
    jwt.sign({user:user}, 'secretkey', (err, token) => {
        res.json({
            token  
        })
    });
})

// FORMAT OF TOKEN

// Authorization: Bearer <access_token>


// verify token

function verifyToken(req, res, next) {
    // get the auth header value
    const bearerHeader = req.headers['authorization'];
    // check if bearer not undefined
    if(typeof bearerHeader !== 'undefined') {
        // slit at the space 
        const bearer = bearerHeader.split(' ');
        // Get token from array
        const bearerToken = bearer[1]
        // Set the token
        req.token = bearerToken;
        // next middleware
        next();
    } else {
        // Forbidden
        res.sendStatus(403)
    }
}


app.listen(5000, ()=> console.log('Server stated at port 5000'));
