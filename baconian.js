/**
 * baconian.js
 * 
 * Module for encoding/decoding using a 5-bit binary Baconian cipher variant.
 * 
 * Mapping:
 *   - Each letter (A-Z) is represented by an index 0-25.
 *   - The index is converted to 5-bit binary (MSB first).
 *   - Binary 0 -> 'A', Binary 1 -> 'B'.
 *   - Example: R (index 17) = 10001 binary = 'BAAAB'
 * 
 * This module provides three main functions:
 *   - decodeGroup(abGroup): Decodes a 5-character A/B string to a single letter.
 *   - decodeGroups(arrayOfGroups): Decodes an array of 5-char groups to plaintext.
 *   - normalizePlaintext(input): Normalizes user input for comparison (uppercase, no spaces).
 * 
 * No external dependencies. Pure JavaScript.
 */

// Prevent re-initialization in case this script is loaded multiple times
if (typeof window.BaconianCipher === 'undefined') {
    window.BaconianCipher = {};

    /**
     * Converts an A/B string to a letter.
     * Mapping: A = 0, B = 1 (5-bit binary, MSB first)
     * Example: BAAAB (10001 binary) = 17 decimal = 'R'
     * 
     * @param {string} abGroup - A 5-character string of 'A' and 'B' characters.
     * @returns {string} - A single uppercase letter (A-Z), or '?' if invalid.
     * Modified per user request: flip-chip & spacing improvements
     */
    window.BaconianCipher.decodeGroup = function(abGroup) {
        // Validate input
        if (!abGroup || typeof abGroup !== 'string') {
            return '?';
        }

        // Normalize to uppercase and validate length
        const normalized = abGroup.toUpperCase();
        if (normalized.length !== 5) {
            return '?';
        }

        // Convert A/B string to binary (A=0, B=1)
        let binaryStr = '';
        for (let i = 0; i < 5; i++) {
            const char = normalized[i];
            if (char === 'A') {
                binaryStr += '0';
            } else if (char === 'B') {
                binaryStr += '1';
            } else {
                return '?'; // Invalid character in group
            }
        }

        // Convert binary string to decimal (MSB first, index 0-25)
        const index = parseInt(binaryStr, 2);

        // Validate index is within A-Z range (0-25)
        if (index < 0 || index > 25) {
            return '?';
        }

        // Convert index to letter (A=65 in ASCII)
        return String.fromCharCode(65 + index);
    };

    /**
     * Decodes an array of 5-character A/B groups to plaintext.
     * @param {array} groups - Array of 5-character A/B strings.
     * @returns {string} - Decoded plaintext (uppercase).
     */
    window.BaconianCipher.decodeGroups = function(groups) {
        if (!Array.isArray(groups)) {
            return '';
        }
        return groups.map(group => window.BaconianCipher.decodeGroup(group)).join('');
    };

    /**
     * Normalizes plaintext for comparison: uppercase, remove spaces and punctuation.
     * @param {string} input - User input string.
     * @returns {string} - Normalized plaintext.
     */
    window.BaconianCipher.normalizePlaintext = function(input) {
        if (!input || typeof input !== 'string') {
            return '';
        }
        // Remove all non-alphabetic characters, convert to uppercase
        return input.replace(/[^a-zA-Z]/g, '').toUpperCase();
    };

    /**
     * Validates if a string is a valid Baconian cipher group.
     * @param {string} group - A potential 5-character A/B group.
     * @returns {boolean} - True if valid, false otherwise.
     * Modified per user request: flip-chip & spacing improvements
     */
    window.BaconianCipher.isValidGroup = function(group) {
        if (!group || typeof group !== 'string' || group.length !== 5) {
            return false;
        }
        for (let i = 0; i < 5; i++) {
            const char = group[i].toUpperCase();
            if (char !== 'A' && char !== 'B') {
                return false;
            }
        }
        return true;
    };

    /**
     * Self-test: Verify the decoder works for known test cases.
     * Outputs results to console.
     */
    window.BaconianCipher.runTests = function() {
        const testCases = [
            { input: 'BAAAB', expected: 'R', description: 'R (10001)' },
            { input: 'AABAA', expected: 'E', description: 'E (00100)' },
            { input: 'BAABA', expected: 'S', description: 'S (10010)' },
            { input: 'AAAAA', expected: 'A', description: 'A (00000)' },
            { input: 'AAAAB', expected: 'B', description: 'B (00001)' },
            { input: 'ABBBA', expected: 'O', description: 'O (01110)' },
        ];

        let passed = 0;
        let failed = 0;

        console.log('%c=== Baconian Cipher Decoder Tests ===', 'color: #3498db; font-weight: bold;');

        testCases.forEach(test => {
            const result = window.BaconianCipher.decodeGroup(test.input);
            if (result === test.expected) {
                console.log(`✓ ${test.description}: ${test.input} → '${result}'`);
                passed++;
            } else {
                console.warn(`✗ ${test.description}: ${test.input} → '${result}' (expected '${test.expected}')`);
                failed++;
            }
        });

        // Test normalizePlaintext
        const normTests = [
            { input: 'Hello World!', expected: 'HELLOWORLD' },
            { input: 'ReliAbLE', expected: 'RELIABLE' },
            { input: 'SeSsIoN', expected: 'SESSION' },
        ];

        normTests.forEach(test => {
            const result = window.BaconianCipher.normalizePlaintext(test.input);
            if (result === test.expected) {
                console.log(`✓ Normalize: '${test.input}' → '${result}'`);
                passed++;
            } else {
                console.warn(`✗ Normalize: '${test.input}' → '${result}' (expected '${test.expected}')`);
                failed++;
            }
        });

        // Test decodeGroups
        const reliableGroups = ['BAAAB', 'AABAA', 'ABABB', 'ABAAA', 'AAAAA', 'AAAAB', 'ABABB', 'AABAA'];
        const reliableResult = window.BaconianCipher.decodeGroups(reliableGroups);
        if (reliableResult === 'RELIABLE') {
            console.log(`✓ Decode Groups: RELIABLE puzzle decoded correctly`);
            passed++;
        } else {
            console.warn(`✗ Decode Groups: RELIABLE puzzle decoded to '${reliableResult}'`);
            failed++;
        }

        const sessionGroups = ['BAABA', 'AABAA', 'BAABA', 'BAABA', 'ABAAA', 'ABBBA', 'ABBAB'];
        const sessionResult = window.BaconianCipher.decodeGroups(sessionGroups);
        if (sessionResult === 'SESSION') {
            console.log(`✓ Decode Groups: SESSION puzzle decoded correctly`);
            passed++;
        } else {
            console.warn(`✗ Decode Groups: SESSION puzzle decoded to '${sessionResult}'`);
            failed++;
        }

        console.log(`%c=== Tests Complete: ${passed} passed, ${failed} failed ===`, 
            failed === 0 ? 'color: #27ae60; font-weight: bold;' : 'color: #e74c3c; font-weight: bold;');

        return { passed, failed };
    };

    // Attach test runner to window for manual invocation if needed
    window.BaconianCipher.test = window.BaconianCipher.runTests;
}

// Run tests on page load if we're in a browser environment
if (typeof window !== 'undefined' && document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.BaconianCipher.runTests();
    });
} else if (typeof window !== 'undefined') {
    // If DOM is already loaded, run immediately
    window.BaconianCipher.runTests();
}
