/**
 * Lexical Labyrinth - Core Game Engine
 * Manages game state, logic, and flow
 */

class Game {
    constructor() {
        // Core engine components
        this.transformationEngine = new TransformationEngine();
        this.levelsManager = new LevelsManager();
        this.powerups = new PowerupsManager();

        // Game state
        this.currentLevelId = 1;
        this.currentLevel = null;
        this.grid = [];
        this.targetWord = '';
        this.transformationSequence = [];
        this.currentStepIndex = 0;
        this.moveCount = 0;
        this.history = [];
        this.isGameActive = false;

        // Player progress
        this.completedLevels = new Set();
        this.currentLevelProgress = 0;
        this.bestScore = 0;

        // UI reference (will be set later)
        this.ui = null;

        // Load saved progress
        this.loadProgress();

        // Initialize powerup effects
        this.powerupEffects = new PowerupEffects(this);
    }

    /**
     * Initialize a level
     */
    initLevel(levelId) {
        const level = this.levelsManager.getLevel(levelId);

        if (!level) {
            console.error(`Level ${levelId} not found`);
            return false;
        }

        this.currentLevelId = levelId;
        this.currentLevel = level;
        this.grid = [...level.initialGrid];
        this.targetWord = level.targetWord;
        this.transformationSequence = [...level.transformationSequence];
        this.currentStepIndex = 0;
        this.moveCount = 0;
        this.history = [];
        this.isGameActive = true;

        // Reset powerup effects
        this.powerupEffects.resetEffects();

        return true;
    }

    /**
     * Handle player's move - apply transformation
     */
    handleMove() {
        if (!this.isGameActive) {
            return;
        }

        // Save current state to history
        this.saveStateToHistory();

        // Get current transformation
        const currentTransformation = this.transformationSequence[this.currentStepIndex];

        // Apply transformation to grid
        const result = this.transformationEngine.applyToGrid(currentTransformation, this.grid);

        // Update grid
        this.grid = result.grid;

        // Increment move counter and step index
        this.moveCount++;
        this.currentStepIndex++;

        // Show visual feedback for transformed words
        if (this.ui) {
            this.ui.flashTransformedTiles(result.transformedIndices);
        }

        // Check win/loss conditions
        this.checkGameState();

        return {
            transformedCount: result.transformedIndices.length,
            transformedIndices: result.transformedIndices
        };
    }

    /**
     * Skip transformation (if no words match the constraint)
     */
    skipTransformation() {
        if (!this.isGameActive) {
            return;
        }

        // Verify that no words actually match the constraint
        const currentTransformation = this.transformationSequence[this.currentStepIndex];
        const wordsMatchingConstraint = this.grid.filter(word =>
            this.transformationEngine.checkConstraint(currentTransformation, word)
        );

        if (wordsMatchingConstraint.length > 0) {
            if (this.ui) {
                this.ui.showToast(
                    `Cannot skip! ${wordsMatchingConstraint.length} word(s) match the constraint.`,
                    'error'
                );
            }
            return false;
        }

        // Save state and skip
        this.saveStateToHistory();
        this.moveCount++;
        this.currentStepIndex++;

        // Check game state
        this.checkGameState();

        if (this.ui) {
            this.ui.showToast('Transformation skipped (no matching words)', 'info');
        }

        return true;
    }

    /**
     * Save current state to history for undo
     */
    saveStateToHistory() {
        this.history.push({
            grid: [...this.grid],
            stepIndex: this.currentStepIndex,
            moveCount: this.moveCount
        });

        // Limit history to last 10 moves
        if (this.history.length > 10) {
            this.history.shift();
        }
    }

    /**
     * Check win/loss conditions
     */
    checkGameState() {
        // Check if all words are target word (WIN)
        const allTarget = this.grid.every(word => word === this.targetWord);

        if (allTarget) {
            this.handleWin();
            return;
        }

        // Check if sequence is exhausted but not all words are target (LOSS)
        if (this.currentStepIndex >= this.transformationSequence.length) {
            this.handleLoss('Sequence exhausted! Not all words reached the target.');
            return;
        }
    }

