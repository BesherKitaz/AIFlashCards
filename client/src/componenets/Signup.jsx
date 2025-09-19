import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Link, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSignup = async (e) => {
    e.preventDefault();
    // TODO: Implement signup logic with Axios and JWT
    // On success: store token, navigate to home
    // On failure: setError
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4, minWidth: 350 }}>
        <Typography variant="h5" mb={2}>Sign Up</Typography>
        <form onSubmit={handleSignup}>
          <TextField label="Name" fullWidth margin="normal" value={name} onChange={e => setName(e.target.value)} required />
          <TextField label="Email" type="email" fullWidth margin="normal" value={email} onChange={e => setEmail(e.target.value)} required />
          <TextField label="Password" type="password" fullWidth margin="normal" value={password} onChange={e => setPassword(e.target.value)} required />
          {error && <Typography color="error" variant="body2">{error}</Typography>}
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>Sign Up</Button>
        </form>
        <Typography variant="body2" align="center" mt={2}>
          Already have an account?{' '}
          <Link href="#" onClick={() => navigate('/login')}>Login</Link>
        </Typography>
      </Paper>
    </Box>
  );
};

export default Signup;
