# processes/scripts/get_last_doc_apply.sh
#!/usr/bin/env bash
# Prints the SHA of the most recent commit tagged with @all_doc_changes_applied
git rev-list -n1 --grep='@all_doc_changes_applied' HEAD