/**
 * Lexical Labyrinth - Transformations Module
 * Defines all linguistic transformations and their constraint checking functions
 */

class TransformationEngine {
    constructor() {
        this.vowels = ['A', 'E', 'I', 'O', 'U'];
        this.consonants = ['B', 'C', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'M', 'N', 'P', 'Q', 'R', 'S', 'T', 'V', 'W', 'X', 'Y', 'Z'];

        // Map of transformation names to their functions
        this.transformations = {
            // PREFIX OPERATIONS
            'Add Prefix UN-': {
                apply: (word) => 'UN' + word,
                constraint: (word) => !word.startsWith('UN'),
                constraintDesc: 'Must not already start with UN'
            },
            'Add Prefix RE-': {
                apply: (word) => 'RE' + word,
                constraint: (word) => !word.startsWith('RE'),
                constraintDesc: 'Must not already start with RE'
            },
            'Remove Prefix UN-': {
                apply: (word) => word.startsWith('UN') ? word.slice(2) : word,
                constraint: (word) => word.startsWith('UN'),
                constraintDesc: 'Must start with UN'
            },
            'Remove Prefix RE-': {
                apply: (word) => word.startsWith('RE') ? word.slice(2) : word,
                constraint: (word) => word.startsWith('RE'),
                constraintDesc: 'Must start with RE'
            },
            'Delete Prefix C': {
                apply: (word) => word.startsWith('C') ? word.slice(1) : word,
                constraint: (word) => word.startsWith('C'),
                constraintDesc: 'Must start with the consonant C'
            },
            'Delete Prefix B': {
                apply: (word) => word.startsWith('B') ? word.slice(1) : word,
                constraint: (word) => word.startsWith('B'),
                constraintDesc: 'Must start with the consonant B'
            },
            'Delete Prefix R': {
                apply: (word) => word.startsWith('R') ? word.slice(1) : word,
                constraint: (word) => word.startsWith('R'),
                constraintDesc: 'Must start with the consonant R'
            },

            // SUFFIX OPERATIONS
            'Delete Suffix -SH': {
                apply: (word) => word.endsWith('SH') ? word.slice(0, -2) : word,
                constraint: (word) => word.endsWith('SH'),
                constraintDesc: 'Must end with SH'
            },
            'Delete Suffix -H': {
                apply: (word) => word.endsWith('H') ? word.slice(0, -1) : word,
                constraint: (word) => word.endsWith('H'),
                constraintDesc: 'Must end with H'
            },
            'Delete Suffix -ED': {
                apply: (word) => word.endsWith('ED') ? word.slice(0, -2) : word,
                constraint: (word) => word.endsWith('ED'),
                constraintDesc: 'Must end with ED'
            },
            'Delete Suffix -ING': {
                apply: (word) => word.endsWith('ING') ? word.slice(0, -3) : word,
                constraint: (word) => word.endsWith('ING'),
                constraintDesc: 'Must end with ING'
            },
            'Delete Suffix -T': {
                apply: (word) => word.endsWith('T') ? word.slice(0, -1) : word,
                constraint: (word) => word.endsWith('T'),
                constraintDesc: 'Must end with T'
            },
            'Delete Suffix -S': {
                apply: (word) => word.endsWith('S') ? word.slice(0, -1) : word,
                constraint: (word) => word.endsWith('S'),
                constraintDesc: 'Must end with S'
            },
            'Delete Suffix -X': {
                apply: (word) => word.endsWith('X') ? word.slice(0, -1) : word,
                constraint: (word) => word.endsWith('X'),
                constraintDesc: 'Must end with X'
            },
            'Delete Rhyme X': {
                apply: (word) => word.endsWith('X') ? word.slice(0, -1) : word,
                constraint: (word) => word.endsWith('X'),
                constraintDesc: 'Must end with X'
            },

            // VOWEL OPERATIONS
            'Change Vowel E→A': {
                apply: (word) => word.replace(/E/g, 'A'),
                constraint: (word) => word.includes('E'),
                constraintDesc: 'Must contain the vowel E'
            },
            'Change Vowel U→A': {
                apply: (word) => word.replace(/U/g, 'A'),
                constraint: (word) => word.includes('U'),
                constraintDesc: 'Must contain the vowel U'
            },
            'Change Vowel A→I': {
                apply: (word) => word.replace(/A/g, 'I'),
                constraint: (word) => word.includes('A'),
                constraintDesc: 'Must contain the vowel A'
            },
            'Change Vowel I→A': {
                apply: (word) => word.replace(/I/g, 'A'),
                constraint: (word) => word.includes('I'),
                constraintDesc: 'Must contain the vowel I'
            },
            'Change Vowel O→A': {
                apply: (word) => word.replace(/O/g, 'A'),
                constraint: (word) => word.includes('O'),
                constraintDesc: 'Must contain the vowel O'
            },
            'Change Vowel E→O': {
                apply: (word) => word.replace(/E/g, 'O'),
                constraint: (word) => word.includes('E'),
                constraintDesc: 'Must contain the vowel E'
            },
            'Delete Vowel': {
                apply: (word) => {
                    let result = '';
                    for (let char of word) {
                        if (!this.vowels.includes(char)) {
                            result += char;
                        }
                    }
                    return result || word;
                },
                constraint: (word) => {
                    // At least one character must be a vowel
                    return word.split('').some(char => this.vowels.includes(char));
                },
                constraintDesc: 'Must contain at least one vowel'
            },
            'Delete Vowel A': {
                apply: (word) => word.replace(/A/g, ''),
                constraint: (word) => word.includes('A'),
                constraintDesc: 'Must contain the vowel A'
            },

            // SIMPLE OPERATIONS
            'Add Vowel I': {
                apply: (word) => word + 'I',
                constraint: (word) => word.length === 0 || !word.endsWith('I'),
                constraintDesc: 'Must be 0-1 characters long or not end with I'
            },
            'Add Letter A': {
                apply: (word) => word + 'A',
                constraint: (word) => word.length === 0,
                constraintDesc: 'Must be empty'
            },
            'Remove Last Letter': {
                apply: (word) => word.slice(0, -1),
                constraint: (word) => word.length > 1,
                constraintDesc: 'Must be longer than 1 character'
            },

            // CONSONANT OPERATIONS
            'Remove All Consonants': {
                apply: (word) => {
                    let result = '';
                    for (let char of word) {
                        if (this.vowels.includes(char)) {
                            result += char;
                        }
                    }
                    return result || word;
                },
                constraint: (word) => {
                    return word.split('').some(char => this.consonants.includes(char));
                },
                constraintDesc: 'Must contain at least one consonant'
            },

            // LENGTH-BASED OPERATIONS
            'Reduce to First Letter': {
                apply: (word) => word.charAt(0),
                constraint: (word) => word.length > 1,
                constraintDesc: 'Must be longer than 1 character'
            },
            'Reduce to Last Letter': {
                apply: (word) => word.charAt(word.length - 1),
                constraint: (word) => word.length > 1,
                constraintDesc: 'Must be longer than 1 character'
            }
        };
    }

