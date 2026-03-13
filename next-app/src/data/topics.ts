export interface Topic {
  id: string;
  title: string;
  description: string;
  icon: string;
  status: "live" | "coming-soon";
}

export const topics: Topic[] = [
  {
    id: "null-hypothesis",
    title: "Null Hypothesis",
    description:
      "The starting assumption that nothing is happening. Learn how we test claims by trying to reject this baseline.",
    icon: "null-hypothesis",
    status: "live",
  },
  {
    id: "probability",
    title: "Probability",
    description:
      "The language of uncertainty. Understand how likely events are and why it matters for every statistical test.",
    icon: "probability",
    status: "live",
  },
  {
    id: "linear-regression",
    title: "Linear Regression",
    description:
      "Fitting a straight line through data. The workhorse of statistical modeling and prediction.",
    icon: "linear-regression",
    status: "coming-soon",
  },
  {
    id: "logistic-regression",
    title: "Logistic Regression",
    description:
      "When the outcome is yes or no. Model the probability of binary events using the S-shaped curve.",
    icon: "logistic-regression",
    status: "coming-soon",
  },
  {
    id: "poisson-regression",
    title: "Poisson Regression",
    description:
      "Modeling count data. How many times does something happen? Visits, incidents, events per unit of time.",
    icon: "poisson-regression",
    status: "coming-soon",
  },
  {
    id: "missing-data",
    title: "Missing Data",
    description:
      "When values are absent. Learn why data goes missing, what patterns matter, and how to handle the gaps.",
    icon: "missing-data",
    status: "coming-soon",
  },
  {
    id: "glmm",
    title: "Generalized Linear Mixed Model",
    description:
      "When data is nested and outcomes vary. Account for clusters, repeated measures, and random effects all at once.",
    icon: "glmm",
    status: "coming-soon",
  },
];
