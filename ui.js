/**
 * Lexical Labyrinth - UI Manager
 * Handles all UI updates and user interactions
 */

class UIManager {
    constructor(game) {
        this.game = game;
        this.game.ui = this;

        // Cache DOM elements
        this.screens = {
            mainMenu: document.getElementById('main-menu'),
            howToPlay: document.getElementById('how-to-play'),
            levelSelect: document.getElementById('level-select'),
            gameScreen: document.getElementById('game-screen'),
            winScreen: document.getElementById('win-screen'),
            loseScreen: document.getElementById('lose-screen')
        };

        // Game elements
        this.wordGrid = document.getElementById('word-grid');
        this.transformationText = document.getElementById('current-transformation');
        this.constraintHint = document.getElementById('constraint-hint');
        this.moveCounter = document.getElementById('move-counter');
        this.levelNumber = document.getElementById('level-number');
        this.targetWordDisplay = document.getElementById('target-word');
        this.toastContainer = document.getElementById('toast-container');

        // Powerup elements
        this.powerupButtons = {
            peek: document.getElementById('powerup-peek'),
            rewind: document.getElementById('powerup-rewind'),
            morpheme: document.getElementById('powerup-morpheme')
        };

        this.powerupCounts = {
            peek: document.getElementById('peek-count'),
            rewind: document.getElementById('rewind-count'),
            morpheme: document.getElementById('morpheme-count')
        };

        // Panels
        this.peekPanel = document.getElementById('peek-panel');
        this.morphemePanel = document.getElementById('morpheme-panel');

        // Initialize event listeners
        this.initEventListeners();

        // Update powerup counts
        this.updatePowerupCounts();

        // Show main menu
        this.switchToMainMenu();
    }

    /**
     * Initialize all event listeners
     */
    initEventListeners() {
        // Main menu buttons
        document.getElementById('start-game-btn').addEventListener('click', () => {
            this.game.initLevel(this.game.currentLevelId);
            this.switchToGameScreen();
            this.updateAll();
        });

        document.getElementById('how-to-play-btn').addEventListener('click', () => {
            this.switchToScreen('howToPlay');
        });

        document.getElementById('levels-btn').addEventListener('click', () => {
            this.showLevelSelect();
        });

        // How to play
        document.getElementById('close-instructions-btn').addEventListener('click', () => {
            this.switchToMainMenu();
        });

        // Level select
        document.getElementById('close-level-select-btn').addEventListener('click', () => {
            this.switchToMainMenu();
        });

        // Game controls
        document.getElementById('back-to-menu-btn').addEventListener('click', () => {
            if (confirm('Are you sure you want to quit this level?')) {
                this.switchToMainMenu();
            }
        });

        document.getElementById('apply-transformation-btn').addEventListener('click', () => {
            const result = this.game.handleMove();
            if (result) {
                this.updateAll();
            }
        });

        document.getElementById('skip-transformation-btn').addEventListener('click', () => {
            this.game.skipTransformation();
            this.updateAll();
        });

        // Powerup buttons
        this.powerupButtons.peek.addEventListener('click', () => {
            this.game.powerupEffects.activatePeek();
            this.updatePowerupCounts();
        });

        this.powerupButtons.rewind.addEventListener('click', () => {
            this.game.powerupEffects.activateRewind();
            this.updatePowerupCounts();
        });

        this.powerupButtons.morpheme.addEventListener('click', () => {
            this.game.powerupEffects.activateMorpheme();
            this.updatePowerupCounts();
        });

        // Panel close buttons
        document.getElementById('close-peek-btn').addEventListener('click', () => {
            this.hidePeekPanel();
        });

        document.getElementById('close-morpheme-btn').addEventListener('click', () => {
            this.hideMorphemePanel();
            this.game.powerupEffects.deactivateMorpheme();
        });

        // Win screen buttons
        document.getElementById('next-level-btn').addEventListener('click', () => {
            this.game.loadNextLevel();
        });

        document.getElementById('replay-level-btn').addEventListener('click', () => {
            this.game.restartLevel();
            this.switchToGameScreen();
            this.updateAll();
        });

        document.getElementById('win-menu-btn').addEventListener('click', () => {
            this.switchToMainMenu();
        });

        // Lose screen buttons
        document.getElementById('retry-level-btn').addEventListener('click', () => {
            this.game.restartLevel();
            this.switchToGameScreen();
            this.updateAll();
        });

        document.getElementById('lose-menu-btn').addEventListener('click', () => {
            this.switchToMainMenu();
        });
    }

