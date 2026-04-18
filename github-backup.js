class GitHubBackup {
    constructor() {
        this.token = localStorage.getItem('teja_github_token') || '';
        this.repo = localStorage.getItem('teja_github_repo') || '';
    }

    setCredentials(token, repo) {
        this.token = token;
        this.repo = repo;
        localStorage.setItem('teja_github_token', token);
        localStorage.setItem('teja_github_repo', repo);
    }

    getCredentials() {
        return { token: this.token, repo: this.repo };
    }

    isConfigured() {
        return !!(this.token && this.repo);
    }

    async _apiRequest(method, path, body = null) {
        const options = {
            method,
            headers: {
                'Authorization': `token ${this.token}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            }
        };
        if (body) options.body = JSON.stringify(body);
        const response = await fetch(`https://api.github.com${path}`, options);
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || `GitHub API error: ${response.status}`);
        return data;
    }

    async testConnection() {
        const data = await this._apiRequest('GET', `/repos/${this.repo}`);
        return { success: true, name: data.full_name };
    }

    _getTodayFilePath() {
        const date = new Date().toISOString().split('T')[0];
        return `backups/backup-${date}.json`;
    }

    async backup(conversations) {
        const filePath = this._getTodayFilePath();
        const content = JSON.stringify({
            timestamp: new Date().toISOString(),
            version: '1.0',
            conversations
        }, null, 2);

        // btoa requires latin1; encodeURIComponent+unescape handles unicode
        const encoded = btoa(unescape(encodeURIComponent(content)));

        // Get existing SHA so GitHub allows an update (not just create)
        let sha = null;
        try {
            const existing = await this._apiRequest('GET', `/repos/${this.repo}/contents/${filePath}`);
            sha = existing.sha;
        } catch (_) { /* file doesn't exist yet — ok */ }

        const body = { message: `Backup ${new Date().toISOString()}`, content: encoded };
        if (sha) body.sha = sha;

        await this._apiRequest('PUT', `/repos/${this.repo}/contents/${filePath}`, body);
        return filePath;
    }

    async listBackups() {
        try {
            const items = await this._apiRequest('GET', `/repos/${this.repo}/contents/backups`);
            return items
                .filter(i => i.name.startsWith('backup-') && i.name.endsWith('.json'))
                .sort((a, b) => b.name.localeCompare(a.name));
        } catch (_) {
            return [];
        }
    }

    async restore(filePath) {
        const data = await this._apiRequest('GET', `/repos/${this.repo}/contents/${filePath}`);
        const decoded = decodeURIComponent(escape(atob(data.content.replace(/\n/g, ''))));
        const parsed = JSON.parse(decoded);
        return parsed.conversations;
    }
}

window.GitHubBackup = GitHubBackup;
