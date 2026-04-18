# Local Development Guide - Teja AI

## Quick Start (3 Steps)

### Step 1: Extract Files

1. Download and extract `teja-ai-complete.zip`
2. You should see these files:
   ```
   teja-ai/
   ├── index.html
   ├── styles.css
   ├── app.js
   ├── api.js
   ├── config.js
   ├── README.md
   ├── DEPLOYMENT_GUIDE.md
   └── PROJECT_GUIDE.md
   ```

### Step 2: Start Local Server

You need a local web server (required for JavaScript modules to work).

**Choose ONE method:**

#### Option A: Python (Easiest - Pre-installed on most systems)

```bash
cd teja-ai
python -m http.server 8000
```

Or if you have Python 2:
```bash
python -m SimpleHTTPServer 8000
```

#### Option B: Node.js (If you have Node installed)

```bash
cd teja-ai
npx http-server -p 8000
```

Or install globally:
```bash
npm install -g http-server
cd teja-ai
http-server -p 8000
```

#### Option C: PHP (If you have PHP installed)

```bash
cd teja-ai
php -S localhost:8000
```

#### Option D: VS Code Live Server (If using VS Code)

1. Install "Live Server" extension
2. Right-click on `index.html`
3. Select "Open with Live Server"

#### Option E: Double-click (Simple but limited)

**Note**: Some features may not work due to CORS restrictions
- Just double-click `index.html`
- Opens in your default browser

### Step 3: Get OpenRouter API Key

1. Go to https://openrouter.ai/
2. Sign up (free)
3. Navigate to https://openrouter.ai/keys
4. Create new API key
5. Copy it (format: `sk-or-v1-...`)

### Step 4: Use the App

1. **Open browser**: http://localhost:8000
2. **Click Settings** (gear icon)
3. **Paste API key**
4. **Select model** (Claude 3.5 Sonnet recommended)
5. **Save settings**
6. **Start chatting!**

---

## Detailed Instructions by Operating System

### Windows

#### Method 1: Python (Recommended)
```cmd
# Open Command Prompt
cd C:\path\to\teja-ai
python -m http.server 8000
```

Then open: http://localhost:8000

#### Method 2: Node.js
```cmd
cd C:\path\to\teja-ai
npx http-server -p 8000
```

### macOS

#### Method 1: Python (Pre-installed)
```bash
# Open Terminal
cd ~/Downloads/teja-ai
python3 -m http.server 8000
```

Then open: http://localhost:8000

#### Method 2: Node.js
```bash
cd ~/Downloads/teja-ai
npx http-server -p 8000
```

### Linux

#### Method 1: Python
```bash
cd ~/teja-ai
python3 -m http.server 8000
```

#### Method 2: Node.js
```bash
cd ~/teja-ai
npx http-server -p 8000
```

---

## Testing Checklist

Once the server is running, test these features:

- [ ] Page loads without errors
- [ ] Can open settings modal
- [ ] Can save API key
- [ ] Can send a message
- [ ] Streaming response appears
- [ ] Can create new chat
- [ ] Chat history saves
- [ ] Can switch between chats
- [ ] Theme toggle works
- [ ] Code formatting displays correctly
- [ ] Copy button works
- [ ] Regenerate button works

---

## Troubleshooting

### Issue: "Command not found" for Python

**Fix:**
- Install Python from https://www.python.org/downloads/
- Or use another method (Node.js, VS Code, etc.)

### Issue: Port 8000 already in use

**Fix:**
```bash
# Use a different port
python -m http.server 8001
# Then open http://localhost:8001
```

### Issue: Page loads but features don't work

**Fix:**
- Don't use file:// protocol (double-click method)
- Must use http://localhost with a web server
- Check browser console for errors (F12)

### Issue: API key doesn't save

**Fix:**
- Check browser console (F12) for errors
- Ensure localStorage is enabled
- Not using incognito/private mode
- Try a different browser

### Issue: No response from AI

**Check:**
- API key is correct (starts with `sk-or-v1-`)
- You have credits in OpenRouter account
- Browser console (F12) for error messages
- Network tab shows request to openrouter.ai

**Fix:**
- Verify API key in OpenRouter dashboard
- Add credits to your account
- Check internet connection

