// Main Application Logic

class TejaAI {
    constructor() {
        this.api = new OpenRouterAPI();
        this.conversations = new ConversationManager();
        this.isProcessing = false;

        this.initializeElements();
        this.populateModelSelectors();
        this.attachEventListeners();
        this.loadSettings();
        this.renderChatHistory();
        this.renderCurrentChat();
        this._seedDefaultProjects();
    }

    initializeElements() {
        this.messageInput = document.getElementById('messageInput');
        this.sendBtn = document.getElementById('sendBtn');

        this.messagesContainer = document.getElementById('messages');
        this.welcomeScreen = document.getElementById('welcomeScreen');
        this.chatHistory = document.getElementById('chatHistory');

        this.settingsModal = document.getElementById('settingsModal');
        this.settingsBtn = document.getElementById('settingsBtn');
        this.closeSettingsBtn = document.getElementById('closeSettingsBtn');
        this.apiKeyInput = document.getElementById('apiKeyInput');
        this.modelSelect = document.getElementById('modelSelect');
        this.modelSelectInline = document.getElementById('modelSelectInline');
        this.themeSelect = document.getElementById('themeSelect');
        this.streamingToggle = document.getElementById('streamingToggle');
        this.saveSettingsBtn = document.getElementById('saveSettingsBtn');

        this.newChatBtn = document.getElementById('newChatBtn');
        this.sidebar = document.getElementById('sidebar');
        this.sidebarToggleBtn = document.getElementById('sidebarToggleBtn');

        this.navChats = document.getElementById('navChats');
        this.navProjects = document.getElementById('navProjects');
        this.navArtifacts = document.getElementById('navArtifacts');
        this.navCode = document.getElementById('navCode');
        this.searchBtn = document.getElementById('searchBtn');
    }

    populateModelSelectors() {
        // Populate the inline model selector from CONFIG.MODELS
        this.modelSelectInline.innerHTML = '';
        Object.entries(CONFIG.MODELS).forEach(([id, info]) => {
            const opt = document.createElement('option');
            opt.value = id;
            opt.textContent = info.name;
            this.modelSelectInline.appendChild(opt);
        });
        this.modelSelectInline.value = CONFIG.DEFAULT_MODEL;
    }

    attachEventListeners() {
        this.messageInput.addEventListener('input', () => this.handleInputChange());
        this.messageInput.addEventListener('keydown', (e) => this.handleKeyDown(e));
        this.sendBtn.addEventListener('click', () => this.sendMessage());

        this.settingsBtn.addEventListener('click', () => this.openCustomizePage());
        this.closeSettingsBtn.addEventListener('click', () => this.closeSettings());
        this.saveSettingsBtn.addEventListener('click', () => this.saveSettings());

        this.newChatBtn.addEventListener('click', () => this.createNewChat());

        this.sidebarToggleBtn.addEventListener('click', () => {
            this.sidebar.classList.toggle('collapsed');
        });

        this.navChats.addEventListener('click', () => this.switchPanel('chats'));
        this.navProjects.addEventListener('click', () => this.openProjectsPage());
        this.navArtifacts.addEventListener('click', () => this.switchPanel('artifacts'));
        this.navCode.addEventListener('click', () => this.switchPanel('code'));
        this.searchBtn.addEventListener('click', () => this.switchPanel('search'));

        document.getElementById('newProjectBtn').addEventListener('click', () => this.createProjectFromSidebar());
        document.getElementById('projectsNewBtn').addEventListener('click', () => this.createProjectFromPage());
        document.getElementById('projectsSearchInput').addEventListener('input', (e) => this.renderProjectsGrid(e.target.value));
        document.getElementById('projectsSortSelect').addEventListener('change', () => this.renderProjectsGrid(document.getElementById('projectsSearchInput').value));
        document.getElementById('sidebarSearchInput').addEventListener('input', (e) => this.handleSearch(e.target.value));

        document.getElementById('customizeBackBtn').addEventListener('click', () => this.closeCustomizePage());
        document.getElementById('projectsBackBtn').addEventListener('click', () => this.closeProjectsPage());
        document.querySelectorAll('.customize-nav-item').forEach(btn => {
            btn.addEventListener('click', () => this.switchCustomizeView(btn.dataset.view));
        });
        document.getElementById('cardConnectors').addEventListener('click', () => this.switchCustomizeView('connectors'));
        document.getElementById('cardSkills').addEventListener('click', () => this.switchCustomizeView('skills'));
        document.getElementById('cardSettings').addEventListener('click', () => { this.closeCustomizePage(); this.openSettings(); });

        // Sync inline model selector → settings model selector
        this.modelSelectInline.addEventListener('change', () => {
            const model = this.modelSelectInline.value;
            this.api.setModel(model);
            this.modelSelect.value = model;
            this.modelSelectInline.dataset.autoMode = (model === 'auto') ? 'true' : 'false';
            this.saveCurrentSettings();
        });

        // Suggestion chips
        document.querySelectorAll('.chip').forEach(chip => {
            chip.addEventListener('click', (e) => {
                const label = e.currentTarget.textContent.trim();
                this.messageInput.value = label + ': ';
                this.handleInputChange();
                this.messageInput.focus();
            });
        });

        this.settingsModal.addEventListener('click', (e) => {
            if (e.target === this.settingsModal) this.closeSettings();
        });
    }

