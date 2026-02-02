// Gamified Lesson System with Badges
class GamifiedLesson {
    constructor(lessonId, lessonData) {
        this.lessonId = lessonId;
        this.lessonData = lessonData;
        this.currentQuestionIndex = 0;
        this.score = 0;
        this.totalQuestions = 0;
        this.earnedBadges = [];
    }

    // Generate quiz questions for lesson
    generateQuestions(subject, grade) {
        const questionTemplates = {
            'Math': this.generateMathQuestions(grade),
            'Science': this.generateScienceQuestions(grade),
            'English': this.generateEnglishQuestions(grade),
            'Technology': this.generateTechnologyQuestions(grade),
            'Geography': this.generateGeographyQuestions(grade)
        };

        return questionTemplates[subject] || [];
    }

    // Check answer and award badge
    checkAnswer(questionIndex, selectedAnswer, correctAnswer) {
        const isCorrect = selectedAnswer === correctAnswer;
        
        if (isCorrect) {
            this.score++;
            this.awardBadge();
        }

        return { isCorrect, score: this.score, total: this.totalQuestions, badges: this.earnedBadges };
    }

    // Award badge for correct answer
    awardBadge() {
        const badgeTypes = ['⭐', '🏆', '💎', '🎯', '✅'];
        const randomBadge = badgeTypes[Math.floor(Math.random() * badgeTypes.length)];
        
        if (!this.earnedBadges.includes(randomBadge)) {
            this.earnedBadges.push(randomBadge);
        }

        // Save to localStorage
        this.saveProgress();
    }

    // Save progress
    saveProgress() {
        const progress = {
            lessonId: this.lessonId,
            score: this.score,
            total: this.totalQuestions,
            percentage: (this.score / this.totalQuestions * 100).toFixed(0),
            badges: this.earnedBadges,
            completedAt: new Date().toISOString()
        };

        let allProgress = JSON.parse(localStorage.getItem('lessonProgress') || '[]');
        const existingIndex = allProgress.findIndex(p => p.lessonId === this.lessonId);
        
        if (existingIndex >= 0) {
            allProgress[existingIndex] = progress;
        } else {
            allProgress.push(progress);
        }

        localStorage.setItem('lessonProgress', JSON.stringify(allProgress));
    }

    // Get progress for lesson
    getProgress(lessonId) {
        const allProgress = JSON.parse(localStorage.getItem('lessonProgress') || '[]');
        return allProgress.find(p => p.lessonId === lessonId) || null;
    }

    // Generate question templates
    generateMathQuestions(grade) {
        if (grade <= 2) {
            return [
                { q: 'What is 2 + 3?', options: ['4', '5', '6', '7'], correct: 1 },
                { q: 'Count the apples: 🍎🍎🍎', options: ['2', '3', '4', '5'], correct: 1 },
                { q: 'Which number is bigger: 5 or 3?', options: ['3', '5', 'They are equal', 'None'], correct: 1 }
            ];
        } else if (grade <= 5) {
            return [
                { q: 'What is 7 × 4?', options: ['24', '28', '30', '32'], correct: 1 },
                { q: 'What is 1/2 of 8?', options: ['2', '4', '6', '8'], correct: 1 },
                { q: 'Which fraction is larger: 1/4 or 1/2?', options: ['1/4', '1/2', 'They are equal', 'Cannot tell'], correct: 1 }
            ];
        } else {
            return [
                { q: 'Solve for x: 2x + 5 = 15', options: ['x = 5', 'x = 6', 'x = 7', 'x = 8'], correct: 0 },
                { q: 'What is the area of a rectangle with length 6 and width 4?', options: ['20', '24', '28', '30'], correct: 1 },
                { q: 'What is 15% of 100?', options: ['10', '15', '20', '25'], correct: 1 }
            ];
        }
    }

    generateScienceQuestions(grade) {
        return [
            { q: 'What planet do we live on?', options: ['Mars', 'Earth', 'Venus', 'Jupiter'], correct: 1 },
            { q: 'What process do plants use to make food?', options: ['Photosynthesis', 'Respiration', 'Digestion', 'Fermentation'], correct: 0 },
            { q: 'What are the three states of matter?', options: ['Solid, Liquid, Gas', 'Hot, Warm, Cold', 'Light, Medium, Dark', 'Big, Medium, Small'], correct: 0 }
        ];
    }

    generateEnglishQuestions(grade) {
        return [
            { q: 'Which word is a noun?', options: ['run', 'happy', 'cat', 'quickly'], correct: 2 },
            { q: 'What is the past tense of "go"?', options: ['goed', 'went', 'gone', 'going'], correct: 1 },
            { q: 'Which sentence is correct?', options: ['I are happy', 'I is happy', 'I am happy', 'I be happy'], correct: 2 }
        ];
    }