    /**
     * Get transformation function by name
     */
    getTransformation(name) {
        return this.transformations[name];
    }

    /**
     * Apply a transformation to a word if it passes the constraint
     * Returns { word: newWord, wasTransformed: boolean }
     */
    applyToWord(transformationName, word) {
        const transformation = this.transformations[transformationName];

        if (!transformation) {
            console.error(`Transformation "${transformationName}" not found`);
            return { word, wasTransformed: false };
        }

        // Check constraint
        const passesConstraint = transformation.constraint(word.toUpperCase());

        if (passesConstraint) {
            const newWord = transformation.apply(word.toUpperCase());
            return { word: newWord, wasTransformed: true };
        }

        return { word, wasTransformed: false };
    }

    /**
     * Apply transformation to all words in a grid
     * Returns { grid: newGrid, transformedIndices: [...] }
     */
    applyToGrid(transformationName, grid) {
        const transformedIndices = [];
        const newGrid = grid.map((word, index) => {
            const result = this.applyToWord(transformationName, word);
            if (result.wasTransformed) {
                transformedIndices.push(index);
            }
            return result.word;
        });

        return { grid: newGrid, transformedIndices };
    }

    /**
     * Check if a word meets a constraint
     */
    checkConstraint(transformationName, word) {
        const transformation = this.transformations[transformationName];
        if (!transformation) return false;
        return transformation.constraint(word.toUpperCase());
    }

    /**
     * Get constraint description for a transformation
     */
    getConstraintDescription(transformationName) {
        const transformation = this.transformations[transformationName];
        if (!transformation) return '';
        return transformation.constraintDesc;
    }

    /**
     * Analyze a word into morphological components
     */
    analyzeMorphemes(word) {
        const upperWord = word.toUpperCase();
        const prefixes = ['UN', 'RE', 'PRE', 'DIS', 'IN', 'IM', 'NON'];
        const suffixes = ['ED', 'ING', 'LY', 'NESS', 'MENT', 'ER', 'EST', 'S', 'ES', 'SH'];

        let prefix = '';
        let suffix = '';
        let root = upperWord;

        // Find prefix
        for (let pre of prefixes) {
            if (upperWord.startsWith(pre) && upperWord.length > pre.length) {
                prefix = pre;
                root = upperWord.slice(pre.length);
                break;
            }
        }

        // Find suffix
        for (let suf of suffixes) {
            if (root.endsWith(suf) && root.length > suf.length) {
                suffix = suf;
                root = root.slice(0, -suf.length);
                break;
            }
        }

        return { prefix, root, suffix };
    }

    /**
     * Get phonetic structure of a word
     */
    getPhoneticStructure(word) {
        const upperWord = word.toUpperCase();
        let structure = '';

        for (let char of upperWord) {
            if (this.vowels.includes(char)) {
                structure += 'V';
            } else if (this.consonants.includes(char)) {
                structure += 'C';
            } else {
                structure += char;
            }
        }

        return structure;
    }

    /**
     * Count vowels in a word
     */
    countVowels(word) {
        return word.toUpperCase().split('').filter(char => this.vowels.includes(char)).length;
    }

    /**
     * Count consonants in a word
     */
    countConsonants(word) {
        return word.toUpperCase().split('').filter(char => this.consonants.includes(char)).length;
    }

    /**
     * Get all transformation names
     */
    getAllTransformationNames() {
        return Object.keys(this.transformations);
    }
}

// Export for use in other modules
if (typeof window !== 'undefined') {
    window.TransformationEngine = TransformationEngine;
}
