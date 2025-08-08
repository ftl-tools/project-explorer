# processes/scripts/diff_design_docs.sh
#!/usr/bin/env bash
# Diff design_docs/ since last @all_doc_changes_applied
last=$(./processes/scripts/get_last_doc_apply.sh)
git diff "$last" -- design_docs/