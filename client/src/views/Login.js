import React, { useState, useEffect } from 'react';
import * as Yup from 'yup';
import {Formik, Form, Field} from 'formik';
import Button from 'react-bootstrap/Button';
import {formStyles} from '../styles';
import { Navigate } from 'react-router-dom';
import { removeMyStoredItems } from '../storage/localStorage';
import axios from 'axios';


const FormSchema = Yup.object().shape({
    "username": Yup.string().required("Required"),

    "password": Yup.string().required("Required")
})

const initialValues = {
    username:'',
    password:''
}

const Login=(props)=>{

    const [error, setError] = useState('');
    const [redirect, setRedirect] = useState('');

    useEffect(()=>{
        props.setToken('');
        removeMyStoredItems();
    }, []);



    const handleSubmit = ({username, password}) => {
        
        axios.post(`http://127.0.0.1:5000/token?username=${username}&password=${password}`)
        .then(response=>{
            localStorage.setItem('token', response.data.token);
            localStorage.setItem('currentUserID', response.data.currentUserID);
            localStorage.setItem('totalPoints', response.data.totalPoints);
            props.setToken(response.data.token);
            props.setCurrentUserID(response.data.currentUserID);
            props.setTotalPoints(response.data.totalPoints);

            return response;
        })
        .then(response=>{
            if (response.data.token){
                console.log(response.data);
                setRedirect(true);
            }
            return response;
        })
        .catch(error=>{
            setError(`Invalid username or password`);
            console.error('Login Error: ', error);
        })
    }

    const styles={

        formHead:{
            color: "azure",
            fontWeight:"bold"
        }

    }
    return (
        <div style={formStyles.pageStyle}>
        {/* <p>Redirect: {`${redirect}`}</p> */}
        {redirect ? <Navigate to={{pathname:"/", props:{token:props.token}}}/> :''}
            <container style={formStyles.form}>
            <center><h1 style={styles.formHead}>Login</h1></center>
            <br/>
            <Formik initialValues={initialValues}
                validationSchema={FormSchema}
                onSubmit={
                    (values)=>{
                        handleSubmit(values);
                    }
                }>
                {
                    ({errors, touched})=>(
                        <Form>
                            <label style={formStyles.formLabel} htmlFor="username" className="form-label">Username</label>
                            {errors.username && touched.username ? (<div style={formStyles.error}>{errors.username}</div>):null}
                            <Field name="username" className="form-control" />
                            <br/>

                            <label style={formStyles.formLabel} htmlFor="password" className="form-label">Password</label>
                            {errors.password && touched.password ? (<div style={formStyles.error}>{errors.password}</div>):null}
                            <Field name="password" type="password" className="form-control" />
                            <small style={formStyles.error}>{error}</small>

                            <br/>
                            <br/>
                            <Button style={formStyles.formButton} type="submit" className="btn btn-primary">Login</Button>

                        </Form>
                    )
                }

            </Formik>
            </container>
        </div>
    );
    
}
export default Login;


