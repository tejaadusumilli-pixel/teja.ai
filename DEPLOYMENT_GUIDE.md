# Complete Deployment Guide for Teja.ai

## Prerequisites

- GitHub account
- OpenRouter API key
- Domain name (teja.ai)

---

## Step 1: Get OpenRouter API Key

1. **Sign up at OpenRouter**
   - Go to https://openrouter.ai/
   - Click "Sign In" → "Sign up"
   - Complete registration

2. **Get API Key**
   - Navigate to https://openrouter.ai/keys
   - Click "Create Key"
   - Name it "Teja AI" or similar
   - Copy the key (format: `sk-or-v1-...`)
   - **IMPORTANT**: Save this key securely - you won't see it again!

3. **Add Credits** (Optional but recommended)
   - Go to https://openrouter.ai/credits
   - Add $5-10 to start
   - New accounts often get free credits

---

## Step 2: Setup GitHub Repository

### Option A: Fork This Repository

1. Go to the repository page
2. Click "Fork" button (top right)
3. Choose your account
4. Repository is now in your account

### Option B: Create New Repository

1. Go to https://github.com/new
2. Name: `teja-ai`
3. Visibility: Public (for free hosting) or Private
4. Don't initialize with README (we have one)
5. Click "Create repository"

6. **Upload files**:
   ```bash
   git clone https://github.com/yourusername/teja-ai.git
   cd teja-ai
   
   # Copy all project files here
   
   git add .
   git commit -m "Initial commit: Teja AI chat interface"
   git push origin main
   ```

---

## Step 3: Deploy to Netlify

### Method 1: Netlify UI (Easiest)

1. **Sign up for Netlify**
   - Go to https://netlify.com
   - Click "Sign up" → "GitHub"
   - Authorize Netlify

2. **Import Repository**
   - Click "Add new site" → "Import an existing project"
   - Choose "GitHub"
   - Select your `teja-ai` repository
   - Click on the repository name

3. **Configure Build Settings**
   - Site name: `teja-ai` (or your preferred subdomain)
   - Branch to deploy: `main`
   - Build command: *leave empty*
   - Publish directory: `.`
   - Click "Deploy site"

4. **Wait for Deployment**
   - Usually takes 30-60 seconds
   - You'll get a URL like `teja-ai.netlify.app`

### Method 2: Netlify CLI (Advanced)

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Initialize site
netlify init

