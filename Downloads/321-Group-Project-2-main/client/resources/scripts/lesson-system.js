// Complete AQE Lesson System - Frontend Integration
class AQELessonSystem {
    constructor() {
        this.apiBaseUrl = 'http://localhost:5001/api';
        this.lessons = this.loadLessons();
    }

    // Load lessons from storage or API
    loadLessons() {
        const cached = localStorage.getItem('aqe_lessons_cache');
        if (cached) {
            return JSON.parse(cached);
        }
        return this.generateLessonsStructure();
    }

    // Generate complete lesson structure (1,460 lessons)
    generateLessonsStructure() {
        const structure = {
            geography: this.generateGeographyLessons(),
            byGrade: {}
        };

        // Generate for K-8 (9 grades)
        for (let grade = 0; grade <= 8; grade++) {
            structure.byGrade[grade] = {
                math: this.generateSubjectLessons('Math', grade, 40),
                science: this.generateSubjectLessons('Science', grade, 40),
                english: this.generateSubjectLessons('English', grade, 40),
                technology: this.generateSubjectLessons('Technology', grade, 40)
            };
        }

        // Cache for performance
        localStorage.setItem('aqe_lessons_cache', JSON.stringify(structure));
        return structure;
    }

    // Generate Geography lessons (20 lessons, accessible to all grades)
    generateGeographyLessons() {
        const topics = [
            'Continents and Oceans', 'Reading Maps', 'Latitude and Longitude',
            'Climate Zones', 'Natural Resources', 'Cultural Landmarks',
            'Mountain Ranges', 'Rivers of the World', 'Deserts and Rainforests',
            'Countries and Capitals', 'Time Zones', 'Biomes and Ecosystems',
            'World Populations', 'Economic Systems', 'Political Geography',
            'Physical Geography', 'Transportation Networks', 'Urban and Rural Areas',
            'Global Warming', 'Conservation'
        ];

        return topics.map((topic, index) => ({
            id: `geo-${index + 1}`,
            title: topic,
            subject: 'Geography',
            grade: 'All Grades',
            difficulty: ['Easy', 'Intermediate', 'Hard'][index % 3],
            objective: `Understand ${topic.toLowerCase()} and their global significance`,
            timeMinutes: 15,
            badgeAwarded: 'GLOBAL_EXPLORER',
            sections: this.generateLessonSections(topic, 'Geography', 'All'),
            game: this.generateMiniGame('Geography', topic),
            vocabulary: this.generateVocabulary('Geography', topic)
        }));
    }

    // Generate subject lessons
    generateSubjectLessons(subject, grade, count) {
        const topics = this.getSubjectTopics(subject, grade);
        return topics.slice(0, count).map((topic, index) => ({
            id: `${subject.toLowerCase()}-g${grade}-${index + 1}`,
            title: topic,
            subject,
            grade,
            difficulty: ['Easy', 'Intermediate', 'Hard'][index % 3],
            objective: this.generateObjective(subject, topic, grade),
            timeMinutes: 20 + (index % 10),
            badgeAwarded: this.getBadgeForLesson(subject),
            sections: this.generateLessonSections(topic, subject, grade),
            game: this.generateMiniGame(subject, topic),
            vocabulary: this.generateVocabulary(subject, topic),
            adaptive: true,
            offlineReady: true
        }));
    }

