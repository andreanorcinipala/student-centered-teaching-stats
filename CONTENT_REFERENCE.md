# Content Reference: Completed Topics

## Topic 1: Counterfactual Reasoning

### Beginner
**The Big Idea:** Imagine you have a headache and you take aspirin. An hour later the headache is gone. Did the aspirin work? Maybe. But maybe the headache would have gone away on its own. The version of events where you *did not* take the aspirin is the **counterfactual**. It is the "what if" scenario that we can never directly observe.

Impact evaluation is fundamentally about answering: "What would have happened if the program had never existed?" The difference between what actually happened and that imagined alternative is the true program effect.

**Everyday Example:** A city installs speed cameras on a dangerous road. Accidents drop by 30% the following year. The mayor credits the cameras. But what if accidents were already trending downward because of improved car safety? Or what if a nearby highway opened, reducing traffic? Without knowing what *would have* happened without the cameras, we cannot be sure the cameras caused the drop.

**Key Takeaway:** We can never observe the counterfactual directly. The entire field of impact evaluation exists to estimate it as convincingly as possible.

---

### Intermediate
**Formal Definition:** The counterfactual is the outcome that would have occurred for program participants had they not been exposed to the intervention. If Y1 is the outcome with treatment and Y0 is the outcome without, the causal effect for an individual is:

> Impact = Y1 - Y0

The fundamental problem of causal inference is that we can observe Y1 *or* Y0 for any given individual, but never both simultaneously. This is why we need comparison groups: a separate group of people who did not receive the program serves as a proxy for Y0.

**Research Example:** A job training program enrolls 500 unemployed adults. After 12 months, 60% are employed. Is this a success? Without a comparison group, we do not know. If a comparable group of non-participants has a 55% employment rate over the same period, the estimated program impact is 5 percentage points. If the comparison group hits 62%, the program may have actually *hindered* employment. The counterfactual estimate changes everything.

**Key Takeaway:** A program's effect is not "the outcome after treatment." It is the *difference* between the observed outcome and what would have happened otherwise. The quality of an evaluation depends on how well it estimates this counterfactual.

---

### Advanced
**The Potential Outcomes Framework:** The Rubin Causal Model (Rubin, 1974) formalizes counterfactual reasoning through the potential outcomes framework. Each unit *i* has two potential outcomes: Yi(1) under treatment and Yi(0) under control. The individual treatment effect is tau_i = Yi(1) - Yi(0), but only one potential outcome is ever realized.

Because individual effects are unidentifiable, we target population-level estimands:
- **ATE** (Average Treatment Effect): E[Y(1) - Y(0)] across the entire population
- **ATT** (Average Treatment Effect on the Treated): E[Y(1) - Y(0) | D=1], the effect among those who actually received treatment
- **LATE** (Local Average Treatment Effect): The effect among compliers in an instrumental variables framework

The choice of estimand matters. Randomized experiments identify the ATE under standard assumptions (SUTVA, no interference). Quasi-experimental designs often identify the ATT or LATE, each with different policy implications. Selection into treatment means E[Y(0)|D=1] != E[Y(0)|D=0], which is precisely the bias that comparison group designs attempt to eliminate.

**Methodological Example:** Consider a conditional cash transfer program where participation is voluntary. Participants may differ from non-participants in motivation, baseline income, and social support. A naive comparison of outcomes yields:

> E[Y|D=1] - E[Y|D=0] = ATT + {E[Y(0)|D=1] - E[Y(0)|D=0]}

The second term is selection bias. If more motivated individuals self-select, E[Y(0)|D=1] > E[Y(0)|D=0], and the naive estimate overstates the program effect. Propensity score methods, difference-in-differences, and regression discontinuity each address this bias under different identifying assumptions. No design eliminates it without assumptions; the question is which assumptions are most credible in context.

**Key Takeaway:** Every quasi-experimental design is a strategy for constructing a plausible counterfactual under explicit assumptions. The credibility of an evaluation rests not on the sophistication of the method but on the defensibility of those assumptions.
