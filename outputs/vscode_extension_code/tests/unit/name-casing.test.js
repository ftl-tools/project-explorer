const { expect } = require('chai');
const { toSnakeCase, toCamelCase, toPascalCase, toKebabCase, toTitleCase } = require('../../out/src/utils/nameCasing.js');

describe('Name Casing Utilities', () => {
    const testInput = "the3DQuick_brown fox-jumps.overTheLazy_dog.";

    describe('snake_case Conversion', () => {
        it('should convert the documented example exactly to snake_case', function() {
            const result = toSnakeCase(testInput);
            const expected = "the_3d_quick_brown_fox_jumps_over_the_lazy_dog";
            
            expect(result).to.equal(expected);
        });

        it('should preserve number groups and insert underscores between words and before numbers', function() {
            const testCases = [
                { input: "word123", expected: "word_123" },
                { input: "123word", expected: "123_word" },
                { input: "word123word", expected: "word_123_word" },
                { input: "HTML5Parser", expected: "html_5_parser" },
                { input: "parseHTML5", expected: "parse_html_5" }
            ];

            testCases.forEach(({ input, expected }) => {
                const result = toSnakeCase(input);
                expect(result).to.equal(expected, `Failed for input: ${input}`);
            });
        });

        it('should handle empty strings', function() {
            expect(toSnakeCase("")).to.equal("");
        });
    });

    describe('camelCase Conversion', () => {
        it('should convert the documented example exactly to camelCase', function() {
            const result = toCamelCase(testInput);
            const expected = "the3dQuickBrownFoxJumpsOverTheLazyDog";
            
            expect(result).to.equal(expected);
        });

        it('should lowercase initial token and capitalize subsequent tokens', function() {
            const testCases = [
                { input: "first second", expected: "firstSecond" },
                { input: "FIRST SECOND", expected: "firstSecond" },
                { input: "first_second_third", expected: "firstSecondThird" },
                { input: "one-two-three", expected: "oneTwoThree" }
            ];

            testCases.forEach(({ input, expected }) => {
                const result = toCamelCase(input);
                expect(result).to.equal(expected, `Failed for input: ${input}`);
            });
        });

        it('should handle empty strings', function() {
            expect(toCamelCase("")).to.equal("");
        });
    });

    describe('PascalCase Conversion', () => {
        it('should convert the documented example exactly to PascalCase', function() {
            const result = toPascalCase(testInput);
            const expected = "The3dQuickBrownFoxJumpsOverTheLazyDog";
            
            expect(result).to.equal(expected);
        });

        it('should capitalize each token', function() {
            const testCases = [
                { input: "first second", expected: "FirstSecond" },
                { input: "first_second_third", expected: "FirstSecondThird" },
                { input: "one-two-three", expected: "OneTwoThree" },
                { input: "word", expected: "Word" }
            ];

            testCases.forEach(({ input, expected }) => {
                const result = toPascalCase(input);
                expect(result).to.equal(expected, `Failed for input: ${input}`);
            });
        });

        it('should handle empty strings', function() {
            expect(toPascalCase("")).to.equal("");
        });
    });

    describe('kebab-case Conversion', () => {
        it('should convert the documented example exactly to kebab-case', function() {
            const result = toKebabCase(testInput);
            const expected = "the-3d-quick-brown-fox-jumps-over-the-lazy-dog";
            
            expect(result).to.equal(expected);
        });

        it('should create lowercase tokens separated by single hyphens', function() {
            const testCases = [
                { input: "Word Word", expected: "word-word" },
                { input: "WORD WORD", expected: "word-word" },
                { input: "first_second_third", expected: "first-second-third" },
                { input: "CamelCaseWord", expected: "camel-case-word" }
            ];

            testCases.forEach(({ input, expected }) => {
                const result = toKebabCase(input);
                expect(result).to.equal(expected, `Failed for input: ${input}`);
            });
        });

        it('should handle empty strings', function() {
            expect(toKebabCase("")).to.equal("");
        });
    });

    describe('Title Case Conversion', () => {
        it('should convert the documented example exactly to Title Case', function() {
            const result = toTitleCase("the3DQuick_brown fox-jumps.OverTheLazy_dog.");
            const expected = "The 3D Quick Brown Fox Jumps Over The Lazy Dog";
            
            expect(result).to.equal(expected);
        });

        it('should include spacing around numbers and capitalize each word', function() {
            const testCases = [
                { input: "word123word", expected: "Word 123 Word" },
                { input: "HTML5parser", expected: "HTML 5 Parser" },
                { input: "api2endpoint", expected: "Api 2 Endpoint" },
                { input: "3dModel", expected: "3D Model" }
            ];

            testCases.forEach(({ input, expected }) => {
                const result = toTitleCase(input);
                expect(result).to.equal(expected, `Failed for input: ${input}`);
            });
        });

        it('should handle empty strings', function() {
            expect(toTitleCase("")).to.equal("");
        });
    });
});