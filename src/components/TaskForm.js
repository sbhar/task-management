import React, { useState } from 'react';
import { Button, Form, FormGroup, Label, Input, Col, Row } from 'reactstrap';
import { getAuth } from 'firebase/auth';
import { getDatabase, ref, push, set } from 'firebase/database';
import { auth, database } from '../firebase'; // Adjust the import path as needed

const TaskForm = ({ onTaskAdded }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('To Do');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const user = getAuth().currentUser;
      if (user) {
        const token = await user.getIdToken();
        const db = getDatabase();
        const tasksRef = ref(db, 'tasks');
        const newTaskRef = push(tasksRef);
        await set(newTaskRef, { title, description, status });

        onTaskAdded({ id: newTaskRef.key, title, description, status });
        setTitle('');
        setDescription('');
        setStatus('To Do');
      } else {
        console.error('No user is signed in.');
      }
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  return (
    <Form onSubmit={handleSubmit} className="mb-4">
      <Row form>
        <Col md={6}>
          <FormGroup>
            <Label for="title">Title</Label>
            <Input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Task Title"
              required
            />
          </FormGroup>
        </Col>
        <Col md={6}>
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
        </Col>
      </Row>
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
      <Button color="primary" type="submit">Add Task</Button>
    </Form>
  );
};

export default TaskForm;
