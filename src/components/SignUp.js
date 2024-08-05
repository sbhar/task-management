import React, { useState } from 'react';
import { createUserWithEmailAndPassword, auth } from '../firebase';
import { Container, Form, FormGroup, Label, Input, Button, Alert } from 'reactstrap';
import { getDatabase, ref, set } from 'firebase/database';
import { getAuth } from 'firebase/auth';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const auth = getAuth();
  const database = getDatabase();
  const [nickname, setNickname] = useState('');

  const handleSignUp = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Save user data in the database
      const userRef = ref(database, 'users/' + user.uid);
      await set(userRef, {
        email,
        nickname
      });
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
