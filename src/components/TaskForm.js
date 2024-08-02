// src/components/TaskForm.js
import React, { useState } from 'react';
import axios from 'axios';
import { Button, Form, FormGroup, Label, Input, Col, Row } from 'reactstrap';

const TaskForm = ({ onTaskAdded }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [status, setStatus] = useState('To Do');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/tasks', { title, description, status });
      onTaskAdded(response.data);
      setTitle('');
      setDescription('');
      setStatus('To Do');
    } catch (error) {
      console.error(error);
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
