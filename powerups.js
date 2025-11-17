/**
 * Lexical Labyrinth - Power-ups System
 * Manages power-up inventory and effects
 */

class PowerupsManager {
    constructor() {
        this.inventory = {
            peek: 0,
            rewind: 0,
            morpheme: 0
        };

        this.activePowerup = null;

        // Load from localStorage
        this.loadInventory();
    }

    /**
     * Add a powerup to inventory
     */
    addPowerup(type) {
        if (this.inventory.hasOwnProperty(type)) {
            this.inventory[type]++;
            this.saveInventory();
            return true;
        }
        return false;
    }

    /**
     * Use a powerup
     */
    usePowerup(type) {
        if (this.inventory[type] > 0) {
            this.inventory[type]--;
            this.saveInventory();
            return true;
        }
        return false;
    }

    /**
     * Get powerup count
     */
    getPowerupCount(type) {
        return this.inventory[type] || 0;
    }

    /**
     * Get all powerup counts
     */
    getAllCounts() {
        return { ...this.inventory };
    }

    /**
     * Check if powerup is available
     */
    hasPowerup(type) {
        return this.inventory[type] > 0;
    }

    /**
     * Set active powerup
     */
    setActivePowerup(type) {
        this.activePowerup = type;
    }

    /**
     * Clear active powerup
     */
    clearActivePowerup() {
        this.activePowerup = null;
    }

    /**
     * Get active powerup
     */
    getActivePowerup() {
        return this.activePowerup;
    }

    /**
     * Save inventory to localStorage
     */
    saveInventory() {
        try {
            localStorage.setItem('lexical_labyrinth_powerups', JSON.stringify(this.inventory));
        } catch (e) {
            console.error('Failed to save powerups:', e);
        }
    }

    /**
     * Load inventory from localStorage
     */
    loadInventory() {
        try {
            const saved = localStorage.getItem('lexical_labyrinth_powerups');
            if (saved) {
                const parsed = JSON.parse(saved);
                this.inventory = { ...this.inventory, ...parsed };
            }
        } catch (e) {
            console.error('Failed to load powerups:', e);
        }
    }

    /**
     * Reset all powerups (for debugging)
     */
    resetInventory() {
        this.inventory = {
            peek: 0,
            rewind: 0,
            morpheme: 0
        };
        this.saveInventory();
    }

    /**
     * Get powerup description
     */
    getPowerupDescription(type) {
        const descriptions = {
            peek: {
                name: 'Sound Peek',
                icon: '🔮',
                description: 'Reveals the next three transformation constraints',
                duration: '10 seconds'
            },
            rewind: {
                name: 'Rewind',
                icon: '⏪',
                description: 'Undo your last move',
                duration: 'Instant'
            },
            morpheme: {
                name: 'Morpheme Map',
                icon: '🧮',
                description: 'Click any word to see its linguistic structure',
                duration: 'Until closed'
            }
        };
        return descriptions[type] || null;
    }

    /**
     * Award powerup for completing a level
     */
    awardLevelReward(levelId, powerupType) {
        this.addPowerup(powerupType);
    }
}

/**
 * PowerUp Effect Handlers
 */
class PowerupEffects {
    constructor(game) {
        this.game = game;
        this.peekTimer = null;
        this.morphemeActive = false;
    }

    /**
     * Activate Sound Peek
     * Shows next 3 constraints for 10 seconds
     */
    activatePeek() {
        if (!this.game.powerups.hasPowerup('peek')) {
            return false;
        }

        if (!this.game.powerups.usePowerup('peek')) {
            return false;
        }

        // Get next 3 transformations
        const currentIndex = this.game.currentStepIndex;
        const sequence = this.game.currentLevel.transformationSequence;
        const upcomingTransformations = sequence.slice(currentIndex, currentIndex + 3);

        // Build constraint hints
        const hints = upcomingTransformations.map((trans, index) => {
            const constraint = this.game.transformationEngine.getConstraintDescription(trans);
            return {
                step: currentIndex + index + 1,
                transformation: trans,
                constraint: constraint
            };
        });

        // Show in UI
        this.game.ui.showPeekPanel(hints);

        // Auto-hide after 10 seconds
        if (this.peekTimer) {
            clearTimeout(this.peekTimer);
        }

        this.peekTimer = setTimeout(() => {
            this.game.ui.hidePeekPanel();
        }, 10000);

        this.game.ui.showToast('Sound Peek activated! Constraints revealed for 10 seconds.', 'info');
        return true;
    }

    /**
     * Activate Rewind
     * Undo last move
     */
    activateRewind() {
        if (!this.game.powerups.hasPowerup('rewind')) {
            return false;
        }

        if (this.game.history.length === 0) {
            this.game.ui.showToast('No moves to undo!', 'warning');
            return false;
        }

        if (!this.game.powerups.usePowerup('rewind')) {
            return false;
        }

        // Get last state
        const lastState = this.game.history.pop();

        // Restore state
        this.game.grid = [...lastState.grid];
        this.game.currentStepIndex = lastState.stepIndex;

        // Update UI
        this.game.ui.updateGrid();
        this.game.ui.updateTransformationDisplay();
        this.game.ui.updateMoveCounter();

        this.game.ui.showToast('Move undone!', 'success');
        return true;
    }

    /**
     * Activate Morpheme Map
     * Enable clicking on words to see structure
     */
    activateMorpheme() {
        if (!this.game.powerups.hasPowerup('morpheme')) {
            return false;
        }

        if (!this.game.powerups.usePowerup('morpheme')) {
            return false;
        }

        this.morphemeActive = true;
        this.game.ui.showMorphemePanel();
        this.game.ui.showToast('Morpheme Map activated! Click any word to analyze.', 'info');

        return true;
    }

    /**
     * Deactivate Morpheme Map
     */
    deactivateMorpheme() {
        this.morphemeActive = false;
    }

    /**
     * Analyze word with Morpheme Map
     */
    analyzeMorpheme(word) {
        if (!this.morphemeActive) {
            return;
        }

        const analysis = this.game.transformationEngine.analyzeMorphemes(word);
        const structure = this.game.transformationEngine.getPhoneticStructure(word);
        const vowelCount = this.game.transformationEngine.countVowels(word);
        const consonantCount = this.game.transformationEngine.countConsonants(word);

        this.game.ui.showMorphemeAnalysis({
            word,
            analysis,
            structure,
            vowelCount,
            consonantCount
        });
    }

    /**
     * Clear peek timer
     */
    clearPeekTimer() {
        if (this.peekTimer) {
            clearTimeout(this.peekTimer);
            this.peekTimer = null;
        }
    }

    /**
     * Reset all active effects
     */
    resetEffects() {
        this.clearPeekTimer();
        this.deactivateMorpheme();
    }
}

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.PowerupsManager = PowerupsManager;
    window.PowerupEffects = PowerupEffects;
}
