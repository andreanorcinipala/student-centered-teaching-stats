import type { DifficultyContent } from "./null-hypothesis";

export const linearRegressionContent: Record<string, DifficultyContent> = {
  beginner: {
    explanation:
      "Linear regression is a way to draw the best straight line through a cloud of data points. It helps you answer questions like: \"As one thing goes up, does another thing tend to go up or down, and by how much?\"\n\nImagine you plot students' study hours on one axis and their test scores on the other. Each student is a dot. Some studied 2 hours and scored 70, others studied 5 hours and scored 85. Linear regression finds the line that comes closest to all those dots at once. That line lets you predict: \"If a student studies 4 hours, their score will probably be around X.\"\n\nThe line has two pieces: where it starts (the intercept) and how steeply it climbs (the slope). The slope is the key number. It tells you: for each additional hour of studying, how many extra points can you expect?",
    example:
      "A coffee shop owner notices that on hotter days, she sells more iced drinks. She records the temperature and iced drink sales for 30 days and plots them. The dots trend upward. Linear regression draws the best line through them and tells her: for every 1-degree increase in temperature, she sells about 5 more iced drinks.\n\nNow she can use that line to plan. If tomorrow is forecast to be 90 degrees, she can estimate how many iced drinks to prepare. The prediction will not be perfect (some dots are far from the line), but it gives her a reasonable starting point.",
    keyTakeaway:
      "Linear regression finds the best straight line through your data. The slope tells you how much one thing changes when another thing changes by one unit.",
    keyTerms: [
      {
        term: "Slope",
        definition:
          "How steep the line is. It tells you how much the outcome changes for each one-unit increase in the predictor.",
      },
      {
        term: "Intercept",
        definition:
          "Where the line crosses the vertical axis. It is the predicted value when the predictor equals zero.",
      },
      {
        term: "Predictor",
        definition:
          "The variable you use to make predictions (the X axis). Also called the independent variable.",
      },
      {
        term: "Outcome",
        definition:
          "The variable you are trying to predict (the Y axis). Also called the dependent variable.",
      },
    ],
    interactive: {
      title: "Line of Best Fit",
      description:
        "Click to place data points on the plot. Watch the regression line update in real time and see how the slope and intercept change.",
      type: "coin-flip",
    },
  },
  intermediate: {
    explanation:
      "The simple linear regression model is Y = b0 + b1*X + e, where Y is the outcome, X is the predictor, b0 is the intercept, b1 is the slope, and e is the error term (residual). The method of Ordinary Least Squares (OLS) finds the values of b0 and b1 that minimize the sum of squared residuals: the total squared vertical distance between each observed point and the fitted line.\n\nThe coefficient b1 has a direct interpretation: a one-unit increase in X is associated with a b1-unit change in Y, holding all else constant. The R-squared value tells you what proportion of the variance in Y is explained by X. An R-squared of 0.72 means 72% of the variability in Y can be accounted for by the linear relationship with X.\n\nKey assumptions include linearity (the true relationship is linear), independence of errors, homoscedasticity (constant error variance), and normality of residuals. Violations of these assumptions can lead to biased estimates or unreliable inference.",
    example:
      "A researcher studies whether years of education predict annual income. Using a sample of 500 adults:\n\nIncome = 15,000 + 4,200 * Education + e\n\nThe intercept (15,000) is the predicted income for someone with zero years of education (a theoretical baseline). The slope (4,200) means each additional year of education is associated with $4,200 more in annual income. R-squared = 0.38, meaning education explains 38% of the variance in income.\n\nThe remaining 62% is captured by the error term and reflects other factors: field of work, experience, location, and luck. A residual plot helps check whether assumptions hold. If residuals fan out as education increases, homoscedasticity is violated and standard errors may be unreliable.",
    keyTakeaway:
      "OLS regression minimizes squared residuals to find the best-fitting line. R-squared measures explanatory power, but the model is only valid when its assumptions are met.",
    keyTerms: [
      {
        term: "Ordinary Least Squares (OLS)",
        definition:
          "The method that finds the line minimizing the total squared vertical distances (residuals) between observed points and the fitted line.",
      },
      {
        term: "R-squared",
        definition:
          "The proportion of variance in Y explained by the model. Ranges from 0 (no explanatory power) to 1 (perfect fit).",
      },
      {
        term: "Residual",
        definition:
          "The difference between an observed value and the value predicted by the regression line. Residual = Y_observed - Y_predicted.",
      },
      {
        term: "Homoscedasticity",
        definition:
          "The assumption that residuals have constant variance across all levels of X. Violations make standard errors unreliable.",
      },
      {
        term: "Coefficient (b1)",
        definition:
          "The estimated slope. Represents the expected change in Y for a one-unit increase in X.",
      },
    ],
    interactive: {
      title: "Regression Diagnostics",
      description:
        "Add data points, see the OLS line, and explore the residual plot. Adjust outliers to see how they affect the slope, intercept, and R-squared.",
      type: "drug-trial",
    },
  },
  advanced: {
    explanation:
      "In matrix notation, the linear model is Y = Xb + e, where Y is an n-by-1 vector of outcomes, X is an n-by-p design matrix (with a column of ones for the intercept), b is a p-by-1 vector of coefficients, and e is the error vector. The OLS estimator is b_hat = (X'X)^(-1) X'Y, which is the Best Linear Unbiased Estimator (BLUE) under the Gauss-Markov conditions: E[e] = 0, Var(e) = sigma^2 * I, and X is fixed (or independent of e).\n\nThe variance-covariance matrix of b_hat is sigma^2 * (X'X)^(-1), from which standard errors, t-statistics, and confidence intervals are derived. The F-test evaluates the joint significance of all predictors by comparing the model sum of squares to the residual sum of squares.\n\nMulticollinearity arises when predictors are highly correlated, inflating the variance of coefficient estimates without biasing them. The Variance Inflation Factor (VIF) quantifies this: VIF > 10 is a common concern threshold. Heteroscedasticity can be addressed with robust (Huber-White) standard errors or Weighted Least Squares. Endogeneity (correlation between X and e) violates the exogeneity assumption and requires instrumental variables or other causal identification strategies.",
    example:
      "Consider a labor economics model estimating the determinants of wages:\n\nlog(Wage) = b0 + b1*Education + b2*Experience + b3*Experience^2 + b4*Female + e\n\nThe log transformation means coefficients are interpreted as approximate percentage changes. With n = 2,000 workers:\n\nb1 = 0.082 (SE = 0.006): each year of education is associated with an 8.2% wage increase\nb2 = 0.031, b3 = -0.0004: returns to experience are positive but diminishing\nb4 = -0.217 (SE = 0.024): women earn approximately 21.7% less, controlling for education and experience\n\nR-squared = 0.34. An F-test rejects the null that all slopes equal zero (F = 258.3, p < 0.001). However, omitted variable bias is likely: ability, industry, and job type are unobserved. If education is correlated with unobserved ability, b1 overestimates the causal return to schooling. Instrumental variables (e.g., proximity to college) can address this, but only under the exclusion restriction.",
    keyTakeaway:
      "The OLS estimator is BLUE under Gauss-Markov conditions, but real-world applications require attention to multicollinearity, heteroscedasticity, and endogeneity. A significant coefficient is not necessarily a causal estimate.",
    keyTerms: [
      {
        term: "Gauss-Markov Theorem",
        definition:
          "States that OLS is the Best Linear Unbiased Estimator (BLUE) when errors have zero mean, constant variance, and are uncorrelated.",
      },
      {
        term: "Multicollinearity",
        definition:
          "High correlation among predictors that inflates standard errors of coefficients without introducing bias. Diagnosed with VIF.",
      },
      {
        term: "Endogeneity",
        definition:
          "When a predictor is correlated with the error term, violating the exogeneity assumption and biasing OLS estimates.",
      },
      {
        term: "Robust Standard Errors",
        definition:
          "Huber-White standard errors that are consistent under heteroscedasticity, providing valid inference without assuming constant error variance.",
      },
      {
        term: "Variance Inflation Factor (VIF)",
        definition:
          "Measures how much the variance of a coefficient is inflated due to correlation with other predictors. VIF = 1/(1-R_j^2).",
      },
      {
        term: "Instrumental Variables",
        definition:
          "A method to address endogeneity using variables correlated with X but not with e, under the exclusion restriction.",
      },
    ],
    interactive: {
      title: "Multiple Regression Explorer",
      description:
        "Fit models with multiple predictors. Examine coefficient estimates, R-squared, VIF for multicollinearity, and residual diagnostics. Toggle predictors to see how estimates shift.",
      type: "power-analysis",
    },
  },
};
