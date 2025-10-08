/**
 * EduConnect - Gamification Module
 * Points, badges, leaderboards, and progress tracking
 */

class GamificationManager {
  constructor(app) {
    this.app = app;
    this.achievements = window.SampleData?.achievements || [];
    this.leaderboard = window.SampleData?.leaderboard || [];
  }

  /**
   * Render leaderboard page
   */
  renderLeaderboard() {
    const mainContent = document.getElementById('main-content');
    const userRank = this.getUserRank();
    
    mainContent.innerHTML = `
      <div class="row">
        <!-- Header -->
        <div class="col-12 mb-4">
          <div class="card border-0 shadow-sm">
            <div class="card-body">
              <div class="row align-items-center">
                <div class="col-md-8">
                  <h2 class="mb-1">
                    <i class="bi bi-trophy text-warning me-2"></i>
                    Leaderboard
                  </h2>
                  <p class="text-muted mb-0">See how you rank among your peers</p>
                </div>
                <div class="col-md-4 text-end">
                  <div class="d-flex align-items-center justify-content-end">
                    <div class="me-3 text-center">
                      <h4 class="mb-0 text-primary">#${userRank}</h4>
                      <small class="text-muted">Your Rank</small>
                    </div>
                    <div class="text-center">
                      <h4 class="mb-0 text-success">${this.app.currentUser?.points || 0}</h4>
                      <small class="text-muted">Your Points</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Time Period Filters -->
        <div class="col-12 mb-4">
          <div class="card border-0 shadow-sm">
            <div class="card-body">
              <div class="row align-items-center">
                <div class="col-md-6">
                  <h6 class="mb-0">Leaderboard Period</h6>
                </div>
                <div class="col-md-6">
                  <div class="btn-group w-100" role="group">
                    <input type="radio" class="btn-check" name="period" id="weekly" checked>
                    <label class="btn btn-outline-primary" for="weekly">Weekly</label>
                    
                    <input type="radio" class="btn-check" name="period" id="monthly">
                    <label class="btn btn-outline-primary" for="monthly">Monthly</label>
                    
                    <input type="radio" class="btn-check" name="period" id="alltime">
                    <label class="btn btn-outline-primary" for="alltime">All Time</label>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Top 3 Podium -->
        <div class="col-12 mb-4">
          <div class="card border-0 shadow-sm">
            <div class="card-body">
              <h5 class="text-center mb-4">Top Performers 🏆</h5>
              <div class="row justify-content-center">
                <!-- 2nd Place -->
                <div class="col-md-3 text-center mb-3">
                  <div class="rank-2 rounded-3 p-3">
                    <div class="mb-2">
                      <span style="font-size: 2rem;">${this.leaderboard[1]?.avatar || '👨‍🎓'}</span>
                    </div>
                    <h5 class="mb-1">${this.leaderboard[1]?.name || 'Student 2'}</h5>
                    <div class="d-flex justify-content-center align-items-center">
                      <span class="badge bg-light text-dark me-2">2nd</span>
                      <strong>${this.leaderboard[1]?.points || 1180}</strong>
                    </div>
                    <small class="text-muted">${this.leaderboard[1]?.streak || 5} day streak</small>
                  </div>
                </div>

                <!-- 1st Place -->
                <div class="col-md-3 text-center mb-3">
                  <div class="rank-1 rounded-3 p-3">
                    <div class="mb-2">
                      <span style="font-size: 2.5rem;">${this.leaderboard[0]?.avatar || '👨‍🎓'}</span>
                    </div>
                    <h5 class="mb-1">${this.leaderboard[0]?.name || 'Top Student'}</h5>
                    <div class="d-flex justify-content-center align-items-center">
                      <span class="badge bg-warning text-dark me-2">1st</span>
                      <strong>${this.leaderboard[0]?.points || 1250}</strong>
                    </div>
                    <small class="text-muted">${this.leaderboard[0]?.streak || 7} day streak</small>
                  </div>
                </div>

                <!-- 3rd Place -->
                <div class="col-md-3 text-center mb-3">
                  <div class="rank-3 rounded-3 p-3">
                    <div class="mb-2">
                      <span style="font-size: 2rem;">${this.leaderboard[2]?.avatar || '👨‍🎓'}</span>
                    </div>
                    <h5 class="mb-1">${this.leaderboard[2]?.name || 'Student 3'}</h5>
                    <div class="d-flex justify-content-center align-items-center">
                      <span class="badge bg-light text-dark me-2">3rd</span>
                      <strong>${this.leaderboard[2]?.points || 1100}</strong>
                    </div>
                    <small class="text-muted">${this.leaderboard[2]?.streak || 9} day streak</small>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Full Leaderboard -->
        <div class="col-12">
          <div class="card border-0 shadow-sm">
            <div class="card-header bg-transparent border-0">
              <h5 class="mb-0">
                <i class="bi bi-list-ol text-primary me-2"></i>
                Complete Rankings
              </h5>
            </div>
            <div class="card-body p-0">
              <div class="list-group list-group-flush">
                ${this.renderLeaderboardList()}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Render leaderboard list
   */
  renderLeaderboardList() {
    return this.leaderboard.map((user, index) => {
      const isCurrentUser = user.name === this.app.currentUser?.name;
      const rankClass = index < 3 ? `rank-${index + 1}` : '';
      
      return `
        <div class="list-group-item leaderboard-item ${isCurrentUser ? 'bg-primary bg-opacity-10' : ''} ${rankClass}">
          <div class="d-flex align-items-center">
            <div class="me-3">
              <div class="d-flex align-items-center justify-content-center rounded-circle" 
                   style="width: 40px; height: 40px; background-color: ${isCurrentUser ? 'var(--primary-color)' : '#f8f9fa'};">
                <span class="fw-bold ${isCurrentUser ? 'text-white' : 'text-dark'}">${user.rank}</span>
              </div>
            </div>
            
            <div class="me-3">
              <span style="font-size: 1.5rem;">${user.avatar}</span>
            </div>
            
            <div class="flex-grow-1">
              <h6 class="mb-0 ${isCurrentUser ? 'text-primary' : ''}">
                ${user.name}
                ${isCurrentUser ? '<span class="badge bg-primary ms-2">You</span>' : ''}
              </h6>
              <small class="text-muted">Level ${user.level} • ${user.streak} day streak</small>
            </div>
            
            <div class="text-end">
              <div class="d-flex align-items-center">
                <span class="badge bg-light text-dark me-2">
                  <i class="bi bi-star-fill text-warning me-1"></i>
                  ${user.points}
                </span>
                ${index < 3 ? `
                  <span class="badge bg-${index === 0 ? 'warning' : index === 1 ? 'secondary' : 'danger'}">
                    ${index === 0 ? '🥇' : index === 1 ? '🥈' : '🥉'}
                  </span>
                ` : ''}
              </div>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  /**
   * Render achievements page
   */
  renderAchievements() {
    const mainContent = document.getElementById('main-content');
    const userAchievements = this.getUserAchievements();
    
    mainContent.innerHTML = `
      <div class="row">
        <!-- Header -->
        <div class="col-12 mb-4">
          <div class="card border-0 shadow-sm">
            <div class="card-body">
              <div class="row align-items-center">
                <div class="col-md-8">
                  <h2 class="mb-1">
                    <i class="bi bi-award text-success me-2"></i>
                    Achievements
                  </h2>
                  <p class="text-muted mb-0">Track your learning milestones and unlock new badges</p>
                </div>
                <div class="col-md-4 text-end">
                  <div class="d-flex align-items-center justify-content-end">
                    <div class="me-3 text-center">
                      <h4 class="mb-0 text-success">${userAchievements.earned.length}</h4>
                      <small class="text-muted">Earned</small>
                    </div>
                    <div class="text-center">
                      <h4 class="mb-0 text-muted">${userAchievements.available.length}</h4>
                      <small class="text-muted">Available</small>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Progress Overview -->
        <div class="col-12 mb-4">
          <div class="card border-0 shadow-sm">
            <div class="card-body">
              <div class="row">
                <div class="col-md-3 text-center mb-3">
                  <div class="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-2" 
                       style="width: 60px; height: 60px;">
                    <i class="bi bi-trophy" style="font-size: 1.5rem;"></i>
                  </div>
                  <h5 class="mb-0">${userAchievements.earned.length}</h5>
                  <small class="text-muted">Total Achievements</small>
                </div>
                <div class="col-md-3 text-center mb-3">
                  <div class="bg-success text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-2" 
                       style="width: 60px; height: 60px;">
                    <i class="bi bi-star" style="font-size: 1.5rem;"></i>
                  </div>
                  <h5 class="mb-0">${this.calculateAchievementPoints(userAchievements.earned)}</h5>
                  <small class="text-muted">Achievement Points</small>
                </div>
                <div class="col-md-3 text-center mb-3">
                  <div class="bg-warning text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-2" 
                       style="width: 60px; height: 60px;">
                    <i class="bi bi-gem" style="font-size: 1.5rem;"></i>
                  </div>
                  <h5 class="mb-0">${this.getRareAchievementsCount(userAchievements.earned)}</h5>
                  <small class="text-muted">Rare Achievements</small>
                </div>
                <div class="col-md-3 text-center mb-3">
                  <div class="bg-info text-white rounded-circle d-inline-flex align-items-center justify-content-center mb-2" 
                       style="width: 60px; height: 60px;">
                    <i class="bi bi-collection" style="font-size: 1.5rem;"></i>
                  </div>
                  <h5 class="mb-0">${this.getCompletedCategories(userAchievements.earned).length}</h5>
                  <small class="text-muted">Categories</small>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Achievement Categories -->
        <div class="col-12 mb-4">
          <div class="card border-0 shadow-sm">
            <div class="card-header bg-transparent border-0">
              <h5 class="mb-0">
                <i class="bi bi-grid text-primary me-2"></i>
                Achievement Categories
              </h5>
            </div>
            <div class="card-body">
              <div class="row">
                ${this.renderAchievementCategories(userAchievements)}
              </div>
            </div>
          </div>
        </div>

        <!-- All Achievements -->
        <div class="col-12">
          <div class="card border-0 shadow-sm">
            <div class="card-header bg-transparent border-0">
              <h5 class="mb-0">
                <i class="bi bi-list-ul text-info me-2"></i>
                All Achievements
              </h5>
            </div>
            <div class="card-body">
              <div class="row">
                ${this.renderAllAchievements(userAchievements)}
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  /**
   * Render achievement categories
   */
  renderAchievementCategories(userAchievements) {
    const categories = this.groupAchievementsByCategory();
    
    return Object.entries(categories).map(([category, achievements]) => {
      const earnedInCategory = achievements.filter(a => userAchievements.earned.includes(a.id));
      const progress = (earnedInCategory.length / achievements.length) * 100;
      
      return `
        <div class="col-md-6 col-lg-4 mb-3">
          <div class="card border-0 shadow-sm h-100">
            <div class="card-body text-center">
              <div class="mb-3">
                <div class="bg-primary text-white rounded-circle d-inline-flex align-items-center justify-content-center" 
                     style="width: 60px; height: 60px;">
                  <i class="bi bi-${this.getCategoryIcon(category)}" style="font-size: 1.5rem;"></i>
                </div>
              </div>
              <h6 class="card-title">${this.formatCategoryName(category)}</h6>
              <p class="card-text small text-muted mb-3">
                ${earnedInCategory.length} of ${achievements.length} earned
              </p>
              <div class="progress mb-3" style="height: 6px;">
                <div class="progress-bar" style="width: ${progress}%"></div>
              </div>
              <small class="text-muted">${Math.round(progress)}% Complete</small>
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  /**
   * Render all achievements
   */
  renderAllAchievements(userAchievements) {
    return this.achievements.map(achievement => {
      const isEarned = userAchievements.earned.includes(achievement.id);
      const isAvailable = userAchievements.available.includes(achievement.id);
      
      return `
        <div class="col-md-6 col-lg-4 mb-3">
          <div class="card border-0 shadow-sm h-100 ${isEarned ? 'border-success' : isAvailable ? 'border-warning' : ''}">
            <div class="card-body text-center">
              <div class="mb-3">
                <div class="badge-earned ${isEarned ? 'bg-success' : isAvailable ? 'bg-warning' : 'bg-light'} text-${isEarned ? 'white' : isAvailable ? 'dark' : 'muted'} rounded-circle d-inline-flex align-items-center justify-content-center" 
                     style="width: 60px; height: 60px; font-size: 1.5rem;">
                  ${achievement.icon}
                </div>
              </div>
              <h6 class="card-title">${achievement.name}</h6>
              <p class="card-text small text-muted mb-3">${achievement.description}</p>
              <div class="d-flex justify-content-between align-items-center mb-2">
                <span class="badge bg-${this.getRarityColor(achievement.rarity)}">${achievement.rarity}</span>
                <span class="badge bg-light text-dark">
                  <i class="bi bi-star-fill text-warning me-1"></i>
                  ${achievement.points}
                </span>
              </div>
              ${isEarned ? `
                <span class="badge bg-success">
                  <i class="bi bi-check-circle me-1"></i>Earned
                </span>
              ` : isAvailable ? `
                <span class="badge bg-warning">
                  <i class="bi bi-clock me-1"></i>Available
                </span>
              ` : `
                <span class="badge bg-secondary">
                  <i class="bi bi-lock me-1"></i>Locked
                </span>
              `}
            </div>
          </div>
        </div>
      `;
    }).join('');
  }

  /**
   * Check and award achievements
   */
  checkAchievements(userId, action, data = {}) {
    const userProgress = this.getUserProgress(userId);
    const earnedAchievements = userProgress.achievements || [];
    const newAchievements = [];

    this.achievements.forEach(achievement => {
      if (earnedAchievements.includes(achievement.id)) return;

      if (this.canEarnAchievement(achievement, userProgress, action, data)) {
        newAchievements.push(achievement);
        this.awardAchievement(userId, achievement);
      }
    });

    return newAchievements;
  }

  /**
   * Award achievement
   */
  awardAchievement(userId, achievement) {
    const userProgress = this.getUserProgress(userId);
    if (!userProgress.achievements) {
      userProgress.achievements = [];
    }
    
    userProgress.achievements.push(achievement.id);
    
    // Award points
    this.awardPoints(userId, achievement.points);
    
    // Show notification
    this.showAchievementNotification(achievement);
    
    // Save progress
    this.saveUserProgress(userId, userProgress);
  }

  /**
   * Show achievement notification
   */
  showAchievementNotification(achievement) {
    const notification = document.createElement('div');
    notification.className = 'toast align-items-center text-white bg-success border-0';
    notification.setAttribute('role', 'alert');
    notification.innerHTML = `
      <div class="d-flex">
        <div class="toast-body">
          <div class="d-flex align-items-center">
            <span class="me-3" style="font-size: 1.5rem;">${achievement.icon}</span>
            <div>
              <strong>Achievement Unlocked!</strong><br>
              <small>${achievement.name} - ${achievement.points} points</small>
            </div>
          </div>
        </div>
        <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
      </div>
    `;
    
    document.body.appendChild(notification);
    new bootstrap.Toast(notification).show();
    
    setTimeout(() => notification.remove(), 5000);
  }

  /**
   * Get user rank
   */
  getUserRank() {
    const userPoints = this.app.currentUser?.points || 0;
    return this.leaderboard.findIndex(user => user.points <= userPoints) + 1 || this.leaderboard.length + 1;
  }

  /**
   * Get user achievements
   */
  getUserAchievements() {
    const userProgress = this.getUserProgress(this.app.currentUser?.id);
    const earned = userProgress?.achievements || [];
    const available = this.achievements.filter(a => !earned.includes(a.id) && this.isAchievementAvailable(a, userProgress));
    
    return { earned, available };
  }

  /**
   * Group achievements by category
   */
  groupAchievementsByCategory() {
    return this.achievements.reduce((groups, achievement) => {
      const category = achievement.category;
      if (!groups[category]) {
        groups[category] = [];
      }
      groups[category].push(achievement);
      return groups;
    }, {});
  }

  /**
   * Get category icon
   */
  getCategoryIcon(category) {
    const icons = {
      subject: 'book',
      engagement: 'heart',
      performance: 'speedometer2',
      exploration: 'compass'
    };
    return icons[category] || 'star';
  }

  /**
   * Format category name
   */
  formatCategoryName(category) {
    return category.charAt(0).toUpperCase() + category.slice(1);
  }

  /**
   * Get rarity color
   */
  getRarityColor(rarity) {
    const colors = {
      common: 'secondary',
      uncommon: 'primary',
      rare: 'warning',
      epic: 'danger',
      legendary: 'dark'
    };
    return colors[rarity] || 'secondary';
  }

  /**
   * Calculate total achievement points
   */
  calculateAchievementPoints(achievements) {
    return achievements.reduce((total, achievementId) => {
      const achievement = this.achievements.find(a => a.id === achievementId);
      return total + (achievement?.points || 0);
    }, 0);
  }

  /**
   * Get rare achievements count
   */
  getRareAchievementsCount(achievements) {
    return achievements.filter(achievementId => {
      const achievement = this.achievements.find(a => a.id === achievementId);
      return achievement && ['rare', 'epic', 'legendary'].includes(achievement.rarity);
    }).length;
  }

  /**
   * Get completed categories
   */
  getCompletedCategories(achievements) {
    const categories = this.groupAchievementsByCategory();
    return Object.entries(categories).filter(([category, categoryAchievements]) => {
      const earnedInCategory = achievements.filter(a => categoryAchievements.some(ca => ca.id === a));
      return earnedInCategory.length === categoryAchievements.length;
    }).map(([category]) => category);
  }

  /**
   * Check if achievement can be earned
   */
  canEarnAchievement(achievement, userProgress, action, data) {
    const requirements = achievement.requirements;
    
    switch (achievement.id) {
      case 'math_master':
        return userProgress.completedLessons >= 10 && userProgress.accuracy >= 90;
      case 'streak_keeper':
        return userProgress.currentStreak >= 7;
      case 'quick_learner':
        return data.timeSpent && data.timeSpent < 10 && data.accuracy >= 80;
      case 'perfectionist':
        return userProgress.consecutivePerfect >= 5;
      case 'explorer':
        return userProgress.subjectsCompleted >= 5;
      default:
        return false;
    }
  }

  /**
   * Check if achievement is available
   */
  isAchievementAvailable(achievement, userProgress) {
    // Simplified logic - in real app, this would check prerequisites
    return true;
  }

  /**
   * Get user progress
   */
  getUserProgress(userId) {
    return window.SampleData?.progressData?.[userId] || {};
  }

  /**
   * Save user progress
   */
  saveUserProgress(userId, progress) {
    // In real app, this would sync with server
    console.log('Saving user progress:', userId, progress);
  }

  /**
   * Award points
   */
  awardPoints(userId, points) {
    if (this.app.currentUser && this.app.currentUser.id === userId) {
      this.app.currentUser.points = (this.app.currentUser.points || 0) + points;
      localStorage.setItem('educonnect_user', JSON.stringify(this.app.currentUser));
    }
  }
}

// Initialize gamification manager
window.gamificationManager = new GamificationManager(window.app);
