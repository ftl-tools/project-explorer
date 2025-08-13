Make a task plan for updating code to match the design doc specs.

## Create the initial task plan doc file

1. Print the diff of all design-doc changes since the last apply using the script:
   ```bash
   ./processes/scripts/diff_design_docs.sh
   ```
2. Review the diff and think hard about every design detail that has changed, their implications.
3. Create an `.md` task doc for this change in `tasks/`, and start it with a bulleted, markdown checklist containing 1-6 steps needed to implement these changes. Each step should have a bold title followed by a 1-2 sentence description and should clearly outline a specific step or deliverable for the development team. Feel free to skip any changes to the docs that are purely organization and don't affect the design or behavior of the product. Think hard about each of these steps as you write them. Once again, please write no more than 6 steps in the checklist.

Format your plan as a markdown checklist.

```markdown
# Title of Task Plan

- [ ] **Step Title:** Step one details...
```

## Analyze step sizes

Next you need to accurately estimate the scale of each proposed step in the task markdown document. Think deeply about what technically will be entailed to accomplish each step and then add a size estimate to the end of the step in parens (e.g. `- [ ] **Step Title:** Step summary. (S)`).

Please use scrum t-shirt sizes XS, S, M, L, and XL to indicate the size of the step. Here are some examples:

- XS
  - Tiny copy/CSS fix, add a missing null check
  - Update an environment variable or CI step
- S
  - Minor schema change plus simple UI validation
  - Add a small feature flag with toggle-able behavior
- M
  - New form or list page backed by a simple API
  - Add file upload to S3 with basic errors handled
- L
  - Cross‑cutting change touching multiple services/modules
  - Nontrivial third‑party integration end‑to‑end
  - Add several related pages or endpoints
- XL (split into smaller items)
  - New module with data model, API, UI, and migrations
  - Significant refactor across domains

## Optimize step sizes

Go through each step in the task document you just created. We've found that developers work best when they are given a series of small-t-shirt sized steps that each contain a small, functioning, testable part of the product. So, take any larger steps and break them down into 3-8 small t-shirt sized steps, and take xs sized steps and combine them into small sized steps. Add sub-steps underneath their parent step. For example:

```markdown
# Title of Task Plan

- [ ] **Step One:** Step one details...
  - [ ] **Sub-Step A:** Sub-step A details...
  - [ ] **Sub-Step B:** Sub-step B details...
  - [ ] **Sub-Step C:** Sub-step C details...
```

Think hard about each of these as you write them.

## Add links to specs

Go through each of step and sub-step in the task document you just created one-by-one and add a list links to of related design document sections to the end of each checklist item. Each link should point to the specific section of the design document that is relevant to the step. Only link to the whole document if every section in the design doc is relevant to this step. Format them exactly like this:

```markdown
# Title of Task Plan

- [ ] **Step One:** Step one details... Related docs: [Related Doc One - Relevant Section](design_docs/related_doc_one.md#relevant-section), [Related Doc Two - Relevant Section A](design_docs/related_doc_two.md#relevant-section-a), [Related Doc Two - Relevant Section B](design_docs/related_doc_two.md#relevant-section-b)
```
