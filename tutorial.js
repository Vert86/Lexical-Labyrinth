/**
 * Lexical Labyrinth - Interactive Tutorial
 * Step-by-step guided tutorial to teach game mechanics through play
 */

class TutorialManager {
    constructor(game, ui) {
        this.game = game;
        this.ui = ui;
        this.currentStep = 0;
        this.isActive = false;
        this.tutorialComplete = false;

        // Check if tutorial was already completed
        this.loadTutorialStatus();

        // Tutorial steps with guided play
        this.steps = [
            {
                title: "Welcome to Lexical Labyrinth!",
                message: "Let's learn by playing! This tutorial will guide you through your first puzzle. Click 'Next' to begin.",
                action: "none",
                highlightElements: [],
                showGrid: false
            },
            {
                title: "Meet Your Word Grid",
                message: "Here's a 3x3 grid of words. Your goal is to transform ALL of these words into the target word shown at the top.",
                action: "none",
                highlightElements: ["#tutorial-word-grid", "#tutorial-target-word"],
                showGrid: true
            },
            {
                title: "The Target Word",
                message: "Look at the target: 'I'. Every word in the grid must become 'I'. But how? That's where transformations come in!",
                action: "none",
                highlightElements: ["#tutorial-target-word"],
                showGrid: true
            },
            {
                title: "Your First Transformation",
                message: "Each level has a sequence of transformations. The first one is shown here: 'Delete Suffix -SH'. This will only affect words ending in 'SH'.",
                action: "none",
                highlightElements: ["#tutorial-transformation-display"],
                showGrid: true
            },
            {
                title: "Which Words Will Change?",
                message: "Look at the grid. Which words end in 'SH'? Those are: DISH, FISH, DASH, LASH, and MASH. Only these words will be transformed! The others (MISS, KISS, TOSS, BOSS) will stay the same for now.",
                action: "none",
                highlightElements: ["#tutorial-word-grid", "#tutorial-transformation-display"],
                showGrid: true,
                highlightWords: [0, 1, 2, 3, 4] // Indices of words ending in SH
            },
            {
                title: "Apply the Transformation",
                message: "Now it's your turn! Click the 'Apply Transformation' button to remove the -SH suffix from matching words. Watch what happens!",
                action: "wait_for_transformation",
                highlightElements: ["#tutorial-apply-btn"],
                showGrid: true,
                expectedAction: "apply"
            },
            {
                title: "Words Changed!",
                message: "Great! DISH→DI, FISH→FI, DASH→DA, LASH→LA, MASH→MA. Notice how MISS, KISS, TOSS, and BOSS didn't change? That's because they don't end in 'SH'.",
                action: "none",
                highlightElements: ["#tutorial-word-grid"],
                showGrid: true
            },
            {
                title: "Next Transformation",
                message: "Now we have a new transformation: 'Delete Vowel A'. This will only affect words containing the letter 'A'. Can you spot them?",
                action: "none",
                highlightElements: ["#tutorial-transformation-display"],
                showGrid: true,
                highlightWords: [2, 3, 4] // DA, LA, MA have 'A'
            },
            {
                title: "Your Turn Again",
                message: "Click 'Apply Transformation' to remove the letter 'A' from DA, LA, and MA. Think about what they'll become!",
                action: "wait_for_transformation",
                highlightElements: ["#tutorial-apply-btn"],
                showGrid: true,
                expectedAction: "apply"
            },
            {
                title: "Getting Closer!",
                message: "Nice! DA→D, LA→L, MA→M. We now have different letters, but we still need to transform them all into 'I'.",
                action: "none",
                highlightElements: ["#tutorial-word-grid"],
                showGrid: true
            },
            {
                title: "Final Transformation",
                message: "The last transformation is 'Add Vowel I'. This will add the letter 'I' to ALL words in the grid. This is our chance to reach the target!",
                action: "none",
                highlightElements: ["#tutorial-transformation-display"],
                showGrid: true
            },
            {
                title: "Complete the Puzzle!",
                message: "Apply the final transformation and watch all words become 'I'. You're about to win your first level!",
                action: "wait_for_transformation",
                highlightElements: ["#tutorial-apply-btn"],
                showGrid: true,
                expectedAction: "apply"
            },
            {
                title: "You Did It!",
                message: "Congratulations! All words are now 'I'. You've completed your first puzzle! The key insight: transformations only affect words meeting specific conditions. Understanding these constraints is your strategy!",
                action: "none",
                highlightElements: ["#tutorial-word-grid"],
                showGrid: true
            },
            {
                title: "Power-Ups Help You Strategize",
                message: "As you play, you'll earn power-ups:\n🔮 Sound Peek - See upcoming constraints\n⏪ Rewind - Undo mistakes\n🧮 Morpheme Map - Analyze word structure\n\nUse these to plan your strategy!",
                action: "none",
                highlightElements: [".tutorial-powerups"],
                showGrid: true
            },
            {
                title: "Develop Your Strategy",
                message: "The real challenge: figuring out which words will be affected at each step. There's no 'right way' - experiment, learn patterns, and develop your own approach. Ready to play for real?",
                action: "none",
                highlightElements: [],
                showGrid: true
            }
        ];

        // Tutorial level configuration (same as Level 1)
        this.tutorialLevel = {
            id: 0,
            name: 'Tutorial',
            gridSize: 3,
            targetWord: 'I',
            initialGrid: [
                'DISH', 'FISH', 'DASH',
                'LASH', 'MASH', 'MISS',
                'KISS', 'TOSS', 'BOSS'
            ],
            transformationSequence: [
                'Delete Suffix -SH',
                'Delete Vowel A',
                'Add Vowel I'
            ],
            powerupReward: null,
            difficulty: 'Tutorial'
        };
    }

