---
name: next
description: Pick the next TODO item from plans/README.md to plan and implement
---

# Next TODO Item

Read `plans/README.md` and present the unchecked (`- [ ]`) items to the user.

## Steps

1. **Read** `plans/README.md` and find all unchecked items (`- [ ]`)
2. **Ask the user** which item they want to work on next (use AskUserQuestion with the unchecked items as options)
3. **Read** the linked plan file for the selected item (e.g., `plans/01-vocab-categories.md`)
4. **Plan** the implementation:
   - Research the codebase as needed to understand the current state
   - Flesh out the plan file with concrete implementation steps
   - Each step should have a `- [ ]` checklist item so progress can be tracked
   - Ask clarifying questions if needed
5. **Ask for approval** before implementing
6. **Implement** the plan once approved, checking off `- [x]` each step in the plan file as it's completed
   - If the actual implementation diverges from the plan (different approach, extra steps, skipped steps), update the plan file to reflect what was actually done
7. **Update status**:
   - Update the plan file status to `Done`
   - Check the item in `plans/README.md` (`- [x]`)

If there are no unchecked items, tell the user all TODO items are complete.