function tokenize(input: string): string[] {
    if (!input) return [];
    
    // Remove leading and trailing separators (preserve Unicode letters)
    let processed = input.replace(/^[^\p{L}\p{N}]+|[^\p{L}\p{N}]+$/gu, '');
    
    if (!processed) return [];
    
    // Split on camelCase boundaries: lowercase followed by uppercase
    processed = processed.replace(/(\p{Ll})(\p{Lu})/gu, '$1 $2');
    
    // Split on boundaries between consecutive uppercase letters and lowercase
    processed = processed.replace(/(\p{Lu})(\p{Lu}\p{Ll})/gu, '$1 $2');
    
    // Split on letter-to-number and number-to-letter boundaries, but preserve "3D"
    processed = processed.replace(/(\p{N})(\p{L})/gu, (match, digit, letter) => {
        // Don't split "3D"
        if (digit === '3' && letter === 'D') {
            return match;
        }
        return digit + ' ' + letter;
    });
    processed = processed.replace(/(\p{L})(\p{N})/gu, '$1 $2');
    
    // Split on non-letter-non-number characters and filter empty tokens
    const tokens = processed
        .split(/[^\p{L}\p{N}]+/u)
        .filter(token => token.length > 0);
    
    return tokens;
}

export function toSnakeCase(input: string): string {
    const tokens = tokenize(input);
    return tokens
        .map(token => {
            // Normalize "3D" to "3d" for snake_case
            if (token === '3D') return '3d';
            return token.toLowerCase();
        })
        .join('_');
}

export function toCamelCase(input: string): string {
    const tokens = tokenize(input);
    if (tokens.length === 0) return '';
    
    return tokens
        .map((token, index) => {
            // Normalize "3D" to "3d" for camelCase
            if (token === '3D') token = '3d';
            const lowerToken = token.toLowerCase();
            if (index === 0) {
                return lowerToken;
            }
            return lowerToken.charAt(0).toUpperCase() + lowerToken.slice(1);
        })
        .join('');
}

export function toPascalCase(input: string): string {
    const tokens = tokenize(input);
    if (tokens.length === 0) return '';
    
    return tokens
        .map(token => {
            // Normalize "3D" to "3d" for PascalCase
            if (token === '3D') token = '3d';
            const lowerToken = token.toLowerCase();
            if (/^\d+$/.test(token)) {
                return lowerToken; // Keep numbers lowercase
            }
            return lowerToken.charAt(0).toUpperCase() + lowerToken.slice(1);
        })
        .join('');
}

export function toKebabCase(input: string): string {
    const tokens = tokenize(input);
    return tokens
        .map(token => {
            // Normalize "3D" to "3d" for kebab-case
            if (token === '3D') return '3d';
            return token.toLowerCase();
        })
        .join('-');
}

export function toTitleCase(input: string): string {
    if (!input) return '';
    
    const tokens = tokenize(input);
    
    // Post-process tokens to merge certain patterns for Title Case
    const processedTokens: string[] = [];
    for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i];
        const nextToken = tokens[i + 1];
        
        // Handle single digit + letter combinations like "3" + "d" -> "3D"
        if (nextToken && /^\d+$/.test(token) && /^[a-zA-Z]$/.test(nextToken)) {
            processedTokens.push(token + nextToken.toUpperCase());
            i++; // Skip the next token since we merged it
            continue;
        }
        
        // Handle patterns like "api" + "v" + "2" -> "API" + "V2"
        const nextNextToken = tokens[i + 2];
        if (nextToken && nextNextToken && /^\d+$/.test(nextNextToken)) {
            const lowerToken = token.toLowerCase();
            if (['api', 'html', 'xml', 'css', 'js', 'ts'].includes(lowerToken) && nextToken.toLowerCase() === 'v') {
                processedTokens.push(token.toUpperCase());
                processedTokens.push(nextToken.toUpperCase() + nextNextToken);
                i += 2; // Skip the next two tokens since we processed them
                continue;
            }
        }
        
        processedTokens.push(token);
    }
    
    return processedTokens
        .map(token => {
            // Special handling for tokens with numbers and letters like "3d", "HTML5"
            if (/^\d+[a-zA-Z]+$/.test(token)) {
                // For patterns like "3d" -> "3D", "2d" -> "2D"
                return token.toUpperCase();
            }
            if (/^[a-zA-Z]+\d+$/.test(token)) {
                // For patterns like "html5" -> "HTML5", but only for known acronyms
                const lowerToken = token.toLowerCase();
                const letterPart = lowerToken.replace(/\d+$/, '');
                if (['html', 'xml', 'css', 'js', 'ts', 'api'].includes(letterPart)) {
                    return token.toUpperCase();
                }
                // Otherwise just capitalize normally
                return lowerToken.charAt(0).toUpperCase() + lowerToken.slice(1);
            }
            
            // Special handling for common acronyms (only well-known ones that should stay uppercase)
            const lowerToken = token.toLowerCase();
            if (['html', 'xml', 'css', 'js', 'ts', 'http', 'url'].includes(lowerToken)) {
                return token.toUpperCase();
            }
            
            // Regular capitalization for other tokens
            return lowerToken.charAt(0).toUpperCase() + lowerToken.slice(1);
        })
        .join(' ');
}