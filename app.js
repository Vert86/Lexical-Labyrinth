/**
 * Lexical Labyrinth - Application Entry Point
 * Initializes the game and UI
 */

(function() {
    'use strict';

    // Global game instance
    let game = null;
    let ui = null;
    let tutorial = null;

    /**
     * Initialize the application
     */
    function init() {
        console.log('🎮 Lexical Labyrinth - Initializing...');

        try {
            // Create game instance
            game = new Game();

            // Create UI manager
            ui = new UIManager(game);

            // Create tutorial manager
            tutorial = new TutorialManager(game, ui);
            ui.tutorial = tutorial;

            console.log('✓ Game initialized successfully');
            console.log(`📊 Progress: Level ${game.currentLevelId}, ${game.completedLevels.size} levels completed`);

            // Add keyboard shortcuts
            initKeyboardShortcuts();

            // Add visibility change handler to pause animations when tab is not visible
            document.addEventListener('visibilitychange', handleVisibilityChange);

            // Prevent zoom on mobile
            preventMobileZoom();

            // Add global error handler
            window.addEventListener('error', handleGlobalError);

        } catch (error) {
            console.error('Failed to initialize game:', error);
            showFatalError('Failed to initialize game. Please refresh the page.');
        }
    }

    /**
     * Initialize keyboard shortcuts
     */
    function initKeyboardShortcuts() {
        document.addEventListener('keydown', (e) => {
            // Only handle shortcuts on game screen
            if (!game.isGameActive) return;

            switch(e.key) {
                case ' ':
                case 'Enter':
                    e.preventDefault();
                    document.getElementById('apply-transformation-btn').click();
                    break;

                case 'z':
                case 'Z':
                    if (e.ctrlKey || e.metaKey) {
                        e.preventDefault();
                        document.getElementById('powerup-rewind').click();
                    }
                    break;

                case 'p':
                case 'P':
                    e.preventDefault();
                    document.getElementById('powerup-peek').click();
                    break;

                case 'm':
                case 'M':
                    e.preventDefault();
                    document.getElementById('powerup-morpheme').click();
                    break;

                case 'Escape':
                    e.preventDefault();
                    // Close any open panels
                    ui.hidePeekPanel();
                    ui.hideMorphemePanel();
                    break;
            }
        });
    }

    /**
     * Handle visibility change (tab switching)
     */
    function handleVisibilityChange() {
        if (document.hidden) {
            // Tab is hidden - could pause timers here if needed
            console.log('Tab hidden');
        } else {
            // Tab is visible again
            console.log('Tab visible');
        }
    }

    /**
     * Prevent zoom on mobile devices
     */
    function preventMobileZoom() {
        // Prevent double-tap zoom
        let lastTouchEnd = 0;
        document.addEventListener('touchend', (e) => {
            const now = Date.now();
            if (now - lastTouchEnd <= 300) {
                e.preventDefault();
            }
            lastTouchEnd = now;
        }, false);

        // Prevent pinch zoom
        document.addEventListener('gesturestart', (e) => {
            e.preventDefault();
        });

        document.addEventListener('gesturechange', (e) => {
            e.preventDefault();
        });

        document.addEventListener('gestureend', (e) => {
            e.preventDefault();
        });
    }

    /**
     * Handle global errors
     */
    function handleGlobalError(event) {
        console.error('Global error:', event.error);
        // Don't show error to user for minor issues, just log it
    }

    /**
     * Show fatal error message
     */
    function showFatalError(message) {
        const errorDiv = document.createElement('div');
        errorDiv.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%);
            background: white;
            padding: 40px;
            border-radius: 12px;
            box-shadow: 0 8px 32px rgba(0,0,0,0.3);
            text-align: center;
            z-index: 10000;
            max-width: 400px;
        `;
        errorDiv.innerHTML = `
            <h2 style="color: #e74c3c; margin-bottom: 20px;">⚠ Error</h2>
            <p style="color: #666; margin-bottom: 20px;">${message}</p>
            <button onclick="location.reload()" style="
                background: #3498db;
                color: white;
                border: none;
                padding: 12px 24px;
                border-radius: 8px;
                font-size: 1rem;
                cursor: pointer;
            ">Reload Page</button>
        `;
        document.body.appendChild(errorDiv);
    }

    /**
     * Add debug commands to window for testing
     */
    if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
        window.DEBUG = {
            game: () => game,
            ui: () => ui,
            resetProgress: () => {
                game.resetProgress();
                console.log('Progress reset!');
            },
            unlockAllLevels: () => {
                for (let i = 1; i <= game.levelsManager.getTotalLevels(); i++) {
                    game.completedLevels.add(i);
                }
                game.currentLevelProgress = game.levelsManager.getTotalLevels();
                game.saveProgress();
                console.log('All levels unlocked!');
            },
            addAllPowerups: () => {
                for (let i = 0; i < 10; i++) {
                    game.powerups.addPowerup('peek');
                    game.powerups.addPowerup('rewind');
                    game.powerups.addPowerup('morpheme');
                }
                ui.updatePowerupCounts();
                console.log('Added 10 of each powerup!');
            },
            skipToLevel: (levelId) => {
                game.initLevel(levelId);
                ui.switchToGameScreen();
                ui.updateAll();
                console.log(`Skipped to level ${levelId}`);
            },
            completeLevel: () => {
                // Set all words to target
                game.grid = game.grid.map(() => game.targetWord);
                game.handleWin();
                console.log('Level completed!');
            },
            resetTutorial: () => {
                tutorial.reset();
                console.log('Tutorial reset!');
            }
        };
        console.log('🛠 Debug commands available: DEBUG.resetProgress(), DEBUG.unlockAllLevels(), DEBUG.addAllPowerups(), DEBUG.skipToLevel(n), DEBUG.completeLevel(), DEBUG.resetTutorial()');
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Export to window for debugging
    window.LexicalLabyrinthApp = {
        version: '1.0.0',
        game: () => game,
        ui: () => ui,
        tutorial: () => tutorial
    };

})();
