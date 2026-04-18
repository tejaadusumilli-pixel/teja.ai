# Building Your AI Agent - teja.ai

## Project Structure

```
teja-ai/
├── index.html
├── styles.css
├── app.js
├── api.js
├── config.js
├── components/
│   ├── chat.js
│   ├── sidebar.js
│   └── message.js
├── assets/
│   └── images/
└── README.md
```

## Technology Stack

- **Frontend**: Pure HTML/CSS/JavaScript (no build step needed)
- **API**: OpenRouter.ai
- **Hosting**: Netlify or GitHub Pages
- **Domain**: teja.ai

## OpenRouter Integration Details

### 1. API Key Setup
- Sign up at https://openrouter.ai/
- Get API key from dashboard
- Available models: GPT-4, Claude, Llama, etc.

### 2. API Endpoint
```
POST https://openrouter.ai/api/v1/chat/completions
```

### 3. Authentication
```javascript
headers: {
  "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
  "HTTP-Referer": "https://teja.ai",
  "X-Title": "Teja AI"
}
```

## Key Features to Implement

1. **Chat Interface**
   - Message input with auto-resize
   - Conversation history
   - Streaming responses
   - Code syntax highlighting
   - Markdown rendering

2. **Sidebar**
   - Conversation list
   - New chat button
   - Settings panel
   - Model selector

3. **Message Display**
   - User messages (right-aligned)
   - AI responses (left-aligned)
   - Timestamp
   - Copy button
   - Regenerate option

4. **Advanced Features**
   - Local storage for chat history
   - Export conversations
   - Dark/light theme toggle
   - Keyboard shortcuts

## Security Considerations

⚠️ **IMPORTANT**: Never expose API keys in frontend code!

### Options:
1. **Use Netlify Functions** (Recommended)
2. **Use GitHub Pages + Cloudflare Workers**
3. **Prompt user to enter their own API key**

## Deployment Steps

### Option 1: Netlify (Recommended)
1. Create `netlify.toml`
2. Set up serverless functions for API calls
3. Add API key as environment variable
4. Connect GitHub repo
5. Configure custom domain (teja.ai)

### Option 2: GitHub Pages
1. Create repository
2. Enable GitHub Pages
3. Use Cloudflare Workers for API proxy
4. Configure DNS for teja.ai

## Cost Estimation

OpenRouter pricing (pay-as-you-go):
- Claude Sonnet: ~$3 per million tokens
- GPT-4: ~$30 per million tokens
- Free tier available for testing

## Next Steps

1. Set up development environment
2. Implement basic chat UI
3. Integrate OpenRouter API
4. Add message streaming
5. Implement chat history
6. Deploy to Netlify/GitHub Pages
7. Configure custom domain
