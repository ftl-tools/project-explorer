# Name Casing

This document defines the name casing conventions and conversion rules used throughout the Logical Project Explorer extension. We'll need a robust system for converting names from one case into another.

## snake_case

"the3DQuick_brown fox-jumps.overTheLazy_dog." in snake_case becomes "the_3d_quick_brown_fox_jumps_over_the_lazy_dog".

<details>
<summary>Test that</summary>

- Input string converts exactly to the documented snake_case output, preserving number groups and inserting underscores between words and before numbers.
- Mixed separators (spaces, hyphens, dots, underscores) normalize to single underscores; consecutive separators collapse to one underscore.
- Leading/trailing separators are trimmed; Unicode letters are lowercased and preserved.

[How to Test](/design_docs/vscode_extensions.md#testing)

</details><br>

## camelCase

"the3DQuick_brown fox-jumps.overTheLazy_dog." in camelCase becomes "the3dQuickBrownFoxJumpsOverTheLazyDog".

<details>
<summary>Test that</summary>

- Input converts to the documented camelCase output: lowercased initial token, subsequent tokens capitalized; digits remain adjacent to words as shown.
- Punctuation and separators are removed; acronyms like "3D" normalize to "3d" per example.
- Leading/trailing separators are ignored; non-ASCII letters are preserved and case-folded appropriately.

[How to Test](/design_docs/vscode_extensions.md#testing)

</details><br>

## PascalCase

"the3DQuick_brown fox-jumps.overTheLazy_dog." in PascalCase becomes "The3dQuickBrownFoxJumpsOverTheLazyDog".

<details>
<summary>Test that</summary>

- Input converts to the documented PascalCase output: each token capitalized, digits preserved and normalized like "3D" -> "3d".
- No separators remain; no leading underscores or punctuation appear.
- Handles single-token and all-separator inputs gracefully, yielding an empty string or capitalized token as appropriate.

[How to Test](/design_docs/vscode_extensions.md#testing)

</details><br>

## kebab-case

"the3DQuick_brown fox-jumps.overTheLazy_dog." in kebab-case becomes "the-3d-quick-brown-fox-jumps-over-the-lazy-dog".

<details>
<summary>Test that</summary>

- Input converts exactly to the documented kebab-case output: lowercase tokens separated by single hyphens, numeric boundaries handled like "3d".
- Multiple separators collapse to single hyphens; no leading/trailing hyphens remain.
- Non-ASCII letters are preserved; unsupported punctuation is removed.

[How to Test](/design_docs/vscode_extensions.md#testing)

</details><br>

## Title Case

"the3DQuick_brown fox-jumps.OverTheLazy_dog." in Title Case becomes "The 3D Quick Brown Fox Jumps Over The Lazy Dog".

<details>
<summary>Test that</summary>

- Input converts exactly to the documented Title Case output, including spacing around numbers and capitalization of each word.
- Hyphens/underscores/dots/spaces normalize to single spaces; numeric tokens like "3D" are uppercased as shown.
- Leading/trailing whitespace is trimmed; apostrophes are preserved within words (e.g., "Dog's" -> "Dog's").

[How to Test](/design_docs/vscode_extensions.md#testing)

</details><br>
