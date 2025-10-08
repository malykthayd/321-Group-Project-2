// Offline synchronization functionality
class OfflineSync {
    constructor() {
        this.pendingActions = this.loadPendingActions();
        this.isOnline = navigator.onLine;
        this.setupEventListeners();
    }

    setupEventListeners() {
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.syncPendingActions();
        });

        window.addEventListener('offline', () => {
            this.isOnline = false;
        });
    }

    loadPendingActions() {
        const actions = localStorage.getItem('pendingActions');
        return actions ? JSON.parse(actions) : [];
    }

    savePendingActions() {
        localStorage.setItem('pendingActions', JSON.stringify(this.pendingActions));
    }

    addPendingAction(action) {
        action.id = Date.now() + Math.random();
        action.timestamp = new Date().toISOString();
        this.pendingActions.push(action);
        this.savePendingActions();
    }

    async syncPendingActions() {
        if (!this.isOnline || this.pendingActions.length === 0) {
            return;
        }

        const actionsToSync = [...this.pendingActions];
        this.pendingActions = [];
        this.savePendingActions();

        for (const action of actionsToSync) {
            try {
                await this.executeAction(action);
            } catch (error) {
                console.error('Failed to sync action:', action, error);
                // Re-add failed actions to pending
                this.pendingActions.push(action);
            }
        }

        this.savePendingActions();
    }

    async executeAction(action) {
        switch (action.type) {
            case 'create_user':
                await apiService.createUser(action.data);
                break;
            case 'create_lesson':
                await apiService.createLesson(action.data);
                break;
            case 'create_progress':
                await apiService.createProgress(action.data);
                break;
            case 'update_progress':
                await apiService.updateProgress(action.id, action.data);
                break;
            default:
                throw new Error(`Unknown action type: ${action.type}`);
        }
    }

    // Offline-safe API methods
    async createUserOffline(user) {
        if (this.isOnline) {
            try {
                return await apiService.createUser(user);
            } catch (error) {
                // If online but request fails, queue for later
                this.addPendingAction({
                    type: 'create_user',
                    data: user
                });
                throw error;
            }
        } else {
            // Queue for when back online
            this.addPendingAction({
                type: 'create_user',
                data: user
            });
            
            // Return a mock response for immediate UI feedback
            return {
                id: Date.now(),
                ...user,
                createdAt: new Date().toISOString(),
                offline: true
            };
        }
    }

    async createLessonOffline(lesson) {
        if (this.isOnline) {
            try {
                return await apiService.createLesson(lesson);
            } catch (error) {
                this.addPendingAction({
                    type: 'create_lesson',
                    data: lesson
                });
                throw error;
            }
        } else {
            this.addPendingAction({
                type: 'create_lesson',
                data: lesson
            });
            
            return {
                id: Date.now(),
                ...lesson,
                createdAt: new Date().toISOString(),
                offline: true
            };
        }
    }

    async createProgressOffline(progress) {
        if (this.isOnline) {
            try {
                return await apiService.createProgress(progress);
            } catch (error) {
                this.addPendingAction({
                    type: 'create_progress',
                    data: progress
                });
                throw error;
            }
        } else {
            this.addPendingAction({
                type: 'create_progress',
                data: progress
            });
            
            return {
                id: Date.now(),
                ...progress,
                completedAt: progress.completed ? new Date().toISOString() : null,
                offline: true
            };
        }
    }

    async updateProgressOffline(id, progress) {
        if (this.isOnline) {
            try {
                return await apiService.updateProgress(id, progress);
            } catch (error) {
                this.addPendingAction({
                    type: 'update_progress',
                    id: id,
                    data: progress
                });
                throw error;
            }
        } else {
            this.addPendingAction({
                type: 'update_progress',
                id: id,
                data: progress
            });
            
            return {
                ...progress,
                offline: true
            };
        }
    }

    // Cache management
    async cacheData(key, data) {
        try {
            const cache = await caches.open('lms-data');
            await cache.put(key, new Response(JSON.stringify(data)));
        } catch (error) {
            console.error('Failed to cache data:', error);
        }
    }

    async getCachedData(key) {
        try {
            const cache = await caches.open('lms-data');
            const response = await cache.match(key);
            if (response) {
                return await response.json();
            }
        } catch (error) {
            console.error('Failed to get cached data:', error);
        }
        return null;
    }

    // Offline data access
    async getLessonsOffline() {
        if (this.isOnline) {
            try {
                const lessons = await apiService.getLessons();
                await this.cacheData('/api/lessons', lessons);
                return lessons;
            } catch (error) {
                console.warn('Failed to fetch lessons online, trying cache');
                return await this.getCachedData('/api/lessons') || [];
            }
        } else {
            return await this.getCachedData('/api/lessons') || [];
        }
    }

    async getProgressOffline() {
        if (this.isOnline) {
            try {
                const progress = await apiService.getProgress();
                await this.cacheData('/api/progress', progress);
                return progress;
            } catch (error) {
                console.warn('Failed to fetch progress online, trying cache');
                return await this.getCachedData('/api/progress') || [];
            }
        } else {
            return await this.getCachedData('/api/progress') || [];
        }
    }

    getPendingActionsCount() {
        return this.pendingActions.length;
    }

    getConnectionStatus() {
        return {
            online: this.isOnline,
            pendingActions: this.pendingActions.length
        };
    }

    // Force sync (manual trigger)
    async forceSync() {
        if (this.isOnline) {
            await this.syncPendingActions();
            return true;
        }
        return false;
    }

    // Clear all pending actions (use with caution)
    clearPendingActions() {
        this.pendingActions = [];
        this.savePendingActions();
    }
}

// Global offline sync instance
const offlineSync = new OfflineSync();
