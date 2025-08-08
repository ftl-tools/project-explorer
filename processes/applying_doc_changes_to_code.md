# Applying Doc Updates to Code

Implement any updates to the design docs in the actual code, following these steps exactly.

1. Make a task plan doc.
   1. Print the diff of all design-doc changes since the last apply using the script:
      ```bash
      ./processes/scripts/diff_design_docs.sh
      ```
   2. Review the diff and identify all individual changes to the design, as well as what changes are merely organizational, and have no impact on the design or code.
   3. Create an `.md` task doc for this change in `tasks/`, and start it with a bulleted checklist summarizing each added, removed, or modified feature/behavior in a sentence or two. Add a link to each bullet point linking to the relevant design doc section header. Don't bother with changes that are organization or clean up, but don't that don't affect the spec.
   4. Double check the diffs and see if there are any additional changes to the design that you missed, or unexpected design implications that will be needed to support these updates, and add them to the task checklist as well.
2. Implement the changes.
   1. Read the task doc.
   2. Implement the changes in the code one at a time, checking off each item in the file checklist as you go. So the team can know where you're at.
   3. If there are tests, run all of them, and then go back and debug if needed.
   4. Make a build of the extension using the build script.
   5. Make a git commit, flagging it as being a doc-apply commit:
      ```bash
      ./processes/scripts/flag_doc_apply.sh -m "Apply doc changes for XYZ"
      ```
