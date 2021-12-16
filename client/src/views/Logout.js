import React, { useEffect } from 'react';
import { Navigate } from 'react-router-dom';
import { removeMyStoredItems } from '../storage/localStorage';



const Logout=(props)=>{

    useEffect(()=>{
        props.setToken('');
        removeMyStoredItems();
    }, []);

    return (
        <div>
            <Navigate to={{pathname : '/login'}} />
        </div>
    );
}

export default Logout;
