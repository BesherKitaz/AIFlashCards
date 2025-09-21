import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Fab,
    Snackbar,
    Alert,
    Grid
} from "@mui/material";
import {
    Delete as DeleteIcon,
    Edit as EditIcon,
    Add as AddIcon,
    ArrowBack as ArrowBackIcon,
    Save as SaveIcon
} from "@mui/icons-material";
import AddCardsDialog from './AddCardsDialog';

const EditSet = () => {
    const { setId } = useParams();
    const navigate = useNavigate();
    
    const [cardSet, setCardSet] = useState(null);
    const [cards, setCards] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingCard, setEditingCard] = useState(null);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [deleteSetDialogOpen, setDeleteSetDialogOpen] = useState(false);
    const [addDialogOpen, setAddDialogOpen] = useState(false);
    const [cardToDelete, setCardToDelete] = useState(null);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        fetchCardSetAndCards();
    }, [setId]);

    const fetchCardSetAndCards = async () => {
        try {
            setLoading(true);
            // Fetch card set info and cards from API
            const token = localStorage.getItem('token');
            const setResponse = await axios.get(`/api/card-sets/${setId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            const cardsResponse = await axios.get(`/api/card-sets/${setId}/cards`, {
                params: {
                    studying: 0
                },
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            setCardSet(setResponse.data);
            setCards(cardsResponse.data);
        } catch (error) {
            console.error('Error fetching data:', error);
            showSnackbar('Failed to load card set data. Please check if the server is running.', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleEditCard = (card) => {
        setEditingCard({ ...card });
    };

    const handleSaveCard = async () => {
        try {
            // API call to update card
            const token = localStorage.getItem('token');
            await axios.put(`/api/cards/${editingCard.id}`, {
                front: editingCard.front,
                back: editingCard.back,
            }, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            // Update local state
            setCards(cards.map(card => 
                card.id === editingCard.id ? editingCard : card
            ));
            setEditingCard(null);
            showSnackbar('Card updated successfully!', 'success');
        } catch (error) {
            console.error('Error updating card:', error);
            showSnackbar('Failed to update card', 'error');
        }
    };

    const handleDeleteCard = async (cardId) => {
        try {
            // API call to delete card
            const token = localStorage.getItem('token');
            await axios.delete(`/api/cards/${cardId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            // Update local state
            setCards(cards.filter(card => card.id !== cardId));
            setDeleteDialogOpen(false);
            setCardToDelete(null);
            showSnackbar('Card deleted successfully!', 'success');
        } catch (error) {
            console.error('Error deleting card:', error);
            showSnackbar('Failed to delete card', 'error');
        }
    };

    const handleDeleteSet = async () => {
        try {
            // API call to delete set
            const token = localStorage.getItem('token');
            await axios.delete(`/api/card-sets/${setId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            setDeleteSetDialogOpen(false);
            showSnackbar('Set deleted successfully!', 'success');
            setTimeout(() => navigate('/'), 1500);
        } catch (error) {
            console.error('Error deleting set:', error);
            showSnackbar('Failed to delete set', 'error');
        }
    };

    const showSnackbar = (message, severity) => {
        setSnackbar({ open: true, message, severity });
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const handleCardsAdded = (newCards, message, severity) => {
        if (newCards.length > 0) {
            setCards([...cards, ...newCards]);
        }
        showSnackbar(message, severity);
    };

    if (loading) {
        return (
            <Container sx={{ textAlign: 'center', mt: 8 }}>
                <Typography variant="h6">Loading...</Typography>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ mt: 4 }}>
            {/* Header */}
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 4 }}>
                <IconButton onClick={() => navigate('/')} sx={{ mr: 2 }}>
                    <ArrowBackIcon />
                </IconButton>
                <Box sx={{ flexGrow: 1 }}>
                    <Typography variant="h4" component="h1">
                        Edit: {cardSet?.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        {cardSet?.description}
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={() => setAddDialogOpen(true)}
                    sx={{ mr: 2 }}
                >
                    Add Cards
                </Button>
                <Button
                    variant="outlined"
                    color="error"
                    startIcon={<DeleteIcon />}
                    onClick={() => setDeleteSetDialogOpen(true)}
                >
                    Delete Set
                </Button>
            </Box>

            {/* Cards Grid */}
            <Grid container spacing={3}>
                {cards.map((card) => (
                    <Grid item xs={12} sm={6} md={4} key={card.id}>
                        <Card>
                            <CardContent>
                                <Typography variant="h6" gutterBottom>
                                    Front: {card.front}
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Back: {card.back}
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
                                    onClick={() => {
                                        setCardToDelete(card.id);
                                        setDeleteDialogOpen(true);
                                    }}
                                >
                                    Delete
                                </Button>
                            </CardActions>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Add New Card Button */}
            <Fab
                color="primary"
                aria-label="add"
                sx={{ position: 'fixed', bottom: 16, right: 16 }}
                onClick={() => setAddDialogOpen(true)}
            >
                <AddIcon />
            </Fab>

            {/* Reusable Add Cards Dialog */}
            <AddCardsDialog
                open={addDialogOpen}
                onClose={() => setAddDialogOpen(false)}
                onCardsAdded={handleCardsAdded}
                setId={setId}
                title="Add Cards to Set"
            />

            {/* Edit Card Dialog */}
            <Dialog open={!!editingCard} onClose={() => setEditingCard(null)} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {editingCard?.id ? 'Edit Card' : 'Add New Card'}
                </DialogTitle>
                <DialogContent>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Front (Question)"
                        fullWidth
                        variant="outlined"
                        value={editingCard?.front || ''}
                        onChange={(e) => setEditingCard({ ...editingCard, front: e.target.value })}
                        sx={{ mb: 2 }}
                    />
                    <TextField
                        margin="dense"
                        label="Back (Answer)"
                        fullWidth
                        variant="outlined"
                        multiline
                        rows={3}
                        value={editingCard?.back || ''}
                        onChange={(e) => setEditingCard({ ...editingCard, back: e.target.value })}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setEditingCard(null)}>Cancel</Button>
                    <Button 
                        onClick={handleSaveCard} 
                        variant="contained" 
                        startIcon={<SaveIcon />}
                        disabled={!editingCard?.front || !editingCard?.back}
                    >
                        {editingCard?.id ? 'Update' : 'Add'} Card
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Card Dialog */}
            <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
                <DialogTitle>Delete Card</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete this card? This action cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteDialogOpen(false)}>Cancel</Button>
                    <Button 
                        onClick={() => handleDeleteCard(cardToDelete)} 
                        color="error" 
                        variant="contained"
                    >
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Delete Set Dialog */}
            <Dialog open={deleteSetDialogOpen} onClose={() => setDeleteSetDialogOpen(false)}>
                <DialogTitle>Delete Entire Set</DialogTitle>
                <DialogContent>
                    <Typography>
                        Are you sure you want to delete the entire set "{cardSet?.name}"? 
                        This will delete all cards in this set and cannot be undone.
                    </Typography>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDeleteSetDialogOpen(false)}>Cancel</Button>
                    <Button 
                        onClick={handleDeleteSet} 
                        color="error" 
                        variant="contained"
                    >
                        Delete Set
                    </Button>
                </DialogActions>
            </Dialog>

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

export default EditSet;
