import { expect } from 'chai';
import { toSnakeCase, toCamelCase, toPascalCase, toKebabCase, toTitleCase } from '../../../src/utils/nameCasing';

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

        it('should normalize mixed separators to single underscores', function() {
            const testCases = [
                { input: "word-word", expected: "word_word" },
                { input: "word word", expected: "word_word" },
                { input: "word.word", expected: "word_word" },
                { input: "word_word", expected: "word_word" },
                { input: "word--word", expected: "word_word" },
                { input: "word  word", expected: "word_word" },
                { input: "word..word", expected: "word_word" },
                { input: "word__word", expected: "word_word" }
            ];

            testCases.forEach(({ input, expected }) => {
                const result = toSnakeCase(input);
                expect(result).to.equal(expected, `Failed for input: ${input}`);
            });
        });

        it('should collapse consecutive separators to one underscore', function() {
            const testCases = [
                { input: "word---word", expected: "word_word" },
                { input: "word   word", expected: "word_word" },
                { input: "word...word", expected: "word_word" },
                { input: "word___word", expected: "word_word" },
                { input: "word-_. word", expected: "word_word" }
            ];

            testCases.forEach(({ input, expected }) => {
                const result = toSnakeCase(input);
                expect(result).to.equal(expected, `Failed for input: ${input}`);
            });
        });

        it('should trim leading and trailing separators', function() {
            const testCases = [
                { input: "-word", expected: "word" },
                { input: "word-", expected: "word" },
                { input: "_word_", expected: "word" },
                { input: " word ", expected: "word" },
                { input: ".word.", expected: "word" },
                { input: "---word---", expected: "word" },
                { input: "   word   ", expected: "word" }
            ];

            testCases.forEach(({ input, expected }) => {
                const result = toSnakeCase(input);
                expect(result).to.equal(expected, `Failed for input: ${input}`);
            });
        });

        it('should lowercase and preserve Unicode letters', function() {
            const testCases = [
                { input: "WORD", expected: "word" },
                { input: "Word", expected: "word" },
                { input: "café", expected: "café" },
                { input: "naïve", expected: "naïve" },
                { input: "résumé", expected: "résumé" }
            ];

            testCases.forEach(({ input, expected }) => {
                const result = toSnakeCase(input);
                expect(result).to.equal(expected, `Failed for input: ${input}`);
            });
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

        it('should keep digits adjacent to words as shown in example', function() {
            const testCases = [
                { input: "word3d", expected: "word3d" },
                { input: "3d word", expected: "3dWord" },
                { input: "html5 parser", expected: "html5Parser" },
                { input: "parse html5", expected: "parseHtml5" }
            ];

            testCases.forEach(({ input, expected }) => {
                const result = toCamelCase(input);
                expect(result).to.equal(expected, `Failed for input: ${input}`);
            });
        });

        it('should remove punctuation and separators', function() {
            const testCases = [
                { input: "word-word", expected: "wordWord" },
                { input: "word_word", expected: "wordWord" },
                { input: "word.word", expected: "wordWord" },
                { input: "word word", expected: "wordWord" },
                { input: "word!@#word", expected: "wordWord" }
            ];

            testCases.forEach(({ input, expected }) => {
                const result = toCamelCase(input);
                expect(result).to.equal(expected, `Failed for input: ${input}`);
            });
        });

        it('should normalize acronyms like "3D" to "3d" per example', function() {
            const testCases = [
                { input: "3D quick", expected: "3dQuick" },
                { input: "HTML parser", expected: "htmlParser" },
                { input: "XML HTTP request", expected: "xmlHttpRequest" },
                { input: "API key", expected: "apiKey" }
            ];

            testCases.forEach(({ input, expected }) => {
                const result = toCamelCase(input);
                expect(result).to.equal(expected, `Failed for input: ${input}`);
            });
        });

        it('should ignore leading and trailing separators', function() {
            const testCases = [
                { input: "-word word", expected: "wordWord" },
                { input: "word word-", expected: "wordWord" },
                { input: "_word_word_", expected: "wordWord" },
                { input: " word word ", expected: "wordWord" }
            ];

            testCases.forEach(({ input, expected }) => {
                const result = toCamelCase(input);
                expect(result).to.equal(expected, `Failed for input: ${input}`);
            });
        });

        it('should preserve and case-fold non-ASCII letters appropriately', function() {
            const testCases = [
                { input: "café shop", expected: "caféShop" },
                { input: "naïve approach", expected: "naïveApproach" },
                { input: "résumé builder", expected: "résuméBuilder" }
            ];

            testCases.forEach(({ input, expected }) => {
                const result = toCamelCase(input);
                expect(result).to.equal(expected, `Failed for input: ${input}`);
            });
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

        it('should preserve digits and normalize like "3D" -> "3d"', function() {
            const testCases = [
                { input: "3D model", expected: "3dModel" },
                { input: "HTML5 parser", expected: "Html5Parser" },
                { input: "2D graphics", expected: "2dGraphics" },
                { input: "API v2", expected: "ApiV2" }
            ];

            testCases.forEach(({ input, expected }) => {
                const result = toPascalCase(input);
                expect(result).to.equal(expected, `Failed for input: ${input}`);
            });
        });

        it('should remove all separators', function() {
            const testCases = [
                { input: "word-word", expected: "WordWord" },
                { input: "word_word", expected: "WordWord" },
                { input: "word.word", expected: "WordWord" },
                { input: "word word", expected: "WordWord" },
                { input: "word!@#word", expected: "WordWord" }
            ];

            testCases.forEach(({ input, expected }) => {
                const result = toPascalCase(input);
                expect(result).to.equal(expected, `Failed for input: ${input}`);
            });
        });

        it('should not have leading underscores or punctuation', function() {
            const testCases = [
                { input: "_word", expected: "Word" },
                { input: "-word", expected: "Word" },
                { input: ".word", expected: "Word" },
                { input: "!word", expected: "Word" },
                { input: "___word", expected: "Word" }
            ];

            testCases.forEach(({ input, expected }) => {
                const result = toPascalCase(input);
                expect(result).to.equal(expected, `Failed for input: ${input}`);
            });
        });

        it('should handle single-token inputs gracefully', function() {
            const testCases = [
                { input: "word", expected: "Word" },
                { input: "WORD", expected: "Word" },
                { input: "123", expected: "123" },
                { input: "a", expected: "A" }
            ];

            testCases.forEach(({ input, expected }) => {
                const result = toPascalCase(input);
                expect(result).to.equal(expected, `Failed for input: ${input}`);
            });
        });

        it('should handle all-separator inputs by yielding empty string', function() {
            const testCases = [
                { input: "---", expected: "" },
                { input: "___", expected: "" },
                { input: "   ", expected: "" },
                { input: "...", expected: "" },
                { input: "!@#", expected: "" }
            ];

            testCases.forEach(({ input, expected }) => {
                const result = toPascalCase(input);
                expect(result).to.equal(expected, `Failed for input: ${input}`);
            });
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

        it('should handle numeric boundaries like "3d"', function() {
            const testCases = [
                { input: "3D model", expected: "3d-model" },
                { input: "HTML5 parser", expected: "html-5-parser" },
                { input: "word123word", expected: "word-123-word" },
                { input: "API2", expected: "api-2" }
            ];

            testCases.forEach(({ input, expected }) => {
                const result = toKebabCase(input);
                expect(result).to.equal(expected, `Failed for input: ${input}`);
            });
        });

        it('should collapse multiple separators to single hyphens', function() {
            const testCases = [
                { input: "word---word", expected: "word-word" },
                { input: "word   word", expected: "word-word" },
                { input: "word___word", expected: "word-word" },
                { input: "word...word", expected: "word-word" },
                { input: "word-_. word", expected: "word-word" }
            ];

            testCases.forEach(({ input, expected }) => {
                const result = toKebabCase(input);
                expect(result).to.equal(expected, `Failed for input: ${input}`);
            });
        });

        it('should not have leading or trailing hyphens', function() {
            const testCases = [
                { input: "-word", expected: "word" },
                { input: "word-", expected: "word" },
                { input: "_word_", expected: "word" },
                { input: " word ", expected: "word" },
                { input: "---word---", expected: "word" }
            ];

            testCases.forEach(({ input, expected }) => {
                const result = toKebabCase(input);
                expect(result).to.equal(expected, `Failed for input: ${input}`);
            });
        });

        it('should preserve non-ASCII letters', function() {
            const testCases = [
                { input: "café shop", expected: "café-shop" },
                { input: "naïve approach", expected: "naïve-approach" },
                { input: "résumé builder", expected: "résumé-builder" }
            ];

            testCases.forEach(({ input, expected }) => {
                const result = toKebabCase(input);
                expect(result).to.equal(expected, `Failed for input: ${input}`);
            });
        });

        it('should remove unsupported punctuation', function() {
            const testCases = [
                { input: "word!word", expected: "word-word" },
                { input: "word@word", expected: "word-word" },
                { input: "word#word", expected: "word-word" },
                { input: "word$word", expected: "word-word" },
                { input: "word%word", expected: "word-word" }
            ];

            testCases.forEach(({ input, expected }) => {
                const result = toKebabCase(input);
                expect(result).to.equal(expected, `Failed for input: ${input}`);
            });
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

        it('should normalize various separators to single spaces', function() {
            const testCases = [
                { input: "word-word", expected: "Word Word" },
                { input: "word_word", expected: "Word Word" },
                { input: "word.word", expected: "Word Word" },
                { input: "word word", expected: "Word Word" },
                { input: "word---word", expected: "Word Word" },
                { input: "word___word", expected: "Word Word" }
            ];

            testCases.forEach(({ input, expected }) => {
                const result = toTitleCase(input);
                expect(result).to.equal(expected, `Failed for input: ${input}`);
            });
        });

        it('should uppercase numeric tokens like "3D" as shown', function() {
            const testCases = [
                { input: "3d model", expected: "3D Model" },
                { input: "html5 parser", expected: "HTML5 Parser" },
                { input: "2d graphics", expected: "2D Graphics" },
                { input: "api v2", expected: "API V2" }
            ];

            testCases.forEach(({ input, expected }) => {
                const result = toTitleCase(input);
                expect(result).to.equal(expected, `Failed for input: ${input}`);
            });
        });

        it('should trim leading and trailing whitespace', function() {
            const testCases = [
                { input: " word word ", expected: "Word Word" },
                { input: "  word  word  ", expected: "Word Word" },
                { input: "\tword\tword\t", expected: "Word Word" },
                { input: "\nword\nword\n", expected: "Word Word" }
            ];

            testCases.forEach(({ input, expected }) => {
                const result = toTitleCase(input);
                expect(result).to.equal(expected, `Failed for input: ${input}`);
            });
        });

        it('should preserve apostrophes within words', function() {
            const testCases = [
                { input: "dog's toy", expected: "Dog's Toy" },
                { input: "can't do", expected: "Can't Do" },
                { input: "it's working", expected: "It's Working" },
                { input: "won't work", expected: "Won't Work" }
            ];

            testCases.forEach(({ input, expected }) => {
                const result = toTitleCase(input);
                expect(result).to.equal(expected, `Failed for input: ${input}`);
            });
        });

        it('should handle edge cases gracefully', function() {
            const testCases = [
                { input: "", expected: "" },
                { input: "   ", expected: "" },
                { input: "a", expected: "A" },
                { input: "123", expected: "123" },
                { input: "a1b2c3", expected: "A1B2C3" }
            ];

            testCases.forEach(({ input, expected }) => {
                const result = toTitleCase(input);
                expect(result).to.equal(expected, `Failed for input: ${input}`);
            });
        });
    });

    describe('Edge Cases and Error Handling', () => {
        it('should handle empty strings', function() {
            expect(toSnakeCase("")).to.equal("");
            expect(toCamelCase("")).to.equal("");
            expect(toPascalCase("")).to.equal("");
            expect(toKebabCase("")).to.equal("");
            expect(toTitleCase("")).to.equal("");
        });

        it('should handle strings with only separators', function() {
            const separatorOnlyInputs = ["---", "___", "   ", "...", "!@#"];
            
            separatorOnlyInputs.forEach(input => {
                expect(toSnakeCase(input)).to.equal("", `snake_case failed for: ${input}`);
                expect(toCamelCase(input)).to.equal("", `camelCase failed for: ${input}`);
                expect(toPascalCase(input)).to.equal("", `PascalCase failed for: ${input}`);
                expect(toKebabCase(input)).to.equal("", `kebab-case failed for: ${input}`);
                expect(toTitleCase(input)).to.equal("", `Title Case failed for: ${input}`);
            });
        });

        it('should handle single character inputs', function() {
            expect(toSnakeCase("a")).to.equal("a");
            expect(toCamelCase("a")).to.equal("a");
            expect(toPascalCase("a")).to.equal("A");
            expect(toKebabCase("a")).to.equal("a");
            expect(toTitleCase("a")).to.equal("A");
        });

        it('should handle numeric-only inputs', function() {
            expect(toSnakeCase("123")).to.equal("123");
            expect(toCamelCase("123")).to.equal("123");
            expect(toPascalCase("123")).to.equal("123");
            expect(toKebabCase("123")).to.equal("123");
            expect(toTitleCase("123")).to.equal("123");
        });
    });
});