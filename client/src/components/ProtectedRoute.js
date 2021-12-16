import React from 'react';
import { Navigate } from 'react-router-dom';

const Protectedroute = (props) => {
    return props.token || localStorage.getItem('tasks') ?(
        props.children
    ):(
        <Navigate to={{pathname:"/login"}} />
    );
}

export default Protectedroute;
