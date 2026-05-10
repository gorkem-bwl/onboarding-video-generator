# State capture checklists by feature archetype

Use this during intake to generate the screenshot list for a feature video. Match the feature to an archetype, list the required states, then ask the user to capture them. Skipping this leads to "I started authoring then realized I'm missing the focused state of the input" — a 30-minute mistake that takes 10 seconds to prevent.

## How to use

1. Read the user's one-sentence description of the feature.
2. Pick the closest archetype below. If two apply, pick the dominant action.
3. Send the user the matching state list as part of intake. Don't start authoring until each state is captured.

## Archetypes

### CRUD — Create (form-fill in a modal/page)

Examples: add a task, create a project, invite a user.

- [ ] **List view, resting** — the table/grid before the new item exists. Counter cards visible (e.g. "Total: 7").
- [ ] **List view, focused on the create button** — same as above but with the create button hovered or visually emphasized. Optional but useful for the click target beat.
- [ ] **Modal/page open, empty** — every form field in its default state.
- [ ] **Modal/page, partially filled** — at least one required field with realistic data, to demonstrate the typing/selection beat. If multiple field types are used (text, dropdown, date), capture an intermediate state showing each.
- [ ] **Modal/page, fully filled, primary button enabled** — all required fields populated, the submit button in its enabled state (some apps disable submit until the form is valid).
- [ ] **List view, with the new item** — same crop as the resting state, but with the new row visible. Counter cards updated.

### CRUD — Update (edit existing item)

- [ ] **List/detail view, resting** — the item before the edit.
- [ ] **Edit mode opened** — the field(s) showing as editable.
- [ ] **Edited, mid-change** — old value partially overwritten with the new value.
- [ ] **Edited, saved** — the item showing the new value, ideally with a brief confirmation cue (toast, checkmark, color change).

### CRUD — Delete

- [ ] **List view, resting** — the item before deletion.
- [ ] **Confirmation dialog** — the "Are you sure?" prompt with the destructive button.
- [ ] **List view, after deletion** — same crop as resting, item gone, counters decremented.

### Toggle / switch

Examples: enable a feature, mark complete, archive.

- [ ] **Off / inactive state** — at rest.
- [ ] **Mid-toggle** — the switch animation halfway, or button being pressed. (Often skipped — the rest-and-result frames carry the beat with a CSS animation.)
- [ ] **On / active state** — at rest.
- [ ] **Side-effect state** — anything else on the screen that updates because of the toggle (a chip turning green, a row moving to a different section, a badge appearing).

### Drag and drop / reorder

- [ ] **Initial order** — list at rest, items in starting position.
- [ ] **Item picked up** — drag handle active, item shows lift cue (shadow, scale, opacity).
- [ ] **Mid-drag, hover over target** — drop indicator visible at the target position.
- [ ] **Final order** — list at rest, items in new position. (Capture from the same crop as initial order so the reorder is the only difference.)

### Filter / search / sort

- [ ] **Unfiltered list** — full results, default sort.
- [ ] **Filter UI open** — the filter panel/dropdown with options visible.
- [ ] **Filter applied, mid-state** — the filter chip/pill showing what's selected, results updating.
- [ ] **Filtered list** — results showing only matching items. Empty state if no matches is also worth capturing for some videos.

### Empty state → populated

Examples: first-time use, "no projects yet" → "your first project."

- [ ] **Empty state** — illustration, headline, primary CTA.
- [ ] **Action triggered** — typically maps to a CRUD-Create flow from here. See that archetype.
- [ ] **Populated state** — the page with content, no longer showing the empty illustration.

### Notification / status change

Examples: alert appears, task overdue, sync complete.

- [ ] **Pre-event state** — the UI before the notification fires.
- [ ] **Notification visible** — toast/banner/badge in its on-screen position.
- [ ] **Post-event state** — what the UI looks like after the notification dismisses (often = pre-event with a small persistent change like a counter increment or status pill swap).

### Multi-step flow / wizard

For features that span 3+ screens. Treat each step as its own beat using the CRUD-Create checklist for each step, plus:

- [ ] **Step indicator** — capture the wizard's progress UI at each step so the viewer can orient.
- [ ] **Final success screen** — the completion state with whatever confirmation/CTA appears.

### Dashboard / chart / data viz

- [ ] **Chart in resting state** — full data, default time range.
- [ ] **Hover/tooltip state** — cursor on a data point, tooltip showing values.
- [ ] **Filter or time-range change** — chart re-renders for a different slice. Optional but useful if the value of the feature is the interactivity.

## Don't ask for these (the skill builds them)

- Cursor / pointer states — the `<Pointer>` component handles fade-in and click ripple
- Caption overlays — the skill adds these on top
- Hover-with-cursor states from the app — the cursor is fake, not a real screenshot
- Loading spinners — usually animated in the rebuild rather than captured

## Output format to send to the user

Once you've matched the archetype, send a single message like:

> For the "<feature>" video I'll need these screenshots — can you drop them into `public/<feature>/` named as below?
>
> 1. `list-resting.png` — the list view before the new item exists
> 2. `modal-empty.png` — the create modal with all fields empty
> 3. `modal-filled.png` — the modal with all required fields filled in
> 4. `list-with-new.png` — the list view with the new item
>
> I'll start authoring once you've dropped them. If any of these are awkward to capture (e.g. you don't have realistic data), tell me and I'll work around it.

Don't list states the user can't reasonably capture (e.g. mid-toggle if the app doesn't expose that animation frame). Substitute "rest before" + "rest after" and rebuild the transition.
