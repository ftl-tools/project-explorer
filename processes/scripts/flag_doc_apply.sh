# processes/scripts/flag_doc_apply.sh
#!/usr/bin/env bash
# Usage: flag_doc_apply.sh -m "Commit message" [-a]
# -a will do `git commit -a` (stage all modified files)
all_flag=""
while getopts "m:a" opt; do
  case $opt in
    m) msg=$OPTARG    ;;
    a) all_flag="-a"  ;;
    *) exit 1         ;;
  esac
done
if [ -z "$msg" ]; then
  echo "Usage: $0 -m \"Commit message\" [-a]" >&2
  exit 1
fi
git add .
git commit $all_flag -m "$msg

@all_doc_changes_applied"