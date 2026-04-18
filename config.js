// Configuration for Teja AI

const CONFIG = {
    // Provider API URLs
    OPENROUTER_API_URL: 'https://openrouter.ai/api/v1/chat/completions',
    GEMINI_API_URL: 'https://generativelanguage.googleapis.com/v1beta/models',

    // Your site information
    SITE_URL: 'https://teja.ai',
    SITE_NAME: 'Teja AI',

    // Providers
    PROVIDERS: {
        openrouter: { name: 'OpenRouter', key: 'teja_ai_api_key' },
        gemini:     { name: 'Google Gemini', key: 'teja_ai_gemini_key' }
    },
    DEFAULT_PROVIDER: 'openrouter',

    // Default settings
    DEFAULT_MODEL: 'auto',
    DEFAULT_THEME: 'dark',
    ENABLE_STREAMING: true,

    // Available models
    MODELS: {
    'auto': {
        name: 'Auto (Smart Select)',
        provider: 'Teja AI',
        contextWindow: 0,
        pricing: { prompt: 0, completion: 0 }
    },
    // --- Paid ---
    'anthropic/claude-3.5-haiku': {
        name: 'Claude 3.5 Haiku',
        provider: 'Anthropic',
        contextWindow: 200000,
        pricing: { prompt: 0.0008, completion: 0.004 }
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
    },
    // --- Free ---
    'meta-llama/llama-3.3-70b-instruct:free': {
        name: 'Llama 3.3 70B (Free)',
        provider: 'Meta',
        contextWindow: 131072,
        pricing: { prompt: 0, completion: 0 }
    },
    'meta-llama/llama-3.2-3b-instruct:free': {
        name: 'Llama 3.2 3B (Free)',
        provider: 'Meta',
        contextWindow: 131072,
        pricing: { prompt: 0, completion: 0 }
    },
    'qwen/qwen3-coder:free': {
        name: 'Qwen3 Coder (Free)',
        provider: 'Qwen',
        contextWindow: 32768,
        pricing: { prompt: 0, completion: 0 }
    },
    'qwen/qwen3-next-80b-a3b-instruct:free': {
        name: 'Qwen3 80B (Free)',
        provider: 'Qwen',
        contextWindow: 32768,
        pricing: { prompt: 0, completion: 0 }
    },
    'google/gemma-3-27b-it:free': {
        name: 'Gemma 3 27B (Free)',
        provider: 'Google',
        contextWindow: 8192,
        pricing: { prompt: 0, completion: 0 }
    },
    'google/gemma-3-12b-it:free': {
        name: 'Gemma 3 12B (Free)',
        provider: 'Google',
        contextWindow: 8192,
        pricing: { prompt: 0, completion: 0 }
    },
    'google/gemma-3-4b-it:free': {
        name: 'Gemma 3 4B (Free)',
        provider: 'Google',
        contextWindow: 8192,
        pricing: { prompt: 0, completion: 0 }
    },
    'google/gemma-3n-e4b-it:free': {
        name: 'Gemma 3n E4B (Free)',
        provider: 'Google',
        contextWindow: 8192,
        pricing: { prompt: 0, completion: 0 }
    },
    'google/gemma-3n-e2b-it:free': {
        name: 'Gemma 3n E2B (Free)',
        provider: 'Google',
        contextWindow: 8192,
        pricing: { prompt: 0, completion: 0 }
    },
    'google/gemma-4-26b-a4b-it:free': {
        name: 'Gemma 4 26B (Free)',
        provider: 'Google',
        contextWindow: 8192,
        pricing: { prompt: 0, completion: 0 }
    },
    'google/gemma-4-31b-it:free': {
        name: 'Gemma 4 31B (Free)',
        provider: 'Google',
        contextWindow: 8192,
        pricing: { prompt: 0, completion: 0 }
    },
    'openai/gpt-oss-20b:free': {
        name: 'GPT OSS 20B (Free)',
        provider: 'OpenAI',
        contextWindow: 32768,
        pricing: { prompt: 0, completion: 0 }
    },
    'openai/gpt-oss-120b:free': {
        name: 'GPT OSS 120B (Free)',
        provider: 'OpenAI',
        contextWindow: 32768,
        pricing: { prompt: 0, completion: 0 }
    },
    'nousresearch/hermes-3-llama-3.1-405b:free': {
        name: 'Hermes 3 Llama 405B (Free)',
        provider: 'NousResearch',
        contextWindow: 131072,
        pricing: { prompt: 0, completion: 0 }
    },
    'nvidia/llama-nemotron-embed-vl-1b-v2:free': {
        name: 'Nemotron Embed 1B (Free)',
        provider: 'NVIDIA',
        contextWindow: 8192,
        pricing: { prompt: 0, completion: 0 }
    },
    'nvidia/nemotron-nano-12b-v2-vl:free': {
        name: 'Nemotron Nano 12B (Free)',
        provider: 'NVIDIA',
        contextWindow: 32768,
        pricing: { prompt: 0, completion: 0 }
    },
    'nvidia/nemotron-nano-9b-v2:free': {
        name: 'Nemotron Nano 9B (Free)',
        provider: 'NVIDIA',
        contextWindow: 32768,
        pricing: { prompt: 0, completion: 0 }
    },
    'nvidia/nemotron-3-super-120b-a12b:free': {
        name: 'Nemotron Super 120B (Free)',
        provider: 'NVIDIA',
        contextWindow: 32768,
        pricing: { prompt: 0, completion: 0 }
    },
    'liquid/lfm-2.5-1.2b-thinking:free': {
        name: 'LFM 1.2B Thinking (Free)',
        provider: 'Liquid',
        contextWindow: 32768,
        pricing: { prompt: 0, completion: 0 }
    },
    'liquid/lfm-2.5-1.2b-instruct:free': {
        name: 'LFM 1.2B Instruct (Free)',
        provider: 'Liquid',
        contextWindow: 32768,
        pricing: { prompt: 0, completion: 0 }
    },
    'cognitivecomputations/dolphin-mistral-24b-venice-edition:free': {
        name: 'Dolphin Mistral 24B (Free)',
        provider: 'CognitiveComputations',
        contextWindow: 32768,
        pricing: { prompt: 0, completion: 0 }
    },
    'minimax/minimax-m2.5:free': {
        name: 'MiniMax M2.5 (Free)',
        provider: 'MiniMax',
        contextWindow: 40960,
        pricing: { prompt: 0, completion: 0 }
    },
    'z-ai/glm-4.5-air:free': {
        name: 'GLM 4.5 Air (Free)',
        provider: 'Z-AI',
        contextWindow: 32768,
        pricing: { prompt: 0, completion: 0 }
    },
    'arcee-ai/trinity-large-preview:free': {
        name: 'Trinity Large (Free)',
        provider: 'Arcee AI',
        contextWindow: 32768,
        pricing: { prompt: 0, completion: 0 }
    }
},
    // Gemini models
    GEMINI_MODELS: {
        'auto': { name: 'Auto (Smart Select)', provider: 'Teja AI', contextWindow: 0, pricing: { prompt: 0, completion: 0 } },
        'gemini-2.0-flash': { name: 'Gemini 2.0 Flash', provider: 'Google', contextWindow: 1048576, pricing: { prompt: 0, completion: 0 } },
        'gemini-1.5-flash': { name: 'Gemini 1.5 Flash', provider: 'Google', contextWindow: 1048576, pricing: { prompt: 0, completion: 0 } },
        'gemini-1.5-flash-8b': { name: 'Gemini 1.5 Flash 8B', provider: 'Google', contextWindow: 1048576, pricing: { prompt: 0, completion: 0 } },
        'gemini-1.5-pro': { name: 'Gemini 1.5 Pro', provider: 'Google', contextWindow: 2097152, pricing: { prompt: 0, completion: 0 } },
        'gemini-1.0-pro': { name: 'Gemini 1.0 Pro', provider: 'Google', contextWindow: 32768, pricing: { prompt: 0, completion: 0 } }
    },

    // Local storage keys
    STORAGE_KEYS: {
        API_KEY: 'teja_ai_api_key',
        GEMINI_KEY: 'teja_ai_gemini_key',
        PROVIDER: 'teja_ai_provider',
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

// Auto model selection — picks best model based on message content and provider
function autoSelectModel(message, provider = 'openrouter') {
    const text = message.toLowerCase();
    const isCode = /\b(code|function|bug|error|debug|script|program|class|api|sql|html|css|javascript|python|java|c\+\+|typescript|json|regex|algorithm|array|loop|variable|compile|import|export|async|await)\b/.test(text);
    const isComplex = text.length > 300 || /\b(explain|analyze|compare|summarize|essay|detailed|research|philosophy|math|calculate|proof|strategy|architecture)\b/.test(text);
    const isSimple = text.length < 80 && !isCode && !isComplex;

    if (provider === 'gemini') {
        if (isComplex) return 'gemini-1.5-pro';
        return 'gemini-2.0-flash';
    }
    if (isCode) return 'qwen/qwen3-coder:free';
    if (isSimple) return 'meta-llama/llama-3.2-3b-instruct:free';
    return 'meta-llama/llama-3.3-70b-instruct:free';
}
