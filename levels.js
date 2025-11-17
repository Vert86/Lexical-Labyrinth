/**
 * Lexical Labyrinth - Levels Configuration
 * Defines all game levels with their grids, transformation sequences, and rewards
 */

class LevelsManager {
    constructor() {
        this.levels = [
            // LEVEL 1: Short Suffix
            {
                id: 1,
                name: 'Short Suffix',
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
                powerupReward: 'peek',
                difficulty: 'Easy'
            },

            // LEVEL 2: Basic Prefix
            {
                id: 2,
                name: 'Basic Prefix',
                gridSize: 3,
                targetWord: 'A',
                initialGrid: [
                    'UNBAT', 'UNCAT', 'UNHAT',
                    'UNMAT', 'UNPAT', 'UNRAT',
                    'UNSAT', 'UNTAT', 'UNVET'
                ],
                transformationSequence: [
                    'Remove Prefix UN-',
                    'Delete Suffix -T',
                    'Add Letter A'
                ],
                powerupReward: 'rewind',
                difficulty: 'Easy'
            },

            // LEVEL 3: Vowel Change
            {
                id: 3,
                name: 'Vowel Change',
                gridSize: 3,
                targetWord: 'A',
                initialGrid: [
                    'BET', 'GET', 'LET',
                    'MET', 'NET', 'PET',
                    'SET', 'VET', 'WET'
                ],
                transformationSequence: [
                    'Change Vowel E→A',
                    'Delete Suffix -T'
                ],
                powerupReward: 'morpheme',
                difficulty: 'Easy'
            },

            // LEVEL 4: Consonant Start
            {
                id: 4,
                name: 'Consonant Start',
                gridSize: 3,
                targetWord: 'A',
                initialGrid: [
                    'CAB', 'CAD', 'CAM',
                    'CAN', 'CAP', 'CAR',
                    'CAT', 'CAW', 'CAY'
                ],
                transformationSequence: [
                    'Delete Prefix C',
                    'Delete Suffix -B',
                    'Delete Suffix -D',
                    'Delete Suffix -M',
                    'Delete Suffix -N',
                    'Delete Suffix -P',
                    'Delete Suffix -R',
                    'Delete Suffix -T',
                    'Delete Suffix -W',
                    'Delete Suffix -Y'
                ],
                powerupReward: 'peek',
                difficulty: 'Medium'
            },

            // LEVEL 5: Vowel Shift
            {
                id: 5,
                name: 'Vowel Shift',
                gridSize: 4,
                targetWord: 'O',
                initialGrid: [
                    'CAT', 'CUT', 'COT', 'CIT',
                    'BIT', 'BAT', 'BOT', 'BUT',
                    'HAT', 'HUT', 'HOT', 'HIT',
                    'MAT', 'MUT', 'MOT', 'MIT'
                ],
                transformationSequence: [
                    'Change Vowel U→A',
                    'Change Vowel I→A',
                    'Delete Prefix C',
                    'Delete Prefix B',
                    'Delete Prefix H',
                    'Delete Prefix M',
                    'Delete Suffix -T',
                    'Change Vowel A→I',
                    'Change Vowel I→A'
                ],
                powerupReward: 'rewind',
                difficulty: 'Medium'
            },

            // LEVEL 6: Double Suffix
            {
                id: 6,
                name: 'Double Suffix',
                gridSize: 3,
                targetWord: 'I',
                initialGrid: [
                    'WISHED', 'FISHED', 'DASHED',
                    'LASHED', 'MASHED', 'BUSHED',
                    'PUSHED', 'RUSHED', 'HUSHED'
                ],
                transformationSequence: [
                    'Delete Suffix -ED',
                    'Delete Suffix -SH',
                    'Delete Vowel A',
                    'Delete Vowel E',
                    'Delete Vowel U',
                    'Add Vowel I'
                ],
                powerupReward: 'morpheme',
                difficulty: 'Medium'
            },

            // LEVEL 7: Prefix Mix
            {
                id: 7,
                name: 'Prefix Mix',
                gridSize: 4,
                targetWord: 'A',
                initialGrid: [
                    'UNBOX', 'UNTIE', 'UNBAG', 'UNPIN',
                    'REBOX', 'RETIE', 'REBAG', 'REPIN',
                    'UNCAN', 'UNMAN', 'UNFAN', 'UNPAN',
                    'RECAN', 'REMAN', 'REFAN', 'REPAN'
                ],
                transformationSequence: [
                    'Remove Prefix UN-',
                    'Remove Prefix RE-',
                    'Delete Suffix -X',
                    'Delete Suffix -E',
                    'Delete Suffix -G',
                    'Delete Suffix -N',
                    'Delete Prefix B',
                    'Delete Prefix T',
                    'Delete Prefix C',
                    'Delete Prefix M',
                    'Delete Prefix F',
                    'Delete Prefix P'
                ],
                powerupReward: 'peek',
                difficulty: 'Hard'
            },

            // LEVEL 8: Vowel Elimination
            {
                id: 8,
                name: 'Vowel Elimination',
                gridSize: 4,
                targetWord: 'I',
                initialGrid: [
                    'BEAT', 'HEAT', 'MEAT', 'NEAT',
                    'PEAT', 'SEAT', 'FEAT', 'TEAT',
                    'BOAT', 'COAT', 'GOAT', 'MOAT',
                    'BEET', 'FEET', 'MEET', 'LEET'
                ],
                transformationSequence: [
                    'Change Vowel O→A',
                    'Delete Suffix -T',
                    'Delete Vowel E',
                    'Delete Vowel A',
                    'Add Vowel I'
                ],
                powerupReward: 'rewind',
                difficulty: 'Hard'
            },

            // LEVEL 9: Complex Pattern
            {
                id: 9,
                name: 'Complex Pattern',
                gridSize: 4,
                targetWord: 'A',
                initialGrid: [
                    'UNBASH', 'UNCASH', 'UNDASH', 'UNGASH',
                    'UNHASH', 'UNLASH', 'UNMASH', 'UNPASH',
                    'REBASH', 'RECASH', 'REDASH', 'REGASH',
                    'REHASH', 'RELASH', 'REMASH', 'REPASH'
                ],
                transformationSequence: [
                    'Remove Prefix UN-',
                    'Remove Prefix RE-',
                    'Delete Suffix -SH',
                    'Delete Vowel A',
                    'Delete Vowel E',
                    'Delete Prefix B',
                    'Delete Prefix C',
                    'Delete Prefix D',
                    'Delete Prefix G',
                    'Delete Prefix H',
                    'Delete Prefix L',
                    'Delete Prefix M',
                    'Delete Prefix P',
                    'Add Letter A'
                ],
                powerupReward: 'morpheme',
                difficulty: 'Hard'
            },

            // LEVEL 10: Prefix/Rhyme (as specified in design doc)
            {
                id: 10,
                name: 'Prefix/Rhyme',
                gridSize: 5,
                targetWord: 'A',
                initialGrid: [
                    'UNBOX', 'UNTIE', 'REBOX', 'RETIE', 'TIE',
                    'BOX', 'UNFIX', 'REFIX', 'FIX', 'SIX',
                    'MIX', 'UNMIX', 'REMIX', 'UNWAX', 'REWAX',
                    'WAX', 'TAX', 'UNTAX', 'RETAX', 'MAX',
                    'UNMAX', 'REMAX', 'UNSEX', 'RESEX', 'SEX'
                ],
                transformationSequence: [
                    'Remove Prefix UN-',
                    'Remove Prefix RE-',
                    'Change Vowel E→O',
                    'Delete Rhyme X',
                    'Delete Vowel O',
                    'Delete Vowel I',
                    'Add Letter A'
                ],
                powerupReward: 'peek',
                difficulty: 'Very Hard'
            },

            // LEVEL 11: Speed Round
            {
                id: 11,
                name: 'Speed Round',
                gridSize: 3,
                targetWord: 'I',
                initialGrid: [
                    'BASH', 'CASH', 'DASH',
                    'GASH', 'HASH', 'LASH',
                    'MASH', 'RASH', 'SASH'
                ],
                transformationSequence: [
                    'Delete Suffix -SH',
                    'Delete Vowel A',
                    'Add Vowel I'
                ],
                powerupReward: 'rewind',
                difficulty: 'Easy'
            },

            // LEVEL 12: Letter Ladder
            {
                id: 12,
                name: 'Letter Ladder',
                gridSize: 4,
                targetWord: 'A',
                initialGrid: [
                    'BIT', 'HIT', 'KIT', 'LIT',
                    'PIT', 'SIT', 'WIT', 'FIT',
                    'BAT', 'HAT', 'KAT', 'LAT',
                    'PAT', 'SAT', 'VAT', 'FAT'
                ],
                transformationSequence: [
                    'Change Vowel I→A',
                    'Delete Suffix -T'
                ],
                powerupReward: 'morpheme',
                difficulty: 'Easy'
            },

            // LEVEL 13: Prefix Stack
            {
                id: 13,
                name: 'Prefix Stack',
                gridSize: 4,
                targetWord: 'I',
                initialGrid: [
                    'UNBID', 'UNDID', 'UNFED', 'UNLED',
                    'REBID', 'REDID', 'REFED', 'RELED',
                    'UNHID', 'UNPID', 'UNRID', 'UNSID',
                    'REHID', 'REPID', 'RERID', 'RESID'
                ],
                transformationSequence: [
                    'Remove Prefix UN-',
                    'Remove Prefix RE-',
                    'Delete Suffix -D',
                    'Delete Vowel E',
                    'Delete Vowel A'
                ],
                powerupReward: 'peek',
                difficulty: 'Medium'
            },

            // LEVEL 14: Final Challenge
            {
                id: 14,
                name: 'Final Challenge',
                gridSize: 5,
                targetWord: 'A',
                initialGrid: [
                    'UNBASH', 'REBASH', 'BASH', 'CASH', 'DASH',
                    'GASH', 'HASH', 'LASH', 'MASH', 'NASH',
                    'PASH', 'RASH', 'SASH', 'TASH', 'WASH',
                    'UNCASH', 'RECASH', 'UNDASH', 'REDASH', 'UNGASH',
                    'REGASH', 'UNHASH', 'REHASH', 'UNLASH', 'RELASH'
                ],
                transformationSequence: [
                    'Remove Prefix UN-',
                    'Remove Prefix RE-',
                    'Delete Suffix -SH',
                    'Delete Vowel A',
                    'Add Letter A'
                ],
                powerupReward: 'rewind',
                difficulty: 'Very Hard'
            },

            // LEVEL 15: Master Level
            {
                id: 15,
                name: 'Master Level',
                gridSize: 5,
                targetWord: 'I',
                initialGrid: [
                    'WISHED', 'FISHED', 'DISHED', 'BUSHED', 'PUSHED',
                    'RUSHED', 'HUSHED', 'MUSHED', 'GUSHED', 'CUSHED',
                    'WISHED', 'BASHED', 'CASHED', 'DASHED', 'GASHED',
                    'HASHED', 'LASHED', 'MASHED', 'RASHED', 'SASHED',
                    'TASHED', 'WASHED', 'NOSHED', 'JOSHED', 'KOSHED'
                ],
                transformationSequence: [
                    'Delete Suffix -ED',
                    'Delete Suffix -SH',
                    'Delete Vowel A',
                    'Delete Vowel E',
                    'Delete Vowel O',
                    'Delete Vowel U',
                    'Add Vowel I'
                ],
                powerupReward: 'morpheme',
                difficulty: 'Very Hard'
            }
        ];
    }