    /**
     * Handle win condition
     */
    handleWin() {
        this.isGameActive = false;

        // Mark level as completed
        this.completedLevels.add(this.currentLevelId);

        // Award powerup
        const reward = this.currentLevel.powerupReward;
        if (reward) {
            this.powerups.addPowerup(reward);
        }

        // Check if perfect (optimal moves)
        const optimalMoves = this.levelsManager.getOptimalMoves(this.currentLevelId);
        const isPerfect = this.moveCount === optimalMoves;

        // Update progress
        this.currentLevelProgress = Math.max(this.currentLevelProgress, this.currentLevelId);
        this.saveProgress();

        // Show win screen
        if (this.ui) {
            this.ui.showWinScreen({
                moves: this.moveCount,
                optimal: optimalMoves,
                isPerfect,
                reward,
                nextLevel: this.levelsManager.getNextLevelId(this.currentLevelId)
            });
        }
    }

    /**
     * Handle loss condition
     */
    handleLoss(reason) {
        this.isGameActive = false;

        if (this.ui) {
            this.ui.showLoseScreen(reason);
        }
    }

    /**
     * Get current transformation
     */
    getCurrentTransformation() {
        if (this.currentStepIndex < this.transformationSequence.length) {
            return this.transformationSequence[this.currentStepIndex];
        }
        return null;
    }

    /**
     * Get constraint description for current transformation
     */
    getCurrentConstraintDescription() {
        const transformation = this.getCurrentTransformation();
        if (transformation) {
            return this.transformationEngine.getConstraintDescription(transformation);
        }
        return '';
    }

    /**
     * Get words that match current constraint
     */
    getMatchingWords() {
        const transformation = this.getCurrentTransformation();
        if (!transformation) return [];

        return this.grid.map((word, index) => ({
            word,
            index,
            matches: this.transformationEngine.checkConstraint(transformation, word)
        })).filter(item => item.matches);
    }

    /**
     * Restart current level
     */
    restartLevel() {
        this.initLevel(this.currentLevelId);
        if (this.ui) {
            this.ui.updateAll();
        }
    }

    /**
     * Load next level
     */
    loadNextLevel() {
        const nextLevelId = this.levelsManager.getNextLevelId(this.currentLevelId);

        if (nextLevelId) {
            this.initLevel(nextLevelId);
            if (this.ui) {
                this.ui.switchToGameScreen();
                this.ui.updateAll();
            }
            return true;
        }

        // No more levels - game complete!
        if (this.ui) {
            this.ui.showToast('Congratulations! You completed all levels!', 'success');
        }
        return false;
    }

    /**
     * Save progress to localStorage
     */
    saveProgress() {
        try {
            const progress = {
                currentLevelProgress: this.currentLevelProgress,
                completedLevels: Array.from(this.completedLevels),
                bestScore: this.bestScore
            };
            localStorage.setItem('lexical_labyrinth_progress', JSON.stringify(progress));
        } catch (e) {
            console.error('Failed to save progress:', e);
        }
    }

    /**
     * Load progress from localStorage
     */
    loadProgress() {
        try {
            const saved = localStorage.getItem('lexical_labyrinth_progress');
            if (saved) {
                const progress = JSON.parse(saved);
                this.currentLevelProgress = progress.currentLevelProgress || 1;
                this.completedLevels = new Set(progress.completedLevels || []);
                this.bestScore = progress.bestScore || 0;

                // Start at the next uncompleted level
                this.currentLevelId = this.currentLevelProgress;
            }
        } catch (e) {
            console.error('Failed to load progress:', e);
        }
    }

    /**
     * Reset all progress (for debugging)
     */
    resetProgress() {
        this.currentLevelProgress = 1;
        this.completedLevels.clear();
        this.bestScore = 0;
        this.currentLevelId = 1;
        this.saveProgress();
        this.powerups.resetInventory();

        if (this.ui) {
            this.ui.updateAll();
        }
    }

    /**
     * Check if a level is unlocked
     */
    isLevelUnlocked(levelId) {
        // Level 1 is always unlocked
        if (levelId === 1) return true;

        // A level is unlocked if the previous level is completed
        return this.completedLevels.has(levelId - 1) || this.currentLevelProgress >= levelId;
    }

    /**
     * Check if a level is completed
     */
    isLevelCompleted(levelId) {
        return this.completedLevels.has(levelId);
    }

    /**
     * Get progress statistics
     */
    getStats() {
        return {
            currentLevel: this.currentLevelId,
            completedLevels: this.completedLevels.size,
            totalLevels: this.levelsManager.getTotalLevels(),
            bestScore: this.bestScore,
            powerups: this.powerups.getAllCounts()
        };
    }
}

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.Game = Game;
}
