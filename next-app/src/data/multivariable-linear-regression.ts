import type { DifficultyContent } from "./null-hypothesis";

export const multivariableLinearRegressionContent: Record<string, DifficultyContent> = {
  beginner: {
    explanation:
      "Simple linear regression uses one predictor to explain an outcome. But in real life, many things influence an outcome at the same time. A student's test score is not just about study hours; it also depends on sleep, prior knowledge, and class attendance.\n\nMultivariable linear regression lets you include all of those factors at once. It answers the question: \"What is the effect of study hours on the test score, after accounting for sleep, prior knowledge, and attendance?\" Each predictor gets its own slope, telling you how much the outcome changes when that predictor increases by one unit, while everything else stays the same.\n\nThis \"while everything else stays the same\" part is crucial. It is what separates multivariable regression from running separate simple regressions. By including multiple predictors, you control for the influence of the other variables.",
    example:
      "A real estate company wants to understand what drives home prices. They look at three factors: square footage, number of bedrooms, and distance from the city center.\n\nA simple regression using only square footage might say: each extra square foot adds $150 to the price. But when you add bedrooms and distance to the model, the effect of square footage drops to $120. Why? Because some of that $150 was actually due to bigger homes having more bedrooms. The multivariable model separates out each factor's unique contribution.\n\nThe model might say: each square foot adds $120, each bedroom adds $8,000, and each mile from the city center subtracts $5,000. Now the company can make smarter pricing decisions because each effect is isolated from the others.",
    keyTakeaway:
      "Multivariable regression includes multiple predictors at once. Each coefficient tells you the effect of that variable while holding all others constant.",
    keyTerms: [
      {
        term: "Controlling for",
        definition:
          "Holding other variables constant so you can see the independent effect of the variable you care about.",
      },
      {
        term: "Predictor (Independent Variable)",
        definition:
          "A factor you include in the model to help explain or predict the outcome. You can have many predictors.",
      },
      {
        term: "Partial Effect",
        definition:
          "The effect of one predictor after removing the influence of all other predictors in the model.",
      },
      {
        term: "Confounding",
        definition:
          "When a third variable influences both the predictor and the outcome, making the relationship look different than it really is.",
      },
    ],
    interactive: {
      title: "Add and Remove Predictors",
      description:
        "Start with one predictor. Add more and watch how the coefficients and R-squared change. See confounding in action.",
      type: "coin-flip",
    },
  },
  intermediate: {
    explanation:
      "The multivariable linear model extends the simple case to p predictors:\n\nY = b0 + b1*X1 + b2*X2 + ... + bp*Xp + e\n\nEach coefficient bj represents the expected change in Y for a one-unit increase in Xj, holding all other predictors constant. This is the partial regression coefficient. The adjusted R-squared penalizes the addition of predictors that do not meaningfully improve the model, unlike R-squared which can only increase.\n\nConfounding is a central concern. If a variable Z causes both X and Y, omitting Z from the model biases the estimate of X's effect. Including Z \"controls for\" its influence. However, not every variable should be included. Colliders (variables caused by both X and Y) and mediators (variables on the causal path from X to Y) should generally be excluded, as adjusting for them introduces bias.\n\nInteraction terms (X1*X2) allow the effect of one predictor to depend on the level of another. A significant interaction means the relationship between X1 and Y changes at different values of X2.",
    example:
      "A public health researcher studies the effect of exercise (hours/week) on systolic blood pressure, controlling for age and BMI. In 800 adults:\n\nBP = 130 - 1.8*Exercise + 0.5*Age + 0.9*BMI\n\nWithout age and BMI: Exercise coefficient = -0.6 (attenuated because older, heavier people exercise less and have higher BP). With controls: Exercise coefficient = -1.8. The confounders were masking the true effect.\n\nAdding an interaction Exercise*Age:\nBP = 128 - 2.4*Exercise + 0.6*Age + 0.9*BMI + 0.03*Exercise*Age\n\nThe interaction (0.03) means the benefit of exercise is slightly smaller for older adults. For a 30-year-old, the exercise effect is -2.4 + 0.03*30 = -1.5. For a 70-year-old, it is -2.4 + 0.03*70 = -0.3. Adjusted R-squared increased from 0.31 to 0.34.",
    keyTakeaway:
      "Multivariable regression isolates partial effects and reveals confounding. Interaction terms capture effect modification. Use adjusted R-squared to evaluate model fit with multiple predictors.",
    keyTerms: [
      {
        term: "Partial Regression Coefficient",
        definition:
          "The slope of a predictor after accounting for all other variables. Represents the unique contribution of that predictor.",
      },
      {
        term: "Adjusted R-squared",
        definition:
          "A modified R-squared that penalizes the inclusion of unnecessary predictors. Can decrease if a new variable adds no explanatory value.",
      },
      {
        term: "Confounding Variable",
        definition:
          "A variable that influences both the predictor and the outcome. Omitting it biases the estimated effect of the predictor.",
      },
      {
        term: "Interaction Term",
        definition:
          "A product of two predictors (X1*X2) included in the model. A significant interaction means the effect of X1 depends on the value of X2.",
      },
      {
        term: "Collider",
        definition:
          "A variable caused by both X and Y. Adjusting for a collider introduces bias (collider stratification bias) rather than removing it.",
      },
    ],
    interactive: {
      title: "Confounding Simulator",
      description:
        "Generate data with a known confounder. Fit the model with and without the confounder to see how omitting it biases the coefficient.",
      type: "drug-trial",
    },
  },
  advanced: {
    explanation:
      "In matrix form, Y = Xb + e where X is the n x (p+1) design matrix. The OLS estimator b_hat = (X'X)^(-1)X'Y has variance Var(b_hat) = sigma^2(X'X)^(-1). Model selection involves balancing fit and parsimony: information criteria (AIC, BIC) formalize this tradeoff, with BIC penalizing complexity more heavily.\n\nThe Frisch-Waugh-Lovell (FWL) theorem provides geometric insight: the partial coefficient of X1 is identical to the coefficient from regressing the residuals of Y on all other predictors against the residuals of X1 on all other predictors. This formalizes \"controlling for\" and explains why coefficients change when predictors are added.\n\nDiagnostic concerns in multiple regression include multicollinearity (VIF > 10), influential observations (Cook's distance, leverage), and specification errors (omitted variables, functional form). Ridge and LASSO regression address multicollinearity and perform variable selection through penalization: LASSO (L1) shrinks some coefficients to exactly zero, while Ridge (L2) shrinks all coefficients toward zero without eliminating any. The elastic net combines both penalties.\n\nCausal identification requires more than statistical adjustment. DAGs (Directed Acyclic Graphs) formalize which variables to include: confounders should be adjusted for, colliders and mediators should not. The backdoor criterion from Pearl's causal framework specifies the sufficient adjustment set.",
    example:
      "An education economist estimates returns to schooling using NLSY data (n = 3,500):\n\nlog(Wage) = b0 + b1*Education + b2*Experience + b3*Experience^2 + b4*AFQT + b5*Female + b6*Black + b7*Urban\n\nModel comparison:\n- Without AFQT (ability proxy): b1 = 0.098 (SE 0.005)\n- With AFQT: b1 = 0.062 (SE 0.006)\n- AIC drops from 4,521 to 4,198; BIC from 4,570 to 4,253\n\nThe 37% reduction in the education coefficient reveals ability bias: more able individuals get more schooling and earn more, inflating the naive return. VIF for Education = 1.8 (acceptable). Cook's distance identifies 12 influential observations; re-estimating without them changes b1 by less than 0.003.\n\nA DAG analysis shows that AFQT is a confounder (causes both Education and Wages), so adjustment is appropriate. However, if Education causes AFQT score (through learning), then AFQT is partly a mediator, and adjusting for it underestimates the total effect of education. The correct adjustment set depends on the causal model, not just statistical fit.",
    keyTakeaway:
      "Multivariable regression requires careful variable selection guided by causal reasoning, not just statistical significance. The FWL theorem, information criteria, and DAGs provide the theoretical and practical tools for doing this correctly.",
    keyTerms: [
      {
        term: "Frisch-Waugh-Lovell Theorem",
        definition:
          "A partial coefficient equals the slope from regressing Y-residuals on X-residuals after both have been purged of all other predictors. Formalizes 'controlling for.'",
      },
      {
        term: "AIC / BIC",
        definition:
          "Information criteria balancing model fit and complexity. AIC = -2logL + 2p; BIC = -2logL + p*log(n). Lower is better. BIC penalizes more heavily.",
      },
      {
        term: "LASSO (L1 Regularization)",
        definition:
          "Penalized regression that adds lambda*sum(|bj|) to the loss. Shrinks some coefficients to exactly zero, performing automatic variable selection.",
      },
      {
        term: "Directed Acyclic Graph (DAG)",
        definition:
          "A graphical representation of causal relationships. Used to determine which variables to adjust for (confounders) and which to leave out (colliders, mediators).",
      },
      {
        term: "Backdoor Criterion",
        definition:
          "A sufficient condition for causal identification: block all backdoor paths from treatment to outcome by adjusting for the appropriate variable set.",
      },
      {
        term: "Cook's Distance",
        definition:
          "A measure of how much all fitted values change when a single observation is removed. Identifies influential data points. Values > 4/n warrant investigation.",
      },
    ],
    interactive: {
      title: "Model Selection Lab",
      description:
        "Compare models with different predictor sets. See AIC, BIC, adjusted R-squared, and VIF update as you add or remove variables. Observe how coefficients shift with each change.",
      type: "power-analysis",
    },
  },
};
