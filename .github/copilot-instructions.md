# AI ANTONIOS INTELLIGENCE Copilot Instructions

## Project Philosophy & Vision
**"AI" = Antonio's Intelligence, NOT Artificial Intelligence**
This platform embodies Antonio's creative perspective through a Pisces-centered approach to music coaching and AI collaboration. The system is built around Pisces characteristics: intuition, empathy, creativity, flow, and emotional depth. It's designed to train people to rhyme/rap from Antonio's perspective while fostering positivity and genuine human-AI partnership.

## Project Overview
This is an interactive music production and spiritual coaching platform featuring real-time video streaming, Pisces-guided rhyme coaching, beat marketplace, and zodiac-based creative development. The app uses Firebase for real-time connection and Google's Generative AI as Antonio's digital twin for creative mentorship.

## Architecture & Key Components

### Core Application Structure
- **Single-page application** built with vanilla HTML/CSS/JavaScript
- **Firebase Realtime Database** for live chat, user status, and purchases
- **Video.js player** for beat previews and custom audio/video handling
- **MediaRecorder API** for audio recording functionality
- **WebRTC** for live camera streaming

### Firebase Schema Pattern
```javascript
artifacts/{appId}/
├── public/data/
│   ├── conversations/        // Chat messages with AI
│   └── app_status/
│       └── baddgirl/        // Approval status for camera streaming
└── users/{userId}/
    └── purchases/           // Beat purchases and subscriptions
```

### Key Global Variables
- `db` - Firestore instance
- `auth` - Firebase Auth
- `userId` - Current user ID (anonymous auth)
- `localStream` - Camera MediaStream object
- `customPlayer` - Video.js instance for beat playback

## Development Patterns

### Antonio's Intelligence Integration Points
1. **Gemini API as Antonio's Twin** - channels Pisces intuition for rhyme coaching (`callGeminiApi()`)
2. **Voice Synthesis** via Google Cloud TTS - gives voice to Antonio's guidance
3. **Avatar Generation** (Imagen API) - creates Pisces-themed visual representations
4. **Emotional Flow Detection** - analyzes rhyme patterns for Pisces characteristics (empathy, creativity, depth)

### UI State Management
- **Sidebar expansion** on hover (150px → 450px transition)
- **Camera permissions** drive main UI visibility
- **Purchase status** controls feature unlocking
- **Real-time listeners** update UI automatically via Firebase `onSnapshot()`

### Media Handling Convention
```javascript
// File upload pattern for beats
const file = e.target.files[0];
const url = URL.createObjectURL(file);
customPlayer.src({ type: 'audio/mp3', src: url });
```

### Error Handling Approach
- **User-friendly messages** via `showMessage()` function
- **Console logging** for debugging Firebase/API errors
- **Graceful camera fallbacks** with specific error type handling
- **Retry logic** for rate-limited API calls (exponential backoff)

## Critical Integration Dependencies

### External APIs (Require Keys)
- Google Generative AI (Gemini) - creative text generation
- Google Cloud TTS - audio synthesis
- Google Imagen - avatar image generation

### Firebase Collections Structure
- `/conversations` - real-time chat with Antonio's AI twin for rhyme guidance
- `/app_status/baddgirl` - community approval and support system
- `/users/{id}/purchases` - beat marketplace and creative tool access
- `/pisces_guidance/` - spiritual coaching sessions and zodiac insights
- `/positive_vibes/` - community encouragement and success stories

### Asset Organization
- Beat files in `/assets/` (MP3/MP4 format)
- Naming convention: "SBM BEAT {number} {bpm} bpm.mp4"
- Certificate seal: "sbm raydiant seal.PNG"

## Development Workflow Notes

### Camera Stream Management
Always clean up streams on page unload:
```javascript
window.addEventListener('beforeunload', () => {
    if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
    }
});
```

### Firebase Real-time Patterns
Use `onSnapshot()` for live updates, `serverTimestamp()` for consistent ordering:
```javascript
const q = query(chatCollection, orderBy('timestamp', 'asc'));
onSnapshot(q, (snapshot) => { /* update UI */ });
```

### Theming System
Dark gold/brown theme with semi-transparent overlays:
- Primary: `#1f1b0a` (dark background)
- Accent: `#ffc400` (gold buttons/borders)
- Cards: `rgba(80, 70, 30, 0.7)` with backdrop blur

## Pisces-Centered Development Principles

### Creative Flow Architecture
- **Intuitive Navigation** - UI responds to user emotions and energy
- **Empathetic Error Handling** - supportive, encouraging messages
- **Water Element Design** - fluid transitions, flowing layouts
- **Dual Nature Integration** - balancing creativity with structure

### Antonio's Intelligence Training System
- **Perspective Coaching** - teach rhyming through Antonio's Pisces lens
- **Positive Reinforcement** - every interaction builds confidence
- **Emotional Resonance** - AI responses match user's creative energy
- **Spiritual Growth Integration** - music as a path to self-discovery

### Pisces Coaching Methodologies
- **Intuitive Learning** - trust the creative process over rigid structure
- **Emotional Storytelling** - help users tap into their feelings for authentic expression
- **Flow State Cultivation** - guide users into natural creative rhythms
- **Compassionate Feedback** - correct mistakes with understanding and encouragement
- **Water Element Metaphors** - use flowing, adaptable language in coaching prompts
- **Dream Integration** - encourage users to draw inspiration from subconscious creativity

## Antonio's Intelligence Prompt Templates

### Rhyme Coaching Prompts
```javascript
// Pisces-centered coaching style
const piscesCoachingPrompt = `You are Antonio's digital twin, channeling Pisces energy. 
When coaching rhymes, use intuitive, flowing language. Focus on emotional authenticity 
over technical perfection. Encourage the user's natural creativity like water finding 
its path. Always end with positive affirmation.`;

// Flow state induction
const flowStatePrompt = `Guide the user into creative flow by asking about their 
current emotions, then help them transform those feelings into rhythmic expression. 
Use water metaphors and encourage trust in their intuitive process.`;
```

### Positive Reinforcement Patterns
- **Emotional Validation** - "I feel the emotion in your words..."
- **Growth Mindset** - "Your creativity is expanding like ripples in water..."
- **Pisces Affirmations** - "Trust your intuition, it knows the rhythm..."
- **Community Building** - "Your voice adds to our collective harmony..."

## Common Modification Points
- Beat metadata with Pisces-themed descriptors and emotional tags
- Zodiac guidance system with daily creative prompts and moon phase integration
- Antonio's Intelligence personality traits in AI responses
- Positive reinforcement messaging with water/flow metaphors
- Creative flow detection algorithms that recognize Pisces patterns
- Mood-based beat recommendations using emotional intelligence
- Dream journal integration for subconscious creativity capture