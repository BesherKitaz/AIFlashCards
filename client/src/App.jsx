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
            <Route path="/" element={ <Home /> } />
            <Route path="/study/:setId" element={<CardSet />} />
            <Route path="/edit-set/:setId" element={<EditSet />} />
            <Route path="/create-set" element={<CreateSet />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="*" element={<Typography align="center">404 Not Found</Typography>} />
          </Routes>
        </Container>
      </Router>
    </>
  )
}

export default App

