import React, { useState } from 'react';
import { Box, Button, TextField, Typography, Link, Paper } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || 'Login failed');
        return;
      }
      localStorage.setItem('token', data.token);
      localStorage.setItem('user_id', data.user.id);
      localStorage.setItem('user_name', data.user.name);
      localStorage.setItem('user_email', data.user.email);
      navigate('/');
    } catch (err) {
      setError('Network error. Please try again.');
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mt: 8 }}>
      <Paper elevation={3} sx={{ p: 4, minWidth: 350 }}>
        <Typography variant="h5" mb={2}>Login</Typography>
        <form onSubmit={handleLogin}>
          <TextField label="Email" type="email" fullWidth margin="normal" value={email} onChange={e => setEmail(e.target.value)} required />
          <TextField label="Password" type="password" fullWidth margin="normal" value={password} onChange={e => setPassword(e.target.value)} required />
          {error && <Typography color="error" variant="body2">{error}</Typography>}
          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>Login</Button>
        </form>
        <Typography variant="body2" align="center" mt={2}>
          Don't have an account?{' '}
          <Link href="#" onClick={() => navigate('/signup')}>Create an account</Link>
        </Typography>
      </Paper>
    </Box>
  );
};

export default Login;
