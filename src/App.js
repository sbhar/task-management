// src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TaskForm from './components/TaskForm';
import TaskList from './components/TaskList';
import { Container, Row, Col } from 'reactstrap';

const App = () => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState('All');

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get('http://localhost:5000/tasks');
        setTasks(response.data);
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
    setTasks(tasks.map(task => task.id === id ? { ...task, status } : task));
  };

  const handleTaskDelete = (id) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  return (
    <Container>
      <Row>
        <Col>
          <h1 className="my-4">Task Management</h1>
          <TaskForm onTaskAdded={handleTaskAdded} />
        </Col>
      </Row>
      <Row>
        <Col>
          <TaskList tasks={tasks} onTaskUpdate={handleTaskUpdate} onTaskDelete={handleTaskDelete} />
        </Col>
      </Row>
    </Container>
  );
};

export default App;
