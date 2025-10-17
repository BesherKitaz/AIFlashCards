# Cardly - AI-Powered Flashcard Application

Cardly is a modern flashcard application that helps you learn and memorize content through spaced repetition. Built with React frontend and Flask backend, it features AI-powered card generation from images and intelligent study scheduling.

## Features

### 🧠 Smart Learning
- **Spaced Repetition Algorithm**: Uses the SM-2 algorithm to optimize learning retention
- **Study Dashboard**: View cards that are due for review based on your performance
- **Progress Tracking**: Cards are rescheduled based on how well you remember them

### 🤖 AI-Powered Content Creation
- **Image-to-Flashcards**: Upload images containing text and let AI generate flashcards automatically
- **Google Gemini Integration**: Powered by Google's Gemini AI for accurate content extraction
- **Manual Card Creation**: Create cards manually for full control over content

### 📱 Modern User Interface
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices
- **Material-UI Components**: Clean, modern interface with consistent design
- **Interactive Card Study**: Flip cards to reveal answers with smooth animations
- **Intuitive Navigation**: Easy-to-use routing between different app sections

### 🔐 User Management
- **Secure Authentication**: JWT-based authentication system
- **User Accounts**: Each user has their own private flashcard sets
- **Session Management**: Persistent login sessions with secure token handling

## Technology Stack

### Frontend
- **React 19.1.0** - Modern React with hooks and functional components
- **Material-UI 7.3.2** - Google's Material Design components
- **React Router 7.8.2** - Client-side routing
- **Axios 1.11.0** - HTTP client for API communication
- **Vite 7.0.4** - Fast build tool and development server

### Backend
- **Flask 3.1.2** - Python web framework
- **Peewee 3.18.2** - Lightweight ORM for database operations
- **MySQL** - Primary database for data persistence
- **JWT Authentication** - Secure token-based authentication
- **Google Gemini AI** - AI-powered image processing
- **Flask-CORS** - Cross-origin resource sharing support

## Project Structure

```
AIFlashCardsApp/
├── client/                 # React frontend
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── css/           # Custom styles
│   │   └── assets/        # Static assets
│   └── dist/              # Built frontend (served by Flask)
├── server/                # Flask backend
│   ├── app/
│   │   ├── models/        # Database models
│   │   ├── logic/         # AI processing logic
│   │   ├── routes.py      # API endpoints
│   │   └── auth.py        # Authentication routes
│   └── run.py             # Flask application entry point
└── README.md
```

## Installation & Setup

### Prerequisites
- Python 3.8+
- Node.js 16+
- MySQL database
- Google Gemini API key

### Backend Setup

1. **Navigate to server directory**:
   ```bash
   cd server
   ```

2. **Create virtual environment**:
   ```bash
   python -m venv .venv
   source .venv/Scripts/activate  # Windows
   # or
   source .venv/bin/activate     # macOS/Linux
   ```

3. **Install Python dependencies**:
   ```bash
   pip install -r requirements.txt
   ```

4. **Configure database**:
   - Copy `app/models/db.config-example.json` to `app/models/db.config.json`
   - Update with your MySQL database credentials:
   ```json
   {
     "name": "your_database_name",
     "user": "your_username", 
     "password": "your_password",
     "host": "127.0.0.1",
     "port": 3306
   }
   ```

5. **Set up API keys**:
   - Create `app/secret_key.py` with your secrets:
   ```python
   SECRET_KEY = "your-jwt-secret-key"
   GOOGLE_API_KEY = "your-google-gemini-api-key"
   ```

6. **Initialize database**:
   ```bash
   python -m app.models.migrations
   ```

### Frontend Setup

1. **Navigate to client directory**:
   ```bash
   cd client
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Build for production**:
   ```bash
   npm run build
   ```

### Running the Application

1. **Start the Flask server**:
   ```bash
   cd server
   python run.py
   ```

2. **Access the application**:
   Open your browser to `http://localhost:5000`

The Flask server serves both the API and the built React frontend.

## API Endpoints

### Authentication
- `POST /api/signup` - Create new user account
- `POST /api/login` - User login

### Card Sets
- `GET /api/card-sets/` - Get user's flashcard sets
- `POST /api/card-sets/` - Create new flashcard set
- `GET /api/card-sets/{id}` - Get specific set details
- `DELETE /api/card-sets/{id}` - Delete flashcard set

### Cards
- `GET /api/card-sets/{id}/cards` - Get cards in a set
- `POST /api/card-sets/{id}/cards` - Add cards to a set
- `PUT /api/cards/{id}` - Update specific card
- `DELETE /api/cards/{id}` - Delete specific card
- `PUT /api/score/{id}` - Update card performance for spaced repetition

### AI Features
- `POST /api/process-image/` - Generate flashcards from uploaded image

## Usage

### Creating Flashcard Sets
1. Click "Create New Set" from the dashboard
2. Enter set name and description
3. Add cards manually or upload images for AI generation
4. Review and save your set

### Studying
1. Click "Study" on any flashcard set
2. View the question, think of the answer
3. Click "Reveal Answer" to see the correct answer
4. Click "I remembered this 👍" or "I forgot this 👎"
5. Cards are automatically rescheduled based on your performance

### AI Card Generation
1. When adding cards, choose "Upload Image (AI)" tab
2. Upload an image containing text
3. AI will automatically extract content and create flashcards
4. Review and edit generated cards as needed

## Database Schema

### Users
- id, username, email, password_hash, created_at, updated_at

### FC_Set (Flashcard Sets)
- id, owner (FK), name, description, created_at, updated_at

### Cards
- id, question, answer, fc_set (FK), created_at, updated_at
- interval, repetitions, ease_factor, due_date (for spaced repetition)

## Development

### Frontend Development
```bash
cd client
npm run dev  # Start development server with hot reload
```

### Backend Development
```bash
cd server
export FLASK_ENV=development
export FLASK_DEBUG=1
python run.py
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- **Spaced Repetition Algorithm**: Based on the SM-2 algorithm for optimal learning
- **Google Gemini AI**: Powers the image-to-flashcard generation feature
- **Material-UI**: Provides the beautiful, consistent user interface
- **Flask & React**: Modern, scalable web application architecture
