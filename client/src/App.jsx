import { useState } from 'react'
import 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'

import Card from './componenets/Card'
import CardSet from './componenets/CardSet';
import EditSet from './componenets/EditSet';
import CreateSet from './componenets/CreateSet';
import Login from './componenets/Login';
import Signup from './componenets/Signup';
import {BrowserRouter as Router, Route, Routes, useNavigate} from 'react-router-dom'
import { CssBaseline, Container, Typography, Button, Box } from "@mui/material";
import Home from './componenets/Home';
import RequireAuth from './componenets/RequireAuth';
import './App.css'



function LogoutButton() {
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };
  return (
    <Box sx={{ position: 'fixed', top: 16, right: 16, zIndex: 999 }}>
      <Button variant="contained" color="secondary" onClick={handleLogout}>Logout</Button>
    </Box>
  );
}

function App() {
  return (
    <>
      <CssBaseline />
      <Router>
        <LogoutButton />
        <Container>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            {/* Protected routes */}
            <Route path="/" element={
              <RequireAuth>
                <Home />
              </RequireAuth>
            } />
            <Route path="/study/:setId" element={
              <RequireAuth>
                <CardSet />
              </RequireAuth>
            } />
            <Route path="/edit-set/:setId" element={
              <RequireAuth>
                <EditSet />
              </RequireAuth>
            } />
            <Route path="/create-set" element={
              <RequireAuth>
                <CreateSet />
              </RequireAuth>
            } />
            <Route path="*" element={<Typography align="center">404 Not Found</Typography>} />
          </Routes>
        </Container>
      </Router>
    </>
  )
}

export default App

