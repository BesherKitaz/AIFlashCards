import React, { useState } from "react";
import axios from "axios";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Box,
    TextField,
    Typography,
    Tabs,
    Tab,
    Input,
    CircularProgress
} from "@mui/material";
import {
    Upload as UploadIcon,
    Create as CreateIcon,
    Add as AddIcon,
    Save as SaveIcon
} from "@mui/icons-material";

const AddCardsDialog = ({ open, onClose, onCardsAdded, setId = null, title = "Add New Cards" }) => {
    const [tabValue, setTabValue] = useState(0);
    const [selectedFile, setSelectedFile] = useState(null);
    const [processingImage, setProcessingImage] = useState(false);
    const [manualCards, setManualCards] = useState([{ front: '', back: '' }]);

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file && file.type.startsWith('image/')) {
            setSelectedFile(file);
        } else {
            onCardsAdded([], 'Please select a valid image file', 'error');
        }
    };

    const handleProcessImage = async () => {
        if (!selectedFile) {
            onCardsAdded([], 'Please select an image first', 'error');
            return;
        }

        setProcessingImage(true);
        const formData = new FormData();
        formData.append('image', selectedFile);
        const userId = '1'; // Dummy user ID
        if (setId) formData.append('setId', setId);

        try {
            // API call to process image with AI
            const response = await axios.post(`http://localhost:5000/api/process-image/${userId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });

            const newCards = response.data.cards;
            onCardsAdded(newCards, `${newCards.length} cards generated from image!`, 'success');
            handleCloseDialog();
        } catch (error) {
            console.error('AI processing failed:', error);
            onCardsAdded([], 'Failed to process image. Please try again.', 'error');
        } finally {
            setProcessingImage(false);
        }
    };

    const handleAddManualCard = () => {
        setManualCards([...manualCards, { front: '', back: '' }]);
    };

    const handleRemoveManualCard = (index) => {
        setManualCards(manualCards.filter((_, i) => i !== index));
    };

    const handleManualCardChange = (index, field, value) => {
        const updatedCards = manualCards.map((card, i) => 
            i === index ? { ...card, [field]: value } : card
        );
        setManualCards(updatedCards);
    };

    const handleSaveManualCards = async () => {
        const validCards = manualCards.filter(card => card.front.trim() && card.back.trim());
        
        if (validCards.length === 0) {
            onCardsAdded([], 'Please add at least one valid card', 'error');
            return;
        }

        // If setId is provided, save to database (EditSet scenario)
        if (setId) {
            try {
                const userId = 1; // Dummy user ID
                const response = await axios.post(`http://localhost:5000/api/card-sets/${userId}/${setId}/cards`, { 
                    cards: validCards
                });
                
                onCardsAdded(response.data.cards, `${response.data.count} cards added successfully!`, 'success');
                handleCloseDialog();
            } catch (error) {
                console.error('Error adding cards:', error);
                onCardsAdded([], 'Failed to add cards', 'error');
            }
        } else {
            // If no setId, just return cards for CreateSet scenario
            const newCards = validCards.map((card, index) => ({
                id: Date.now() + index,
                front: card.front,
                back: card.back
            }));
            
            onCardsAdded(newCards, `${validCards.length} cards added successfully!`, 'success');
            handleCloseDialog();
        }
    };

    const handleCloseDialog = () => {
        setTabValue(0);
        setSelectedFile(null);
        setManualCards([{ front: '', back: '' }]);
        onClose();
    };

    return (
        <Dialog open={open} onClose={handleCloseDialog} maxWidth="md" fullWidth>
            <DialogTitle>{title}</DialogTitle>
            <DialogContent>
                <Tabs value={tabValue} onChange={(e, newValue) => setTabValue(newValue)} sx={{ mb: 3 }}>
                    <Tab icon={<UploadIcon />} label="Upload Image (AI)" />
                    <Tab icon={<CreateIcon />} label="Manual Entry" />
                </Tabs>

                {/* Image Upload Tab */}
                {tabValue === 0 && (
                    <Box>
                        <Typography variant="body1" gutterBottom>
                            Upload an image containing text or questions, and AI will generate flashcards for you.
                        </Typography>
                        <Box sx={{ border: '2px dashed #ccc', borderRadius: 2, p: 3, textAlign: 'center', mb: 2 }}>
                            <Input
                                type="file"
                                accept="image/*"
                                onChange={handleFileUpload}
                                sx={{ display: 'none' }}
                                id="image-upload"
                            />
                            <label htmlFor="image-upload">
                                <Button
                                    variant="outlined"
                                    component="span"
                                    startIcon={<UploadIcon />}
                                    sx={{ mb: 2 }}
                                >
                                    Choose Image
                                </Button>
                            </label>
                            {selectedFile && (
                                <Typography variant="body2" color="primary">
                                    Selected: {selectedFile.name}
                                </Typography>
                            )}
                            <Typography variant="caption" display="block" sx={{ mt: 1 }}>
                                Supported formats: JPG, PNG, GIF
                            </Typography>
                        </Box>
                    </Box>
                )}

                {/* Manual Entry Tab */}
                {tabValue === 1 && (
                    <Box>
                        <Typography variant="body1" gutterBottom>
                            Manually create multiple flashcards at once.
                        </Typography>
                        {manualCards.map((card, index) => (
                            <Box key={index} sx={{ mb: 2, p: 2, border: '1px solid #e0e0e0', borderRadius: 1 }}>
                                <Typography variant="subtitle2" gutterBottom>
                                    Card {index + 1}
                                </Typography>
                                <TextField
                                    label="Front (Question)"
                                    fullWidth
                                    value={card.front}
                                    onChange={(e) => handleManualCardChange(index, 'front', e.target.value)}
                                    sx={{ mb: 1 }}
                                />
                                <TextField
                                    label="Back (Answer)"
                                    fullWidth
                                    multiline
                                    rows={2}
                                    value={card.back}
                                    onChange={(e) => handleManualCardChange(index, 'back', e.target.value)}
                                />
                                {manualCards.length > 1 && (
                                    <Button
                                        size="small"
                                        color="error"
                                        onClick={() => handleRemoveManualCard(index)}
                                        sx={{ mt: 1 }}
                                    >
                                        Remove Card
                                    </Button>
                                )}
                            </Box>
                        ))}
                        <Button
                            variant="outlined"
                            startIcon={<AddIcon />}
                            onClick={handleAddManualCard}
                            sx={{ mt: 1 }}
                        >
                            Add Another Card
                        </Button>
                    </Box>
                )}
            </DialogContent>
            <DialogActions>
                <Button onClick={handleCloseDialog}>Cancel</Button>
                {tabValue === 0 ? (
                    <Button
                        onClick={handleProcessImage}
                        variant="contained"
                        disabled={!selectedFile || processingImage}
                        startIcon={processingImage ? <CircularProgress size={20} /> : <UploadIcon />}
                    >
                        {processingImage ? 'Processing...' : 'Generate Cards'}
                    </Button>
                ) : (
                    <Button
                        onClick={handleSaveManualCards}
                        variant="contained"
                        startIcon={<SaveIcon />}
                        disabled={manualCards.every(card => !card.front.trim() || !card.back.trim())}
                    >
                        Add Cards
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default AddCardsDialog;