### Issue: Streaming not working

**Fix:**
- Disable streaming in settings
- Try different browser (Chrome/Edge/Firefox recommended)
- Check console for errors

---

## Browser Compatibility

**Recommended Browsers:**
- ✅ Chrome 90+
- ✅ Edge 90+
- ✅ Firefox 88+
- ✅ Safari 14+

**Not Supported:**
- ❌ Internet Explorer
- ❌ Old browser versions

---

## Development Tips

### 1. Auto-reload on Changes

If using VS Code Live Server, changes auto-refresh.

For other methods, manually refresh browser after editing files.

### 2. Browser DevTools

Press `F12` or `Ctrl+Shift+I` (Windows/Linux) or `Cmd+Option+I` (Mac)

Useful tabs:
- **Console**: See errors and logs
- **Network**: Check API requests
- **Application**: View localStorage data

### 3. View Saved Chats

1. Open DevTools (F12)
2. Go to "Application" tab
3. Expand "Local Storage"
4. Click on your localhost URL
5. Look for keys starting with `teja_ai_`

### 4. Clear All Data

In browser DevTools:
1. Application → Local Storage
2. Right-click → Clear
3. Refresh page

Or programmatically:
```javascript
// In browser console
localStorage.clear();
location.reload();
```

---

## Customization During Development

### Change Colors

Edit `styles.css`:
```css
:root {
    --accent-color: #c17c4e;  /* Your brand color */
    --bg-primary: #ffffff;
    --text-primary: #1a1a1a;
}
```

Refresh browser to see changes.

### Change Default Model

Edit `config.js`:
```javascript
DEFAULT_MODEL: 'anthropic/claude-3.5-sonnet',
```

### Add Custom Welcome Message

Edit `index.html`:
```html
<div class="welcome-screen">
    <h1>Your Custom Title</h1>
    <p>Your custom message</p>
</div>
```

---

## File Structure Explained

```
teja-ai/
├── index.html          # Main page structure
├── styles.css          # All styling
├── app.js             # UI logic & event handlers
├── api.js             # OpenRouter API integration
├── config.js          # Settings & configuration
├── netlify.toml       # For deployment (not needed locally)
├── README.md          # Documentation
├── DEPLOYMENT_GUIDE.md # Deployment instructions
└── PROJECT_GUIDE.md   # Technical overview
```

**To modify the app:**
- **UI changes**: Edit `index.html` and `styles.css`
- **Logic changes**: Edit `app.js`
- **API changes**: Edit `api.js`
- **Settings**: Edit `config.js`

---

## Common Local Development Tasks

### Test Different Models

1. Open settings
2. Select different model from dropdown
3. Send test message
4. Compare responses

### Test Streaming On/Off

1. Open settings
2. Toggle "Enable Streaming Responses"
3. Test both modes

### Export Chat History

Add this to browser console:
```javascript
// Export all conversations
const conversations = localStorage.getItem('teja_ai_conversations');
console.log(JSON.parse(conversations));

// Download as JSON
const data = localStorage.getItem('teja_ai_conversations');
const blob = new Blob([data], {type: 'application/json'});
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'chat-history.json';
a.click();
```

### Monitor API Costs

Check OpenRouter dashboard:
https://openrouter.ai/activity

---

## Next Steps

After local testing works:
1. ✅ Make any customizations you want
2. ✅ Test thoroughly locally
3. ✅ Deploy to Netlify (see DEPLOYMENT_GUIDE.md)
4. ✅ Configure teja.ai domain

---

## Getting Help

**Check these first:**
1. Browser console (F12) for errors
2. Network tab for failed requests
3. OpenRouter dashboard for API issues

**Common solutions:**
- Clear browser cache
- Try incognito mode
- Use different browser
- Regenerate API key
- Add credits to OpenRouter

---

## Summary: Fastest Way to Run Locally

```bash
# 1. Extract ZIP file
# 2. Open terminal in that folder
# 3. Run this command:

python -m http.server 8000

# 4. Open browser: http://localhost:8000
# 5. Click settings, add API key from openrouter.ai
# 6. Start chatting!
```

That's it! 🎉
