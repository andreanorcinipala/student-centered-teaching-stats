import type { DifficultyContent } from "./null-hypothesis";

export const logisticRegressionContent: Record<string, DifficultyContent> = {
  beginner: {
    explanation:
      "Sometimes the thing you want to predict is not a number but a yes-or-no question. Will a student pass or fail? Will a customer buy or not buy? Will it rain or not rain? You cannot draw a straight line through yes-and-no answers. That is where logistic regression comes in.\n\nInstead of predicting a number, logistic regression predicts the probability of something happening. The result is always between 0% and 100%. It uses an S-shaped curve (called a sigmoid) to squeeze any prediction into that range. If the probability is above 50%, you predict \"yes.\" If it is below, you predict \"no.\"\n\nThink of it as a confidence meter. Given what you know about a person or situation, how confident are you that the outcome will be yes?",
    example:
      "A university wants to predict which applicants will graduate. They look at two things: high school GPA and SAT score. For each past student, they know the inputs (GPA, SAT) and the outcome (graduated: yes or no).\n\nLogistic regression learns the pattern. It might find that a student with a 3.5 GPA and a 1200 SAT has an 82% probability of graduating. A student with a 2.3 GPA and a 900 SAT might have a 35% probability. The model does not say \"this student will definitely graduate.\" It says \"based on the pattern we have seen, here is how likely it is.\"",
    keyTakeaway:
      "Logistic regression predicts the probability of a yes/no outcome. It uses an S-shaped curve to keep predictions between 0 and 1.",
    keyTerms: [
      {
        term: "Binary Outcome",
        definition:
          "A result with only two possibilities: yes/no, pass/fail, 1/0. This is what logistic regression predicts.",
      },
      {
        term: "Probability",
        definition:
          "How likely something is to happen, expressed as a number between 0 (impossible) and 1 (certain).",
      },
      {
        term: "Sigmoid Curve",
        definition:
          "The S-shaped curve that converts any number into a probability between 0 and 1. Steep in the middle, flat at the extremes.",
      },
      {
        term: "Threshold",
        definition:
          "The cutoff (usually 50%) above which you predict \"yes\" and below which you predict \"no.\"",
      },
    ],
    interactive: {
      title: "Pass or Fail Predictor",
      description:
        "Adjust a student's study hours and see how the predicted probability of passing changes along the S-curve. Drag the threshold to see how the prediction flips.",
      type: "coin-flip",
    },
  },
  intermediate: {
    explanation:
      "Logistic regression models the log-odds of a binary outcome as a linear function of predictors:\n\nlog(p / (1-p)) = b0 + b1*X1 + b2*X2 + ...\n\nThe left side is the logit: the natural log of the odds. The odds are p/(1-p), where p is the probability of the event. This transformation maps probabilities (0 to 1) onto the entire real number line, making it compatible with a linear model.\n\nCoefficients are estimated via Maximum Likelihood Estimation (MLE), not OLS. Each coefficient represents the change in log-odds for a one-unit increase in the predictor. Exponentiating the coefficient gives the odds ratio: exp(b1) tells you how much the odds multiply for each unit increase in X1. An odds ratio of 1.5 means the odds increase by 50%.\n\nModel fit is assessed using deviance, the Akaike Information Criterion (AIC), or pseudo R-squared measures. Classification accuracy can be evaluated with a confusion matrix, sensitivity, specificity, and the ROC curve.",
    example:
      "A hospital predicts 30-day readmission (yes/no) using patient age, number of comorbidities, and length of stay:\n\nlogit(p) = -3.2 + 0.04*Age + 0.62*Comorbidities + 0.11*LengthOfStay\n\nFor a 70-year-old with 3 comorbidities and a 5-day stay:\nlogit(p) = -3.2 + 0.04(70) + 0.62(3) + 0.11(5) = -3.2 + 2.8 + 1.86 + 0.55 = 2.01\np = exp(2.01) / (1 + exp(2.01)) = 0.882, or 88.2%\n\nThe odds ratio for comorbidities is exp(0.62) = 1.86, meaning each additional comorbidity nearly doubles the odds of readmission. The ROC-AUC of 0.78 indicates good (but not excellent) discriminatory ability.",
    keyTakeaway:
      "Logistic regression models log-odds as a linear function and uses MLE for estimation. Coefficients are interpreted as changes in log-odds, and odds ratios quantify the multiplicative effect on odds.",
    keyTerms: [
      {
        term: "Logit",
        definition:
          "The log of the odds: log(p/(1-p)). This transformation is the link function that connects the linear predictor to the probability scale.",
      },
      {
        term: "Odds Ratio",
        definition:
          "exp(b). The factor by which the odds of the outcome multiply for a one-unit increase in the predictor. OR = 1 means no effect.",
      },
      {
        term: "Maximum Likelihood Estimation (MLE)",
        definition:
          "The method that finds coefficients by maximizing the probability of observing the data given the model. Used instead of OLS for binary outcomes.",
      },
      {
        term: "ROC Curve / AUC",
        definition:
          "A plot of sensitivity vs. 1-specificity at all thresholds. The area under the curve (AUC) measures how well the model distinguishes between classes.",
      },
      {
        term: "Confusion Matrix",
        definition:
          "A table showing true positives, false positives, true negatives, and false negatives at a given classification threshold.",
      },
    ],
    interactive: {
      title: "Logistic Model Simulator",
      description:
        "Adjust the intercept and slope to see how the logistic curve shifts. Input predictor values and watch the predicted probability and odds ratio update.",
      type: "drug-trial",
    },
  },
  advanced: {
    explanation:
      "The generalized linear model framework unifies logistic regression with other models through the choice of link function and error distribution. For binary outcomes, the canonical link is the logit, and the response follows a Bernoulli (or Binomial) distribution. The likelihood function is:\n\nL(b) = product of [p_i^y_i * (1-p_i)^(1-y_i)]\n\nwhere p_i = 1 / (1 + exp(-X_i'b)). MLE maximizes the log-likelihood using iteratively reweighted least squares (IRLS) or Newton-Raphson optimization.\n\nUnlike OLS, logistic regression has no closed-form solution and no direct R-squared analog. McFadden's pseudo R-squared, defined as 1 - (logL_model / logL_null), provides a rough measure but should be interpreted cautiously. The Hosmer-Lemeshow test assesses calibration, while the Brier score combines calibration and discrimination into a single metric.\n\nSeparation occurs when a predictor perfectly predicts the outcome, causing MLE to diverge. Firth's penalized likelihood or exact logistic regression address this. For rare events (prevalence < 5%), standard MLE can produce biased coefficient estimates; King and Zeng's correction or Firth's method should be used. Extensions include multinomial logistic regression (for polytomous outcomes), ordinal logistic regression (proportional odds model), and conditional logistic regression (for matched case-control designs).",
    example:
      "A criminal justice researcher models pretrial failure-to-appear (FTA) using administrative data (n = 45,000). The goal is to build a risk assessment tool:\n\nlogit(FTA) = -2.81 + 0.73*PriorFTAs + 0.44*ActiveWarrants + 0.21*UnemployedAtArrest - 0.38*CommunityTies + 0.15*ChargeGravity\n\nModel diagnostics:\nAUC = 0.74, Brier score = 0.18, Hosmer-Lemeshow p = 0.42 (adequate calibration)\n\nThe odds ratio for PriorFTAs is exp(0.73) = 2.08: each prior FTA doubles the odds of a new FTA. However, the model raises fairness concerns. If race is correlated with predictors like employment status and community ties (through structural inequality), the model can reproduce racial disparities even without race as an explicit variable. Algorithmic fairness requires examining calibration and error rates across subgroups, not just overall accuracy. Equalized odds and predictive parity are often in tension, and the choice of fairness criterion is ultimately a normative decision, not a statistical one.",
    keyTakeaway:
      "Logistic regression within the GLM framework offers principled inference for binary outcomes, but applied work demands attention to separation, rare events, calibration, and the ethical implications of prediction in high-stakes settings.",
    keyTerms: [
      {
        term: "GLM Framework",
        definition:
          "Generalized Linear Models unify regression for different outcome types through a link function and error distribution. Logistic regression uses the logit link and Bernoulli distribution.",
      },
      {
        term: "Separation",
        definition:
          "When a predictor perfectly separates outcomes, causing MLE to diverge. Addressed with penalized likelihood (Firth's method) or exact logistic regression.",
      },
      {
        term: "Hosmer-Lemeshow Test",
        definition:
          "A goodness-of-fit test that groups observations by predicted probability and compares observed vs. expected event rates within each group.",
      },
      {
        term: "Brier Score",
        definition:
          "Mean squared difference between predicted probabilities and actual outcomes. Combines calibration and discrimination. Lower is better; range 0 to 1.",
      },
      {
        term: "Firth's Penalized Likelihood",
        definition:
          "A bias-reduction method that modifies the score function to handle separation and small-sample bias in logistic regression.",
      },
      {
        term: "Algorithmic Fairness",
        definition:
          "The study of whether prediction models produce equitable outcomes across demographic groups. Key criteria include equalized odds, calibration, and predictive parity.",
      },
    ],
    interactive: {
      title: "ROC Curve and Threshold Explorer",
      description:
        "Visualize how changing the classification threshold affects sensitivity, specificity, and the position on the ROC curve. See the tradeoff between false positives and false negatives.",
      type: "power-analysis",
    },
  },
};
