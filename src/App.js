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
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("All");

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          const token = await user.getIdToken();
          const response = await axios.get('https://task-manager.b4a.app/tasks', {
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
  }, [user]);

  const handleSignOut = async () => {
    try {
      await signOut(auth);
    } catch (error) {
      console.error(error);
    }
  };

  const handleTaskAdded = async (task) => {
    try {
      const user = auth.currentUser;
      if (user) {
        const token = await user.getIdToken();
        const response = await axios.post('https://task-manager.b4a.app/tasks', {
          ...task,
          userId: user.uid // Add the user ID to the task data
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTasks([...tasks, response.data]);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleTaskUpdate = async (id, status) => {
    try {
      const user = auth.currentUser;
      if (user) {
        const token = await user.getIdToken();
        await axios.put(`https://task-manager.b4a.app/tasks/${id}`, { status }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTasks(
          tasks.map((task) => (task.id === id ? { ...task, status } : task))
        );
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleTaskDelete = async (id) => {
    try {
      const user = auth.currentUser;
      if (user) {
        const token = await user.getIdToken();
        await axios.delete(`https://task-manager.b4a.app/tasks/${id}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setTasks(tasks.filter((task) => task.id !== id));
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <Container>
        {user ? (
          <div>
            <h1>Welcome, {user.email}</h1>
            <Button color="primary" onClick={handleSignOut} className="mb-4">Sign Out</Button>
            <Row>
              <Col>
                <TaskForm onTaskAdded={handleTaskAdded} />
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
