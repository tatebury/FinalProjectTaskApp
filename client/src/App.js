import React, { useState, useEffect, useContext, useRef } from 'react';
// import AdminRoute from './components/AdminRoute';
// import {titleCase, parseBool} from './helpers';
import {Routes, Route} from 'react-router-dom';
import Home from './views/Home';
import MyTasks from './views/MyTasks';
import TaskBuilder from './views/TaskBuilder';
import EditTask from './views/EditTask';
import Info from './views/Info';
import ProtectedRoute from './components/ProtectedRoute';
import NavBar from './components/NavBar';
import Login from './views/Login';
import Register from './views/Register';
import Logout from './views/Logout';
import 'bootstrap/dist/css/bootstrap.min.css';
import { useUpdateEffect } from './customHooks/useUpdateEffect';
import { getIsStarted } from './api/started';
import { getUser } from './api/user';
import axios from 'axios';

export const TaskContext = React.createContext()
// export const EditTaskContext = React.createContext()

const App=()=>{
  const [user, setUser] = useState({});
  const [currentUserID, setCurrentUserID] = useState(0);
  const [token, setToken] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [userTasks, setUserTasks] = useState(()=>[]);
  const [totalPoints, setTotalPoints] = useState(()=>0);
  const [isFirstRender, setIsFirstRender] = useState(()=>true);
  const [started, setStarted] = useState(()=>false);
  const fromEdit = useRef(false);


  useEffect(()=>getIsStarted(currentUserID, (responseBool)=>setStarted(responseBool)), []);

  useUpdateEffect(()=>{
    setCurrentUserID(parseInt(localStorage.getItem('currentUserID')));
    // getUser(parseInt(localStorage.getItem('currentUserID')), (response)=>{
    //   setUser(response);
    // })
  }, [currentUserID])

  useEffect(()=>{
    setToken(localStorage.getItem('token'));
    setCurrentUserID(parseInt(localStorage.getItem('currentUserID')));
    setTotalPoints(parseInt(localStorage.getItem('totalPoints')));
    setUserTasks(JSON.parse(localStorage.getItem('tasks')));
  }, []);

  const getUserTasks=(after=()=>{})=>{
    setTotalPoints(parseInt(localStorage.getItem('totalPoints')));
    let id = localStorage.getItem('currentUserID');
    if (id) {
      axios.get(`https://idimtaskapp.herokuapp.com/user/${id}/tasks`)
      .then(response=>{
        // console.log(response.data);
        setUserTasks(response.data.tasks);
        localStorage.setItem('tasks', JSON.stringify(response.data.tasks));
        after(response.data.tasks);
      })

    }
    else{
      console.error("There is no id in local storage.");
    }
  }
  useUpdateEffect(()=>getUserTasks(), [currentUserID])


  return (
    <>
      <NavBar token={token} totalPoints={totalPoints}/>
      {/* {"my token: "+token}<br/> */}
      {/* {"user: "+user}<br/> */}
      {/* {"currentUserID: "+currentUserID}<br/> */}

      <TaskContext.Provider value={userTasks}>
      <Routes>
        <Route path = '/' element={
          <ProtectedRoute token={token}>
            <Home

            isAdmin={isAdmin}
            getUserTasks={getUserTasks}
            currentUserID={currentUserID}
            started={started}
            setStarted={setStarted}
            />
          </ProtectedRoute>
        }/>

        <Route path = '/mytasks' element={
          <ProtectedRoute token={token}>
            <MyTasks
            isAdmin={isAdmin}
            getUserTasks={getUserTasks}
            currentUserID={currentUserID}
            started={started}
            setStarted={setStarted}
            fromEdit={fromEdit}
            />
          </ProtectedRoute>
        }/>

        <Route path = '/taskbuilder' element={
          <ProtectedRoute token={token}>
            <TaskBuilder

            isAdmin={isAdmin}
            getUserTasks={getUserTasks}
            currentUserID={currentUserID}
            />
            </ProtectedRoute>
          }/>

        <Route path = '/edittask' element={
          <ProtectedRoute token={token}>
              <EditTask

              isAdmin={isAdmin}
              getUserTasks={getUserTasks}
              currentUserID={currentUserID}
              user={user}
              />
              
              </ProtectedRoute>
            }/>

        <Route path = '/info' element={
          <ProtectedRoute token={token}>
            <Info

            isAdmin={isAdmin}
            getUserTasks={getUserTasks}
            currentUserID={currentUserID}
            />
          </ProtectedRoute>
        }/>

        <Route path = '/logout' element={
          <ProtectedRoute token={token}>
            <Logout
            setToken={setToken}
            />
          </ProtectedRoute>
        }/>

        <Route path = '/login' element={
          <Login
          setToken={setToken}
          setTotalPoints={setTotalPoints}
          token={token}
          setCurrentUserID={setCurrentUserID}
          />
        }/>

        <Route path = '/register' element={
          <Register
          />
        }/>
      </Routes>
      </TaskContext.Provider>
    </>
  );
}

export default App;
