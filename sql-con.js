const sql = require('mssql');
var Request = require('mssql').Request

const config = {
    user: 'cuber',
    password: 'speedsolving',
    server: 'localhost',
    database: 'CubeWorld',
    port: 1433,
    parseJSON: true,
    //requestTimeout: 3000,
};



//Implies you already cleaned the statement!
function executeStatement(request, query, connection)
{
    query = query.toString();
    request.query(query, (err, rowCount) => {
	if (err) {
	    console.log(err);
	} else {
	    console.log('Result: ' + rowCount + ' rows.');
	}
	connection.close();
    });

    request.on('row', function(columns) {
	columns.forEach(function(column) {
	    console.log(column.value === null ? 'NULL' : column.value);
	});
    });

    request.on('done', function(rowCount, more) {
	console.log(rowCount, ' rows returned.');
    });
}


module.exports = {
    login: function(username, password)
    {
	sql.on('error', err => {
	    console.log('SQL Error: '+err);
	});
	return new Promise((resolve, reject) => {
	    sql.connect(config).then(pool => {
		return pool.request()
		    .input('un',sql.VarChar,username)
		    .input('pw',sql.VarChar,password)
		    .execute('TryLogin');
	    }).then(result=> {
		console.log(result);
		resolve(result);		
	    }).catch(err => {
		console.log('Query error: '+err);
		reject(err);
	    });
	});
			    	
    },
    register: function(username, password, last_name, first_name, is_private)
    {
	sql.on('error', err => {
	    console.log('SQL Error: '+err);
	});
	return new Promise((resolve, reject) => {
	    sql.connect(config).then(pool => {
		const query = `insert into users(username, password, last_name, first_name, is_private)
 values(@username, @password, @last_name, @first_name, @is_private);`;
		return pool.request()
		    .input('username',sql.VarChar,username)
		    .input('password',sql.VarChar,password)
		    .input('last_name',sql.VarChar,last_name)
		    .input('first_name',sql.VarChar,first_name)
		    .input('is_private',sql.Bit,is_private)
		    .query(query);
	    }).then(result=> {
		console.log(result);
		resolve(result);		
	    }).catch(err => {
		console.log('Query error: '+err);
		reject(err);
	    });
	});
    }
}


