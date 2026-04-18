// Configuration for Teja AI

const CONFIG = {
    // OpenRouter API Configuration
    OPENROUTER_API_URL: 'https://openrouter.ai/api/v1/chat/completions',

    // Your site information
    SITE_URL: 'https://teja.ai',
    SITE_NAME: 'Teja AI',

    // Default settings
    DEFAULT_MODEL: 'anthropic/claude-3.5-sonnet',
    DEFAULT_THEME: 'dark',
    ENABLE_STREAMING: true,

    // Available models (current OpenRouter IDs as of 2025)
    MODELS: {
    'anthropic/claude-3.5-sonnet': {
        name: 'Claude 3.5 Sonnet',
        provider: 'Anthropic',
        contextWindow: 200000,
        pricing: { prompt: 0.003, completion: 0.015 }
    },
    'anthropic/claude-3.5-haiku': {
        name: 'Claude 3.5 Haiku',
        provider: 'Anthropic',
        contextWindow: 200000,
        pricing: { prompt: 0.0008, completion: 0.004 }
    },
    'anthropic/claude-3-opus': {
        name: 'Claude 3 Opus',
        provider: 'Anthropic',
        contextWindow: 200000,
        pricing: { prompt: 0.015, completion: 0.075 }
    },
    'openai/gpt-4o': {
        name: 'GPT-4o',
        provider: 'OpenAI',
        contextWindow: 128000,
        pricing: { prompt: 0.0025, completion: 0.01 }
    },
    'openai/gpt-4o-mini': {
        name: 'GPT-4o Mini',
        provider: 'OpenAI',
        contextWindow: 128000,
        pricing: { prompt: 0.00015, completion: 0.0006 }
    },
    'openai/gpt-3.5-turbo': {
        name: 'GPT-3.5 Turbo',
        provider: 'OpenAI',
        contextWindow: 16000,
        pricing: { prompt: 0.0005, completion: 0.0015 }
    },
    'google/gemini-flash-1.5': {
        name: 'Gemini Flash 1.5',
        provider: 'Google',
        contextWindow: 1000000,
        pricing: { prompt: 0.000075, completion: 0.0003 }
    },
    'google/gemini-pro-1.5': {
        name: 'Gemini Pro 1.5',
        provider: 'Google',
        contextWindow: 2000000,
        pricing: { prompt: 0.00125, completion: 0.005 }
    },
    'meta-llama/llama-3.1-8b-instruct': {
        name: 'Llama 3.1 8B',
        provider: 'Meta',
        contextWindow: 131072,
        pricing: { prompt: 0.00006, completion: 0.00006 }
    },
    'meta-llama/llama-3.1-70b-instruct': {
        name: 'Llama 3.1 70B',
        provider: 'Meta',
        contextWindow: 131072,
        pricing: { prompt: 0.0004, completion: 0.0004 }
    }
},
    // Local storage keys
    STORAGE_KEYS: {
        API_KEY: 'teja_ai_api_key',
        CONVERSATIONS: 'teja_ai_conversations',
        CURRENT_CHAT: 'teja_ai_current_chat',
        SETTINGS: 'teja_ai_settings',
        THEME: 'teja_ai_theme'
    },

    // UI Configuration
    MAX_MESSAGE_LENGTH: 10000,
    AUTO_SAVE_INTERVAL: 5000,
    TYPING_INDICATOR_DELAY: 300,

    // System prompts (optional)
    SYSTEM_PROMPT: 'You are a helpful, harmless, and honest AI assistant.',
};

// Utility functions
const Storage = {
    get(key) {
        try {
            const value = localStorage.getItem(key);
            return value ? JSON.parse(value) : null;
        } catch (error) {
            console.error('Storage get error:', error);
            return null;
        }
    },
    
    set(key, value) {
        try {
            localStorage.setItem(key, JSON.stringify(value));
            return true;
        } catch (error) {
            console.error('Storage set error:', error);
            return false;
        }
    },
    
    remove(key) {
        try {
            localStorage.removeItem(key);
            return true;
        } catch (error) {
            console.error('Storage remove error:', error);
            return false;
        }
    }
};

// Theme utilities
const Theme = {
    apply(theme) {
        if (theme === 'auto') {
            const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            theme = isDark ? 'dark' : 'light';
        }
        document.documentElement.setAttribute('data-theme', theme);
        Storage.set(CONFIG.STORAGE_KEYS.THEME, theme);
    },
    
    get() {
        return Storage.get(CONFIG.STORAGE_KEYS.THEME) || CONFIG.DEFAULT_THEME;
    }
};

// Initialize theme
Theme.apply(Theme.get());
