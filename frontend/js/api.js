const API_URL = 'http://localhost:8000';

const api = {
    async request(endpoint, options = {}) {
        const token = localStorage.getItem('token');
        const headers = {
            'Content-Type': 'application/json',
            ...options.headers
        };
        
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        
        const response = await fetch(`${API_URL}${endpoint}`, {
            ...options,
            headers
        });
        
        if (response.status === 401) {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = '/login.html';
            return null;
        }
        
        return response;
    },
    
    async get(endpoint) {
        const res = await this.request(endpoint);
        if (res && res.ok) return res.json();
        return null;
    },
    
    async post(endpoint, data) {
        const res = await this.request(endpoint, {
            method: 'POST',
            body: JSON.stringify(data)
        });
        if (res && res.ok) return res.json();
        throw new Error(await res?.text());
    },
    
    async put(endpoint, data) {
        const res = await this.request(endpoint, {
            method: 'PUT',
            body: JSON.stringify(data)
        });
        if (res && res.ok) return res.json();
        return null;
    },
    
    async delete(endpoint) {
        const res = await this.request(endpoint, { method: 'DELETE' });
        return res && res.ok;
    }
};