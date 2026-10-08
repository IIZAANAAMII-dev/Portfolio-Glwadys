# REOPEN — visual QA fails on legibility and navigation

The editorial direction is clear, and the opening has a strong mood. The supplied captures also show essential copy covered by images, a clipped mobile navigation bar, and contact details that are obscured or truncated. Those are release blockers.

**Acceptance baseline:** compare at 1440×900 and 390×844, French locale, fonts loaded, reduced motion off; capture settled states at `scrollY` 0, 500 and 1000.

## 12 highest impact defects

1. **P0 · Mobile selected work copy is under the collage** — `mobile-0500`. The Yuna summary is crossed by image strips, and the project title starts below them.  
   **Before → after:** photos overlap the copy → give the project title, image band and summary separate vertical zones; limit the band to two images.  
   **Accept:** at 390×844, no project text box intersects an image box; keep at least 16px between them, and show the complete summary.

2. **P0 · Contact collage obscures the conversion content** — `shot-1000`, `mobile-1000`. Images cross the name and statement; the email is partly hidden.  
   **Before → after:** images float across contact copy → move them into a dedicated image strip, with the name, statement, email and LinkedIn in a clear text area.  
   **Accept:** at both viewports, no contact text intersects an image; the full email and LinkedIn label are readable without scrolling the contact page.

3. **P0 · Mobile navigation extends beyond the viewport** — `mobile-0000` and later captures. The capsule reaches both screen edges, with its left side visibly clipped.  
   **Before → after:** intrinsic-width capsule → constrain it to `calc(100vw - 24px)` and reduce its contents or use a separate language control.  
   **Accept:** at 390px, the nav has at least 12px side margins, no horizontal overflow, and every visible target has a 44×44px hit area.

4. **P1 · Mobile navigation removes two destinations** — `BottomNav.module.css` hides Journey and Expertise below 1024px. A long one-page portfolio offers no direct mobile route to either section.  
   **Before → after:** hide both links → provide a compact, keyboard-accessible Sections control that exposes all five destinations.  
   **Accept:** all five destinations can be reached from mobile navigation in one tap, with 44px minimum targets.

5. **P1 · Fixed navigation covers page content** — `mobile-0500`. The bottom capsule lies over copy near the bottom of the project view.  
   **Before → after:** content runs beneath the fixed bar → reserve bottom space equal to the nav height, safe area and a 16px clearance.  
   **Accept:** at 390×844, no paragraph, case label or link sits behind the nav.

6. **P1 · Desktop method scene has no stable reading order** — `shot-0500`. A large image and several smaller images compete with the method list; some labels are faint behind the composition.  
   **Before → after:** overlapping image collage beside the list → one primary image on the left, method steps in a clear right column, and no extra images over the steps.  
   **Accept:** at 1440×900, maintain a 64px gap between image and list; all six step labels are fully visible and reach 4.5:1 text contrast.

7. **P1 · Desktop nav truncates its active chapter label** — `shot-0500` shows “LE PROC…” inside the capsule.  
   **Before → after:** fixed-width, ellipsized chapter label → allow enough width for the full label or shorten the displayed wording intentionally.  
   **Accept:** at 1440px, the active act label has no ellipsis and the capsule remains centered with at least 24px viewport clearance on each side.

8. **P1 · First viewport weakens Glwadys’s identity and role** — `shot-0000`, `mobile-0000`. “Dalleau” is very low contrast against the brown; on mobile, the discipline list is hidden. The slogan alone does not identify the service.  
   **Before → after:** low-contrast surname and no mobile role line → render the full name at readable contrast and add a concise service descriptor near the tagline.  
   **Accept:** at both sizes, the full name and “Social media · contenu · communication de marque” are visible in the first viewport; name text reaches 4.5:1 contrast.

9. **P1 · Imagery reads as moodboard material, not portfolio evidence** — across the supplied states. The embedded media catalogue uses generated still lifes and studio imagery, and these recur as case-study visuals. That weakens trust and makes the projects feel interchangeable.  
   **Before → after:** generic generated imagery presented as work proof → use an authentic deliverable for each project; label illustrative direction studies clearly where real work is unavailable.  
   **Accept:** each visible case includes at least one identifiable, project-specific deliverable and its project label; no case relies solely on generic studio imagery.

10. **P1 · Mobile contact metadata is too small and truncated** — `mobile-1000`. Service text ends in an ellipsis, and the footer labels are difficult to read.  
    **Before → after:** 9px metadata with hidden overflow → use at least 12px type, allow wrapping, and give long fields a full-width row.  
    **Accept:** all four contact metadata fields are complete at 390px, with no ellipsis or clipping and a minimum 1.35 line height.

11. **P1 · Contact has competing calls to action** — `shot-1000`, `mobile-1000`. The handwritten “Écrire” note, email link and transformed nav pill compete; the email is also obscured by imagery.  
    **Before → after:** three separated cues → make one mail action visually primary beside the contact statement, with the address legible as its destination.  
    **Accept:** the contact view has one primary action, at least 44px high, within 24px of the email; the same action is not repeated as a second prominent label.

12. **P1 · Pinned pacing spends too long before the work is reached** — the embedded timeline assigns 8.6 viewport-heights to the opening/social/phone sequence and 6.35 to the process sequence.  
    **Before → after:** long sequences with repeated beats → shorten the first sequence to at most 6 viewport-heights and the process sequence to at most 4.5, removing repeated image reveals first.  
    **Accept:** no single pinned scene exceeds 6 viewport-heights; a scripted route reaches Contact within 15 viewport-heights on desktop and 18 on mobile.

**Reopen gate:** resolve the mobile text collisions, contact legibility, and nav clipping first. Then review the method hierarchy and authentic project proof before sign-off.