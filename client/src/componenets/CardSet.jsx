// Study it - Flashcard Application


import { useState, useEffect } from 'react'
import axios from 'axios';
import { Modal, Button } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import { IconButton, Box } from '@mui/material';
import { ArrowBack as ArrowBackIcon } from '@mui/icons-material';
import Card from './Card'

function CardSet() {
  const { setId } = useParams();
  const navigate = useNavigate();
  const [loadingCards, setLoadingCards] = useState(true);

  // Cards state
  const [cards, setCards] = useState([]);
  // Fetch cards from backend when setId changes
  useEffect(() => {
    const fetchCards = async () => {
      const token = localStorage.getItem('token');
      if (!token || !setId) return;
      try {        
        const response = await axios.get(`/api/card-sets/${setId}/cards`,  {
          params: {
            studying: 1
          },
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        // Map backend card fields to frontend
        setCards(response.data.map(card => ({
          id: card.id,
          question: card.front,
          answer: card.back
        })));
        setLoadingCards(false);
      } catch (err) {
        console.error('Failed to fetch cards:', err);
        setCards([]);
      }
    };
    fetchCards();
  }, [setId]);
  const [slideLeftId, setSlideLeftId] = useState(null);
  const [slideRightId, setSlideRightId] = useState(null);
  const [show, setShow] = useState(false);
  const [buttonsLocked, setButtonsLocked] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');


  const sendScore = async (remembered) => {
      const token = localStorage.getItem('token');
      const response = axios.put(`/api/score/${cards[cards.length - 1].id}`, {
        remembered: remembered
      }, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
  }
  const remembered = () => {
    if (cards.length > 0) {
      setButtonsLocked(true)
      setSlideLeftId(cards[cards.length - 1].id);
      sendScore(true);
      setTimeout(() => {
        setCards(prev => prev.slice(0, -1));
        setSlideLeftId(null);
        setButtonsLocked(false);
      }, 500);
    }
  };

  const forgot = () => {
    if (cards.length > 0) {
      setButtonsLocked(true);
      setSlideRightId(cards[cards.length - 1].id);
      sendScore(false);
      setTimeout(() => {
        setCards(prev => prev.slice(0, -1));
        setSlideRightId(null);
        setButtonsLocked(false);
      }, 500);
    }
  };

  const handleRemoveCard = (id) => {
    setCards(prev => prev.filter(card => card.id !== id));
    if (slideLeftId === id) setSlideLeftId(prev => prev - 1);
    if (slideRightId === id) setSlideRightId(prev => prev - 1);
  };


  return (
  <>
    <div className="container">

      {loadingCards ? (
        <div>Loading cards...</div>
      ) : cards.length === 0 ? (
        <div>No cards available for today in this set. Well Done!</div>
      ) : (
          <div className='cardContainer'> 
            {cards.map((card, index) => (
              <Card
                key={card.id}
                topMargin={index < 3 ? index * 6 : 18}
                question={card.question}
                answer={card.answer}
                shouldSlideLeft={card.id === slideLeftId}
                shouldSlideRight={card.id === slideRightId}
                onSlideLeftEnd={() => handleRemoveCard(card.id)}
                onSlideRightEnd={() => handleRemoveCard(card.id)}
              />
            ))}   
          </div>
          )}
          <div className='buttonContainer'>
            <button className='btn btn-primary mt-5 mx-3' onClick={remembered} disabled={buttonsLocked}>
              I remembered this 👍
            </button>
            <button className='btn btn-danger mt-5 mx-3' onClick={forgot} disabled={buttonsLocked}>
              I forgot this 👎
            </button>
          </div>
        </div>

      <Box sx={{ position: 'fixed', top: 16, left: 16 }}>
        <IconButton onClick={() => navigate('/')}>
          <ArrowBackIcon />
        </IconButton>
      </Box>
    </>  
  )
}

export default CardSet;