    /**
     * Switch to a screen
     */
    switchToScreen(screenName) {
        Object.values(this.screens).forEach(screen => {
            screen.classList.remove('active');
        });

        if (this.screens[screenName]) {
            this.screens[screenName].classList.add('active');
        }
    }

    /**
     * Switch to main menu
     */
    switchToMainMenu() {
        this.switchToScreen('mainMenu');
        this.updateMainMenuStats();
    }

    /**
     * Switch to game screen
     */
    switchToGameScreen() {
        this.switchToScreen('gameScreen');
    }

    /**
     * Update main menu statistics
     */
    updateMainMenuStats() {
        const stats = this.game.getStats();
        document.getElementById('current-level-display').textContent = stats.currentLevel;
        document.getElementById('best-score-display').textContent = stats.completedLevels;
    }

    /**
     * Show level select screen
     */
    showLevelSelect() {
        this.switchToScreen('levelSelect');

        const levelGrid = document.getElementById('level-grid');
        levelGrid.innerHTML = '';

        const totalLevels = this.game.levelsManager.getTotalLevels();

        for (let i = 1; i <= totalLevels; i++) {
            const button = document.createElement('button');
            button.className = 'level-card';
            button.textContent = i;

            if (this.game.isLevelCompleted(i)) {
                button.classList.add('completed');
            }

            if (!this.game.isLevelUnlocked(i)) {
                button.classList.add('locked');
                button.disabled = true;
                button.textContent = '🔒';
            } else {
                button.addEventListener('click', () => {
                    this.game.initLevel(i);
                    this.switchToGameScreen();
                    this.updateAll();
                });
            }

            levelGrid.appendChild(button);
        }
    }

