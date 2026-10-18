# Continuum: Material 3 design direction

Reference: https://m3.material.io/foundations/layout/canonical-examples/overview

The implementation adapts the canonical patterns to Continuum rather than adding a
component framework or changing its persistence.

- Feed: the dashboard uses a responsive project-card grid with actual progress and
  a separate attention list. Search, status chips and creation actions keep stable
  locations; status always has a text label.
- List–detail: the project drawer/rail stays separate from the current project's
  context, next steps and resources. Only the current destination is selected.
- Supporting pane: the timer is a secondary tool. It stays beside the main workspace
  on wide screens, reflows below it at 768–959px, and stacks on phones. Its session
  remains independent of navigation. The Focus shortcut reaches it directly.
- Adaptive navigation: a narrow rail is the initial navigation below 1440px, an
  expanded drawer on larger screens, and labeled bottom navigation below 768px.
  The drawer can also be expanded manually. Breakpoints reflect the web app's
  content needs rather than claiming a literal Android dp implementation.

`src/workspace/material.css` defines surface, primary, container, outline, text,
shape and motion roles. Warm cream and purple remain the brand palette. Material
influence comes from tonal hierarchy, generous spacing, restrained elevation,
pill actions, rounded panes, outlined fields, chips and segmented timer controls.
System typography avoids a remote-font dependency. The CSS is scoped to the app
workspace, leaving authentication and existing Firebase data behavior intact.

Accessibility: readable primary/secondary text roles, text status labels, visible
focus indicators, keyboard tabs, focus-managed dialogs and mobile drawer, Escape
to close the drawer, inert closed navigation, 48px phone controls for primary
buttons/chips/task actions, reduced-motion handling, and safe-area padding for the
bottom navigation. The timer is not an automatically announced live region.

Visual validation includes 390px phones, an 820px tablet reflow, and desktop.
No horizontal overflow was observed at those tested widths. A tablet track-sizing
issue was corrected so the focus pane starts after the primary pane ends.
No backend migration or GitHub update is part of this design iteration.

## Shared controls and select menus

`src/design-system.css` is the shared source for Material color roles, field heights,
corner shapes and control styles. It is imported after the screen styles to align
legacy buttons, fields, badges and dialogs with the workspace. User-selected project
icon colors remain independent identity colors.

`src/components/Select.jsx` supplies a controlled, select-only combobox for all
resource filters, task project selection and focus project/task selection. Its
portaled listbox has themed options, selected checkmarks, scrollable long lists,
viewport-aware placement, outside-click dismissal, Arrow/Home/End/Enter/Escape/Tab
handling and label typeahead. Focus stays on the trigger via aria-activedescendant,
so it works with the existing dialog focus trap. No new packages or database fields
are introduced. The user requested to perform testing; this iteration has not been
built, automatically tested, or browser-tested by the agent.


## Unified form and typography system

References:
- https://m3.material.io/styles/typography/applying-type
- https://m3.material.io/components/text-fields/guidelines
- https://github.com/material-components/material-web/blob/main/docs/components/text-field.md

The collapsed navigation rail no longer contains a redundant Focus shortcut. The
supporting focus pane and compact-screen bottom-navigation action remain.

`FormDialog`, `Field` and `useDialogForm` in `src/components/FormDialog.jsx` are now
shared by project, resource and next-step creation/editing. Dialogs use one width,
surface, header, scrollable body, sticky action region and focus-management pattern.
Fields use persistent labels, required/optional indicators and aria-linked supporting
text. Empty, filled, hover, focus, disabled, readonly and error treatments share role
tokens. Validation runs on blur and submit; touched fields revalidate as they change.
All dialogs prevent duplicate submissions, show a saving state, disable dismissal
while saving, and retain input on failure. Project/resource saves now return backend
acknowledgment to the form instead of closing before the write resolves.

The typography tokens in `src/design-system.css` define headline, title, body and
label roles shared across screen headings, cards, actions, metadata and chips.
Editable tags use one selectable-chip treatment; read-only tags and badges share
one label role. Existing project icon colors remain user-selected identity colors.

As requested by the user, no automated build, tests, or browser testing were run
for this iteration. Review in the local preview before publishing.