# Deploy
netlify deploy --prod
```

---

## Step 4: Configure Custom Domain (teja.ai)

### A. In Netlify Dashboard

1. **Add Domain**
   - Click on your site
   - Go to "Domain settings"
   - Click "Add custom domain"
   - Enter `teja.ai`
   - Click "Verify"

2. **DNS Configuration**
   - Netlify will show DNS records needed
   - Keep this page open

### B. Configure DNS at Domain Registrar

**If using Netlify DNS (Recommended):**

1. Copy nameservers from Netlify
2. Go to your domain registrar (GoDaddy, Namecheap, etc.)
3. Update nameservers to Netlify's
4. Wait 24-48 hours for propagation

**If using External DNS:**

1. Add these records at your DNS provider:

   **For Root Domain (teja.ai):**
   ```
   Type: A
   Name: @
   Value: 75.2.60.5
   TTL: 3600
   ```

   **For www subdomain:**
   ```
   Type: CNAME
   Name: www
   Value: teja-ai.netlify.app
   TTL: 3600
   ```

2. Save changes
3. Return to Netlify and click "Verify DNS configuration"

### C. Enable HTTPS

1. In Netlify, go to "Domain settings"
2. Scroll to "HTTPS"
3. Click "Verify DNS configuration"
4. Click "Provision certificate"
5. Wait 1-2 minutes for SSL activation
6. Enable "Force HTTPS"

---

## Step 5: Test Your Deployment

1. **Open your site**
   - Go to https://teja.ai (or your domain)
   - You should see the welcome screen

2. **Add API Key**
   - Click settings icon (gear)
   - Paste your OpenRouter API key
   - Select model (Claude 3.5 Sonnet recommended)
   - Click "Save Settings"

3. **Test Chat**
   - Type a message: "Hello, introduce yourself"
   - Press Enter or click send
   - You should see AI response streaming in

4. **Test Features**
   - ✅ Streaming responses
   - ✅ Chat history sidebar
   - ✅ New chat creation
   - ✅ Theme toggle
   - ✅ Code formatting
   - ✅ Copy/regenerate buttons

---

## Step 6: Optimize & Monitor

### Performance

1. **Enable Asset Optimization** (Netlify)
   - Go to Build & deploy → Post processing
   - Enable:
     - Bundle CSS
     - Minify CSS
     - Minify JS
     - Compress images

2. **Add Analytics** (Optional)
   - Netlify Analytics: Site settings → Analytics
   - Or add Google Analytics to `index.html`

### Monitoring

1. **Check Deploys**
   - Netlify Dashboard → Deploys
   - See deployment history and logs

2. **Monitor Costs**
   - OpenRouter Dashboard → Usage
   - Track API spending
   - Set spending limits if needed

---

## Alternative: Deploy to GitHub Pages

### Step-by-Step

1. **Enable GitHub Pages**
   ```bash
   # In your repository
   git checkout -b gh-pages
   git push origin gh-pages
   ```

2. **Configure**
   - Go to Settings → Pages
   - Source: `gh-pages` branch
   - Folder: `/` (root)
   - Save

3. **Custom Domain**
   - Add `CNAME` file with `teja.ai`
   - Configure DNS:
     ```
     Type: A
     Name: @
     Value: 185.199.108.153
     Value: 185.199.109.153
     Value: 185.199.110.153
     Value: 185.199.111.153
     ```

4. **Access**
   - Wait 5-10 minutes
   - Visit https://teja.ai

---

## Troubleshooting

### Issue: Site Not Loading

**Check:**
- DNS propagation (use https://dnschecker.org)
- SSL certificate status in Netlify
- Browser cache (try incognito mode)

**Fix:**
- Clear browser cache
- Wait for DNS (can take 24-48 hours)
- Check Netlify deploy logs

### Issue: API Key Not Working

**Check:**
- Key format: `sk-or-v1-...`
- Credits available in OpenRouter
- Browser console for errors

**Fix:**
- Regenerate API key
- Add credits to OpenRouter account
- Check network tab in browser DevTools

### Issue: Streaming Not Working

**Check:**
- Browser compatibility (modern browsers only)
- Network connection
- API response in console

**Fix:**
- Disable streaming in settings
- Try different browser
- Check OpenRouter status page

### Issue: Chat History Not Saving

**Check:**
- localStorage enabled
- Not in incognito mode
- Storage quota not full

**Fix:**
- Enable cookies/storage
- Use normal browser mode
- Clear old data or export chats

---

## Cost Optimization Tips

1. **Use Cheaper Models for Simple Tasks**
   - Llama 3 70B for basic queries
   - Claude/GPT-4 for complex tasks

2. **Monitor Usage**
   - Set up OpenRouter usage alerts
   - Review monthly spending

3. **Free Hosting**
   - Netlify: 100GB bandwidth/month free
   - GitHub Pages: unlimited for public repos

---

## Next Steps

### Add Features

1. **Image Upload** - Let users send images
2. **Voice Input** - Speech-to-text
3. **Export/Import** - Backup conversations
4. **Prompt Templates** - Quick-start prompts
5. **Multi-user** - Add authentication

### Customization

1. **Branding**
   - Add logo to `assets/` folder
   - Update colors in `styles.css`
   - Modify welcome message

2. **Additional Models**
   - Add more models in `config.js`
   - Create model presets

3. **Advanced Features**
   - Function calling
   - Image generation
   - Document analysis

---

## Support

- **OpenRouter**: https://openrouter.ai/docs
- **Netlify**: https://docs.netlify.com
- **GitHub Issues**: Create issues in your repo

---

## Security Checklist

✅ HTTPS enabled
✅ API key stored client-side only
✅ No backend = no server vulnerabilities
✅ CSP headers configured
✅ XSS protection enabled
✅ Regular dependency updates (if you add any)

---

**Congratulations!** 🎉

Your Teja AI assistant is now live at https://teja.ai
