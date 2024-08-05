import React, { useState, useEffect } from 'react';
import { ref, onValue, remove, update } from 'firebase/database';
import { getAuth } from 'firebase/auth';
import { getDatabase } from 'firebase/database';
import { Button, ListGroup, ListGroupItem } from 'reactstrap';

const TaskList = () => {
  const [tasks, setTasks] = useState([]);
  const [editingTaskId, setEditingTaskId] = useState(null);
  const [newStatus, setNewStatus] = useState('');

  const auth = getAuth();
  const database = getDatabase();

  useEffect(() => {
    const user = auth.currentUser;
    if (user) {
      const userId = user.uid;
      const tasksRef = ref(database, 'tasks');
      const unsubscribe = onValue(tasksRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
          const userTasks = Object.keys(data)
            .filter(key => data[key].userUID === userId)
            .map(key => ({ id: key, ...data[key] }));
          setTasks(userTasks);
        } else {
          setTasks([]);
        }
      });
      return () => unsubscribe();
    }
  }, [auth.currentUser]);

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
