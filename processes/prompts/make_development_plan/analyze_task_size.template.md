I need you to accurately estimate the scale of the proposed "<task-name>" task in the `design_docs/development_plan.md`. To do this:

1. Read in all related docs listed in the task as well as any others in `design_docs/` you think might be helpful
2. Think deeply about what technically will be entailed to accomplish this task
3. Return an accurate estimate of the size of this task.

Please use scrum t-shirt sizes XS, S, M, L, and XL to indicate the size of the task. Here are some examples:

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
