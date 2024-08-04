// src/App.js

import React, { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase";
import axios from "axios";
import SignUp from "./components/SignUp";
import Login from "./components/Login";
import TaskList from "./components/TaskList";
import TaskForm from "./components/TaskForm";
import { Container, Row, Col, Button } from "reactstrap";

const App = () => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error(error);
    }
  };

  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const token = await user.getIdToken();
          const response = await axios.get('http://localhost:5000/tasks', {
            headers: { Authorization: `Bearer ${token}` }
          });
          // Process the response data
          setTasks(response.data);
        }
        
      } catch (error) {
        console.error(error);
      }
    };
    fetchTasks();
  }, []);

  const handleTaskAdded = (task) => {
    setTasks([...tasks, task]);
  };

  const handleTaskUpdate = (id, status) => {
    setTasks(
      tasks.map((task) => (task.id === id ? { ...task, status } : task))
    );
  };

  const handleTaskDelete = (id) => {
    setTasks(tasks.filter((task) => task.id !== id));
  };

  return (
    <div>
      <Container>
        {user ? (
          <div>
            <h1>Welcome, {user.email}</h1>
            <Button color="primary"  onClick={handleSignOut}>Sign Out</Button>
            <Row>
              <Col>
              <TaskForm />
                <TaskList
                  tasks={tasks}
                  onTaskUpdate={handleTaskUpdate}
                  onTaskDelete={handleTaskDelete}
                />
              </Col>
            </Row>
          </div>
        ) : (
          <div>
            <SignUp />
            <Login />
          </div>
        )}
      </Container>
    </div>
  );
};

export default App;
