import { useState } from 'react'
import 'react-bootstrap'
import 'bootstrap/dist/css/bootstrap.min.css'
import './App.css'
import { Modal, Button } from 'react-bootstrap';
import Card from './componenets/Card'

function App() {
  // 6 dummy cards for testing
  const [dummyCards, setDummyCards] = useState([
    { question: 'card1', answer: 'answer1', id: 1 },
    { question: 'card2', answer: 'answer2', id: 2 },
    { question: 'card3', answer: 'answer3', id: 3 },
    { question: 'card4', answer: 'answer4', id: 4 },
    { question: 'card5', answer: 'answer5', id: 5 },
    { question: 'card6', answer: 'answer6', id: 6 }
  ]);
  const [slideLeftId, setSlideLeftId] = useState(null);
  const [slideRightId, setSlideRightId] = useState(null);
  const [show, setShow] = useState(false);
  const [buttonsLocked, setButtonsLocked] = useState(false);
  const [newQuestion, setNewQuestion] = useState('');
  const [newAnswer, setNewAnswer] = useState('');

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);



  const remembered = () => {
    if (dummyCards.length > 0) {
      setButtonsLocked(true)
      setSlideLeftId(dummyCards[dummyCards.length - 1].id);
      setTimeout(() => {
      setDummyCards(prev => prev.slice(0, -1));
      setSlideLeftId(null);
      setButtonsLocked(false);
      }, 500);
    }
  };

  const forgot = () => {
    if (dummyCards.length > 0) {
      setButtonsLocked(true);
      setSlideRightId(dummyCards[dummyCards.length - 1].id);
      setTimeout(() => {
      setDummyCards(prev => prev.slice(0, -1));
      setSlideRightId(null);
      setButtonsLocked(false);
      }, 500);
    }
  };

  const handleRemoveCard = (id) => {
    setDummyCards(prev => prev.filter(card => card.id !== id));
    if (slideLeftId === id) setSlideLeftId(prev => prev - 1);
    if (slideRightId === id) setSlideRightId(prev => prev - 1);
  };

  const saveNewCard = () => {
    const question = newQuestion;
    const answer = newAnswer;
    if (!question || !answer) {
      alert('Please fill in both fields');
      return;
    }
    setDummyCards(prev => [...prev, { question, answer, id: Date.now() }]);
    setNewQuestion('');
    handleClose();
  }
  return (
  <>
    <div className="container">
      <div className='w-100 d-flex justify-content-end flex- mb-2'>
        <div className="addCards" onClick={handleShow}> + </div>
      </div>
          <div className='cardContainer'> 
            {dummyCards.map((card, index) => (
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
          <div className='buttonContainer'>
            <button className='btn btn-primary mt-5 mx-3' onClick={remembered} disabled={buttonsLocked}>
              I remembered this 👍
            </button>
            <button className='btn btn-danger mt-5 mx-3' onClick={forgot} disabled={buttonsLocked}>
              I forgot this 👎
            </button>
          </div>
        </div>
        <Modal show={show} onHide={handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>Add a New Card</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <form>
              <div className="mb-3">
                <label htmlFor="question" className="form-label">Question on Card</label>
                <textarea className="form-control" id="question" value={newQuestion} onChange={(e) => setNewQuestion(e.target.value)}></textarea>
              </div>
              <div className="mb-3">
                <label htmlFor="answer" className="form-label">Answer to the question</label>
                <textarea className="form-control" id="answer" value={newAnswer} onChange={(e) => setNewAnswer(e.target.value)}></textarea>
              </div>
            </form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Close
            </Button>
            <Button variant="primary" onClick={() => saveNewCard()}>
              Save Changes
            </Button>
          </Modal.Footer>
      </Modal>
    </>
  )
}

export default App