    getSubjectTopics(subject, grade) {
        const topics = {
            Math: [
                'Counting Basics', 'Addition', 'Subtraction', 'Multiplication Tables',
                'Division', 'Fractions', 'Decimals', 'Geometry Shapes',
                'Area and Perimeter', 'Time and Money', 'Graphs and Charts',
                'Word Problems', 'Number Patterns', 'Place Value', 'Algebra Basics',
                'Statistics', 'Percentages', 'Ratio and Proportion', 'Coordinate Planes',
                'Probability', 'Complex Equations', 'Advanced Geometry',
                'Trigonometry Basics', 'Data Analysis', 'Financial Math',
                'Linear Equations', 'Quadratic Equations', 'Functions and Graphs',
                'Inequalities', 'Polynomials', 'Exponents and Roots',
                'Sequences', 'Series', 'Mathematical Logic', 'Advanced Statistics',
                'Calculus Intro', 'Optimization', 'Advanced Data Analysis'
            ],
            Science: [
                'Scientific Method', 'Living Things', 'Human Body Systems',
                'Plants and Animals', 'Weather and Climate', 'States of Matter',
                'Forces and Motion', 'Earth and Space', 'Energy and Electricity',
                'Environmental Science', 'Cells and Microorganisms', 'Ecosystems',
                'Chemical Reactions', 'Atomic Structure', 'Periodic Table',
                'Light and Sound', 'Electricity and Magnetism', 'Simple Machines',
                'Rocks and Minerals', 'Water Cycle', 'Food Chains',
                'Adaptation', 'Genetics Basics', 'Evolution', 'Conservation',
                'Organic Chemistry', 'Nuclear Science', 'Advanced Physics',
                'Biochemistry', 'Engineering Principles', 'Climate Science',
                'Renewable Energy', 'Space Exploration', 'Medical Science',
                'Computer Science', 'Artificial Intelligence', 'Robotics',
                'Nanotechnology', 'Biotechnology', 'Sustainable Living'
            ],
            English: [
                'Phonics', 'Letter Recognition', 'Reading Comprehension',
                'Vocabulary Building', 'Grammar Basics', 'Writing Sentences',
                'Story Elements', 'Poetry and Prose', 'Research Skills',
                'Communication', 'Parts of Speech', 'Punctuation',
                'Creative Writing', 'Persuasive Writing', 'Literary Analysis',
                'Critical Thinking', 'Media Literacy', 'Public Speaking',
                'Essay Writing', 'Argumentation', 'Literary Devices',
                'Character Development', 'Plot Structure', 'Themes and Motifs',
                'Classic Literature', 'Modern Literature', 'Drama',
                'Linguistics', 'Advanced Grammar', 'Composition Skills',
                'Editing and Revising', 'Digital Literacy', 'Research Methods',
                'Citation and Bibliography', 'Academic Writing', 'Creative Expression',
                'Language Arts', 'Communication Strategies', 'Multimedia Skills'
            ],
            Technology: [
                'Computer Basics', 'Internet Safety', 'Typing Skills',
                'Word Processing', 'Presentations', 'Spreadsheets',
                'Digital Citizenship', 'Online Research', 'Media Creation',
                'Coding Basics', 'Problem Solving', 'Logical Thinking',
                'Programming Concepts', 'Web Development', 'App Design',
                'Database Basics', 'Network Security', 'Cloud Computing',
                'Data Visualization', 'Artificial Intelligence', 'Machine Learning',
                'Cybersecurity', 'Software Engineering', 'System Design',
                'Mobile App Development', 'Game Development', 'VR and AR',
                'Blockchain Basics', 'IoT (Internet of Things)', 'Robotics Programming',
                'Data Science', 'Algorithm Design', 'Computer Architecture',
                'Operating Systems', 'Compilers', 'Advanced Programming',
                'Tech Ethics', 'Future Technologies', 'Innovation and Design'
            ]
        };
        return topics[subject] || [];
    }

    generateLessonSections(topic, subject, grade) {
        return {
            priorKnowledge: {
                type: 'warm-up',
                question: `What do you already know about ${topic}?`,
                timeLimit: 2
            },
            directInstruction: {
                type: 'content',
                content: this.generateInstructionContent(topic, subject, grade),
                duration: 5
            },
            guidedPractice: {
                type: 'practice',
                questions: this.generateGuidedQuestions(topic, subject, grade),
                hints: true
            },
            independent: {
                type: 'independent',
                exercises: this.generateIndependentExercises(topic, subject, grade),
                timeLimit: 10
            },
            mastery: {
                type: 'assessment',
                questions: this.generateMasteryCheck(topic, subject, grade),
                passScore: 70
            },
            challenge: {
                type: 'extension',
                task: this.generateChallengeTask(topic, subject, grade),
                optional: true
            },
            parentConnection: {
                type: 'home',
                activity: this.generateParentActivity(topic, subject, grade)
            }
        };
    }

    generateInstructionContent(topic, subject, grade) {
        return `In this lesson, we'll explore ${topic}. This is important for your understanding of ${subject}.`;
    }

    generateGuidedQuestions(topic, subject, grade) {
        return [
            { q: `What is the main concept of ${topic}?`, type: 'mcq', options: ['Option A', 'Option B', 'Option C', 'Option D'], correct: 0 },
            { q: `Can you explain ${topic} in your own words?`, type: 'short_text' }
        ];
    }

    generateIndependentExercises(topic, subject, grade) {
        return [
            { type: 'drag-drop', description: `Match concepts related to ${topic}` },
            { type: 'matching', items: 5 }
        ];
    }

