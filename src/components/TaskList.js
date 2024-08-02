// src/components/TaskList.js
import React from 'react';
import axios from 'axios';
import { Button, ListGroup, ListGroupItem, Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

const TaskList = ({ tasks, onTaskUpdate, onTaskDelete }) => {
  const [dropdownOpen, setDropdownOpen] = React.useState(false);
  const [filter, setFilter] = React.useState('All');

  const toggleDropdown = () => setDropdownOpen(prevState => !prevState);

  const handleStatusChange = async (id, status) => {
    try {
      await axios.put(`http://localhost:5000/tasks/${id}`, { status });
      onTaskUpdate(id, status);
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/tasks/${id}`);
      onTaskDelete(id);
    } catch (error) {
      console.error(error);
    }
  };

  const filteredTasks = filter === 'All' ? tasks : tasks.filter(task => task.status === filter);

  return (
    <div>
      <Dropdown isOpen={dropdownOpen} toggle={toggleDropdown} className="mb-4">
        <DropdownToggle caret>
          {filter || 'Filter'}
        </DropdownToggle>
        <DropdownMenu>
          <DropdownItem onClick={() => setFilter('All')}>All</DropdownItem>
          <DropdownItem onClick={() => setFilter('To Do')}>To Do</DropdownItem>
          <DropdownItem onClick={() => setFilter('In Progress')}>In Progress</DropdownItem>
          <DropdownItem onClick={() => setFilter('Done')}>Done</DropdownItem>
        </DropdownMenu>
      </Dropdown>
      <ListGroup>
        {filteredTasks.map(task => (
          <ListGroupItem key={task.id} className="d-flex justify-content-between align-items-center">
            <div>
              <h5>{task.title}</h5>
              <p>{task.description}</p>
            </div>
            <div>
              <Button
                color="warning"
                onClick={() => handleStatusChange(task.id, task.status === 'To Do' ? 'In Progress' : task.status === 'In Progress' ? 'Done' : 'To Do')}
              >
                {task.status}
              </Button>
              <Button color="danger" onClick={() => handleDelete(task.id)} className="ms-2">
                Delete
              </Button>
            </div>
          </ListGroupItem>
        ))}
      </ListGroup>
    </div>
  );
};

export default TaskList;
