import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
// import material UI components 
import { 
    Container, 
    Typography, 
    Button, 
    Card, 
    CardContent, 
    CardActions,
    Box,
    Chip,
    CircularProgress,
    Alert
} from "@mui/material";
import { Add as AddIcon, PlayArrow as PlayIcon } from "@mui/icons-material";

const Home = () => {
    const [cardSets, setCardSets] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        fetchCardSets();
    }, []);

    const fetchCardSets = async () => {
        try {
            setLoading(true);
            const token = localStorage.getItem('token');
            const response = await axios.get(`http://localhost:5000/api/card-sets/`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            setCardSets(response.data);
            setError(null);
        } catch (err) {
            console.error('Error fetching card sets:', err);
            setError('Failed to load card sets. Please make sure the server is running.');
            setCardSets([]);
        } finally {
            setLoading(false);
        }
    };

    const handleCardSetClick = (setId) => {
        navigate(`/study/${setId}`);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString();
    };

    if (loading) {
        return (
            <Container sx={{ textAlign: 'center', mt: 8 }}>
                <CircularProgress />
                <Typography variant="h6" sx={{ mt: 2 }}>
                    Loading your card sets...
                </Typography>
            </Container>
        );
    }

    return (
        <Container sx={{ mt: 4, px: 0.5, maxWidth: 'none' }}>
            {/* Header Section */}
            <Box sx={{ textAlign: 'center', mb: 3, px: 2 }}>
                <Typography variant="h3" component="h1" gutterBottom>
                    Cardly Recall Dashboard
                </Typography>
                <Typography variant="body1" color="text.secondary" gutterBottom>
                    Practice and memorize with your flashcards
                </Typography>
                {cardSets.length > 0 && (
                    <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    sx={{ mt: 2 }}
                    onClick={() => navigate('/create-set')}
                >
                    Create New Set
                </Button>
            )}
            </Box>

            {/* Error Display */}
            {error && (
                <Alert severity="error" sx={{ mb: 4 }}>
                    {error}
                </Alert>
            )}

            {/* Card Sets Grid */}
            {cardSets.length === 0 ? (
                <Box sx={{ textAlign: 'center', mt: 8 }}>
                    <Typography variant="h5" color="text.secondary" gutterBottom>
                        No card sets yet
                    </Typography>
                    <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                        Create your first flashcard set to get started!
                    </Typography>
                    <Button
                        variant="outlined"
                        startIcon={<AddIcon />}
                        onClick={() => navigate('/create-set')}
                    >
                        Create Your First Set
                    </Button>
                </Box>
            ) : (
                <Box 
                    sx={{
                        display: 'grid',
                        gridTemplateColumns: {
                            xs: '1fr',
                            sm: 'repeat(2, 1fr)',
                            md: 'repeat(3, 1fr)',
                            lg: 'repeat(3, 1fr)',
                            xl: 'repeat(3, 1fr)'
                        },
                        gap: 2,
                        width: '100%'
                    }}
                >
                    {cardSets.map((set) => (
                        <Box key={set.id}>
                            <Card 
                                sx={{ 
                                    cursor: 'pointer',
                                    transition: 'transform 0.2s, box-shadow 0.2s',
                                    minHeight: '280px',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    '&:hover': {
                                        transform: 'translateY(-4px)',
                                        boxShadow: 4
                                    }
                                }}
                                onClick={() => handleCardSetClick(set.id)}
                            >
                                <CardContent sx={{ flex: '1 0 auto' }}>
                                    <Typography variant="h6" component="h2" gutterBottom>
                                        {set.name}
                                    </Typography>
                                    <Typography 
                                        variant="body2" 
                                        color="text.secondary" 
                                        sx={{ mb: 2, minHeight: '40px' }}
                                    >
                                        {set.description || 'No description available'}
                                    </Typography>
                                    <Box sx={{ display: 'flex', gap: 1, mb: 2 }}>
                                        <Chip 
                                            label={`${set.cardCount || 0} cards`} 
                                            size="small" 
                                            color="primary" 
                                        />
                                        <Chip 
                                            label={formatDate(set.created_at)} 
                                            size="small" 
                                            variant="outlined" 
                                        />
                                    </Box>
                                </CardContent>
                                <CardActions sx={{ justifyContent: 'space-between', p: 2 }}>
                                    <Button 
                                        size="small" 
                                        startIcon={<PlayIcon />}
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/study/${set.id}`);
                                        }}
                                    >
                                        Study
                                    </Button>
                                    <Button 
                                        size="small" 
                                        variant="outlined"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            navigate(`/edit-set/${set.id}`);
                                        }}
                                    >
                                        Edit
                                    </Button>
                                </CardActions>
                            </Card>
                        </Box>
                    ))}
                </Box>
            )}
        </Container>
    );
}

export default Home
