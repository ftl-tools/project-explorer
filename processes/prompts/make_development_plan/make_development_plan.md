I want you to orchestrate subagents and have them plan out implementing the current design_docs. Follow these steps:

1. Spawn a @pm subagent and give it the `processes/prompts/make_development_plan/create_initial_dev_plan.template.md`, replacing any <parameters> in the prompt template with appropriate values.
2. When the subagent is done with that task, give it the `processes/prompts/make_development_plan/add_markdown_links.template.md`, replacing any <parameters> in the prompt template with appropriate values.
3. When the subagent is done with that task, one-at-a-time, for each task in the checklist
   1. Spawn a @pm subagent and give it the "`processes/prompts/make_development_plan/analyze_task_size.template.md`, replacing any <parameters> in the prompt template with appropriate values.
   2. When this subagent finishes, check the estimated size it returned for the task.
      - If the task is a medium or larger then give the same subagent the `processes/prompts/make_development_plan/breakdown_bigger_tasks.template.md`, replacing any <parameters> in the prompt template with appropriate values.
      - If the task is small or smaller, then they are done don't give them any more prompts, and continue to the next step below.
4. When all subagents have finished both prompts, collect their responses and compile a final report.