    /**
     * Get level by ID
     */
    getLevel(levelId) {
        return this.levels.find(level => level.id === levelId);
    }

    /**
     * Get total number of levels
     */
    getTotalLevels() {
        return this.levels.length;
    }

    /**
     * Get all levels
     */
    getAllLevels() {
        return this.levels;
    }

    /**
     * Get powerup reward for a level
     */
    getPowerupReward(levelId) {
        const level = this.getLevel(levelId);
        return level ? level.powerupReward : null;
    }

    /**
     * Check if level exists
     */
    levelExists(levelId) {
        return levelId >= 1 && levelId <= this.levels.length;
    }

    /**
     * Get next level ID
     */
    getNextLevelId(currentLevelId) {
        if (currentLevelId < this.levels.length) {
            return currentLevelId + 1;
        }
        return null;
    }

    /**
     * Get level difficulty color
     */
    getDifficultyColor(difficulty) {
        const colors = {
            'Easy': '#27ae60',
            'Medium': '#f39c12',
            'Hard': '#e67e22',
            'Very Hard': '#e74c3c'
        };
        return colors[difficulty] || '#3498db';
    }

    /**
     * Get optimal move count for a level
     */
    getOptimalMoves(levelId) {
        const level = this.getLevel(levelId);
        return level ? level.transformationSequence.length : 0;
    }
}

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.LevelsManager = LevelsManager;
}
