import React, {useState, useEffect, useContext} from 'react';
import { Navigate } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import { getIsStarted } from '../api/started';
import { deleteTask } from '../api/task';
import { useUpdateEffect } from '../customHooks/useUpdateEffect';
import { setActive, setBonusActive } from '../api/active';
import { setUserEdit } from '../api/user';
import {TaskContext} from '../App';
import { taskPageStyles, homeStyles } from '../styles';

const MyTasks = (props) => {
    const [redirect, setRedirect] = useState(()=>false);
    const [editID, setEditID] = useState(()=>0);
    const tasks = useContext(TaskContext);
    const [userID, setUserID] = useState(()=>parseInt(localStorage.getItem('currentUserID')));

    useEffect(()=>getIsStarted(userID, (responseBool)=>props.setStarted(responseBool)), []);
    
    useUpdateEffect(()=>{
        setUserID(parseInt(localStorage.getItem('currentUserID')));
    }, [userID])

    const handleUse=(id)=>setActive(id, true, ()=>{props.getUserTasks()});
    const handleRemove=(id)=>setActive(id, false, ()=>{props.getUserTasks()});

    const handleAddBonusTask=(id)=>setBonusActive(id, true, ()=>{props.getUserTasks()});
    const handleRemoveBonusTask=(id)=>setBonusActive(id, false, ()=>{props.getUserTasks()});
    
    const handleEdit=(taskID)=>{
        setUserEdit(userID, taskID, ()=>setRedirect(true));
    }

    const handleDelete=(taskID)=>deleteTask(taskID, ()=>props.getUserTasks());
    

    return (
        <>
        <div style={taskPageStyles.pageStyle}>
        {redirect ? <Navigate to={{pathname:"/edittask", props:{getUserTasks:props.getUserTasks}}}/> :''}

            {tasks.length>0 ? 
            <>
            <a style={taskPageStyles.link} href={"/"}>Back to Homepage</a><br/>
            <ul>
                {tasks.map(task=>(
                    <li key={task.id} style={{...taskPageStyles.listItem, "backgroundColor":task.color}}>
                        
                        
                        <div style={taskPageStyles.name}>
                            <h5>{task.name}</h5>
                            <b>{parseInt(task.time/60)} min</b><br/>
                        </div>
                        <h4 style={taskPageStyles.importance}><b>{task.importance}</b></h4>

                        <p style={taskPageStyles.description}>{task.description}</p>
                        <p style={taskPageStyles.steps}>{task.steps}</p>
                        
                        <br/><br/><br/><br/>
                        
                        {props.started==true ?
                        <>
                            {task.is_active ?
                            <>
                                {task.is_bonus ?
                                <Button style={taskPageStyles.removeBonusButton} variant="danger" onClick={()=>handleRemoveBonusTask(task.id)}>Remove Bonus Task</Button>
                                :
                                <Button style={{borderWidth:"1px", borderColor:"black"}} variant="secondary" type="disabled">In Use</Button>
                                }
                            </>
                            :
                            <Button style={taskPageStyles.useBonusButton} variant="success" onClick={()=>handleAddBonusTask(task.id)}>Add Bonus Task</Button>
                            }
                        </>
                        :
                        <>                        
                            {task.is_active ?
                            <Button style={taskPageStyles.removeButton} variant="danger" onClick={()=>handleRemove(task.id)}>Remove</Button>
                            :
                            <Button style={taskPageStyles.useButton} variant="success" onClick={()=>handleUse(task.id)}>Use Task</Button>
                            }
                        </>
                        }   
                        <Button style={taskPageStyles.editButton} variant="warning" onClick={()=>handleEdit(task.id)}>Edit</Button>
                        <Button style={taskPageStyles.deleteButton} variant="danger" onClick={()=>handleDelete(task.id)}>Delete</Button>

                        <br/>
                        
                    </li>
                ))}
            </ul>
            </>
            :
            <p >
                It looks like you have no tasks. You can create some with the
                &nbsp;<a style={homeStyles.link} href={"/taskbuilder"}>Task Builder</a>.
            </p>
            
            }
        </div>
        </>
    );
}

export default MyTasks;
