# Plan: Microsoft OAuth + Configurable Submission Deadlines

Reverted commits:
- `a217967` — Add Microsoft OAuth provider and configurable submission deadlines
- `a9c9e49` — Merge branch: resolve conflicts

Restore target: `ef938c5`

---

## 1. Infrastructure / config

### `.gitignore`
Add:
```
.env*.local
.vercel
*.pem
/temp
```

### `docker-compose.yml` / `docker-compose.m1.yml`
- Change image from `amd64/postgres:15.1` to `postgres:15.1` (both files)
- In `docker-compose.m1.yml`: expose dev DB on port `5433:5432` (was `5432:5432`)
- Add newline at end of both files

---

## 2. Microsoft OAuth provider

### New file: `src/components/common/Icons/MicrosoftIcon.tsx`
Four-quadrant SVG icon (red, green, blue, yellow squares):
```tsx
export function MicrosoftIcon() {
  return (
    <svg width="34" height="34" viewBox="0 0 34 34" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M16.1 16.1H4V4h12.1v12.1z" fill="#F25022" />
      <path d="M30 16.1H17.9V4H30v12.1z" fill="#7FBA00" />
      <path d="M16.1 30H4V17.9h12.1V30z" fill="#00A4EF" />
      <path d="M30 30H17.9V17.9H30V30z" fill="#FFB900" />
    </svg>
  );
}
```

### `src/components/common/Icons/index.ts`
Export `MicrosoftIcon` alongside existing icons.

### `src/components/common/RegisterButton/RegisterButton.module.scss`
Add `.Microsoft` variant:
```scss
&.Microsoft {
  background: white;
  color: #274159;
  text-align: center;
}
```

### `src/components/common/RegisterButton/RegisterButton.tsx`
- Add `"Microsoft"` to the `icon` prop union type
- Import `MicrosoftIcon`
- Render `<MicrosoftIcon />` when `icon === "Microsoft"`

### `src/components/view/Index/Register.tsx`
Add button:
```tsx
<RegisterButton icon="Microsoft" onClick={() => signIn("azure-ad")} />
```

### NextAuth config (`src/pages/api/auth/[...nextauth].ts` or equivalent)
Add Azure AD provider. Requires env vars: `AZURE_AD_CLIENT_ID`, `AZURE_AD_CLIENT_SECRET`, `AZURE_AD_TENANT_ID`. See Auth.js docs for `AzureADProvider`.

---

## 3. Configurable submission deadlines

Replaces the hardcoded "10 minutes before match start" rule. Deadlines are now stored as `groupSubmissionsEnd: DateTime` and `finalsSubmissionsEnd: DateTime` columns on the `Prode` model.

### Schema changes (Prisma)
Add to `Prode` model:
```prisma
groupSubmissionsEnd   DateTime
finalsSubmissionsEnd  DateTime
```
Run migration and seed with appropriate values for WC 2026.

### `src/utils/queries.ts`

**Add helpers:**
```ts
function isDeadlineReached(deadline: Date) {
  return deadline.getTime() <= Date.now();
}

export function groupSubmissionsEnded(room: { prode: { groupSubmissionsEnd: Date } }) {
  return isDeadlineReached(room.prode.groupSubmissionsEnd);
}

export function finalsSubmissionsEnded(room: { prode: { finalsSubmissionsEnd: Date } }) {
  return isDeadlineReached(room.prode.finalsSubmissionsEnd);
}
```

**Update `getAllowedMatchesToModify`:**
- Add `submissionsEnd: Date` parameter
- Return `[]` immediately if `isDeadlineReached(submissionsEnd)`
- Remove the `date: { gte: getNextTenMinutesDate() }` filter from the Prisma query

**Update `getUserFinalMatches` and `getUserGroupMatches`:**
- Change parameter type from `ProdeRoom` to `ProdeRoomWithDeadlines` (intersection with `{ prode: { groupSubmissionsEnd, finalsSubmissionsEnd } }`)
- Replace `disabled: match.date < getNextTenMinutesDate()` with the appropriate `groupSubmissionsEnded` / `finalsSubmissionsEnded` call

**Update `getUserTemplateFinalMatches` and `getUserTemplateGroupMatches`:**
- Same disabled logic change — use `finalsSubmissionsEnded` / `groupSubmissionsEnded` with the fetched `prode` record

**Remove import:** `getNextTenMinutesDate` from `./date`

### API routes — add 403 guard and pass deadline to `getAllowedMatchesToModify`