    /**
     * Update word grid
     */
    updateGrid() {
        this.wordGrid.innerHTML = '';

        // Set grid size class
        const gridSize = this.game.currentLevel.gridSize;
        this.wordGrid.className = `word-grid grid-${gridSize}x${gridSize}`;

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

            // Add click handler for morpheme analysis
            tile.addEventListener('click', () => {
                if (this.game.powerupEffects.morphemeActive) {
                    this.game.powerupEffects.analyzeMorpheme(word);
                }
            });

            this.wordGrid.appendChild(tile);
        });
    }

    /**
     * Update transformation display
     */
    updateTransformationDisplay() {
        const transformation = this.game.getCurrentTransformation();

        if (transformation) {
            this.transformationText.textContent = transformation;
            const constraint = this.game.getCurrentConstraintDescription();
            this.constraintHint.textContent = `Constraint: ${constraint}`;
            this.constraintHint.classList.add('active');
        } else {
            this.transformationText.textContent = 'Complete!';
            this.constraintHint.textContent = '';
            this.constraintHint.classList.remove('active');
        }
    }

    /**
     * Update move counter
     */
    updateMoveCounter() {
        const optimal = this.game.transformationSequence.length;
        this.moveCounter.textContent = `${this.game.moveCount}/${optimal}`;
    }

    /**
     * Update level info
     */
    updateLevelInfo() {
        this.levelNumber.textContent = this.game.currentLevelId;
        this.targetWordDisplay.textContent = this.game.targetWord;
    }

    /**
     * Update powerup counts
     */
    updatePowerupCounts() {
        const counts = this.game.powerups.getAllCounts();

        this.powerupCounts.peek.textContent = counts.peek;
        this.powerupCounts.rewind.textContent = counts.rewind;
        this.powerupCounts.morpheme.textContent = counts.morpheme;

        // Disable buttons if no powerups
        this.powerupButtons.peek.disabled = counts.peek === 0;
        this.powerupButtons.rewind.disabled = counts.rewind === 0 || this.game.history.length === 0;
        this.powerupButtons.morpheme.disabled = counts.morpheme === 0;
    }

    /**
     * Update all UI elements
     */
    updateAll() {
        this.updateGrid();
        this.updateTransformationDisplay();
        this.updateMoveCounter();
        this.updateLevelInfo();
        this.updatePowerupCounts();
    }

    /**
     * Flash transformed tiles
     */
    flashTransformedTiles(indices) {
        indices.forEach(index => {
            const tile = this.wordGrid.querySelector(`[data-index="${index}"]`);
            if (tile) {
                tile.classList.add('transformed');
                setTimeout(() => {
                    tile.classList.remove('transformed');
                }, 600);
            }
        });
    }

    /**
     * Show toast notification
     */
    showToast(message, type = 'info') {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;

        const icons = {
            success: '✓',
            error: '✗',
            warning: '⚠',
            info: 'ℹ'
        };

        toast.innerHTML = `
            <span class="toast-icon">${icons[type] || icons.info}</span>
            <span class="toast-message">${message}</span>
        `;

        this.toastContainer.appendChild(toast);

        // Auto-remove after 3 seconds
        setTimeout(() => {
            toast.remove();
        }, 3000);
    }

    /**
     * Show peek panel with constraints
     */
    showPeekPanel(hints) {
        const content = document.getElementById('peek-content');
        content.innerHTML = '';

        hints.forEach(hint => {
            const item = document.createElement('div');
            item.className = 'constraint-item';
            item.innerHTML = `
                <div class="constraint-step">Step ${hint.step}: ${hint.transformation}</div>
                <div class="constraint-desc">${hint.constraint}</div>
            `;
            content.appendChild(item);
        });

        this.peekPanel.classList.add('active');
    }

    /**
     * Hide peek panel
     */
    hidePeekPanel() {
        this.peekPanel.classList.remove('active');
    }

    /**
     * Show morpheme panel
     */
    showMorphemePanel() {
        this.morphemePanel.classList.add('active');
    }

    /**
     * Hide morpheme panel
     */
    hideMorphemePanel() {
        this.morphemePanel.classList.remove('active');
    }

    /**
     * Show morpheme analysis
     */
    showMorphemeAnalysis(data) {
        const content = document.getElementById('morpheme-content');

        const parts = [];
        if (data.analysis.prefix) {
            parts.push(`<span class="morpheme-part morpheme-prefix">${data.analysis.prefix}</span>`);
        }
        if (data.analysis.root) {
            parts.push(`<span class="morpheme-part morpheme-root">${data.analysis.root}</span>`);
        }
        if (data.analysis.suffix) {
            parts.push(`<span class="morpheme-part morpheme-suffix">${data.analysis.suffix}</span>`);
        }

        content.innerHTML = `
            <div class="morpheme-word">${data.word}</div>
            <div class="morpheme-breakdown">
                ${parts.join('')}
            </div>
            <div class="morpheme-info">
                <strong>Phonetic Structure:</strong> ${data.structure}<br>
                <strong>Vowels:</strong> ${data.vowelCount} | <strong>Consonants:</strong> ${data.consonantCount}
            </div>
        `;
    }

    /**
     * Show win screen
     */
    showWinScreen(data) {
        document.getElementById('win-moves').textContent = data.moves;
        document.getElementById('win-perfect').textContent = data.isPerfect ? 'Perfect!' : `${data.optimal} optimal`;

        // Show powerup reward
        const rewardDiv = document.getElementById('powerup-reward');
        const rewardIcon = document.getElementById('reward-icon');

        if (data.reward) {
            const powerupInfo = this.game.powerups.getPowerupDescription(data.reward);
            rewardIcon.textContent = powerupInfo.icon;
            rewardDiv.style.display = 'block';
        } else {
            rewardDiv.style.display = 'none';
        }

        // Hide next level button if no more levels
        const nextLevelBtn = document.getElementById('next-level-btn');
        if (data.nextLevel) {
            nextLevelBtn.style.display = 'block';
        } else {
            nextLevelBtn.style.display = 'none';
        }

        this.switchToScreen('winScreen');
    }

    /**
     * Show lose screen
     */
    showLoseScreen(reason) {
        document.getElementById('fail-reason').textContent = reason;
        this.switchToScreen('loseScreen');
    }
}

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.UIManager = UIManager;
}
