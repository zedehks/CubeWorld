const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const app = express();
const sql = require('./sql-con.js');
const Scrambo = require('./scrambo.js');

app.use(express.static(path.join(__dirname, 'build')))
app.use(express.static('public'));

var Scramble = new Scrambo();

// app.get('/', function (req, res) {
//     res.sendFile(path.join(__dirname, 'public', 'index.html'));
// });

app.get('/login', function (req, res, next) {
    console.dir(req.query);
    let user = req.query.username;
    let pass = req.query.password;
    console.log('attempting login for '+user+','+pass);
    sql.login(user,pass).then(result => {
	if(result.rowsAffected[0] === 0)
	{
	    res.status(404).send('Incorrect credentials.');
	}
	else
	{
	    let queryResult = result.recordset[0][0];
	    console.dir(queryResult);
	    res.send(JSON.stringify(queryResult));
	}	
    }).catch(next);
    
});

app.get('/sessions', function (req, res, next) {
    console.dir (req.query);
    sql.sessions(req.query.id_user).then(result => {
	if(result.rowsAffected[0] === 0)
	{
	    res.status(404).send('No sessions found.');
	}
	else
	{
	    let queryResult = result.recordset[0];
	    console.dir(queryResult);
	    res.send(JSON.stringify(queryResult));
	}
    }).catch(next);    
});

app.post('/register', function (req, res) {
    console.dir(req.query)
    let user = req.query.username;
    let pass = req.query.password;
    let ln = req.query.last_name === '' ? null : req.query.last_name;
    let fn = req.query.first_name === '' ? null : req.query.first_name;
    let priv = req.query.is_private === 'true' ? 1 : 0;
     sql.register(user,pass,ln,fn,priv).then(result => {
	if(result.rowsAffected[0] === 0)
	{
	    console.log('Username already exists!');
	    res.status(409).send('conflict_username');
	}
	else
	{
	    res.send("User Created.");	    
	}
	
    }).catch(error=> {
	console.log('Username already exists!');
	res.status(409).send('conflict_username');
    });
});

app.post('/session', function (req, res) {
    console.dir(req.query);
    let user=req.query.user;
    let puzzle=req.query.puzzle;
    sql.session(user,puzzle).then(result => {
	if(result.rowsAffected[0] === 0)
	{
	    console.log('Error creating Session!');
	    res.status(500).send('conflict_session');
	}
	else
	{
	    res.send("Session Created.");	    
	}
    }).catch(error=> {
	console.log('Error creating Session!');
	res.status(500).send('conflict_session');
    });
});

app.delete('/session', function (req, res,next ) {
    console.dir(req.query);
    let user=req.query.id_user;
    let sess=req.query.id_session;
    sql.delSession(user,sess).then(result => {
	if(result.rowsAffected[0] === 0)
	{
	    console.log('Error deleting session!');
	    res.status(404).send('session_not_found');
	}
	else
	{
	    res.send("Session deleted.");	    
	}
    }).catch(error=> {
	console.log('Error deleting Session!');
	res.status(404).send('session_not_found');
    });
    
});

app.get('/scramble', function (req, res) {
    console.log('Get cube scramble');
    let scramble = Scramble.get(1);
    res.send(scramble);  
});

console.log('Server running on port 8080');
app.listen(process.env.PORT || 8080);

