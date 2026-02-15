NeuralTrade: AI-Powered Financial Intelligence Terminal
"Where Market Reality meets the Neural Horizon."

NeuralTrade is a full-stack financial intelligence platform designed to "weld" real-time market data with AI-generated future predictions. Unlike standard dashboards, NeuralTrade uses a dedicated Python AI Microservice running Facebook Prophet to project price movements 24 hours into the future.

It features a self-auditing "Truth Loop" that verifies its own predictions against actual market outcomes, creating a transparent Accuracy Score for every asset.

🚀 Key Features
Unified Horizon Chart: A continuous time-series visualization that seamlessly welds historical data (Cyan) with AI-predicted future price action (Purple).

Microservice AI: A dedicated Python server handles heavy statistical computation, keeping the Node.js backend fast and responsive.

The "Truth Loop" (Neural Audit): An automated Cron job that verifies past predictions against real market data.

Smart Caching: High-performance Redis caching layer ensures sub-10ms response times.

Secure Authentication: JWT-based auth with HTTP-Only cookies.

🛠 Architecture
NeuralTrade operates on a Microservice Architecture, separating the "Orchestrator" (Node) from the "Brain" (Python).

Code snippet
graph TD
    User[React Client] <-->|JSON| Node[Node.js API Gateway (Port 4000)]
    Node <-->|Cache Hit| Redis[(Redis Cache)]
    Node <-->|Audit Logs| Mongo[(MongoDB)]
    Node <-->|HTTP Request| Python[Python Brain Service (Port 8000)]
    Python -->|Forecast JSON| Node
1. Frontend (The "Glass Terminal")
Port: 5173

Tech: React (Vite), Tailwind CSS, Lucide-React, Recharts.

Role: Visualizes the "Unified Horizon" and manages user interaction.

2. Backend (The "Orchestrator")
Port: 4000

Tech: Node.js, Express, Mongoose, Redis.

Role: Handles Auth, Caching, and acts as the API Gateway. It forwards prediction requests to the Python Brain.

3. Python Brain (The "Intelligence Service")
Port: 8000

Tech: Python, FastAPI/Flask, Facebook Prophet.

Role: A dedicated HTTP server that accepts a stock ticker/history, runs the Prophet model, and returns the 24h forecast.

⚡ Getting Started
Prerequisites
Node.js (v18+)

Python (v3.9+)

MongoDB (Atlas URI)

Redis (Local or Remote)

1. Clone the Repository
Bash
git clone https://github.com/yourusername/NeuralTrade.git
cd NeuralTrade
2. Backend Setup (Node.js)
Bash
cd backend

# Install dependencies
npm install

# Create .env file
touch .env
Paste into backend/.env:

Code snippet
PORT=4000
MONGO_URI=your_mongodb_connection_string
PYTHON_BRAIN_URL=http://127.0.0.1:8000  # The address of your Python Service
JWT_SECRET=your_secret_key
FMP_API_KEY=your_fmp_key
FINNHUB_KEY=your_finnhub_key
REDIS_URL=your_redis_url
3. AI Brain Setup (Python)
Bash
cd ../python_brain  # Or whatever your python folder is named

# Create virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
4. Frontend Setup
Bash
cd ../frontend

# Install dependencies
npm install

# Create .env file
touch .env
Paste into frontend/.env:

Code snippet
VITE_BACKEND_URL=http://localhost:4000/api
VITE_FINNHUB_KEY=your_finnhub_key
🏃‍♂️ Running the Application
You need Three Terminals running simultaneously:

Terminal 1: Python Brain 🧠

Bash
cd python_brain
source venv/bin/activate
# Assuming you use uvicorn for FastAPI or python app.py for Flask
uvicorn main:app --reload --port 8000
# OR
python app.py
Terminal 2: Node Backend ⚙️

Bash
cd backend
npm start
# Server running on http://localhost:4000
# "Connected to Python Brain at http://127.0.0.1:8000"
Terminal 3: React Frontend 🖥️

Bash
cd frontend
npm run dev
# Client running on http://localhost:5173
🧪 Testing the Pipeline
Ensure the Python Brain is running on port 8000.

Start the Node Backend. It should log a successful connection to Redis and MongoDB.

Open the Frontend (localhost:5173) and search for TSLA.

Flow Check:

Frontend calls Node (/api/stocks/unified/TSLA).

Node checks Redis (Miss).

Node sends HTTP POST to http://127.0.0.1:8000/predict.

Python runs Prophet and returns JSON.

Node welds the data and returns it to Frontend.
