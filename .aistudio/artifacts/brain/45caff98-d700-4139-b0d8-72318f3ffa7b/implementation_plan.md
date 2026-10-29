# ShieldNet — Pure App UI Refinement & Hardware Mock Removal

Remove all artificial physical device mockups (fake status bar, battery, Wi-Fi, time, camera punch-hole, and phone chassis) so ShieldNet runs strictly as a clean, production-grade application filling the screen with a full-width responsive layout.

---

### User Review & Critical Decisions

> [!IMPORTANT]
> - **Total Elimination of Simulated Hardware**: A real Android application does not draw its own battery percentage, Wi-Fi signal, camera punch-hole, or phone casing. All simulated hardware components (`AndroidStatusBar`, `AndroidPhoneFrame`, device bezels, side buttons) will be completely removed.
> - **Full-Width Responsive Architecture**: As confirmed, the application will stretch into a clean, modern, full-width responsive layout on larger displays while remaining touch-optimized for mobile viewports.
> - **Direct Home Dashboard Launch**: On launch, users land directly on the functional **Home** dashboard with the primary protection status and quick actions ready to add websites, while keeping onboarding and permission guides accessible on demand from Settings.

- **Confirmed Decision 1**: Full-width responsive layout stretching cleanly across screens without artificial frame constraints.
- **Confirmed Decision 2**: Direct landing on the Home dashboard with protection and blocklist controls immediately ready.
- **Confirmed Decision 3**: Complete removal of fake system UI (battery, Wi-Fi, time, camera punch-hole).

---

### 1. Overview of Proposed Changes

1. **Delete Simulated Device Frame & Status Bar**:
   - Delete `src/components/AndroidStatusBar.tsx` (the fake clock, battery, and signal bar).
   - Delete `src/components/AndroidPhoneFrame.tsx` (the phone chassis, side buttons, camera hole, and frame toggle).
2. **Refactor App Root Layout (`src/App.tsx`)**:
   - Render the application directly within a clean, full-width responsive container (`w-full min-h-screen bg-white`).
   - Top application header with ShieldNet brand identity, active protection indicator, and notifications.
   - Max-width content containers (`max-w-4xl mx-auto px-4 sm:px-6 py-6`) for balanced responsive readability on desktop without stretching text excessively.
   - Responsive persistent bottom navigation bar anchored cleanly at the bottom of the viewport.
3. **Default to Home Dashboard**:
   - Ensure the app opens directly to the Home screen ready for action.
   - Initial state starts clean with 0 blocked counts and ready for the user to add website rules.

---

### 2. Architecture & Layout Blueprint

```
┌────────────────────────────────────────────────────────────────────────┐
│                        ShieldNet Application Header                    │
│   [ ShieldNet ]                                   [ Test in Browser ]  │
├────────────────────────────────────────────────────────────────────────┤
│                                                                        │
│                       Responsive Content Area                          │
│                                                                        │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │               Circular Protection Status Shield                │   │
│   │         • State: Active / Configuration Incomplete             │   │
│   │         • Real Stats: Blocked today (0) · Total (0)            │   │
│   └────────────────────────────────────────────────────────────────┘   │
│                                                                        │
│   ┌────────────────────────────────────────────────────────────────┐   │
│   │                        Quick Actions                           │   │
│   │         • Manage Blocklist  • Set Schedule  • View Activity    │   │
│   └────────────────────────────────────────────────────────────────┘   │
│                                                                        │
├────────────────────────────────────────────────────────────────────────┤
│             Persistent Bottom Navigation (Home · Blocklist · Activity · Settings)           │
└────────────────────────────────────────────────────────────────────────┘
```

---

### 3. Implementation Plan Steps

1. **Remove Artifacts**: Delete `AndroidStatusBar.tsx` and `AndroidPhoneFrame.tsx`.
2. **Update `App.tsx`**: Replace the phone frame wrapper with a fluid responsive application container and set `hasCompletedOnboarding: true` by default so users land directly on the Home dashboard.
3. **Verify Pure Light Theme**: Ensure all surfaces adhere strictly to `#FFFFFF`, `#F0F6FF`, `#DCE7F5`, `#17365D`, `#1677FF`, `#14B88A`, `#F59E0B`, and `#E5484D`.
4. **Compile & Lint**: Run `compile_applet` and `lint_applet` to verify clean compilation.
