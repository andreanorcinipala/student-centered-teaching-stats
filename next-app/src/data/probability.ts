import type { DifficultyContent } from "./null-hypothesis";

export const probabilityContent: Record<string, DifficultyContent> = {
  beginner: {
    explanation:
      "Probability is just a way of measuring how likely something is to happen. It is a number between 0 and 1. Zero means impossible. One means certain. Everything else falls somewhere in between.\n\nThink about rolling a standard six-sided die. There are 6 possible outcomes, and each one is equally likely. The probability of rolling a 3 is 1 out of 6, or about 17%. The probability of rolling an even number (2, 4, or 6) is 3 out of 6, or 50%.\n\nThe key insight is that probability does not tell you what will happen on any single try. It tells you what tends to happen over many, many tries. Roll a die 6 times and you might never see a 3. Roll it 6,000 times and you will see a 3 roughly 1,000 times. The more you repeat, the closer reality gets to the math.",
    example:
      "You check the weather app and it says there is a 70% chance of rain tomorrow. Does that mean it will definitely rain? No. It means that out of 100 days with conditions like tomorrow, about 70 of them would have rain. On any single day, it either rains or it does not. But 70% tells you it is wise to bring an umbrella.\n\nThis is why probability matters in everyday life. It does not give you certainty. It gives you a smart way to make decisions when you do not know what will happen.",
    keyTakeaway:
      "Probability measures how likely something is on a scale from 0 (impossible) to 1 (certain). It tells you what to expect over many repetitions, not what will happen once.",
    keyTerms: [
      {
        term: "Probability",
        definition:
          "A number between 0 and 1 that measures how likely an event is to occur. Higher means more likely.",
      },
      {
        term: "Event",
        definition:
          "Something that might happen. Rolling a 6, flipping heads, or it raining tomorrow are all events.",
      },
      {
        term: "Outcome",
        definition:
          "One specific result. When you roll a die, each face (1, 2, 3, 4, 5, 6) is a separate outcome.",
      },
      {
        term: "Random",
        definition:
          "When you cannot predict the exact result ahead of time, even if you know all the possibilities.",
      },
    ],
    interactive: {
      title: "Dice Roller",
      description:
        "Roll a virtual die and track the results. Watch how the frequencies get closer to what probability predicts as you roll more times.",
      type: "coin-flip",
    },
  },
  intermediate: {
    explanation:
      "Formally, probability is a function P that assigns a value between 0 and 1 to events in a sample space S. For any event A, P(A) represents the long-run relative frequency of A occurring, or our degree of belief that A is true.\n\nTwo core rules govern how probabilities combine. The addition rule handles \"or\" questions: P(A or B) = P(A) + P(B) - P(A and B). The multiplication rule handles \"and\" questions: P(A and B) = P(A) * P(B|A), where P(B|A) is the conditional probability of B given that A occurred.\n\nConditional probability is where things get interesting. P(B|A) = P(A and B) / P(A). It answers: \"If I know A happened, how does that change the likelihood of B?\" This leads directly to Bayes' Theorem, which lets you update your beliefs when you get new evidence:\n\nP(A|B) = P(B|A) * P(A) / P(B)",
    example:
      "A medical test for a rare disease is 95% accurate (sensitivity) and has a 3% false positive rate. The disease affects 1 in 1,000 people. You test positive. What is the probability you actually have the disease?\n\nIntuition says 95%, but Bayes' Theorem tells a different story:\n\nP(Disease|Positive) = P(Positive|Disease) * P(Disease) / P(Positive)\n= 0.95 * 0.001 / (0.95 * 0.001 + 0.03 * 0.999)\n= 0.00095 / 0.03092\n= 0.031, or about 3.1%\n\nDespite a positive result on a 95% accurate test, there is only a 3.1% chance you have the disease. The low base rate (1 in 1,000) overwhelms the test accuracy. This is why understanding conditional probability matters in research and clinical decision-making.",
    keyTakeaway:
      "Conditional probability and Bayes' Theorem show that the probability of an event can change dramatically depending on context. Base rates matter as much as test accuracy.",
    keyTerms: [
      {
        term: "Sample Space (S)",
        definition:
          "The set of all possible outcomes of an experiment. For a coin flip, S = {Heads, Tails}.",
      },
      {
        term: "Conditional Probability P(B|A)",
        definition:
          "The probability of event B occurring given that event A has already occurred. Calculated as P(A and B) / P(A).",
      },
      {
        term: "Bayes' Theorem",
        definition:
          "A formula for updating probabilities with new evidence: P(A|B) = P(B|A) * P(A) / P(B). Reverses the conditioning direction.",
      },
      {
        term: "Independence",
        definition:
          "Two events are independent if knowing one occurred does not change the probability of the other. Formally, P(A and B) = P(A) * P(B).",
      },
      {
        term: "Base Rate",
        definition:
          "The overall prevalence or frequency of an event in the population, before considering any test results or additional evidence.",
      },
    ],
    interactive: {
      title: "Bayes' Theorem Calculator",
      description:
        "Set the base rate of a condition, the sensitivity of a test, and the false positive rate. See how they interact to produce the true probability after a positive result.",
      type: "drug-trial",
    },
  },
  advanced: {
    explanation:
      "Probability theory is built on the Kolmogorov axioms (1933). Given a sample space Omega and a sigma-algebra F of events, a probability measure P satisfies: (1) P(A) >= 0 for all A in F, (2) P(Omega) = 1, and (3) for any countable sequence of mutually exclusive events, P(union Ai) = sum P(Ai).\n\nRandom variables map outcomes to real numbers, and their behavior is characterized by probability distributions. Discrete distributions (Bernoulli, Binomial, Poisson) assign probabilities to countable outcomes. Continuous distributions (Normal, Exponential, Beta) are described by probability density functions where P(a < X < b) = integral from a to b of f(x)dx.\n\nTwo fundamental theorems underpin all of inferential statistics. The Law of Large Numbers states that the sample mean converges to the expected value as n grows. The Central Limit Theorem (CLT) states that regardless of the population distribution, the sampling distribution of the mean approaches a Normal distribution as n increases, with mean mu and standard deviation sigma/sqrt(n). The CLT is why so many statistical tests assume normality: they are testing the distribution of sample statistics, not the raw data.",
    example:
      "Consider estimating the average time users spend on a website. The population distribution of session times is heavily right-skewed (many short visits, a few very long ones), with mu = 4.2 minutes and sigma = 6.1 minutes.\n\nWith a single sample of n = 5, the sampling distribution of the mean is still skewed and unreliable. But by the CLT, with n = 50, the distribution of the sample mean is approximately Normal(4.2, 6.1/sqrt(50)) = Normal(4.2, 0.863). With n = 200, it tightens to Normal(4.2, 0.431).\n\nThis has direct implications for study design. A 95% confidence interval for the mean with n = 50 has a margin of error of 1.96 * 0.863 = 1.69 minutes. With n = 200, it shrinks to 0.84 minutes. The CLT tells you exactly how much precision you buy with each additional observation, and it works regardless of the skewness in the underlying data.",
    keyTakeaway:
      "The Kolmogorov axioms provide the foundation, but the Central Limit Theorem is what makes modern statistics work. It guarantees that sample means behave predictably, enabling inference from any population distribution given sufficient sample size.",
    keyTerms: [
      {
        term: "Kolmogorov Axioms",
        definition:
          "The three foundational axioms of probability: non-negativity, normalization (P(Omega) = 1), and countable additivity for mutually exclusive events.",
      },
      {
        term: "Random Variable",
        definition:
          "A function that maps each outcome in the sample space to a real number. Can be discrete (countable values) or continuous (any value in an interval).",
      },
      {
        term: "Law of Large Numbers",
        definition:
          "As sample size increases, the sample mean converges in probability to the population mean. The mathematical basis for why larger samples are more reliable.",
      },
      {
        term: "Central Limit Theorem",
        definition:
          "The sampling distribution of the mean approaches a Normal distribution as n increases, regardless of the population distribution. Mean = mu, SD = sigma/sqrt(n).",
      },
      {
        term: "Probability Density Function",
        definition:
          "For continuous random variables, f(x) describes the relative likelihood of values. Probabilities are areas under the curve: P(a < X < b) = integral of f(x)dx from a to b.",
      },
      {
        term: "Sampling Distribution",
        definition:
          "The distribution of a statistic (like the mean) computed from repeated samples of the same size from the same population.",
      },
    ],
    interactive: {
      title: "Central Limit Theorem Visualizer",
      description:
        "Choose a population distribution (uniform, skewed, bimodal) and a sample size. Watch the sampling distribution of the mean converge to a normal curve as you draw more samples.",
      type: "power-analysis",
    },
  },
};
