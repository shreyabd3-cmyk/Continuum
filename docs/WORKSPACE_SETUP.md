# Workspace preview and Firebase setup

## Run

`npm install`, then `npm run dev`. Run `npm test` and `npm run build` for checks.
The preview remains local; nothing in this update publishes to GitHub or hosting.

## Existing architecture and preserved data

React 18, Vite, Tailwind, Firebase Authentication and Firestore remain in use.
The existing Firebase app/project and authenticated UID are reused. Existing project
fields, resource tags and question history are retained. Older plain-text “Don't forget”
notes are read as checkbox rows and only converted when the user changes that list.
The separate Next steps tasks never reinterpret legacy reminder checkboxes as tasks.
No bulk migration, data deletion, or invented activity is required.

New per-user paths under `/artifacts/continuum-v1/users/{uid}`:

- `tasks/{taskId}`: projectId, title, optional dueDate (local YYYY-MM-DD), completed,
  completedAt, createdAt, updatedAt.
- `workspace/timer`: one shared timer document, revision, mode, status, projectId,
  optional taskId, sessionId, duration, remaining and endsAt (epoch milliseconds).
- `focusSessions/{sessionId}`: immutable completed focus records, projectId, optional
  taskId, duration, completedAt, mode, status. Breaks are never recorded here.

Firestore listeners recover the active timer after refresh and synchronize tabs.
All timer edits compare a revision in a transaction. Finishing a session checks the
same revision, reads its deterministic session document, and writes the session and
completed timer atomically. Pausing, resetting and switching focus do not record time.
A completed session never marks the task complete. The app must reconnect to Firebase
before a restored timer can be read or a session logged. Display uses wall-clock end
instants, not interval tick counts. Daily summaries use the viewer's local timezone.

Demo mode is explicitly labeled, holds changes in memory, and resets on refresh. It
starts with sample project context but zero tasks and zero focus activity. To verify
cross-refresh persistence, use an authenticated account, not the disposable demo.

## Firestore access rules

The repository did not contain the deployed Firestore rules or Firebase deployment
configuration. Live rules were not changed. Confirm that existing rules grant the
signed-in user access to these new paths and deny other UIDs. If existing rules only
cover projects, merge the following match blocks **inside** your existing
`match /databases/{database}/documents` block. Keep existing project/resource rules.
Do not replace an entire deployed ruleset with this snippet.

```javascript
match /artifacts/continuum-v1/users/{uid}/tasks/{taskId} {
  allow read, delete: if request.auth != null && request.auth.uid == uid;
  allow create, update: if request.auth != null && request.auth.uid == uid
    && request.resource.data.title is string
    && request.resource.data.title.size() > 0
    && request.resource.data.title.size() <= 300
    && request.resource.data.projectId is string
    && exists(/databases/$(database)/documents/artifacts/continuum-v1/users/$(uid)/projects/$(request.resource.data.projectId))
    && request.resource.data.completed is bool
    && request.resource.data.dueDate is string;
}
match /artifacts/continuum-v1/users/{uid}/workspace/timer {
  allow read, write: if request.auth != null && request.auth.uid == uid;
}
match /artifacts/continuum-v1/users/{uid}/focusSessions/{sessionId} {
  allow read: if request.auth != null && request.auth.uid == uid;
  allow create: if request.auth != null && request.auth.uid == uid
    && request.resource.data.id == sessionId
    && request.resource.data.mode == 'focus'
    && request.resource.data.status == 'completed'
    && request.resource.data.duration == 1500;
  allow update, delete: if false;
}
```

These are client-owned productivity records, not tamper-proof billing records. Rules
cannot prevent a user from manufacturing their own stats. There are no new composite
indexes: the app listens to the user's collections and computes small-workspace views
locally. Keep `localhost`/the preview host authorized in Firebase Authentication if
needed for Google or email-link sign-in. Never change live rules without reviewing
the complete existing ruleset (Firestore allows are additive).

## Validation and remaining live checks

Automated model tests cover real task progress, unchecked tasks, zero activity,
25/5/15 durations, background elapsed time, serialized recovery, pause/resume, reset,
completion guards, local midnight totals, exclusion of breaks/abandoned sessions and
seven-day calendar boundaries across daylight saving time. Run with different TZ
values to exercise local-date handling.

Browser checks use the explicitly disposable demo to avoid modifying real projects.
Verified task creation, editing, due-date shortcuts/radar, completion and unchecking,
progress/count updates, search, deletion, focus selection/start/pause, navigation
with a paused timer, and autosave during immediate project switching. Responsive
checks cover a 390px mobile viewport and the desktop layout.
Before publishing, sign into the local preview to verify deployed rules: task CRUD
persists after reload; a running/paused timer restores after reload; a second tab sees
the same timer; one completed focus session produces exactly one record and 25 minutes;
access from a second UID is denied. Live authenticated persistence and security rules
cannot be confirmed without an authenticated account or the deployed rules/emulator.
The current machine has no Java runtime for the Firestore emulator.

## Focus garden and floating timer (local preview)

The focus panel can collapse to a floating pill; its position, view and alert preferences
are local appearance settings. The mobile Focus button expands the full panel again.
Break modes hide project/task controls but retain the selection for the next focus session.
Sessions never start automatically, and tasks never complete automatically.

Garden growth is derived from deduplicated completed focus sessions, at 25/75/150/250
minutes per plant. Breaks and unfinished sessions do not count. Bloomed plants remain
in the collection. `gardenStartedAt` and `gardenPlantIndex` are saved on the existing
per-user workspace timer document; no new collection or bulk data migration is needed.
Historical completed focus time also contributes to the garden. The demo includes a
clearly labeled illustration preview that does not write sessions or change statistics.

Completion alerts include an in-app message, tab title, optional soft chime and opt-in
desktop notifications when the tab is hidden. Notification permission is requested only
from the Enable notifications button. Clicking a notification requests window focus;
the browser/OS decides whether it can bring the window forward. Unsupported/blocked
notifications retain sound and in-app feedback. These are open-page notifications, not
scheduled push notifications: suspended/closed tabs and sleeping devices may delay or
prevent an alert. Notifications never include project/task names. No service worker,
push service or notification backend was added.

Garden tests cover milestones, duplicate records, exclusion of breaks/abandoned sessions,
repeat planting and historical session totals. Browser checks cover project-free breaks,
floating pause/corner switching, mobile positioning and seed planting with zero awarded
minutes. Desktop permission delivery, live completion logging and authenticated recovery
still require a supported browser and a signed-in account for end-to-end verification.

## Motion and garden discoveries (local preview)

Shared motion uses short press feedback and 300–420ms settling transitions. Native
checkbox inputs retain keyboard operation and visible focus. List reordering uses
layout offsets (not scroll positions); task completion briefly shows the checkmark
before an open-only list removes the row. Progress bars interpolate completed data.
New resources include a creation timestamp for a brief arrival highlight. Resolved
questions offer a View answer shortcut. Timer panel/pill morphing uses progressive
View Transitions support, with direct state changes as the fallback.

Tapping plants reveals short messages. A butterfly occasionally visits awake blooms,
with a per-browser-session cooldown; clicking sends it away. Long-break mode rests the
plant and shows a moon without changing focus progress. The first-bloom keepsake and
date are derived from the earliest real cumulative 250 focus minutes, excluding breaks,
invalid records and duplicates. No new collection or reward-write permission is needed.
Demo bloom previews expose the butterfly and a clearly labeled keepsake illustration;
these previews never unlock rewards or write focus history. Motion has a reduced-motion
alternative and garden controls support keyboard interaction.
