export interface TopicContent {
  explanation: string;
  example: string;
  keyTakeaway: string;
}

export interface InteractiveExample {
  title: string;
  description: string;
  type: "coin-flip" | "drug-trial" | "power-analysis";
}

export interface KeyTerm {
  term: string;
  definition: string;
}

export interface DifficultyContent {
  explanation: string;
  example: string;
  keyTakeaway: string;
  keyTerms: KeyTerm[];
  interactive: InteractiveExample;
}

export const nullHypothesisContent: Record<string, DifficultyContent> = {
  beginner: {
    explanation:
      "Imagine someone tells you they can predict coin flips. Your first instinct is probably: \"No you can't, you are just guessing.\" That instinct is the null hypothesis. It is the default assumption that nothing special is going on. In statistics, we always start by assuming the boring explanation is true. Then we look at data to see if there is enough evidence to change our mind. If someone guesses 9 out of 10 coin flips correctly, maybe they are not just guessing. But if they get 6 out of 10, that could easily happen by luck. The null hypothesis is our way of asking: \"Could this result just be a coincidence?\"",
    example:
      "A teacher tries a new study method with her class. The class average goes up by 3 points on the next test. She is excited, but is this proof the method worked? The null hypothesis says: \"The new method made no difference. The 3-point bump is just normal variation.\" To challenge that, she would need to show that a 3-point increase is unlikely to happen by chance alone. If she cannot, the null hypothesis stands. Not because the method definitely failed, but because we do not have strong enough evidence to say it worked.",
    keyTakeaway:
      "The null hypothesis is the \"nothing is happening\" assumption. We only reject it when the evidence is strong enough to rule out coincidence.",
    keyTerms: [
      {
        term: "Null Hypothesis",
        definition:
          "The default assumption that there is no effect, no difference, and no relationship. The \"boring\" explanation.",
      },
      {
        term: "Evidence",
        definition:
          "The data we collect to decide whether the null hypothesis is believable or not.",
      },
      {
        term: "Coincidence",
        definition:
          "When something looks meaningful but actually happened by random chance.",
      },
      {
        term: "Rejecting the Null",
        definition:
          "Deciding that the evidence is strong enough to say something real is going on, not just luck.",
      },
    ],
    interactive: {
      title: "Coin Flip Challenge",
      description:
        "Flip a virtual coin multiple times. Can you tell if the coin is fair or rigged? This is exactly what the null hypothesis helps us figure out.",
      type: "coin-flip",
    },
  },
  intermediate: {
    explanation:
      "The null hypothesis (H0) is a formal statistical statement that there is no effect or no difference in the population. It serves as the claim we attempt to disprove. The alternative hypothesis (H1 or Ha) is what we suspect might be true instead. Hypothesis testing works by assuming H0 is true, then calculating how likely our observed data would be under that assumption. This probability is the p-value. If the p-value falls below a pre-set threshold (typically 0.05), we reject H0 in favor of H1. If not, we fail to reject H0. Importantly, failing to reject does not mean H0 is true. It means we lack sufficient evidence to conclude otherwise.",
    example:
      "A pharmaceutical company tests whether a new drug lowers blood pressure more than a placebo. They set up:\n\nH0: The mean blood pressure reduction is the same for drug and placebo (drug effect = 0)\nH1: The mean blood pressure reduction is greater for the drug group\n\n200 patients are randomized: 100 receive the drug, 100 receive the placebo. The drug group shows a mean reduction of 8 mmHg, the placebo group 5 mmHg. A two-sample t-test yields p = 0.03. Since 0.03 < 0.05, the researchers reject H0 and conclude the drug has a statistically significant effect on blood pressure. The 3 mmHg difference is unlikely to have arisen by chance alone.",
    keyTakeaway:
      "Hypothesis testing is a structured decision process. We assume no effect (H0), collect data, compute a p-value, and reject H0 only when the evidence is strong enough by our pre-defined standard.",
    keyTerms: [
      {
        term: "H0 (Null Hypothesis)",
        definition:
          "The formal statement of no effect or no difference. The hypothesis we test against.",
      },
      {
        term: "H1 (Alternative Hypothesis)",
        definition:
          "The statement that there is an effect or difference. What we conclude if we reject H0.",
      },
      {
        term: "p-value",
        definition:
          "The probability of observing data at least as extreme as what we got, assuming H0 is true. Smaller p-values provide stronger evidence against H0.",
      },
      {
        term: "Significance Level (alpha)",
        definition:
          "The threshold (commonly 0.05) below which we reject H0. Set before collecting data.",
      },
      {
        term: "Fail to Reject",
        definition:
          "When the p-value exceeds alpha. This does not prove H0 is true; it means the evidence is not strong enough to discard it.",
      },
    ],
    interactive: {
      title: "Drug Trial Simulator",
      description:
        "Run a simulated clinical trial. Set a sample size, observe the difference in outcomes, and see whether the p-value crosses the significance threshold.",
      type: "drug-trial",
    },
  },
  advanced: {
    explanation:
      "Hypothesis testing under the Neyman-Pearson framework formalizes the decision process into two competing hypotheses, a test statistic, and a rejection region. The null hypothesis H0 specifies a parameter value or constraint (e.g., theta = theta_0), while H1 specifies an alternative (e.g., theta != theta_0, or theta > theta_0). The critical insight is that we control two types of errors:\n\nType I error (alpha): Rejecting H0 when it is true (false positive)\nType II error (beta): Failing to reject H0 when H1 is true (false negative)\n\nPower (1 - beta) is the probability of correctly rejecting a false H0. The Neyman-Pearson Lemma establishes that for simple hypotheses, the likelihood ratio test is the most powerful test at any given alpha level. In practice, researchers must navigate the tradeoff between alpha, power, effect size, and sample size. A statistically significant result (small p-value) does not imply practical significance; the effect size and confidence interval are essential for interpretation.",
    example:
      "Consider testing whether a policy intervention reduces recidivism rates. With H0: p_treatment = p_control and H1: p_treatment < p_control, a researcher conducts a power analysis before data collection:\n\nDesired power: 0.80\nExpected effect size (Cohen's h): 0.25 (small-to-medium)\nSignificance level: alpha = 0.05 (one-tailed)\n\nThe required sample size is approximately 200 per group. After collecting data, the researcher observes p_treatment = 0.32 and p_control = 0.40. A one-sided z-test for proportions yields z = -1.79, p = 0.037. At alpha = 0.05, H0 is rejected. However, the confidence interval for the difference is [-0.15, -0.005], which includes effects so small they may lack policy relevance. The researcher must weigh statistical significance against the practical magnitude of the effect and consider whether the study was adequately powered to detect the minimum clinically important difference.",
    keyTakeaway:
      "The null hypothesis is one component of a broader decision-theoretic framework. Responsible inference requires attention to power, effect size, and the distinction between statistical and practical significance.",
    keyTerms: [
      {
        term: "Neyman-Pearson Framework",
        definition:
          "The decision-theoretic approach to hypothesis testing that formalizes Type I and Type II error rates and optimizes power.",
      },
      {
        term: "Type I Error (alpha)",
        definition:
          "Rejecting H0 when it is in fact true. The false positive rate, controlled by setting the significance level.",
      },
      {
        term: "Type II Error (beta)",
        definition:
          "Failing to reject H0 when H1 is true. The false negative rate, inversely related to power.",
      },
      {
        term: "Power (1 - beta)",
        definition:
          "The probability of correctly rejecting a false null hypothesis. Depends on sample size, effect size, and alpha.",
      },
      {
        term: "Effect Size",
        definition:
          "A standardized measure of the magnitude of an effect (e.g., Cohen's d, Cohen's h), independent of sample size.",
      },
      {
        term: "Likelihood Ratio Test",
        definition:
          "A test statistic based on the ratio of likelihoods under H0 and H1. The Neyman-Pearson Lemma proves it is the most powerful test for simple hypotheses.",
      },
    ],
    interactive: {
      title: "Power Analysis Explorer",
      description:
        "Adjust sample size, effect size, and alpha to see how they affect statistical power. Visualize the overlapping distributions of H0 and H1 and watch the rejection region shift.",
      type: "power-analysis",
    },
  },
};
