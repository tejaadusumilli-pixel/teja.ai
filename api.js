// OpenRouter API Integration

class OpenRouterAPI {
    constructor() {
        this.apiKey = Storage.get(CONFIG.STORAGE_KEYS.API_KEY);
        this.model = CONFIG.DEFAULT_MODEL;
    }
    
    setApiKey(key) {
        this.apiKey = key;
        Storage.set(CONFIG.STORAGE_KEYS.API_KEY, key);
    }
    
    getApiKey() {
        return this.apiKey;
    }
    
    setModel(model) {
        this.model = model;
    }
    
    async sendMessage(messages, options = {}) {
        if (!this.apiKey) {
            throw new Error('API key not set. Please add your OpenRouter API key in settings.');
        }
        
        const {
            stream = CONFIG.ENABLE_STREAMING,
            temperature = 0.7,
            maxTokens = 4096,
            onChunk = null
        } = options;
        
        const requestBody = {
            model: this.model,
            messages: messages,
            temperature: temperature,
            max_tokens: maxTokens,
            stream: stream
        };
        
        const headers = {
            'Authorization': `Bearer ${this.apiKey}`,
            'HTTP-Referer': CONFIG.SITE_URL,
            'X-Title': CONFIG.SITE_NAME,
            'Content-Type': 'application/json'
        };
        
        try {
            const response = await fetch(CONFIG.OPENROUTER_API_URL, {
                method: 'POST',
                headers: headers,
                body: JSON.stringify(requestBody)
            });
            
            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error?.message || 'API request failed');
            }
            
            if (stream) {
                return await this.handleStreamResponse(response, onChunk);
            } else {
                return await this.handleNormalResponse(response);
            }
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    }
    
    async handleNormalResponse(response) {
        const data = await response.json();
        return {
            content: data.choices[0].message.content,
            usage: data.usage,
            model: data.model
        };
    }
    
    async handleStreamResponse(response, onChunk) {
        const reader = response.body.getReader();
        const decoder = new TextDecoder();
        let fullContent = '';
        
        try {
            while (true) {
                const { done, value } = await reader.read();
                
                if (done) break;
                
                const chunk = decoder.decode(value, { stream: true });
                const lines = chunk.split('\n').filter(line => line.trim() !== '');
                
                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        const data = line.slice(6);
                        
                        if (data === '[DONE]') {
                            continue;
                        }
                        
                        try {
                            const parsed = JSON.parse(data);
                            const content = parsed.choices[0]?.delta?.content;
                            
                            if (content) {
                                fullContent += content;
                                if (onChunk) {
                                    onChunk(content, fullContent);
                                }
                            }
                        } catch (e) {
                            console.warn('Failed to parse chunk:', e);
                        }
                    }
                }
            }
            
            return {
                content: fullContent,
                model: this.model
            };
        } catch (error) {
            console.error('Stream error:', error);
            throw error;
        }
    }
    
    async checkApiKey() {
        try {
            const response = await this.sendMessage([
                { role: 'user', content: 'Hi' }
            ], { 
                stream: false,
                maxTokens: 10
            });
            return true;
        } catch (error) {
            return false;
        }
    }
}

// Conversation Manager
class ConversationManager {
    constructor() {
        this.conversations = Storage.get(CONFIG.STORAGE_KEYS.CONVERSATIONS) || [];
        this.currentChatId = Storage.get(CONFIG.STORAGE_KEYS.CURRENT_CHAT);
    }
    
    createNewChat() {
        const chatId = this.generateId();
        const chat = {
            id: chatId,
            title: 'New Chat',
            messages: [],
            createdAt: Date.now(),
            updatedAt: Date.now()
        };
        
        this.conversations.unshift(chat);
        this.currentChatId = chatId;
        this.save();
        
        return chat;
    }
    
    getCurrentChat() {
        if (!this.currentChatId) {
            return this.createNewChat();
        }
        
        let chat = this.conversations.find(c => c.id === this.currentChatId);
        if (!chat) {
            chat = this.createNewChat();
        }
        
        return chat;
    }
    
    addMessage(role, content) {
        const chat = this.getCurrentChat();
        const message = {
            id: this.generateId(),
            role: role,
            content: content,
            timestamp: Date.now()
        };
        
        chat.messages.push(message);
        chat.updatedAt = Date.now();
        
        // Update chat title based on first user message
        if (chat.messages.length === 1 && role === 'user') {
            chat.title = content.substring(0, 50) + (content.length > 50 ? '...' : '');
        }
        
        this.save();
        return message;
    }
    
    updateLastMessage(content) {
        const chat = this.getCurrentChat();
        if (chat.messages.length > 0) {
            chat.messages[chat.messages.length - 1].content = content;
            chat.updatedAt = Date.now();
            this.save();
        }
    }
    
    deleteChat(chatId) {
        this.conversations = this.conversations.filter(c => c.id !== chatId);
        if (this.currentChatId === chatId) {
            this.currentChatId = this.conversations[0]?.id || null;
        }
        this.save();
    }
    
    switchChat(chatId) {
        this.currentChatId = chatId;
        Storage.set(CONFIG.STORAGE_KEYS.CURRENT_CHAT, chatId);
    }
    
    getApiMessages() {
        const chat = this.getCurrentChat();
        return chat.messages.map(m => ({
            role: m.role,
            content: m.content
        }));
    }
    
    getAllConversations() {
        return this.conversations;
    }
    
    save() {
        Storage.set(CONFIG.STORAGE_KEYS.CONVERSATIONS, this.conversations);
        Storage.set(CONFIG.STORAGE_KEYS.CURRENT_CHAT, this.currentChatId);
    }
    
    generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
    
    exportChat(chatId) {
        const chat = this.conversations.find(c => c.id === chatId);
        if (!chat) return null;
        
        return {
            title: chat.title,
            messages: chat.messages,
            createdAt: new Date(chat.createdAt).toISOString()
        };
    }
}
