import React, { useState, useContext } from 'react';
import * as Yup from 'yup';
import {Formik, Form, Field} from 'formik';
import {formStyles} from '../styles';
import Button from 'react-bootstrap/Button';
import {TaskContext} from '../App';
import axios from 'axios';


const FormSchema = Yup.object().shape({
    "name": Yup.string(40).required("Required"),
    "importance":Yup.number("Must be a number")
    .integer("Must be a whole number")
    .test('range', 'Must be between 0 and 11 (not equal to)', val => val>=1 && val<=10)
    .required("Required"),
    "duration":Yup.number("Must be a number")
    .integer("Must be a whole number").nullable(true)
});

const initialValues = {
    name:'',
    description:'',
    steps:'',
    importance:null,
    time:'',
    isPublic:false
 };

export default function TaskBuilder(props) {
    const [error, setError] = useState('');
    const tasks = useContext(TaskContext);




    const handleSubmit = ({name, description, steps, importance, time, isPublic}) => {
        // console.log(name, description, steps, importance, time, isPublic);
        axios.post(`http://127.0.0.1:5000/tasks?name=${name}&description=${description}&steps=${steps}&importance=${importance}&time=${time}&is_public=${isPublic}&user_id=${props.currentUserID}`)
        .then(response=>{
            if (response.data){
                console.log(response.data);
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
            <container style={formStyles.form}>
            <center><h1 style={formStyles.formHead}>Build a Task</h1></center>
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

                            <label style={formStyles.formLabel} htmlFor="time" className="form-label">Duration in minutes</label>
                            {errors.time && touched.time ? (<div style={formStyles.error}>{errors.time}</div>):null}
                            <Field name="time" type="number" className="form-control" placeholder=""/>
                            {/* <small style={formStyles.error}>{error}</small> */}
                            <br/>

                            <Field style={styles.checkBox} name="isPublic" type="checkbox" className="" placeholder=""/>
                            <label style={formStyles.formLabel} htmlFor="isPublic" className="">&nbsp;Make Task Public</label>
                            <br/>
                            
                            <br/>
                            <Button style={formStyles.formButton} type="submit" className="btn btn-info">Build</Button>
                            

                        </Form>
                    )
                }

            </Formik>
            </container>
        </div>
    )
}
