import type { DifficultyContent } from "./null-hypothesis";

export const multivariableLogisticRegressionContent: Record<string, DifficultyContent> = {
  beginner: {
    explanation:
      "In simple logistic regression, you predict a yes/no outcome using one factor. But most real decisions involve multiple factors. A doctor deciding whether a patient is at risk for heart disease does not look at cholesterol alone; they also check blood pressure, age, smoking status, and family history.\n\nMultivariable logistic regression lets you include all of those factors at once. It tells you: \"After accounting for everything else, how much does high cholesterol increase the chances of heart disease?\" Each factor gets its own number (an odds ratio) that tells you how much it independently contributes to the risk.\n\nThis is powerful because it separates the effects of each factor. Without it, you might think smoking is a bigger risk factor than it really is, simply because smokers in your data also tend to be older or have other risk factors.",
    example:
      "A university admissions office wants to understand what predicts whether students will complete their degree. They track three factors: high school GPA, family income, and whether the student lives on campus.\n\nLooking at GPA alone, students with a 3.5+ GPA seem 3 times more likely to graduate. But when you add family income and campus housing to the model, the GPA effect drops to 2.2 times more likely. Why? Because students with higher GPAs also tend to come from higher-income families and are more likely to live on campus, both of which independently help with graduation.\n\nThe multivariable model reveals: GPA still matters (2.2x), living on campus has a strong independent effect (1.8x), and family income has a moderate effect (1.3x per $20,000 increase).",
    keyTakeaway:
      "Multivariable logistic regression separates the independent effect of each factor on a yes/no outcome. This prevents you from attributing the effect of one variable to another.",
    keyTerms: [
      {
        term: "Adjusted Odds Ratio",
        definition:
          "The odds ratio for one predictor after controlling for all other predictors in the model. Shows the independent effect.",
      },
      {
        term: "Risk Factor",
        definition:
          "A variable that increases the probability of the outcome. In the model, it has an odds ratio greater than 1.",
      },
      {
        term: "Protective Factor",
        definition:
          "A variable that decreases the probability of the outcome. In the model, it has an odds ratio less than 1.",
      },
      {
        term: "Confounding",
        definition:
          "When a third variable makes it look like one factor matters more (or less) than it really does. The multivariable model helps untangle this.",
      },
    ],
    interactive: {
      title: "Risk Factor Explorer",
      description:
        "Toggle risk factors on and off for a patient profile. Watch the predicted probability change and see which factors matter most after adjustment.",
      type: "coin-flip",
    },
  },
  intermediate: {
    explanation:
      "The multivariable logistic model extends to p predictors:\n\nlogit(p) = b0 + b1*X1 + b2*X2 + ... + bp*Xp\n\nEach coefficient bj is a log-odds ratio, and exp(bj) is the adjusted odds ratio: the multiplicative change in odds for a one-unit increase in Xj, holding all other predictors constant.\n\nModel building strategies include purposeful selection (start with clinically meaningful variables), stepwise selection (add/remove based on p-values or AIC), and LASSO penalization. Purposeful selection is preferred in explanatory research because stepwise methods can be unstable and biased.\n\nConfounding is assessed by comparing crude and adjusted odds ratios. If the odds ratio for a predictor changes by more than 10% when another variable is added, that variable is likely a confounder and should remain in the model. Effect modification (interaction) occurs when the odds ratio for one predictor varies across levels of another; this is tested by including product terms.\n\nModel calibration (Hosmer-Lemeshow test) and discrimination (AUC) should both be assessed. A model can have good discrimination but poor calibration, or vice versa.",
    example:
      "A clinical study predicts 30-day hospital readmission (n = 2,500):\n\nCrude model (age only): OR_age = 1.04 per year (95% CI: 1.02-1.06)\n\nAdjusted model:\nlogit(readmission) = -3.8 + 0.03*Age + 0.55*Comorbidities + 0.72*PriorAdmissions - 0.41*HasPrimaryCare\n\nAdjusted odds ratios:\n- Age: exp(0.03) = 1.03 (barely changed, not confounded)\n- Comorbidities: exp(0.55) = 1.73 (each additional comorbidity increases odds by 73%)\n- Prior admissions: exp(0.72) = 2.05 (strongest predictor)\n- Has primary care: exp(-0.41) = 0.66 (protective, reduces odds by 34%)\n\nInteraction test: PriorAdmissions * HasPrimaryCare = -0.28 (p = 0.04), meaning primary care is especially protective for patients with prior admissions. AUC = 0.76, Hosmer-Lemeshow p = 0.38 (adequate calibration).",
    keyTakeaway:
      "Adjusted odds ratios isolate each predictor's independent contribution. Comparing crude to adjusted estimates reveals confounding. Interaction terms detect effect modification.",
    keyTerms: [
      {
        term: "Adjusted Odds Ratio",
        definition:
          "exp(bj) from the multivariable model. The odds ratio for Xj holding all other predictors constant. Differs from the crude (unadjusted) OR if confounding is present.",
      },
      {
        term: "Purposeful Selection",
        definition:
          "A model-building strategy that starts with clinically or theoretically meaningful variables, then adds/removes based on confounding criteria and significance.",
      },
      {
        term: "Effect Modification (Interaction)",
        definition:
          "When the effect of one predictor on the outcome differs depending on the level of another predictor. Tested by including a product term.",
      },
      {
        term: "Calibration",
        definition:
          "How well predicted probabilities match observed frequencies. A well-calibrated model predicting 30% risk should see about 30% of events in that group.",
      },
      {
        term: "10% Change Rule",
        definition:
          "A variable is considered a confounder if its inclusion changes the odds ratio of the primary predictor by 10% or more.",
      },
    ],
    interactive: {
      title: "Crude vs. Adjusted Comparison",
      description:
        "Run a logistic model with and without a potential confounder. Compare the crude and adjusted odds ratios side by side.",
      type: "drug-trial",
    },
  },
  advanced: {
    explanation:
      "Multivariable logistic regression in the GLM framework uses the logit link with Bernoulli-distributed responses. Maximum likelihood estimation via IRLS yields coefficient estimates, with the Fisher information matrix I(b) = X'WX providing the variance-covariance matrix, where W is a diagonal matrix of estimated variances p_i(1-p_i).\n\nModel selection in high-dimensional settings requires regularization. LASSO logistic regression minimizes the negative log-likelihood plus lambda*sum(|bj|), simultaneously performing variable selection and shrinkage. The elastic net adds an L2 penalty for stability when predictors are correlated. Cross-validation selects the optimal lambda.\n\nFor causal inference with binary outcomes, the odds ratio has well-known limitations: it is non-collapsible, meaning the marginal OR differs from the conditional OR even without confounding. When the outcome is common (>10%), odds ratios overestimate risk ratios. Alternatives include log-binomial regression (directly estimates risk ratios) or modified Poisson regression with robust standard errors.\n\nPropensity score methods offer an alternative to multivariable adjustment. The propensity score e(X) = P(Treatment=1|X) reduces all confounders to a single dimension. Matching, stratification, or inverse probability weighting on the propensity score can achieve balance on observed confounders, but unobserved confounding remains a threat. Sensitivity analyses (E-value, Rosenbaum bounds) quantify how strong unmeasured confounding would need to be to explain away the result.",
    example:
      "A pharmacoepidemiologist examines the association between statin use and incident diabetes using EHR data (n = 120,000). The crude OR = 1.42 (95% CI: 1.31-1.54). After multivariable adjustment for age, sex, BMI, hypertension, and baseline glucose:\n\nAdjusted OR = 1.18 (95% CI: 1.08-1.29)\n\nSubstantial confounding by BMI and baseline glucose explains 60% of the crude association. However, several concerns remain:\n\n1. Non-collapsibility: The conditional OR (1.18) differs from the marginal OR even after adjustment. A marginal risk ratio via modified Poisson gives RR = 1.11.\n2. Propensity score analysis: Using IPTW with 23 covariates yields OR = 1.15 (95% CI: 1.05-1.26), consistent with the multivariable result.\n3. E-value: 1.57, meaning an unmeasured confounder would need to be associated with both statin use and diabetes by at least OR = 1.57 to fully explain the finding.\n4. LASSO variable selection from 45 candidate covariates retains 12, with AUC = 0.73 and well-calibrated decile plot.\n\nThe converging evidence across methods strengthens causal inference, but residual confounding by unmeasured lifestyle factors (diet, exercise) remains plausible.",
    keyTakeaway:
      "Multivariable logistic regression is one tool in a broader causal inference toolkit. Non-collapsibility, propensity scores, regularization, and sensitivity analyses address its limitations for observational data.",
    keyTerms: [
      {
        term: "Non-collapsibility",
        definition:
          "The property of the odds ratio where marginal and conditional estimates differ even without confounding. A mathematical artifact, not a bias.",
      },
      {
        term: "Propensity Score",
        definition:
          "P(Treatment=1|X), the probability of receiving treatment given observed covariates. Reduces confounding adjustment to a single dimension.",
      },
      {
        term: "Inverse Probability of Treatment Weighting (IPTW)",
        definition:
          "Weights each observation by 1/e(X) or 1/(1-e(X)) to create a pseudo-population where treatment is independent of observed confounders.",
      },
      {
        term: "E-value",
        definition:
          "The minimum strength of association an unmeasured confounder would need with both treatment and outcome to explain away the observed effect.",
      },
      {
        term: "Modified Poisson Regression",
        definition:
          "A Poisson model with robust standard errors used for binary outcomes to directly estimate risk ratios instead of odds ratios.",
      },
      {
        term: "Elastic Net",
        definition:
          "A penalized regression combining L1 (LASSO) and L2 (Ridge) penalties: lambda1*sum(|bj|) + lambda2*sum(bj^2). Handles correlated predictors better than LASSO alone.",
      },
    ],
    interactive: {
      title: "Propensity Score Lab",
      description:
        "Generate observational data with confounding. Compare the crude OR, multivariable-adjusted OR, and propensity-score-weighted OR. Calculate the E-value for sensitivity to unmeasured confounding.",
      type: "power-analysis",
    },
  },
};
