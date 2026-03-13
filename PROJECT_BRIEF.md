# Student-Centered Statistics App

## Origin
This project is a parallel effort to the teaching section being built on Andrea Norcini Pala's academic website (`Web design/site/`). The website version embeds interactive study guides into a research portfolio. This app can be a standalone, student-facing tool with the same pedagogical approach but more interactivity.

## Pedagogical Design

### Three-Level Difficulty Model
Every concept is presented at three levels. Students can toggle freely between them.

| Level | Audience | Style |
|-------|----------|-------|
| **Beginner** | First exposure, no stats background | Plain-language analogy, everyday examples, no formulas |
| **Intermediate** | Has taken intro stats/methods | Formal definitions, notation (Y1-Y0), research examples with numbers |
| **Advanced** | Graduate-level, methodologically oriented | Frameworks (Rubin Causal Model), estimands (ATE/ATT/LATE), bias decomposition, identifying assumptions |

### Content Structure Per Topic
Each topic card contains:
1. **Explanation** at the selected difficulty level
2. **Example** (everyday/research/methodological, matching the level)
3. **Key Takeaway** (one sentence summary)

### UX Decisions Made
- Global difficulty toggle at the top of each class page (sets all topics at once)
- Per-topic tabs allow overriding the global setting for a single topic
- Topics are numbered and navigable from a topic bar at the top
- "Coming soon" placeholders keep the roadmap visible to students
- "Back to Teaching" breadcrumb for navigation

## Course Map (Program Evaluation / Research Methods)

### Class 6: Causal Inference
- Status: Placeholder created, content not yet written
- Planned topics: Foundations of causal reasoning, experimental designs, threats to validity

### Class 7: Impact Evaluation & Comparison Group Designs
- Status: Topic 1 complete, Topics 2-5 planned

**Topics:**
1. **Counterfactual Reasoning** (DONE)
   - Beginner: Aspirin/headache analogy, speed camera example
   - Intermediate: Y1-Y0 notation, job training comparison group example
   - Advanced: Potential outcomes framework, ATE/ATT/LATE, selection bias decomposition
2. **Bias in Estimation** (planned)
   - Selection bias, attrition, secular trends, maturation, regression to the mean
3. **Comparison Group Designs** (planned)
   - Naive, covariate-adjusted, matching, interrupted time series, cohort
4. **Advanced Methods** (planned)
   - Difference-in-differences, fixed effects, SEM, latent models
5. **Cautions about Quasi-Experiments** (planned)

## Technical Stack (Website Version)
- Single-page HTML files per class (class7.html, class6.html, etc.)
- Tailwind CSS via CDN
- Vanilla JavaScript (no build step, no framework)
- DM Serif Display + Inter fonts
- Brand color palette: green-teal (#436d62 primary)
- Cards with subtle shadows and hover effects
- Scroll fade-in animations

## Design Tokens (Brand)
```
brand-50:  #f0f5f4
brand-100: #d7e4e1
brand-200: #b0c9c3
brand-300: #82a99f
brand-400: #5c8a7e
brand-500: #436d62
brand-600: #35574f
brand-700: #2c4640
brand-800: #253835
brand-900: #1e2f2d
brand-950: #111c1b
```

## Writing Rules
- Never use em dashes (--)
- Keep explanations concise; avoid filler
- Beginner level: no jargon, use "you" voice
- Intermediate level: introduce formal terms, use research scenarios
- Advanced level: cite frameworks by name, use notation, discuss assumptions and limitations