    generateMasteryCheck(topic, subject, grade) {
        return [
            { q: `What is ${topic}?`, type: 'mcq', points: 33 },
            { q: `Why is ${topic} important?`, type: 'short_text', points: 34 },
            { q: `Apply ${topic} to a real situation`, type: 'application', points: 33 }
        ];
    }

    generateChallengeTask(topic, subject, grade) {
        return `Create a project that demonstrates your understanding of ${topic}.`;
    }

    generateParentActivity(topic, subject, grade) {
        return `At home, discuss ${topic} with your child. Ask them to explain what they learned.`;
    }

    generateMiniGame(subject, topic) {
        const gameTypes = ['timed', 'match', 'memory', 'dragdrop', 'conceptmap'];
        return {
            type: gameTypes[Math.floor(Math.random() * gameTypes.length)],
            config: {
                timeLimit: 60,
                scoreTarget: 80,
                difficulty: 'adaptive'
            }
        };
    }

    generateVocabulary(subject, topic) {
        return ['concept', 'understand', 'apply', 'analyze'].map(word => ({
            word,
            definition: `Definition for ${word}`,
            example: `Example sentence using ${word}`
        }));
    }

    generateObjective(subject, topic, grade) {
        return `Students will understand and apply concepts of ${topic} in ${subject} at Grade ${grade} level.`;
    }

    getBadgeForLesson(subject) {
        const badges = {
            'Math': 'NUMBER_MASTER',
            'Science': 'SCIENCE_EXPLORER',
            'English': 'WORD_WIZARD',
            'Technology': 'CODE_CHAMP',
            'Geography': 'GLOBAL_EXPLORER'
        };
        return badges[subject] || 'LEARNING_BEGINNER';
    }

    // Render lesson in dashboard
    renderLessonCard(lesson) {
        return `
            <div class="lesson-card" onclick="lessonSystem.openLesson('${lesson.id}')">
                <div class="lesson-level-badge">${lesson.difficulty}</div>
                <div class="lesson-icon">📖</div>
                <h6 class="mb-2">${lesson.title}</h6>
                <p class="text-muted small mb-2">${lesson.objective}</p>
                <div class="d-flex justify-content-between align-items-center mb-2">
                    <span class="badge bg-primary">${lesson.subject}</span>
                    <span class="badge bg-info">${lesson.timeMinutes} min</span>
                </div>
                <div class="progress-bar-container">
                    <div class="progress-bar-fill" style="width: 0%"></div>
                </div>
            </div>
        `;
    }

    // Open lesson
    openLesson(lessonId) {
        const lesson = this.findLesson(lessonId);
        if (!lesson) return;

        // Show lesson modal with all sections
        this.displayLessonModal(lesson);
    }

    findLesson(lessonId) {
        // Search in geography
        if (this.lessons.geography) {
            const geo = this.lessons.geography.find(l => l.id === lessonId);
            if (geo) return geo;
        }

        // Search in grade-specific lessons
        for (const grade in this.lessons.byGrade) {
            for (const subject in this.lessons.byGrade[grade]) {
                const lesson = this.lessons.byGrade[grade][subject].find(l => l.id === lessonId);
                if (lesson) return lesson;
            }
        }
        return null;
    }

    displayLessonModal(lesson) {
        const modal = document.createElement('div');
        modal.className = 'modal fade';
        modal.innerHTML = `
            <div class="modal-dialog modal-xl">
                <div class="modal-content">
                    <div class="modal-header bg-primary text-white">
                        <h5>${lesson.icon} ${lesson.title}</h5>
                        <button class="btn-close btn-close-white" data-bs-dismiss="modal"></button>
                    </div>
                    <div class="modal-body">
                        <div class="lesson-viewer">
                            ${this.renderLessonSection(lesson, 'priorKnowledge')}
                            ${this.renderLessonSection(lesson, 'directInstruction')}
                            ${this.renderLessonSection(lesson, 'guidedPractice')}
                            ${this.renderLessonSection(lesson, 'independent')}
                            ${this.renderLessonSection(lesson, 'mastery')}
                        </div>
                    </div>
                </div>
            </div>
        `;

        document.body.appendChild(modal);
        const bsModal = new bootstrap.Modal(modal);
        bsModal.show();
    }

    renderLessonSection(lesson, sectionKey) {
        const section = lesson.sections?.[sectionKey];
        if (!section) return '';

        return `
            <div class="card mb-3">
                <div class="card-header">${sectionKey}</div>
                <div class="card-body">${JSON.stringify(section)}</div>
            </div>
        `;
    }
}

// Global instance
const lessonSystem = new AQELessonSystem();

