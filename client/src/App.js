import React, { useState, useEffect, useContext } from 'react';
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

const App=()=>{
  const [user, setUser] = useState({});
  const [currentUserID, setCurrentUserID] = useState(0);
  const [token, setToken] = useState('');
  const [isAdmin, setIsAdmin] = useState(false);
  const [userTasks, setUserTasks] = useState(()=>[]);
  const [totalPoints, setTotalPoints] = useState(()=>0);
  const [isFirstRender, setIsFirstRender] = useState(()=>true);
  const [started, setStarted] = useState(()=>false);

  useEffect(()=>getIsStarted(currentUserID, (responseBool)=>setStarted(responseBool)), []);

  useUpdateEffect(()=>{
    setCurrentUserID(parseInt(localStorage.getItem('currentUserID')));
  }, [currentUserID])

  useEffect(()=>{
    setToken(localStorage.getItem('token'));
    setCurrentUserID(parseInt(localStorage.getItem('currentUserID')));
    setTotalPoints(parseInt(localStorage.getItem('totalPoints')));
    setUserTasks(JSON.parse(localStorage.getItem('tasks')));
  }, []);

  const getUserTasks=()=>{
    setTotalPoints(parseInt(localStorage.getItem('totalPoints')));
    let id = localStorage.getItem('currentUserID');
    if (id) {
      axios.get(`http://127.0.0.1:5000/user/${id}/tasks`)
      .then(response=>{
        setUserTasks(response.data.tasks);
        localStorage.setItem('tasks', JSON.stringify(response.data.tasks));
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
