import React, { useState } from 'react';
import { createUserWithEmailAndPassword, auth } from '../firebase';
import { Container, Form, FormGroup, Label, Input, Button, Alert } from 'reactstrap';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSignUp = async () => {
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      alert('User created successfully');
    } catch (error) {
      console.error(error);
      setError(error.message);
    }
  };

  return (
    <Container className="my-5">
      <h2 className="mb-4">Sign Up</h2>
      {error && <Alert color="danger">{error}</Alert>}
      <Form>
        <FormGroup>
          <Label for="email">Email</Label>
          <Input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            required
          />
        </FormGroup>
        <FormGroup>
          <Label for="password">Password</Label>
          <Input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            required
          />
        </FormGroup>
        <Button color="primary" onClick={handleSignUp}>Sign Up</Button>
      </Form>
    </Container>
  );
};

export default SignUp;
