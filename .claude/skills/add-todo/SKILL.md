---
name: add-todo
description: Add a new TODO item and plan file to plans/
---

# Add TODO Item

Add a new TODO item to `plans/README.md` with a corresponding plan file.

## Steps

1. **Ask the user** (via AskUserQuestion) for a short title and one-line description of the TODO item
2. **Determine the next number** by reading `plans/README.md` and finding the highest existing number prefix (e.g., `03` → next is `04`)
3. **Create the plan file** at `plans/<NN>-<slug>.md` with this template:

```markdown
# <Title>

## Status
TODO

## Goal
<description from user>

## Steps
- [ ] (to be filled in when working on this item)
```

4. **Append** a new unchecked item to the TODO list in `plans/README.md`:
   `- [ ] [<Title>](<NN>-<slug>.md) — <description>`