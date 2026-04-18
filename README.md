# Teja AI - Personal AI Assistant

A Claude.ai-like chat interface powered by OpenRouter API, allowing you to interact with multiple AI models including Claude, GPT-4, Llama, and more.

## 🌟 Features

- **Clean, modern UI** - Interface inspired by Claude.ai
- **Multiple AI Models** - Access to Claude 3.5, GPT-4, Llama 3, Gemini, and more
- **Real-time Streaming** - See responses as they're generated
- **Chat History** - Conversations saved locally in your browser
- **Markdown Support** - Formatted text, code blocks, and syntax highlighting
- **Dark/Light Theme** - Customizable appearance
- **Mobile Responsive** - Works on all devices
- **Export Conversations** - Download your chat history
- **Local Storage** - All data stays in your browser

## 🚀 Quick Start

### 1. Get OpenRouter API Key

1. Visit [OpenRouter.ai](https://openrouter.ai/)
2. Sign up for a free account
3. Go to [Keys](https://openrouter.ai/keys) section
4. Create a new API key
5. Copy the key (starts with `sk-or-v1-...`)

### 2. Deploy to Netlify (Recommended)

#### Option A: One-Click Deploy

[![Deploy to Netlify](https://www.netlify.com/img/deploy/button.svg)](https://app.netlify.com/start)

1. Click the button above
2. Connect your GitHub account
3. Choose a repository name
4. Deploy!

#### Option B: Manual Deploy

1. Fork or clone this repository
2. Sign up at [Netlify](https://netlify.com)
3. Click "Add new site" → "Import an existing project"
4. Connect your GitHub/GitLab repository
5. Configure:
   - Build command: (leave empty)
   - Publish directory: `.`
6. Click "Deploy site"

### 3. Configure Custom Domain (teja.ai)

1. In Netlify dashboard, go to "Domain settings"
2. Click "Add custom domain"
3. Enter `teja.ai`
4. Follow DNS configuration instructions:
   - Add A record pointing to Netlify's load balancer
   - Or add CNAME record pointing to your Netlify subdomain
5. Enable HTTPS (automatic with Netlify)

### 4. Use the App

1. Open your deployed site
2. Click the Settings icon (gear)
3. Paste your OpenRouter API key
4. Select your preferred model
5. Start chatting!

## 📁 Project Structure

```
teja-ai/
├── index.html          # Main HTML structure
├── styles.css          # All styling (Claude.ai-inspired)
├── app.js             # Main application logic
├── api.js             # OpenRouter API integration
├── config.js          # Configuration and utilities
├── netlify.toml       # Netlify deployment config
└── README.md          # This file
```

## 🔧 Configuration

### Available Models

The app supports these models through OpenRouter:

- **Claude 3.5 Sonnet** - Best for complex tasks
- **Claude 3 Opus** - Most capable Claude model
- **GPT-4 Turbo** - OpenAI's latest
- **GPT-4** - High-quality responses
- **Llama 3 70B** - Open-source, cost-effective
- **Gemini Pro** - Google's AI model

### Customization

Edit `config.js` to customize:
- Default model
- System prompts
- UI settings
- Available models
- Theme colors

Edit `styles.css` to customize:
- Colors and themes
- Layout and spacing
- Fonts and typography

## 💰 Pricing

OpenRouter uses pay-as-you-go pricing:

| Model | Input (per 1M tokens) | Output (per 1M tokens) |
|-------|----------------------|------------------------|
| Claude 3.5 Sonnet | $3 | $15 |
| Claude 3 Opus | $15 | $75 |
| GPT-4 Turbo | $10 | $30 |
| Llama 3 70B | $0.70 | $0.90 |
| Gemini Pro | $0.25 | $0.50 |

**Free credits available for new accounts!**

## 🔒 Security & Privacy

- **API keys stored locally** - Never sent to any server except OpenRouter
- **No backend required** - Purely client-side application
- **No tracking** - Your conversations stay on your device
- **HTTPS enforced** - Secure communication with OpenRouter

## 🛠️ Development

### Local Development

1. Clone the repository:
```bash
git clone https://github.com/yourusername/teja-ai.git
cd teja-ai
```

2. Serve locally (any HTTP server works):
```bash
# Python
python -m http.server 8000

# Node.js
npx http-server

# VS Code Live Server extension
```

3. Open `http://localhost:8000`

### Building for Production

No build step required! This is a static site that works directly.

## 📦 Alternative Deployment Options

### GitHub Pages

1. Push code to GitHub repository
2. Go to Settings → Pages
3. Select branch and root folder
4. Save

### Cloudflare Pages

1. Connect GitHub repository
2. Build command: (leave empty)
3. Build output directory: `/`
4. Deploy

### Vercel

1. Import GitHub repository
2. Framework preset: Other
3. Build command: (leave empty)
4. Output directory: `./`
5. Deploy

## 🎨 Customization Tips

### Change Colors

Edit CSS variables in `styles.css`:
```css
:root {
    --accent-color: #c17c4e;  /* Change to your brand color */
    --bg-primary: #ffffff;
    --text-primary: #1a1a1a;
}
```

### Add Custom Models

Edit `CONFIG.MODELS` in `config.js`:
```javascript
'custom/model-name': {
    name: 'My Custom Model',
    provider: 'Provider Name',
    contextWindow: 100000,
    pricing: { prompt: 0.001, completion: 0.002 }
}
```

### Change Welcome Message

Edit the welcome screen in `index.html`:
```html
<div class="welcome-screen">
    <h1>Your Custom Title</h1>
    <p>Your custom message</p>
</div>
```

## 🐛 Troubleshooting

### API Key Issues
- Make sure key starts with `sk-or-v1-`
- Check OpenRouter dashboard for key status
- Verify you have credits/billing set up

### Streaming Not Working
- Check browser console for errors
- Try disabling streaming in settings
- Some models may not support streaming

### Chat History Lost
- Check browser's localStorage isn't full
- Don't use incognito/private mode
- Use export feature to backup chats

## 📝 License

MIT License - feel free to use this for any purpose!

## 🤝 Contributing

Contributions welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

## 🔗 Links

- [OpenRouter Documentation](https://openrouter.ai/docs)
- [Claude.ai](https://claude.ai)
- [Netlify Docs](https://docs.netlify.com)

## 💡 Credits

Built with inspiration from Claude.ai's beautiful interface.

---

**Need help?** Open an issue on GitHub or check OpenRouter's documentation.
