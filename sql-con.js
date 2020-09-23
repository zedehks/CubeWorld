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



// //Implies you already cleaned the statement!
// function executeStatement(request, query, connection)
// {
//     query = query.toString();
//     request.query(query, (err, rowCount) => {
// 	if (err) {
// 	    console.log(err);
// 	} else {
// 	    console.log('Result: ' + rowCount + ' rows.');
// 	}
// 	connection.close();
//     });

//     request.on('row', function(columns) {
// 	columns.forEach(function(column) {
// 	    console.log(column.value === null ? 'NULL' : column.value);
// 	});
//     });

//     request.on('done', function(rowCount, more) {
// 	console.log(rowCount, ' rows returned.');
//     });
// }


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
    },
    session: function(user,puzzle)
    {
	sql.on('error', err => {
	    console.log('SQL Error: '+err);
	});
	return new Promise((resolve, reject) => {
	    sql.connect(config).then(pool => {
		return pool.request()
		    .input('user',sql.VarChar,user)
		    .input('date',sql.DateTime,new Date())
		    .input('puzzle',sql.Int,puzzle)
		    .execute('NewSession');
	    }).then(result=> {
		console.log(result);
		resolve(result);		
	    }).catch(err => {
		console.log('Query error: '+err);
		reject(err);
	    });
	});
    },
    delSession: function(user,session)
    {
	sql.on('error', err => {
	    console.log('SQL Error: '+err);
	});
	return new Promise((resolve, reject) => {
	    sql.connect(config).then(pool => {
		const query=`delete from solve where id_session=@session and id_user=@user; delete from session where id_user=@user and id_session=@session;`;
		return pool.request()
		    .input('user',sql.Int, user)
		    .input('session',sql.Int, session)
		    .query(query);
	    }).then(result => {
		console.log(result);
		resolve(result);
	    }).catch(err => {
		console.log('Query error: '+err);
		reject(err);
	    });
	});
    },
    sessions: function(user_id)    
    {
	sql.on('error', err => {
	    console.log('SQL Error: '+err);
	});
	return new Promise((resolve, reject) => {
	    sql.connect(config).then(pool => {
		const query=`select id_session, date_session, puzzle_type from session where id_user=@user_id order by id_session desc
                             for json auto, include_null_values;`;
		return pool.request()
		    .input('user_id',sql.Int, user_id)
		    .query(query);
	    }).then(result => {
		console.log(result);
		resolve(result);
	    }).catch(err => {
		console.log('Query error: '+err);
		reject(err);
	    });
	});
	
    },
    lastSession: function(user_id)    
    {
	sql.on('error', err => {
	    console.log('SQL Error: '+err);
	});
	return new Promise((resolve, reject) => {
	    sql.connect(config).then(pool => {
		const query=`select top 1 id_session, id_user, date_session, puzzle_type from session where id_user=@user_id order by id_session desc 
                             for json auto, include_null_values;`;
		return pool.request()
		    .input('user_id',sql.Int, user_id)
		    .query(query);
	    }).then(result => {
		console.log(result);
		resolve(result);
	    }).catch(err => {
		console.log('Query error: '+err);
		reject(err);
	    });
	});
	
    },
    solves: function(session,user)
    {
	sql.on('error', err => {
	    console.log('SQL Error: '+err);
	});
	return new Promise((resolve, reject) => {
	    sql.connect(config).then(pool => {
		const query=`select id_solve, solve_time, penalty, scramble from solve where id_user=@id_user and id_session=@id_session order by id_solve desc
                             for json auto, include_null_values;`;
		return pool.request()
		    .input('id_user',sql.Int, user)
		    .input('id_session',sql.Int, session)
		    .query(query);
	    }).then(result => {
		console.log(result);
		resolve(result);
	    }).catch(err => {
		console.log('Query error: '+err);
		reject(err);
	    });
	});
    },
    solve: function(user,session,time,penalty,scramble)
    {
	sql.on('error', err => {
	    console.log('SQL Error: '+err);
	});
	return new Promise((resolve, reject) => {
	    sql.connect(config).then(pool => {
		const query=`insert into solve(id_session,id_user,solve_time,penalty,scramble)
                             values(@session,@user,@time,@penalty,@scramble);`;
		return pool.request()
		    .input('user',sql.Int, user)
		    .input('session',sql.Int, session)
		    .input('time',sql.Int,time)
		    .input('penalty',sql.VarChar,penalty)
		    .input('scramble',sql.VarChar,scramble)
		    .query(query);
	    }).then(result => {
		console.log(result);
		resolve(result);
	    }).catch(err => {
		console.log('Query error: '+err);
		reject(err);
	    });
	});
    },
    delSolve: function(user,session,id)
    {
	sql.on('error', err => {
	    console.log('SQL Error: '+err);
	});
	return new Promise((resolve, reject) => {
	    sql.connect(config).then(pool => {
		const query=`delete from solve where id_session=@session and id_user=@user and id_solve=@solve;`;
		return pool.request()
		    .input('user',sql.Int, user)
		    .input('session',sql.Int, session)
		    .input('solve',sql.Int, id)
		    .query(query);
	    }).then(result => {
		console.log(result);
		resolve(result);
	    }).catch(err => {
		console.log('Query error: '+err);
		reject(err);
	    });
	});
    },
    setPenalty: function(user,session,penalty)
    {
	sql.on('error', err => {
	    console.log('SQL Error: '+err);
	});
	return new Promise((resolve, reject) => {
	    sql.connect(config).then(pool => {
		const query=`update solve set penalty=@penalty where id_solve=(
select top 1 id_solve from solve where id_user=@user and id_session=@session order by id_solve desc);`;
		return pool.request()
		    .input('user',sql.Int, user)
		    .input('session',sql.Int, session)
		    .input('penalty',sql.VarChar,penalty)
		    .query(query);
	    }).then(result => {
		console.log(result);
		resolve(result);
	    }).catch(err => {
		console.log('Query error: '+err);
		reject(err);
	    });
	});
    },
    //stat funcs
    bestTime: function(id_user)
    {
	sql.on('error', err => {
	    console.log('SQL Error: '+err);
	});
	return new Promise((resolve, reject) => {
	    sql.connect(config).then(pool => {
		const query=`select top 1 solve_time from 
(select case penalty when 'plustwo' then (2000+solve_time) else solve_time end as solve_time 
from solve where id_user=@user and not penalty='dnf') t
order by solve_time asc;`;
		return pool.request()
		    .input('user',sql.Int, id_user)
		    .query(query);
	    }).then(result => {
		console.log(result);
		resolve(result);
	    }).catch(err => {
		console.log('Query error: '+err);
		reject(err);
	    });
	});
    },

    worstTime: function(id_user)
    {
	sql.on('error', err => {
	    console.log('SQL Error: '+err);
	});
	return new Promise((resolve, reject) => {
	    sql.connect(config).then(pool => {
		const query=`
select top 1 solve_time from 
(select case penalty when 'plustwo' then (2000+solve_time) else solve_time end as solve_time
from solve where id_user=@user and not penalty='dnf') t
order by solve_time desc;`;
		return pool.request()
		    .input('user',sql.Int, id_user)
		    .query(query);
	    }).then(result => {
		console.log(result);
		resolve(result);
	    }).catch(err => {
		console.log('Query error: '+err);
		reject(err);
	    });
	});
    },
    avgTime: function(id_user)
    {
	sql.on('error', err => {
	    console.log('SQL Error: '+err);
	});
	return new Promise((resolve, reject) => {
	    sql.connect(config).then(pool => {
		const query=`
select avg(t.average) as avg from 
(select
case penalty when 'plustwo' then (2000+solve_time) else solve_time end as average
 from solve where not penalty='dnf' and id_user=@user) t;`;
		return pool.request()
		    .input('user',sql.Int, id_user)
		    .query(query);
	    }).then(result => {
		console.log(result);
		resolve(result);
	    }).catch(err => {
		console.log('Query error: '+err);
		reject(err);
	    });
	});
    }
    


    
}


