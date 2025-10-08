// API service for data management
class ApiService {
    constructor(baseUrl = 'https://localhost:7001/api') {
        this.baseUrl = baseUrl;
    }

    async request(endpoint, options = {}) {
        const url = `${this.baseUrl}${endpoint}`;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                ...options.headers,
            },
            ...options,
        };

        try {
            const response = await fetch(url, config);
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            return await response.json();
        } catch (error) {
            console.error('API request failed:', error);
            throw error;
        }
    }

    // Users API
    async getUsers() {
        return this.request('/users');
    }

    async getUser(id) {
        return this.request(`/users/${id}`);
    }

    async createUser(user) {
        return this.request('/users', {
            method: 'POST',
            body: JSON.stringify(user),
        });
    }

    async updateUser(id, user) {
        return this.request(`/users/${id}`, {
            method: 'PUT',
            body: JSON.stringify(user),
        });
    }

    async deleteUser(id) {
        return this.request(`/users/${id}`, {
            method: 'DELETE',
        });
    }

    // Lessons API
    async getLessons() {
        return this.request('/lessons');
    }

    async getLesson(id) {
        return this.request(`/lessons/${id}`);
    }

    async createLesson(lesson) {
        return this.request('/lessons', {
            method: 'POST',
            body: JSON.stringify(lesson),
        });
    }

    async updateLesson(id, lesson) {
        return this.request(`/lessons/${id}`, {
            method: 'PUT',
            body: JSON.stringify(lesson),
        });
    }

    async deleteLesson(id) {
        return this.request(`/lessons/${id}`, {
            method: 'DELETE',
        });
    }

    // Progress API
    async getProgress() {
        return this.request('/progress');
    }

    async getProgressByUser(userId) {
        return this.request(`/progress/user/${userId}`);
    }

    async getProgressById(id) {
        return this.request(`/progress/${id}`);
    }

    async createProgress(progress) {
        return this.request('/progress', {
            method: 'POST',
            body: JSON.stringify(progress),
        });
    }

    async updateProgress(id, progress) {
        return this.request(`/progress/${id}`, {
            method: 'PUT',
            body: JSON.stringify(progress),
        });
    }

    async deleteProgress(id) {
        return this.request(`/progress/${id}`, {
            method: 'DELETE',
        });
    }
}

// Global API service instance
const apiService = new ApiService();
