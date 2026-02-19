# Event Management System - Backend API

## Setup Instructions

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Install MongoDB
- Download and install MongoDB from https://www.mongodb.com/try/download/community
- Start MongoDB service:
  ```bash
  # Windows
  net start MongoDB
  
  # Mac/Linux
  sudo systemctl start mongod
  ```

### 3. Configure Environment
- Edit `.env` file with your settings:
  ```
  PORT=5000
  MONGODB_URI=mongodb://localhost:27017/event-management
  NODE_ENV=development
  ```

### 4. Start Server
```bash
npm run dev
```

Server will run on http://localhost:5000

## API Endpoints

### Events
- `GET /api/events` - Get all events
- `GET /api/events/:id` - Get single event
- `POST /api/events` - Create new event
- `PUT /api/events/:id` - Update event
- `POST /api/events/:id/brochure` - Upload brochure
- `POST /api/events/:id/photos` - Upload photos
- `POST /api/events/:id/schedule` - Add schedule
- `POST /api/events/:id/feedback` - Add feedback
- `DELETE /api/events/:id` - Delete event

### IQAC Proposals
- `GET /api/iqac/proposals` - Get all proposals
- `GET /api/iqac/proposals/:id` - Get single proposal
- `POST /api/iqac/proposals` - Create proposal
- `PUT /api/iqac/proposals/:id/status` - Update status
- `POST /api/iqac/proposals/:id/complete` - Convert to completed event
- `PUT /api/iqac/events/:eventId/documentation` - Add post-event docs
- `DELETE /api/iqac/proposals/:id` - Delete proposal

## Frontend Integration

### 1. Install axios
```bash
cd ..
npm install axios
```

### 2. Create .env in root
```
VITE_API_URL=http://localhost:5000/api
```

### 3. Update EventListPage to use API
```javascript
import { eventAPI } from '../../shared/services/api';

const [events, setEvents] = useState([]);

useEffect(() => {
  const fetchEvents = async () => {
    const data = await eventAPI.getAllEvents();
    setEvents(data);
  };
  fetchEvents();
}, []);
```

### 4. Update EventPostPage to use API
```javascript
import { eventAPI } from '../../shared/services/api';

const { id } = useParams();
const [eventData, setEventData] = useState(null);

useEffect(() => {
  const fetchEvent = async () => {
    const data = await eventAPI.getEventById(id);
    setEventData(data);
  };
  fetchEvent();
}, [id]);
```

## IQAC Workflow

1. **Create Proposal** → IQAC Portal
2. **Approve Proposal** → Status: Approved
3. **Conduct Event** → Real-world event happens
4. **Add Documentation** → Click "Add Documentation" button
5. **Fill Post-Event Form** → Upload photos, brochure, attendance, feedback
6. **Submit** → Converts to completed event
7. **View in Events List** → Appears on /events page

## Testing

### Test Event Creation
```bash
curl -X POST http://localhost:5000/api/events \
  -H "Content-Type: application/json" \
  -d '{
    "eventId": "EVT-2024-TEST",
    "event": {
      "title": "Test Event",
      "department": "CSE",
      "type": "Workshop",
      "date": "2024-01-15"
    }
  }'
```

### Test Proposal Creation
```bash
curl -X POST http://localhost:5000/api/iqac/proposals \
  -H "Content-Type: application/json" \
  -d '{
    "proposalId": "PROP-2024-001",
    "eventTitle": "Test Workshop",
    "department": "CSE",
    "eventType": "Workshop",
    "eventDate": "2024-06-15"
  }'
```