    /**
     * Start the tutorial
     */
    start() {
        this.isActive = true;
        this.currentStep = 0;

        // Initialize the tutorial level
        this.initTutorialLevel();

        // Show tutorial UI
        this.showCurrentStep();
    }

    /**
     * Initialize tutorial level in game
     */
    initTutorialLevel() {
        const level = this.tutorialLevel;
        this.game.currentLevelId = 0;
        this.game.currentLevel = level;
        this.game.grid = [...level.initialGrid];
        this.game.targetWord = level.targetWord;
        this.game.transformationSequence = [...level.transformationSequence];
        this.game.currentStepIndex = 0;
        this.game.moveCount = 0;
        this.game.history = [];
        this.game.isGameActive = true;
    }

    /**
     * Show current tutorial step
     */
    showCurrentStep() {
        const step = this.steps[this.currentStep];

        // Update tutorial dialog
        document.getElementById('tutorial-title').textContent = step.title;
        document.getElementById('tutorial-message').innerHTML = step.message.replace(/\n/g, '<br>');

        // Update progress
        document.getElementById('tutorial-progress').textContent =
            `Step ${this.currentStep + 1} of ${this.steps.length}`;

        // Show/hide next button based on action
        const nextBtn = document.getElementById('tutorial-next-btn');
        const skipBtn = document.getElementById('tutorial-skip-btn');

        if (step.action === 'wait_for_transformation') {
            nextBtn.style.display = 'none';
        } else {
            nextBtn.style.display = 'block';
        }

        // Show skip button only on first step
        skipBtn.style.display = this.currentStep === 0 ? 'block' : 'none';

        // Update next button text on last step
        if (this.currentStep === this.steps.length - 1) {
            nextBtn.querySelector('span').textContent = 'Start Playing!';
        } else {
            nextBtn.querySelector('span').textContent = 'Next';
        }

        // Show/hide game grid
        const gameView = document.querySelector('.tutorial-game-view');
        if (step.showGrid) {
            gameView.style.display = 'block';
            this.updateTutorialDisplay();
        } else {
            gameView.style.display = 'none';
        }

        // Apply highlights
        this.applyHighlights(step);

        // Highlight specific words if specified
        if (step.highlightWords) {
            this.highlightWords(step.highlightWords);
        } else {
            this.clearWordHighlights();
        }
    }

    /**
     * Update tutorial-specific display elements
     */
    updateTutorialDisplay() {
        // Update target word
        document.getElementById('tutorial-target-word').textContent = this.game.targetWord;

        // Update move counter
        const optimal = this.game.transformationSequence.length;
        document.getElementById('tutorial-move-counter').textContent = `${this.game.moveCount}/${optimal}`;

        // Update word grid
        this.updateTutorialGrid();

        // Update transformation display
        this.updateTutorialTransformation();
    }

    /**
     * Update tutorial word grid
     */
    updateTutorialGrid() {
        const gridElement = document.getElementById('tutorial-word-grid');
        gridElement.innerHTML = '';

        // Set grid size class
        const gridSize = this.game.currentLevel.gridSize;
        gridElement.className = `word-grid grid-${gridSize}x${gridSize}`;

        // Create tiles
        this.game.grid.forEach((word, index) => {
            const tile = document.createElement('div');
            tile.className = 'word-tile';
            tile.textContent = word;
            tile.dataset.index = index;

            // Highlight if it's the target word
            if (word === this.game.targetWord) {
                tile.classList.add('target');
            }

            gridElement.appendChild(tile);
        });
    }

