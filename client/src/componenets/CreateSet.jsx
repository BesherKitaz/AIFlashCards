import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
    Container,
    Typography,
    Button,
    Card,
    CardContent,
    CardActions,
    Box,
    TextField,
    IconButton,
    Snackbar,
    Alert,
    Grid,
    Stepper,
    Step,
    StepLabel,
    Paper
} from "@mui/material";
import {
    ArrowBack as ArrowBackIcon,
    Save as SaveIcon,
    Delete as DeleteIcon,
    Edit as EditIcon,
    Add as AddIcon
} from "@mui/icons-material";
import AddCardsDialog from './AddCardsDialog';

const CreateSet = () => {
    const navigate = useNavigate();
    
    const [setInfo, setSetInfo] = useState({
        name: '',
        description: ''
    });
    const [cards, setCards] = useState([]);
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [editingCard, setEditingCard] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [activeStep, setActiveStep] = useState(0);

    const steps = ['Set Information', 'Add Cards', 'Review & Save'];

    const handleSetInfoChange = (field, value) => {
        setSetInfo({ ...setInfo, [field]: value });
    };

    const handleCardsAdded = (newCards, message, severity) => {
        if (newCards.length > 0) {
            setCards([...cards, ...newCards]);
            if (activeStep === 0) setActiveStep(1); // Move to step 2 if on step 1
        }
        showSnackbar(message, severity);
    };

    const handleEditCard = (card) => {
        setEditingCard({ ...card });
    };

    const handleSaveCard = () => {
        setCards(cards.map(card => 
            card.id === editingCard.id ? editingCard : card
        ));
        setEditingCard(null);
        showSnackbar('Card updated successfully!', 'success');
    };

    const handleDeleteCard = (cardId) => {
        setCards(cards.filter(card => card.id !== cardId));
        showSnackbar('Card deleted successfully!', 'success');
    };

    const handleCreateSet = async () => {
        if (!setInfo.name.trim()) {
            showSnackbar('Please enter a set name', 'error');
            return;
        }

        if (cards.length === 0) {
            showSnackbar('Please add at least one card', 'error');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            // API call to create set
            const setResponse = await axios.post(`http://localhost:5000/api/card-sets/`, {
                name: setInfo.name,
                description: setInfo.description
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            const setId = setResponse.data.id;

            // API call to add cards
            await axios.post(`http://localhost:5000/api/card-sets/${setId}/cards`, {
                cards: cards.map(card => ({ front: card.front, back: card.back }))
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });

            showSnackbar('Set created successfully!', 'success');
            setTimeout(() => navigate('/'), 1500);
        } catch (error) {
            console.error('Error creating set:', error);
            showSnackbar('Failed to create set. Please try again.', 'error');
        }
    };

    const showSnackbar = (message, severity) => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const canProceedToStep = (step) => {
        switch (step) {
            case 1: return setInfo.name.trim() !== '';
            case 2: return cards.length > 0;
            default: return true;
        }
    };

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                <IconButton onClick={() => navigate('/')} sx={{ mr: 2 }}>
                    <ArrowBackIcon />
                </IconButton>
                <Typography variant="h4" component="h1">
                    Create New Flashcard Set
                </Typography>
            </Box>

            {/* Stepper */}
            <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
                {steps.map((label) => (
                    <Step key={label}>
                        <StepLabel>{label}</StepLabel>
                    </Step>
                ))}
            </Stepper>

            {/* Step Content */}
            {activeStep === 0 && (
                <Paper sx={{ p: 4, mb: 4 }}>
                    <Typography variant="h5" gutterBottom>
                        Set Information
                    </Typography>
                    <TextField
                        label="Set Name"
                        fullWidth
                        required
                        value={setInfo.name}
                        onChange={(e) => handleSetInfoChange('name', e.target.value)}
                        sx={{ mb: 3 }}
                        placeholder="e.g., Spanish Vocabulary, Math Formulas"
                    />
                    <TextField
                        label="Description"
                        fullWidth
                        multiline
                        rows={3}
                        value={setInfo.description}
                        onChange={(e) => handleSetInfoChange('description', e.target.value)}
                        placeholder="Brief description of what this set covers..."
                    />
                    <Box sx={{ mt: 3 }}>
                        <Button
                            variant="contained"
                            onClick={() => setActiveStep(1)}
                            disabled={!canProceedToStep(1)}
                        >
                            Next: Add Cards
                        </Button>
                    </Box>
                </Paper>
            )}

            {activeStep === 1 && (
                <Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                        <Typography variant="h5">
                            Add Cards to "{setInfo.name}"
                        </Typography>
                        <Button
                            variant="contained"
                            startIcon={<AddIcon />}
                            onClick={() => setAddDialogOpen(true)}
                        >
                            Add Cards
                        </Button>
                    </Box>

                    {cards.length === 0 ? (
                        <Paper sx={{ p: 4, textAlign: 'center' }}>
                            <Typography variant="h6" color="text.secondary" gutterBottom>
                                No cards yet
                            </Typography>
                            <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                                Add your first flashcard using the button above
                            </Typography>
                            <Button
                                variant="outlined"
                                startIcon={<AddIcon />}
                                onClick={() => setAddDialogOpen(true)}
                            >
                                Add Your First Card
                            </Button>
                        </Paper>
                    ) : (
                        <>
                            <Grid container spacing={3} sx={{ mb: 4 }}>
                                {cards.map((card) => (
                                    <Grid item xs={12} sm={6} md={4} key={card.id}>
                                        <Card>
                                            <CardContent>
                                                <Typography variant="h6" gutterBottom>
                                                    {card.front}
                                                </Typography>
                                                <Typography variant="body2" color="text.secondary">
                                                    {card.back}
                                                </Typography>
                                            </CardContent>
                                            <CardActions>
                                                <Button
                                                    size="small"
                                                    startIcon={<EditIcon />}
                                                    onClick={() => handleEditCard(card)}
                                                >
                                                    Edit
                                                </Button>
                                                <Button
                                                    size="small"
                                                    color="error"
                                                    startIcon={<DeleteIcon />}
                                                    onClick={() => handleDeleteCard(card.id)}
                                                >
                                                    Delete
                                                </Button>
                                            </CardActions>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                            
                            <Box sx={{ display: 'flex', gap: 2 }}>
                                <Button onClick={() => setActiveStep(0)}>
                                    Back
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={() => setActiveStep(2)}
                                    disabled={!canProceedToStep(2)}
                                >
                                    Next: Review
                                </Button>
                            </Box>
                        </>
                    )}
                </Box>
            )}

            {activeStep === 2 && (
                <Paper sx={{ p: 4 }}>
                    <Typography variant="h5" gutterBottom>
                        Review Your Set
                    </Typography>
                    
                    <Box sx={{ mb: 3 }}>
                        <Typography variant="h6">Set Name:</Typography>
                        <Typography variant="body1" sx={{ mb: 2 }}>{setInfo.name}</Typography>
                        
                        <Typography variant="h6">Description:</Typography>
                        <Typography variant="body1" sx={{ mb: 2 }}>
                            {setInfo.description || 'No description'}
                        </Typography>
                        
                        <Typography variant="h6">Number of Cards:</Typography>
                        <Typography variant="body1" sx={{ mb: 3 }}>{cards.length}</Typography>
                    </Box>

                    <Box sx={{ display: 'flex', gap: 2 }}>
                        <Button onClick={() => setActiveStep(1)}>
                            Back to Edit
                        </Button>
                        <Button
                            variant="contained"
                            startIcon={<SaveIcon />}
                            onClick={handleCreateSet}
                            color="success"
                        >
                            Create Set
                        </Button>
                    </Box>
                </Paper>
            )}

            {/* Reusable Add Cards Dialog */}
            <AddCardsDialog
                open={addDialogOpen}
                onClose={() => setAddDialogOpen(false)}
                onCardsAdded={handleCardsAdded}
                title="Add Cards to Set"
            />

            {/* Edit Card Dialog */}
            {editingCard && (
                <AddCardsDialog
                    open={!!editingCard}
                    onClose={() => setEditingCard(null)}
                    onCardsAdded={(cards) => {
                        if (cards.length > 0) {
                            handleSaveCard();
                        }
                    }}
                    title="Edit Card"
                    initialCard={editingCard}
                />
            )}

            {/* Snackbar for notifications */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={4000}
                onClose={handleCloseSnackbar}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert
                    onClose={handleCloseSnackbar}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default CreateSet;