    handleInputChange() {
        const length = this.messageInput.value.length;
        this.sendBtn.disabled = length === 0 || this.isProcessing;

        this.messageInput.style.height = 'auto';
        this.messageInput.style.height = Math.min(this.messageInput.scrollHeight, 200) + 'px';
    }

    handleKeyDown(e) {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            if (!this.sendBtn.disabled) this.sendMessage();
        }
    }

    async sendMessage() {
        const message = this.messageInput.value.trim();
        if (!message || this.isProcessing) return;

        if (!this.api.getApiKey()) {
            alert('Please set your OpenRouter API key in settings first.');
            this.openSettings();
            return;
        }

        this.isProcessing = true;
        this.sendBtn.disabled = true;

        if (this.welcomeScreen) {
            this.welcomeScreen.style.display = 'none';
        }

        this.conversations.addMessage('user', message);
        this.renderMessage('user', message);

        this.messageInput.value = '';
        this.handleInputChange();

        const typingId = this.showTypingIndicator();

        // Resolve auto model before sending
        let resolvedModel = this.api.model;
        if (resolvedModel === 'auto') {
            resolvedModel = autoSelectModel(message);
            this.api.setModel(resolvedModel);
            // Show which model was auto-selected in the inline selector temporarily
            if (this.modelSelectInline) this.modelSelectInline.title = `Auto selected: ${CONFIG.MODELS[resolvedModel]?.name || resolvedModel}`;
        }

        try {
            const assistantMsg = this.conversations.addMessage('assistant', '');
            const assistantElement = this.renderMessage('assistant', '', assistantMsg.id);

            const messages = this.conversations.getApiMessages();

            await this.api.sendMessage(messages, {
                stream: this.streamingToggle.checked,
                onChunk: (chunk, fullContent) => {
                    this.updateMessageContent(assistantElement, fullContent);
                    this.conversations.updateLastMessage(fullContent);
                }
            });

            // Restore auto mode after send if user had auto selected
            if (this.modelSelectInline?.dataset?.autoMode === 'true') {
                this.api.setModel('auto');
                this.modelSelectInline.value = 'auto';
            }

            this.renderChatHistory();
        } catch (error) {
            console.error('Send message error:', error);
            this.renderMessage('assistant', `Error: ${error.message}`);
            const chat = this.conversations.getCurrentChat();
            chat.messages.pop();
            this.conversations.save();
        } finally {
            this.removeTypingIndicator(typingId);
            this.isProcessing = false;
            this.sendBtn.disabled = false;
            this.messageInput.focus();
        }
    }

    renderMessage(role, content, messageId = null) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${role}`;
        if (messageId) messageDiv.dataset.messageId = messageId;

        const avatar = role === 'user' ? 'T' : '✳';
        const roleName = role === 'user' ? 'You' : 'Teja AI';

        messageDiv.innerHTML = `
            <div class="message-header">
                <div class="message-avatar">${avatar}</div>
                <div class="message-role">${roleName}</div>
            </div>
            <div class="message-content">${this.formatContent(content)}</div>
            ${role === 'assistant' ? `
                <div class="message-actions">
                    <button class="message-action-btn copy-btn">Copy</button>
                    <button class="message-action-btn regenerate-btn">Regenerate</button>
                </div>
            ` : ''}
        `;

        if (role === 'assistant') {
            messageDiv.querySelector('.copy-btn').addEventListener('click', () => this.copyMessage(content));
            messageDiv.querySelector('.regenerate-btn').addEventListener('click', () => this.regenerateMessage());
        }

        this.messagesContainer.appendChild(messageDiv);
        this.scrollToBottom();
        return messageDiv;
    }

    updateMessageContent(element, content) {
        element.querySelector('.message-content').innerHTML = this.formatContent(content);
        this.scrollToBottom();
    }

    formatContent(content) {
        if (!content) return '';

        return content
            .replace(/```(\w+)?\n([\s\S]*?)```/g, (_, lang, code) =>
                `<pre><code class="language-${lang || 'text'}">${this.escapeHtml(code)}</code></pre>`)
            .replace(/`([^`]+)`/g, '<code>$1</code>')
            .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.+?)\*/g, '<em>$1</em>')
            .replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2" target="_blank" rel="noopener">$1</a>')
            .replace(/\n/g, '<br>');
    }

    escapeHtml(text) {
        return text.replace(/[&<>"']/g, c => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;' }[c]));
    }

    showTypingIndicator() {
        const typingId = 'typing-' + Date.now();
        const typingDiv = document.createElement('div');
        typingDiv.id = typingId;
        typingDiv.className = 'message assistant';
        typingDiv.innerHTML = `
            <div class="message-header">
                <div class="message-avatar">✳</div>
                <div class="message-role">Teja AI</div>
            </div>
            <div class="typing-indicator">
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
                <div class="typing-dot"></div>
            </div>
        `;
        this.messagesContainer.appendChild(typingDiv);
        this.scrollToBottom();
        return typingId;
    }

    removeTypingIndicator(typingId) {
        document.getElementById(typingId)?.remove();
    }

    scrollToBottom() {
        const container = document.getElementById('chatContainer');
        container.scrollTop = container.scrollHeight;
    }

    copyMessage(content) {
        const text = content.replace(/<[^>]*>/g, '');
        navigator.clipboard.writeText(text).catch(() => {});
    }

    regenerateMessage() {
        const chat = this.conversations.getCurrentChat();
        if (chat.messages.length >= 2) {
            chat.messages.pop();
            const lastUserMessage = chat.messages[chat.messages.length - 1].content;
            this.conversations.save();
            this.renderCurrentChat();
            this.messageInput.value = lastUserMessage;
            this.sendMessage();
        }
    }

    createNewChat() {
        this.conversations.createNewChat();
        this.renderChatHistory();
        this.renderCurrentChat();
    }

    renderChatHistory() {
        this.chatHistory.innerHTML = '';
        const conversations = this.conversations.getAllConversations();
        const currentChatId = this.conversations.currentChatId;
        const projects = this._getProjects();

        const renderChatItem = (chat) => {
            const item = document.createElement('div');
            item.className = 'chat-history-item' + (chat.id === currentChatId ? ' active' : '');
            item.innerHTML = `
                <span class="chat-item-title">${this.escapeHtml(chat.title)}</span>
                <button class="chat-menu-btn" title="More options" data-id="${chat.id}">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor">
                        <circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/>
                    </svg>
                </button>
            `;
            item.querySelector('.chat-item-title').addEventListener('click', () => this.switchChat(chat.id));
            item.querySelector('.chat-menu-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                this.openChatMenu(chat.id, chat.title, e.currentTarget);
            });
            return item;
        };

        // Group chats by project
        const projectsWithChats = projects.filter(p =>
            conversations.some(c => c.projectId === p.id)
        );

        projectsWithChats.forEach(proj => {
            const group = document.createElement('div');
            group.className = 'chat-group';

            const header = document.createElement('div');
            header.className = 'chat-group-header';
            header.innerHTML = `
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
                <span>${this.escapeHtml(proj.name)}</span>
            `;
            header.addEventListener('click', () => group.classList.toggle('collapsed'));
            group.appendChild(header);

            conversations.filter(c => c.projectId === proj.id).forEach(chat => {
                group.appendChild(renderChatItem(chat));
            });

            this.chatHistory.appendChild(group);
        });

        // Unassigned chats
        const unassigned = conversations.filter(c => !c.projectId);
        if (unassigned.length) {
            if (projectsWithChats.length) {
                const label = document.createElement('div');
                label.className = 'sidebar-section-label';
                label.style.marginTop = '8px';
                label.textContent = 'Recents';
                this.chatHistory.appendChild(label);
            }
            unassigned.forEach(chat => this.chatHistory.appendChild(renderChatItem(chat)));
        }

        if (!this._menuOutsideListener) {
            this._menuOutsideListener = (e) => {
                if (!e.target.closest('.chat-dropdown')) this.closeChatMenu();
            };
            document.addEventListener('click', this._menuOutsideListener);
        }
    }

    openChatMenu(chatId, chatTitle, btn) {
        this.closeChatMenu();

        const dropdown = document.createElement('div');
        dropdown.className = 'chat-dropdown';
        dropdown.innerHTML = `
            <button class="dropdown-item" data-action="rename">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
                Rename
            </button>
            <button class="dropdown-item dropdown-item-has-sub" data-action="moveto">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
                Move to
                <svg class="dropdown-chevron" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
            </button>
            <div class="dropdown-submenu" id="moveToSubmenu"></div>
            <button class="dropdown-item dropdown-item-danger" data-action="delete">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
                Delete
            </button>
        `;

        dropdown.querySelector('[data-action="rename"]').addEventListener('click', (e) => {
            e.stopPropagation();
            this.closeChatMenu();
            this.renameChat(chatId, chatTitle);
        });

        dropdown.querySelector('[data-action="moveto"]').addEventListener('click', (e) => {
            e.stopPropagation();
            const submenu = dropdown.querySelector('#moveToSubmenu');
            const isOpen = submenu.classList.toggle('active');
            if (isOpen) {
                const projects = this._getProjects();
                const chat = this.conversations.getAllConversations().find(c => c.id === chatId);
                const currentProjectId = chat?.projectId || null;
                submenu.innerHTML = '';
                const noneItem = document.createElement('button');
                noneItem.className = 'dropdown-item dropdown-subitem' + (!currentProjectId ? ' dropdown-subitem-active' : '');
                noneItem.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg> No project`;
                noneItem.addEventListener('click', (ev) => { ev.stopPropagation(); this.moveChatToProject(chatId, null); this.closeChatMenu(); });
                submenu.appendChild(noneItem);
                if (!projects.length) {
                    const empty = document.createElement('div');
                    empty.className = 'dropdown-subitem-empty';
                    empty.textContent = 'No projects yet';
                    submenu.appendChild(empty);
                } else {
                    projects.forEach(proj => {
                        const item = document.createElement('button');
                        item.className = 'dropdown-item dropdown-subitem' + (currentProjectId === proj.id ? ' dropdown-subitem-active' : '');
                        item.innerHTML = `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg> ${this.escapeHtml(proj.name)}`;
                        item.addEventListener('click', (ev) => { ev.stopPropagation(); this.moveChatToProject(chatId, proj.id); this.closeChatMenu(); });
                        submenu.appendChild(item);
                    });
                }
            }
        });

        dropdown.querySelector('[data-action="delete"]').addEventListener('click', (e) => {
            e.stopPropagation();
            this.closeChatMenu();
            this.deleteChat(chatId);
        });

        // Position dropdown near the button
        document.body.appendChild(dropdown);
        const rect = btn.getBoundingClientRect();
        dropdown.style.top = (rect.bottom + 4) + 'px';
        dropdown.style.left = Math.min(rect.left, window.innerWidth - 180) + 'px';

        this._activeDropdown = dropdown;
    }

    moveChatToProject(chatId, projectId) {
        const chat = this.conversations.conversations.find(c => c.id === chatId);
        if (!chat) return;
        chat.projectId = projectId || null;
        this.conversations.save();
        this.renderChatHistory();
        const proj = projectId ? this._getProjects().find(p => p.id === projectId) : null;
        if (proj) {
            const projects = this._getProjects().map(p => p.id === projectId ? { ...p, updatedAt: Date.now() } : p);
            this._saveProjects(projects);
        }
    }

    closeChatMenu() {
        if (this._activeDropdown) {
            this._activeDropdown.remove();
            this._activeDropdown = null;
        }
    }

    renameChat(chatId, currentTitle) {
        const newTitle = prompt('Rename chat:', currentTitle);
        if (newTitle && newTitle.trim()) {
            const chat = this.conversations.conversations.find(c => c.id === chatId);
            if (chat) {
                chat.title = newTitle.trim();
                this.conversations.save();
                this.renderChatHistory();
            }
        }
    }

    deleteChat(chatId) {
        if (!confirm('Delete this chat?')) return;
        this.conversations.deleteChat(chatId);
        this.renderChatHistory();
        this.renderCurrentChat();
    }

    switchChat(chatId) {
        this.conversations.switchChat(chatId);
        this.renderChatHistory();
        this.renderCurrentChat();
    }

    renderCurrentChat() {
        this.messagesContainer.innerHTML = '';
        const chat = this.conversations.getCurrentChat();

        if (chat.messages.length === 0) {
            this.messagesContainer.innerHTML = `
                <div class="welcome-screen" id="welcomeScreen">
                    <div class="welcome-icon">✳</div>
                    <h1>teja returns!</h1>
                </div>
            `;
            this.welcomeScreen = document.getElementById('welcomeScreen');
        } else {
            chat.messages.forEach(msg => this.renderMessage(msg.role, msg.content, msg.id));
        }
    }

    openCustomizePage() {
        document.getElementById('customizePage').classList.add('active');
        this.switchCustomizeView('skills');
    }

    closeCustomizePage() {
        document.getElementById('customizePage').classList.remove('active');
    }

    switchCustomizeView(view) {
        document.querySelectorAll('.customize-nav-item').forEach(b => b.classList.toggle('active', b.dataset.view === view));
        document.querySelectorAll('.customize-view').forEach(v => v.classList.toggle('active', v.id === 'customizeView' + view.charAt(0).toUpperCase() + view.slice(1)));
    }

    openSettings() {
        this.settingsModal.classList.add('active');
        this.apiKeyInput.value = this.api.getApiKey() || '';
    }

    closeSettings() {
        this.settingsModal.classList.remove('active');
    }

    saveSettings() {
        const apiKey = this.apiKeyInput.value.trim();
        const model = this.modelSelect.value;
        const theme = this.themeSelect.value;

        if (apiKey) this.api.setApiKey(apiKey);

        this.api.setModel(model);
        this.modelSelectInline.value = model;
        Theme.apply(theme);

        Storage.set(CONFIG.STORAGE_KEYS.SETTINGS, {
            model,
            theme,
            streaming: this.streamingToggle.checked
        });

        this.closeSettings();
    }

    saveCurrentSettings() {
        const existing = Storage.get(CONFIG.STORAGE_KEYS.SETTINGS) || {};
        Storage.set(CONFIG.STORAGE_KEYS.SETTINGS, {
            ...existing,
            model: this.modelSelectInline.value
        });
    }

    switchPanel(name) {
        const panels = { chats: 'panelChats', search: 'panelSearch', projects: 'panelProjects', artifacts: 'panelArtifacts', code: 'panelCode' };
        const navMap = { chats: this.navChats, projects: this.navProjects, artifacts: this.navArtifacts, code: this.navCode };

        document.querySelectorAll('.sidebar-panel').forEach(p => p.classList.remove('active'));
        document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));

        document.getElementById(panels[name])?.classList.add('active');
        if (navMap[name]) navMap[name].classList.add('active');

        if (name === 'search') { document.getElementById('sidebarSearchInput').focus(); this.handleSearch(''); }
        if (name === 'projects') this.renderProjects();
        if (name === 'artifacts') this.renderArtifacts(false);
        if (name === 'code') this.renderArtifacts(true);
    }

    handleSearch(query) {
        const q = query.toLowerCase();
        const results = document.getElementById('searchResults');
        const all = this.conversations.getAllConversations();
        const matches = q
            ? all.filter(c => c.title.toLowerCase().includes(q) || c.messages.some(m => m.content.toLowerCase().includes(q)))
            : all;

        results.innerHTML = '';
        if (!matches.length) {
            results.innerHTML = '<div class="panel-empty">No results</div>';
            return;
        }
        matches.forEach(chat => {
            const item = document.createElement('div');
            item.className = 'chat-history-item' + (chat.id === this.conversations.currentChatId ? ' active' : '');
            item.innerHTML = `<span class="chat-item-title">${this.escapeHtml(chat.title)}</span>`;
            item.addEventListener('click', () => { this.switchChat(chat.id); this.switchPanel('chats'); });
            results.appendChild(item);
        });
    }

    _seedDefaultProjects() {
        if (localStorage.getItem('teja_projects_seeded')) return;
        const now = Date.now();
        this._saveProjects([
            { id: String(now - 7200000), name: 'teja ai', desc: '', updatedAt: now - 7200000 },
            { id: String(now - 5184000000), name: 'Mini Note', desc: '', updatedAt: now - 5184000000 },
            { id: String(now - 7776000000), name: 'How to use Teja AI', desc: 'An example project that also doubles as a how-to guide for using Teja AI. Chat with it to learn more about how to get the most out of chatting with Teja AI!', tag: 'Example project', updatedAt: now - 7776000000 }
        ]);
        localStorage.setItem('teja_projects_seeded', '1');
    }

    _getProjects() { return JSON.parse(localStorage.getItem('teja_projects') || '[]'); }
    _saveProjects(p) { localStorage.setItem('teja_projects', JSON.stringify(p)); }

    _timeAgo(ts) {
        const diff = Date.now() - ts;
        const m = Math.floor(diff / 60000), h = Math.floor(diff / 3600000), d = Math.floor(diff / 86400000), mo = Math.floor(diff / 2592000000);
        if (mo >= 1) return mo === 1 ? '1 month ago' : mo + ' months ago';
        if (d >= 1) return d === 1 ? '1 day ago' : d + ' days ago';
        if (h >= 1) return h === 1 ? '1 hour ago' : h + ' hours ago';
        if (m >= 1) return m === 1 ? '1 minute ago' : m + ' minutes ago';
        return 'just now';
    }

    openProjectsPage() {
        document.getElementById('projectsPage').classList.add('active');
        document.getElementById('projectsSearchInput').value = '';
        this.renderProjectsGrid('');
    }

    closeProjectsPage() {
        document.getElementById('projectsPage').classList.remove('active');
    }

    renderProjectsGrid(query) {
        const grid = document.getElementById('projectsGrid');
        const sort = document.getElementById('projectsSortSelect').value;
        let projects = this._getProjects();

        if (query?.trim()) {
            const q = query.toLowerCase();
            projects = projects.filter(p => p.name.toLowerCase().includes(q) || (p.desc || '').toLowerCase().includes(q));
        }

        if (sort === 'name') projects.sort((a, b) => a.name.localeCompare(b.name));
        else if (sort === 'created') projects.sort((a, b) => b.id - a.id);
        else projects.sort((a, b) => (b.updatedAt || b.id) - (a.updatedAt || a.id));

        grid.innerHTML = '';

        if (!projects.length) {
            grid.innerHTML = `<div class="projects-empty">${query ? 'No projects match your search.' : 'No projects yet. Click <strong>+ New project</strong> to create one.'}</div>`;
            return;
        }

        projects.forEach(proj => {
            const card = document.createElement('div');
            card.className = 'project-card';
            card.innerHTML = `
                <div class="project-card-top">
                    <span class="project-card-name">${this.escapeHtml(proj.name)}</span>
                    ${proj.tag ? `<span class="project-card-tag">${this.escapeHtml(proj.tag)}</span>` : ''}
                </div>
                ${proj.desc ? `<div class="project-card-desc">${this.escapeHtml(proj.desc)}</div>` : '<div class="project-card-desc"></div>'}
                <div class="project-card-footer">Updated ${this._timeAgo(proj.updatedAt || parseInt(proj.id))}</div>
                <button class="project-card-menu" data-id="${proj.id}" title="More options">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></svg>
                </button>
            `;
            card.querySelector('.project-card-menu').addEventListener('click', (e) => {
                e.stopPropagation();
                this.openProjectCardMenu(proj.id, e.currentTarget);
            });
            card.addEventListener('click', () => this.openProjectDetail(proj.id));
            grid.appendChild(card);
        });
    }

    openProjectCardMenu(id, btn) {
        this.closeChatMenu();
        const dropdown = document.createElement('div');
        dropdown.className = 'chat-dropdown';
        dropdown.innerHTML = `
            <button class="dropdown-item" data-action="rename">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg> Rename
            </button>
            <button class="dropdown-item dropdown-item-danger" data-action="delete">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M9 6V4h6v2"/></svg> Delete
            </button>
        `;
        dropdown.querySelector('[data-action="rename"]').addEventListener('click', (e) => {
            e.stopPropagation(); this.closeChatMenu();
            const proj = this._getProjects().find(p => p.id === id);
            const name = prompt('Rename project:', proj?.name || '');
            if (!name?.trim()) return;
            const projects = this._getProjects().map(p => p.id === id ? { ...p, name: name.trim(), updatedAt: Date.now() } : p);
            this._saveProjects(projects);
            this.renderProjectsGrid(document.getElementById('projectsSearchInput').value);
            this.renderProjects();
        });
        dropdown.querySelector('[data-action="delete"]').addEventListener('click', (e) => {
            e.stopPropagation(); this.closeChatMenu();
            if (!confirm('Delete this project?')) return;
            this._saveProjects(this._getProjects().filter(p => p.id !== id));
            this.renderProjectsGrid(document.getElementById('projectsSearchInput').value);
            this.renderProjects();
        });
        document.body.appendChild(dropdown);
        const rect = btn.getBoundingClientRect();
        dropdown.style.top = (rect.bottom + 4) + 'px';
        dropdown.style.left = Math.min(rect.left, window.innerWidth - 180) + 'px';
        this._activeDropdown = dropdown;
    }

    openProjectDetail(id) {
        const proj = this._getProjects().find(p => p.id === id);
        if (!proj) return;
        alert(`Project: ${proj.name}\n${proj.desc || 'No description.'}`);
    }

    createProjectFromSidebar() {
        const name = prompt('Project name:');
        if (!name?.trim()) return;
        const projects = this._getProjects();
        projects.unshift({ id: Date.now().toString(), name: name.trim(), desc: '', updatedAt: Date.now() });
        this._saveProjects(projects);
        this.renderProjects();
    }

    createProjectFromPage() {
        const name = prompt('Project name:');
        if (!name?.trim()) return;
        const desc = prompt('Description (optional):') || '';
        const projects = this._getProjects();
        projects.unshift({ id: Date.now().toString(), name: name.trim(), desc, updatedAt: Date.now() });
        this._saveProjects(projects);
        this.renderProjectsGrid(document.getElementById('projectsSearchInput').value);
        this.renderProjects();
    }

    renderProjects() {
        const projects = this._getProjects();
        const list = document.getElementById('projectsList');
        list.innerHTML = '';
        if (!projects.length) {
            list.innerHTML = '<div class="panel-empty">No projects yet.<br>Click + to create one.</div>';
            return;
        }
        projects.forEach(proj => {
            const item = document.createElement('div');
            item.className = 'project-item';
            item.innerHTML = `
                <div class="project-icon"><svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg></div>
                <div class="project-info"><div class="project-name">${this.escapeHtml(proj.name)}</div><div class="project-meta">${this._timeAgo(proj.updatedAt || parseInt(proj.id))}</div></div>
                <button class="project-delete-btn" data-id="${proj.id}" title="Delete"><svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 6L6 18M6 6l12 12"/></svg></button>
            `;
            item.querySelector('.project-delete-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                if (!confirm('Delete this project?')) return;
                this._saveProjects(this._getProjects().filter(p => p.id !== proj.id));
                this.renderProjects();
            });
            item.addEventListener('click', (e) => { if (!e.target.closest('.project-delete-btn')) this.openProjectsPage(); });
            list.appendChild(item);
        });
    }

    renderArtifacts(codeOnly) {
        const listEl = document.getElementById(codeOnly ? 'codeList' : 'artifactsList');
        listEl.innerHTML = '';
        const codeBlockRe = /```(\w*)\n([\s\S]*?)```/g;
        const items = [];

        this.conversations.getAllConversations().forEach(chat => {
            chat.messages.filter(m => m.role === 'assistant').forEach(msg => {
                let match;
                codeBlockRe.lastIndex = 0;
                while ((match = codeBlockRe.exec(msg.content)) !== null) {
                    const lang = match[1] || 'text';
                    if (codeOnly && !['js','ts','py','python','java','cpp','c','go','rust','html','css','bash','sh','sql','json','jsx','tsx'].includes(lang)) continue;
                    items.push({ lang, code: match[2].trim(), chatId: chat.id, chatTitle: chat.title });
                }
            });
        });

        if (!items.length) {
            listEl.innerHTML = `<div class="panel-empty">No ${codeOnly ? 'code snippets' : 'artifacts'} yet.</div>`;
            return;
        }

        items.forEach(item => {
            const el = document.createElement('div');
            el.className = 'artifact-item';
            const preview = item.code.split('\n').slice(0, 2).join('\n');
            el.innerHTML = `
                <div class="artifact-header">
                    <span class="artifact-lang">${this.escapeHtml(item.lang)}</span>
                    <span class="artifact-source">${this.escapeHtml(item.chatTitle)}</span>
                </div>
                <pre class="artifact-preview">${this.escapeHtml(preview)}</pre>
            `;
            el.addEventListener('click', () => { this.switchChat(item.chatId); this.switchPanel('chats'); });
            listEl.appendChild(el);
        });
    }

    loadSettings() {
        const settings = Storage.get(CONFIG.STORAGE_KEYS.SETTINGS) || {};

        const model = CONFIG.MODELS[settings.model] ? settings.model : CONFIG.DEFAULT_MODEL;
        this.api.setModel(model);
        this.modelSelect.value = model;
        this.modelSelectInline.value = model;

        if (settings.theme) {
            this.themeSelect.value = settings.theme;
            Theme.apply(settings.theme);
        }

        if (settings.streaming !== undefined) {
            this.streamingToggle.checked = settings.streaming;
        }
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new TejaAI();
});
