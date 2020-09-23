import React, {useState} from 'react';
import Login from './pages/Login';
import Main from './pages/Main';
import MiniDrawer from './pages/Bar';

export default function App() {
    const [user, setUser] = useState('');

    function forceUpdate(json) {
	//	alert(id);
//	console.log(json);
	setUser(json);
	
//	alert(userId);
    }
    function reset()
    {
        setUser('');
    }

    if(user !== '')
    {
	return(
	    <div>
		<Main logout={reset} rec_user={user}/>
	    </div>
	);
    }
    else{
	return(
	    <div>
		<Login rec_user={forceUpdate}/>
	    </div>
	);	
    }
    
    
};
