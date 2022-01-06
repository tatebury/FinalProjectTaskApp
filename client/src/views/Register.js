import React, { useState } from 'react';
import * as Yup from 'yup';
import {Formik, Form, Field} from 'formik';
import Button from 'react-bootstrap/Button';
import { Navigate } from 'react-router-dom';
import {formStyles} from '../styles';
import axios from 'axios';


const FormSchema = Yup.object().shape({
    "firstName": Yup.string(),
    "lastName": Yup.string(),
    "username": Yup.string().required("Required"),

    "password": Yup.string().required("Required"),
    "confirmPassword": Yup.string().required("Required")
     .oneOf([Yup.ref('password'), null], 'Passwords must match'),
    "icon": Yup.number("Must be a number").integer("Must be a non decimal number").nullable(true)
});

const initialValues = {
    firstName:'',
    lastName:'',
    username:'',
    password:'',
    confirmPassword:'',
    icon:null
};

const Register=(props)=>{


    const [error, setError] = useState('');
    const [redirect, setRedirect] = useState('');



    const handleSubmit = ({firstName, lastName, username, password, icon}) => {
        axios.post(`https://idimtaskapp.herokuapp.com/user?first_name=${firstName}&last_name=${lastName}&username=${username}&password=${password}&icon=${icon}`)
        .then(response=>{
            if (response.data){
                console.log(response.data);
                setRedirect(true);
            }
        })
        .catch(error=>{
            console.error("There was an error trying to create the user: ", error);
        })
    }

    const styles={


    }
    return (
        <div style={formStyles.pageStyle}>
        {/* <p>Redirect: {`${redirect}`}</p> */}
        {redirect ? <Navigate to={{pathname:"/login"}}/> :''}
            <container style={formStyles.form}>
            <center><h1 style={formStyles.formHead}>Register</h1></center>
            <br/>
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
                            <label style={formStyles.formLabel} htmlFor="firstName" className="form-label">First Name</label>
                            {errors.firstName && touched.firstName ? (<div style={styles.error}>{errors.firstName}</div>):null}
                            <Field style={formStyles.formField} name="firstName" type="firstName" className="form-control" />
                            <small style={formStyles.error}>{error}</small>
                            <br/>

                            <label style={formStyles.formLabel} htmlFor="lastName" className="form-label">Last Name</label>
                            {errors.lastName && touched.lastName ? (<div style={formStyles.error}>{errors.lastName}</div>):null}
                            <Field style={formStyles.formField} name="lastName" type="lastName" className="form-control" />
                            <small style={formStyles.error}>{error}</small>
                            <br/>

                            <label style={formStyles.formLabel} htmlFor="username" className="form-label">Username</label>
                            {errors.username && touched.username ? (<div style={formStyles.error}>{errors.username}</div>):null}
                            <Field style={formStyles.formField} name="username" className="form-control" />
                            <br/>

                            <label style={formStyles.formLabel} htmlFor="password" className="form-label">Password</label>
                            {errors.password && touched.password ? (<div style={formStyles.error}>{errors.password}</div>):null}
                            <Field style={formStyles.formField} name="password" type="password" className="form-control" />
                            <small style={formStyles.error}>{error}</small>
                            <br/>

                            <label style={formStyles.formLabel} htmlFor="confirmPassword" className="form-label">Confirm Password</label>
                            {errors.confirmPassword && touched.confirmPassword ? (<div style={formStyles.error}>{errors.confirmPassword}</div>):null}
                            <Field style={formStyles.formField} name="confirmPassword" type="password" className="form-control" />
                            <small style={formStyles.error}>{error}</small>
                            <br/>

                            <label style={formStyles.formLabel} htmlFor="icon" className="form-label">Icon # (any integer)</label>
                            {errors.icon && touched.icon ? (<div style={formStyles.error}>{errors.icon}</div>):null}
                            <Field style={formStyles.formField} name="icon" type="icon" className="form-control" />
                            <small style={formStyles.error}>{error}</small>
                            <br/>

                            <br/>
                            <Button style={formStyles.formButton} type="submit" className="btn btn-success">Register</Button>

                        </Form>
                    )
                }

            </Formik>
            </container>
        </div>
    );
    
}
export default Register;