    generateTechnologyQuestions(grade) {
        return [
            { q: 'What does CPU stand for?', options: ['Central Processing Unit', 'Computer Power Unit', 'Central Program Utility', 'Current Processing Utility'], correct: 0 },
            { q: 'What is the most popular web browser?', options: ['Internet Explorer', 'Chrome', 'Firefox', 'Safari'], correct: 1 },
            { q: 'What is cybersecurity?', options: ['Protecting computers', 'Fixing computers', 'Building websites', 'Designing apps'], correct: 0 }
        ];
    }

    generateGeographyQuestions(grade) {
        return [
            { q: 'How many continents are there?', options: ['5', '6', '7', '8'], correct: 2 },
            { q: 'What is the largest ocean?', options: ['Atlantic', 'Pacific', 'Indian', 'Arctic'], correct: 1 },
            { q: 'What is the capital of France?', options: ['London', 'Berlin', 'Paris', 'Madrid'], correct: 2 }
        ];
    }

    // Display gamified lesson modal
    displayLessonModal(lessonData, userRole = 'guest') {
        const questions = this.generateQuestions(lessonData.subject, parseInt(lessonData.grade) || 1);
        this.totalQuestions = questions.length;

        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.id = `lesson-${this.lessonId}`;
        modal.innerHTML = `
            <div class="modal-dialog modal-lg modal-dialog-scrollable">
                <div class="modal-content">
                    <div class="modal-header bg-primary text-white">
                        <h5 class="modal-title">${lessonData.icon} ${lessonData.title}</h5>
                        <button type="button" class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="alert alert-info mb-3">
                            <div class="d-flex justify-content-between align-items-center">
                                <span><strong>Score: </strong><span id="lessonScore">0</span>/${this.totalQuestions}</span>
                                <span><strong>Badges Earned: </strong><span id="lessonBadges"></span></span>
                            </div>
                        </div>

                        <div id="lessonContent">
                            ${lessonData.content}
                        </div>

                        <div id="quizSection" class="mt-4">
                            <h5 class="mb-3"><i class="bi bi-question-circle me-2"></i>Quiz</h5>
                            ${questions.map((q, i) => `
                                <div class="card mb-3 question-card" data-question-index="${i}">
                                    <div class="card-body">
                                        <h6>Question ${i + 1}: ${q.q}</h6>
                                        <div class="options">
                                            ${q.options.map((option, j) => `
                                                <div class="form-check mb-2">
                                                    <input class="form-check-input" type="radio" name="question${i}" id="q${i}_${j}" value="${j}">
                                                    <label class="form-check-label" for="q${i}_${j}">
                                                        ${option}
                                                    </label>
                                                </div>
                                            `).join('')}
                                        </div>
                                        <button class="btn btn-primary btn-sm" onclick="gamifiedLesson.checkAnswer(${i})">
                                            Check Answer
                                        </button>
                                        <div class="result mt-2"></div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>

                        <div id="completionSection" style="display: none;" class="text-center mt-4">
                            <h3 class="text-success">🎉 Lesson Complete!</h3>
                            <p>You earned ${this.score}/${this.totalQuestions} points!</p>
                            <div id="finalBadges" class="mb-3"></div>
                            <button class="btn btn-primary" data-bs-dismiss="modal">Close</button>
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        const bsModal = new bootstrap.Modal(modal);
        bsModal.show();

        modal.addEventListener('hidden.bs.modal', () => {
            modal.remove();
        });

        return questions;
    }

    checkAnswer(questionIndex) {
        const questionCard = document.querySelector(`[data-question-index="${questionIndex}"]`);
        const selectedInput = questionCard.querySelector('input:checked');
        
        if (!selectedInput) {
            alert('Please select an answer');
            return;
        }

        const selectedAnswer = parseInt(selectedInput.value);
        const correctAnswer = parseInt(selectedInput.closest('.card').dataset.correct || '0');
        
        const result = this.checkAnswer(questionIndex, selectedAnswer, correctAnswer);
        
        questionCard.querySelector('.result').innerHTML = result.isCorrect ? 
            '<div class="alert alert-success">✅ Correct! You earned a badge!</div>' : 
            '<div class="alert alert-danger">❌ Incorrect. Keep trying!</div>';
        
        // Update score display
        document.getElementById('lessonScore').textContent = this.score;
        
        // Disable inputs
        questionCard.querySelectorAll('input').forEach(input => input.disabled = true);
        questionCard.querySelector('button').disabled = true;

        // Check if all questions answered
        if (this.score === this.totalQuestions) {
            setTimeout(() => {
                document.getElementById('quizSection').style.display = 'none';
                document.getElementById('completionSection').style.display = 'block';
                document.getElementById('finalBadges').innerHTML = this.earnedBadges.join(' ');
            }, 1000);
        }
    }
}

// Global instance
const gamifiedLesson = new GamifiedLesson();