Four routes to update:

| File | Deadline field |
|------|---------------|
| `src/pages/api/[id]/groups.ts` | `room.prode.groupSubmissionsEnd` |
| `src/pages/api/[id]/finals.ts` | `room.prode.finalsSubmissionsEnd` |
| `src/pages/api/groups.ts` | `userProde.prode.groupSubmissionsEnd` |
| `src/pages/api/finals.ts` | `userProde.prode.finalsSubmissionsEnd` |

In each:
1. Import the relevant `groupSubmissionsEnded` / `finalsSubmissionsEnded` helper
2. After fetching the room/userProde, add: `if (XSubmissionsEnded(room)) return res.status(403).send({});`
3. Pass the deadline to `getAllowedMatchesToModify(ids, room.prode.XSubmissionsEnd)`

### Page-level changes (groups + finals, both roomed and template variants)

For each of the four pages (`src/pages/groups.tsx`, `src/pages/[id]/groups.tsx`, `src/pages/finals.tsx`, `src/pages/[id]/finals.tsx`):

**`getServerSideProps`:**
- Replace `submissionsEnded: false` with `submissionEndsAt: prode.XSubmissionsEnd.toISOString()`
- For roomed pages: field is already on `room.prode`; for template pages: fetch `await prisma.prode.findFirst()` and read the field

**`HomeProps` interface:**
- Replace `submissionsEnded: boolean` with `submissionEndsAt: string`

**Component body:**
```tsx
const [now, setNow] = React.useState(() => Date.now());
useInterval(() => setNow(Date.now()), 60000);
const submissionsEnded = React.useMemo(
  () => new Date(props.submissionEndsAt).getTime() <= now,
  [now, props.submissionEndsAt]
);
```
- Replace all `props.submissionsEnded` refs with local `submissionsEnded`
- Pass `submissionEndsAt={props.submissionEndsAt}` to every `DailyMatchInput`, `DailyMatchFinalInput`, and `UserMatchFinalsInput`

### Component prop additions

**`DailyMatchInput` / `DailyMatchFinalInput` / `UserMatchFinalsInput`:**
- Add `submissionEndsAt?: Date | string | null` to props interface
- Derive `const submissionEndsAt = useMemo(() => props.submissionEndsAt ? new Date(props.submissionEndsAt) : null, [props.submissionEndsAt])`
- In `updateMatchStatus`:
  - `const deadline = submissionEndsAt ? submissionEndsAt.getTime() : props.date.getTime() - 10 * 60 * 1000`
  - `const offset = submissionEndsAt ? 0 : 10 * 60`
  - `const timeLeft = (deadline - Date.now()) / 1000`
  - `const hours = Math.floor((timeLeft - offset) / 3600)`
  - `const minutes = Math.floor((timeLeft - offset) / 60)`
  - Add `submissionEndsAt` to the `useCallback` dep array

---

## 4. Bug fixes bundled in the same commits

### `src/utils/raw.ts` — penalty shootout scoring
In `getSubqueryFinals`, the exact-goals-with-penalties cases were awarding `pointsGoals + pointsWinner` but should award only `pointsGoals` (winner is already covered by the prior WHEN branch). Fix both occurrences:
```sql
-- before
THEN ${room.pointsGoals + room.pointsWinner}
-- after
THEN ${room.pointsGoals}
```

Also fix column alias bug in the leaderboard SELECT: `fp8`, `fp4`, `fp2`, `fp1` were all aliasing `fp."points"` — should alias `fp8."points"`, `fp4."points"`, `fp2."points"`, `fp1."points"` respectively. Align indentation of all GROUP_*/FINALS_* lines.

> **Warning (Landmine #1):** `utils/points.ts` must be updated to match — penalty exact-goals should also award only `pointsGoals`, not `pointsGoals + pointsWinner`. Keep Stage 1 tests green.

### `src/components/view/Finals/FinalsResultsWarning.tsx`
Display only `pointsGoals` in the indicator, not `pointsGoals + pointsWinner`:
```tsx
// before
{props.roomConfig.pointsGoals + props.roomConfig.pointsWinner}
// after
{props.roomConfig.pointsGoals}
```

---

## 5. Locale strings

In `src/locale/locale.json` (both `es` and `en`):
- `headerWelcomeLine2`: replace "10 minutos antes..." / "up to 10 minutes before any match starts" with "antes del cierre de la fase" / "before the phase closes"
- `metaDescription`: update to reflect configurable deadline (remove "10 minutes" phrasing)
