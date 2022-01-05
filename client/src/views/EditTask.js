import React, { useState, useEffect, useRef } from 'react';
import * as Yup from 'yup';
import { Navigate } from 'react-router-dom';
import {Formik, Form, Field} from 'formik';
import {formStyles} from '../styles';
import { getTask } from '../api/task';
import { getUser } from '../api/user';
import Button from 'react-bootstrap/Button';
import axios from 'axios';


const FormSchema = Yup.object().shape({
    "name": Yup.string(40).required("Required"),
    "importance":Yup.number("Must be a number")
    .integer("Must be a whole number")
    .test('range', 'Must be between 0 and 11 (not equal to)', val => val>=1 && val<=10)
    .required("Required")
});


export default function EditTask(props) {
    const [error, setError] = useState('');
    const [redirect, setRedirect] = useState(false);
    const [userID, setUserID] = useState(parseInt(localStorage.getItem('currentUserID')));
    const [task, setTask] = useState({});
    const initialValues = useRef({
        name:'',
        description:'',
        steps:'',
        importance:null,
        time:'',
        isPublic:false
     });

    useEffect(()=>{
        if(initialValues.current.importance!=null){ return }
        getUser(userID, (response)=>{
            getTask(response.edit, (response)=>{
                initialValues.current["name"] = response.name
                if (response.description!==null) initialValues.current["description"] = response.description
                if (response.steps!==null) initialValues.current["steps"] = response.steps
                initialValues.current["importance"] = response.importance
                if (response.time!==null) initialValues.current["time"] = parseInt(response.time/60)
                initialValues.current["isPublic"] = response.isPublic
                setTask(response);
                });
        });
    }, [initialValues])

    




    const handleSubmit = ({name, description, steps, importance, time, isPublic}) => {
        axios.put(`http://127.0.0.1:5000/tasks/${task.id}?name=${name}&description=${description}&steps=${steps}&importance=${importance}&time=${time}&is_public=${isPublic}&user_id=${props.currentUserID}`)
        .then(response=>{
            if (response.data){
                console.log(response.data);
                setRedirect(true);
                props.getUserTasks();
            }
        })
        .catch(error=>{
            console.error("There was an error building the task: ", error);
        })
    }

    const styles={
        checkBox:{
            float:"left",
            marginTop:"3px"
        }
    }
    return (
        <div style={formStyles.pageStyle}>
        {redirect ? <Navigate to={{pathname:"/mytasks", props:{getUserTasks:props.getUserTasks}}}/> :''}

            <container style={formStyles.form}>
            <center><h1 style={formStyles.formHead}>Edit Task</h1></center>
            {task?
            <Formik initialValues={initialValues.current}
                validationSchema={FormSchema}
                onSubmit={
                    (values)=>{
                        handleSubmit(values);
                    }
                }>
                {
                    ({errors, touched})=>(
                        <Form>
                            <label style={formStyles.formLabel} htmlFor="name" className="form-label">Task Name</label>
                            {errors.name && touched.name ? (<div style={formStyles.error}>{errors.name}</div>):null}
                            <Field name="name" type="name" className="form-control" placeholder=""/>
                            <small style={formStyles.error}>{error}</small>
                            <br/>

                            <label style={formStyles.formLabel} htmlFor="description" className="form-label">Description</label>
                            {errors.description && touched.description ? (<div style={formStyles.error}>{errors.description}</div>):null}
                            <Field name="description" component="textarea" rows="3" className="form-control" placeholder=""/>
                            {/* <small style={formStyles.error}>{error}</small> */}
                            <br/>

                            <label style={formStyles.formLabel} htmlFor="steps" className="form-label">steps</label>
                            {errors.steps && touched.steps ? (<div style={formStyles.error}>{errors.steps}</div>):null}
                            <Field name="steps" component="textarea" rows="2" className="form-control" placeholder=""/>
                            <br/>

                            <label style={formStyles.formLabel} htmlFor="importance" className="form-label">Importance (1-10)</label>
                            {errors.importance && touched.importance ? (<div style={formStyles.error}>{errors.importance}</div>):null}
                            <Field name="importance" type="number" className="form-control" placeholder=""/>
                            <small style={formStyles.error}>{error}</small>
                            <br/>

                            <label style={formStyles.formLabel} htmlFor="time" className="form-label">Duration eg. 3h15m or 35 (minutes by default)</label>
                            {errors.time && touched.time ? (<div style={formStyles.error}>{errors.time}</div>):null}
                            <Field name="time" type="" className="form-control" placeholder=""/>
                            {/* <small style={formStyles.error}>{error}</small> */}
                            <br/>

                            <Field style={styles.checkBox} name="isPublic" type="checkbox" className="" placeholder=""/>
                            <label style={formStyles.formLabel} htmlFor="isPublic" className="">&nbsp;Make Task Public</label>
                            <br/>
                            
                            <br/>
                            <Button style={formStyles.formButton} type="submit" className="btn btn-info">Submit Edit</Button>
                            

                        </Form>
                    )
                }

            </Formik>
            :''}

            </container>
        </div>
    )
}
