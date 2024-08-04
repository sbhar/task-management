import React, { useState, useEffect } from 'react';
import { ref, onValue, remove, update, set } from 'firebase/database';
import { database } from '../firebase'; // Adjust the path as needed
import { Button, FormGroup, Label, Input, ListGroup, ListGroupItem } from 'reactstrap';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('To Do');
  const [editingTaskId, setEditingTaskId] = useState(null);

  useEffect(() => {
    const tasksRef = ref(database, 'tasks');
    const unsubscribe = onValue(tasksRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const tasksArray = Object.keys(data).map(key => ({ id: key, ...data[key] }));
        setTasks(tasksArray);
      } else {
        setTasks([]); // Ensure tasks is always an array
      }
    });
    return () => unsubscribe();
  }, []);

  const handleAddTask = () => {
    if (!title) {
      alert('Title is required');
      return;
    }
    const newTask = {
      title,
      description,
      status
    };
    const newTaskRef = ref(database, 'tasks/' + new Date().toISOString());
    set(newTaskRef, newTask)
      .then(() => {
        setTitle('');
        setDescription('');
        setStatus('To Do');
      })
      .catch((error) => {
        console.error('Error adding task:', error);
      });
  };

  const handleUpdateTask = (id) => {
    const updatedStatus = prompt('Enter new status:', 'To Do');
    if (updatedStatus) {
      update(ref(database, 'tasks/' + id), { status: updatedStatus })
        .catch((error) => {
          console.error('Error updating task:', error);
        });
    }
  };

  const handleDeleteTask = (id) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      remove(ref(database, 'tasks/' + id))
        .catch((error) => {
          console.error('Error deleting task:', error);
        });
    }
  };

  return (
    <div>
      <h2>Task List</h2>
      {/* <div className="mb-4">
        <FormGroup>
          <Label for="title">Title</Label>
          <Input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Task Title"
          />
        </FormGroup>
        <FormGroup>
          <Label for="description">Description</Label>
          <Input
            type="textarea"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Task Description"
          />
        </FormGroup>
        <FormGroup>
          <Label for="status">Status</Label>
          <Input
            type="select"
            id="status"
            value={status}
            onChange={(e) => setStatus(e.target.value)}
          >
            <option value="To Do">To Do</option>
            <option value="In Progress">In Progress</option>
            <option value="Done">Done</option>
          </Input>
        </FormGroup>
        <Button color="primary" onClick={handleAddTask}>Add Task</Button>
      </div> */}
      <ListGroup>
        {tasks.map(task => (
          <ListGroupItem key={task.id}>
            <h5>{task.title}</h5>
            <p>{task.description}</p>
            <p>Status: {task.status}</p>
            <Button color="warning" onClick={() => handleUpdateTask(task.id)}>Update Status</Button>
            <Button color="danger" onClick={() => handleDeleteTask(task.id)} className="ms-2">Delete</Button>
          </ListGroupItem>
        ))}
      </ListGroup>
    </div>
  );
};

export default TaskList;
