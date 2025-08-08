# .meta/scripts/diff_code.sh
#!/usr/bin/env bash
# Usage: diff_code.sh <path/to/folder>
# Diff the given folder since last @all_doc_changes_applied
if [ -z "$1" ]; then
  echo "Usage: $0 <path/to/folder>" >&2
  exit 1
fi
last=$(./processes/scripts/get_last_doc_apply.sh)
git diff "$last" HEAD -- "$1"