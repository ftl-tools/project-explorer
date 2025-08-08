# Apply design changes: URL favicon support in Project Explorer

## Checklist

- [x] Add dynamic favicon support for `url:` tree items when `icon` is omitted: initially show `$(globe)`, then update to site favicon when available. See: [Tree Items > User-Defined Tree Items](../design_docs/project_explorer.md#user-defined-tree-items).
- [ ] Implement favicon resolution order and fallbacks:
  - [x] Try `https://host/favicon.ico`
  - [x] If missing, parse HTML for `<link rel="icon" ...>` (including variants like `shortcut icon`, `apple-touch-icon`) and fetch that instead
  - [x] On failure or non-HTTP(S) schemes, keep using globe. See tests under [typeAndPath](../design_docs/project_explorer.md#tree-items)
- [ ] Add persistent caching:
  - [x] Store fetched icons on disk in the extension global storage
  - [x] Positive cache TTL 7 days; avoid refetching during TTL
  - [x] Negative cache (no icon found) TTL 24 hours
  - [x] Cache survives window reloads. See: [Tree Items tests](../design_docs/project_explorer.md#tree-items)
- [x] Keep the tree responsive while fetching; update only the affected item so selection state is preserved. See: [Tree Items tests](../design_docs/project_explorer.md#tree-items)

## Notes / Implications

- We need access to `ExtensionContext.globalStorageUri` for cache; pass `context` into the tree provider
- Use Node's built-in `http/https` to avoid adding dependencies and keep footprint small
- Save icons as `.ico/.png/.svg` based on link or content-type; set `iconPath` to the saved file Uri
- Emit `onDidChangeTreeData(element)` for the specific item to trigger a lightweight icon refresh