    /**
     * Update tutorial transformation display
     */
    updateTutorialTransformation() {
        const transformation = this.game.getCurrentTransformation();
        const transformationText = document.getElementById('tutorial-transformation-text');
        const constraintHint = document.getElementById('tutorial-constraint-hint');

        if (transformation) {
            transformationText.textContent = transformation;
            const constraint = this.game.getCurrentConstraintDescription();
            constraintHint.textContent = `Constraint: ${constraint}`;
            constraintHint.classList.add('active');
        } else {
            transformationText.textContent = 'Complete!';
            constraintHint.textContent = '';
            constraintHint.classList.remove('active');
        }
    }

    /**
     * Apply visual highlights to elements
     */
    applyHighlights(step) {
        // Remove all existing highlights
        document.querySelectorAll('.tutorial-highlight').forEach(el => {
            el.classList.remove('tutorial-highlight');
        });

        // Add highlights to specified elements
        step.highlightElements.forEach(selector => {
            const elements = document.querySelectorAll(selector);
            elements.forEach(el => {
                el.classList.add('tutorial-highlight');
            });
        });
    }

    /**
     * Highlight specific words in the grid
     */
    highlightWords(indices) {
        const tiles = document.querySelectorAll('#tutorial-word-grid .word-tile');
        tiles.forEach((tile, index) => {
            if (indices.includes(index)) {
                tile.classList.add('tutorial-word-highlight');
            } else {
                tile.classList.remove('tutorial-word-highlight');
            }
        });
    }

    /**
     * Clear word highlights
     */
    clearWordHighlights() {
        document.querySelectorAll('#tutorial-word-grid .tutorial-word-highlight').forEach(el => {
            el.classList.remove('tutorial-word-highlight');
        });
    }

    /**
     * Move to next step
     */
    nextStep() {
        const step = this.steps[this.currentStep];

        // If waiting for action, don't advance
        if (step.action === 'wait_for_transformation') {
            return;
        }

        this.currentStep++;

        // Check if tutorial is complete
        if (this.currentStep >= this.steps.length) {
            this.complete();
            return;
        }

        this.showCurrentStep();
    }

    /**
     * Handle transformation during tutorial
     */
    handleTransformation() {
        const step = this.steps[this.currentStep];

        // If we're waiting for a transformation, advance to next step
        if (step.action === 'wait_for_transformation' && step.expectedAction === 'apply') {
            // Small delay to show the result
            setTimeout(() => {
                this.currentStep++;
                if (this.currentStep >= this.steps.length) {
                    this.complete();
                } else {
                    this.showCurrentStep();
                }
            }, 800);
        }
    }

    /**
     * Skip tutorial
     */
    skip() {
        this.complete();
    }

    /**
     * Complete tutorial
     */
    complete() {
        this.isActive = false;
        this.tutorialComplete = true;
        this.saveTutorialStatus();

        // Clean up highlights
        document.querySelectorAll('.tutorial-highlight').forEach(el => {
            el.classList.remove('tutorial-highlight');
        });
        this.clearWordHighlights();

        // Close tutorial and return to menu
        this.ui.switchToMainMenu();
        this.ui.showToast('Tutorial complete! You\'re ready to play!', 'success');
    }

    /**
     * Check if tutorial should be shown
     */
    shouldShowTutorial() {
        return !this.tutorialComplete;
    }

    /**
     * Save tutorial status
     */
    saveTutorialStatus() {
        try {
            localStorage.setItem('lexical_labyrinth_tutorial', JSON.stringify({
                completed: this.tutorialComplete
            }));
        } catch (e) {
            console.error('Failed to save tutorial status:', e);
        }
    }

    /**
     * Load tutorial status
     */
    loadTutorialStatus() {
        try {
            const saved = localStorage.getItem('lexical_labyrinth_tutorial');
            if (saved) {
                const status = JSON.parse(saved);
                this.tutorialComplete = status.completed || false;
            }
        } catch (e) {
            console.error('Failed to load tutorial status:', e);
        }
    }

    /**
     * Reset tutorial
     */
    reset() {
        this.tutorialComplete = false;
        this.saveTutorialStatus();
    }
}

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.TutorialManager = TutorialManager;
}
