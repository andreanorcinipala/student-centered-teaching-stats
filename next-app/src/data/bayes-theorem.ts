import type { DifficultyContent } from "./null-hypothesis";

export const bayesTheoremContent: Record<string, DifficultyContent> = {
  beginner: {
    explanation:
      "Imagine you get a positive result on a medical test. Does that mean you definitely have the disease? Not necessarily. Bayes' Theorem helps you figure out the real probability by combining two pieces of information: how common the disease actually is, and how accurate the test is.\n\nHere is the key insight: if a disease is very rare, even a good test will produce many false alarms. Out of 1,000 people tested, maybe only 5 actually have the disease. A 90%-accurate test will correctly catch about 4 or 5 of those, but it will also falsely flag about 100 healthy people. So if you test positive, you are more likely to be one of the 100 false alarms than one of the 5 true cases.\n\nBayes' Theorem gives you the math to update your beliefs when new evidence (like a test result) comes in. You start with a prior belief (how common is the disease?), see some evidence (the test result), and arrive at a posterior belief (how likely am I to actually have the disease given this positive test?).",
    example:
      "A university screens all 10,000 students for a rare learning disability that affects 2% of students. The screening test is 95% sensitive (catches 95% of true cases) and 90% specific (correctly clears 90% of non-cases).\n\nOf 10,000 students:\n- 200 actually have the disability (2%)\n- 9,800 do not\n\nTest results:\n- True positives: 200 x 0.95 = 190 students correctly identified\n- False positives: 9,800 x 0.10 = 980 students incorrectly flagged\n- Total positives: 190 + 980 = 1,170\n\nIf you test positive, the chance you actually have the disability is 190 / 1,170 = 16.2%. Despite a seemingly accurate test, over 83% of positive results are false alarms. This is why a second, more specific test is usually required before diagnosis.",
    keyTakeaway:
      "Bayes' Theorem shows that the probability of having a condition after a positive test depends not just on test accuracy, but critically on how common the condition is in the first place.",
    keyTerms: [
      {
        term: "Prior Probability",
        definition:
          "Your initial belief about how likely something is before seeing new evidence. In medical testing, this is the prevalence of the disease.",
      },
      {
        term: "Posterior Probability",
        definition:
          "Your updated belief after incorporating new evidence. The probability of actually having the disease after getting a positive test result.",
      },
      {
        term: "False Positive",
        definition:
          "When the test says positive but the person does not actually have the condition. More common when the condition is rare.",
      },
      {
        term: "Sensitivity",
        definition:
          "The probability that the test correctly identifies someone who has the condition. A 95% sensitive test catches 95 out of 100 true cases.",
      },
    ],
    interactive: {
      title: "Test Result Calculator",
      description:
        "Set the disease prevalence and test accuracy. See how many of the positive results are true cases versus false alarms.",
      type: "coin-flip",
    },
  },
  intermediate: {
    explanation:
      "Bayes' Theorem formalizes how to update probabilities with new evidence:\n\nP(A|B) = P(B|A) * P(A) / P(B)\n\nwhere P(A|B) is the posterior (probability of A given B), P(B|A) is the likelihood, P(A) is the prior, and P(B) is the marginal likelihood (total probability of observing B).\n\nThe denominator P(B) is computed using the law of total probability: P(B) = P(B|A)*P(A) + P(B|not A)*P(not A). This ensures the posterior probabilities sum to 1.\n\nIn diagnostic testing, these terms map directly: A = disease, B = positive test. The prior is prevalence, the likelihood is sensitivity, and P(B|not A) is the false positive rate (1 - specificity). The positive predictive value (PPV) is P(Disease|Positive), and the negative predictive value (NPV) is P(No disease|Negative).\n\nA critical insight is that PPV depends heavily on prevalence. The same test with 95% sensitivity and 95% specificity has a PPV of 16% when prevalence is 1%, but 86% when prevalence is 30%. This is why screening programs in low-prevalence populations generate many false positives.",
    example:
      "A rapid COVID test has sensitivity = 0.92 and specificity = 0.98. During a wave, local prevalence is 8%.\n\nP(COVID | Positive) = P(Pos|COVID) * P(COVID) / P(Pos)\n= (0.92 * 0.08) / (0.92 * 0.08 + 0.02 * 0.92)\n= 0.0736 / (0.0736 + 0.0184)\n= 0.0736 / 0.092\n= 0.80 (80% PPV)\n\nP(COVID | Negative) = P(Neg|COVID) * P(COVID) / P(Neg)\n= (0.08 * 0.08) / (0.08 * 0.08 + 0.98 * 0.92)\n= 0.0064 / 0.9080\n= 0.007 (0.7% false omission rate; NPV = 99.3%)\n\nNow imagine prevalence drops to 1%:\nPPV = (0.92 * 0.01) / (0.92 * 0.01 + 0.02 * 0.99) = 0.0092 / 0.029 = 31.7%\n\nThe same test goes from 80% PPV to 32% PPV just because prevalence changed. This demonstrates why context matters as much as test accuracy.",
    keyTakeaway:
      "Bayes' Theorem connects prior probability, likelihood, and evidence to produce a posterior probability. The same test performs very differently depending on the base rate of the condition in the population.",
    keyTerms: [
      {
        term: "Likelihood",
        definition:
          "P(B|A), the probability of observing the evidence given that the hypothesis is true. In testing, this is sensitivity.",
      },
      {
        term: "Marginal Likelihood",
        definition:
          "P(B), the total probability of observing the evidence across all possible states. Computed via the law of total probability.",
      },
      {
        term: "Positive Predictive Value (PPV)",
        definition:
          "The probability that a person who tests positive actually has the condition. Heavily influenced by prevalence.",
      },
      {
        term: "Negative Predictive Value (NPV)",
        definition:
          "The probability that a person who tests negative truly does not have the condition. Usually high when prevalence is low.",
      },
      {
        term: "Base Rate Neglect",
        definition:
          "A common cognitive error where people ignore the prior probability (how common something is) and focus only on the test result.",
      },
    ],
    interactive: {
      title: "Bayes' Theorem Calculator",
      description:
        "Adjust prevalence, sensitivity, and specificity. Watch the posterior probability and natural frequency tree update in real time.",
      type: "drug-trial",
    },
  },
  advanced: {
    explanation:
      "Bayes' Theorem generalizes to the continuous case and forms the foundation of Bayesian statistics. For a parameter theta with prior distribution p(theta), the posterior given data D is:\n\np(theta|D) = p(D|theta) * p(theta) / p(D)\n\nwhere p(D) = integral of p(D|theta)*p(theta) d(theta) is the marginal likelihood (evidence). This integral is often intractable, motivating computational methods like Markov Chain Monte Carlo (MCMC).\n\nIn Bayesian inference, the prior encodes existing knowledge or beliefs before seeing data. Conjugate priors simplify computation: a Beta prior with Binomial likelihood yields a Beta posterior; a Normal prior with Normal likelihood yields a Normal posterior. Non-informative (flat) priors attempt to let the data speak for themselves, though truly non-informative priors do not exist in all parameterizations (Jeffreys' prior addresses this).\n\nThe Bayesian framework offers several advantages over frequentist approaches: direct probability statements about parameters (credible intervals vs. confidence intervals), natural incorporation of prior knowledge, and coherent handling of nuisance parameters through marginalization. However, it introduces subjectivity through prior specification. Sensitivity analysis across different priors assesses how much conclusions depend on prior choices.\n\nBayesian model comparison uses Bayes factors: BF = p(D|M1) / p(D|M2), the ratio of marginal likelihoods under competing models. Unlike p-values, Bayes factors quantify evidence for both the alternative and the null hypothesis.",
    example:
      "A clinical trialist uses a Bayesian framework to evaluate a new treatment. Historical data suggests the treatment effect (log-odds ratio) is approximately Normal(0.3, 0.15^2), reflecting modest prior belief in efficacy.\n\nNew trial data (n = 400): observed log-OR = 0.45, SE = 0.12.\n\nPosterior (conjugate Normal-Normal update):\nPosterior mean = (0.3/0.15^2 + 0.45/0.12^2) / (1/0.15^2 + 1/0.12^2)\n= (13.33 + 31.25) / (44.44 + 69.44)\n= 44.58 / 113.89\n= 0.391\n\nPosterior variance = 1 / 113.89 = 0.00878\nPosterior SD = 0.094\n\n95% credible interval: 0.391 +/- 1.96 * 0.094 = [0.207, 0.575]\n\nP(theta > 0 | data) = 1 - Phi(-0.391/0.094) > 0.999\n\nThe posterior mean (0.391) is a precision-weighted compromise between the prior mean (0.3) and the data (0.45). With a skeptical prior centered at 0: posterior mean = 0.35, 95% CI [0.16, 0.54], still showing strong evidence. Bayes factor vs. null: BF > 100, decisive evidence for efficacy.\n\nSensitivity analysis across three priors (informative, weakly informative, skeptical) shows consistent conclusions, strengthening the inference.",
    keyTakeaway:
      "Bayesian inference uses Bayes' Theorem to update prior beliefs with data, producing posterior distributions that allow direct probability statements about parameters. Prior sensitivity analysis and Bayes factors complement this framework.",
    keyTerms: [
      {
        term: "Prior Distribution",
        definition:
          "p(theta), the probability distribution encoding beliefs about a parameter before observing data. Can be informative, weakly informative, or non-informative.",
      },
      {
        term: "Posterior Distribution",
        definition:
          "p(theta|D), the updated distribution after combining the prior with observed data through the likelihood. The main output of Bayesian analysis.",
      },
      {
        term: "Credible Interval",
        definition:
          "A Bayesian interval with a direct probability interpretation: a 95% credible interval means there is a 95% probability the parameter lies within it (unlike confidence intervals).",
      },
      {
        term: "Conjugate Prior",
        definition:
          "A prior that, when combined with a specific likelihood, produces a posterior in the same distributional family. Beta-Binomial and Normal-Normal are classic examples.",
      },
      {
        term: "Bayes Factor",
        definition:
          "The ratio of marginal likelihoods under two competing models. Values above 10 are strong evidence; above 100 are decisive. Can support the null hypothesis, unlike p-values.",
      },
      {
        term: "MCMC (Markov Chain Monte Carlo)",
        definition:
          "A computational method for sampling from posterior distributions when the marginal likelihood integral is analytically intractable. Includes algorithms like Metropolis-Hastings and Hamiltonian Monte Carlo.",
      },
    ],
    interactive: {
      title: "Prior-to-Posterior Lab",
      description:
        "Choose a prior distribution and observe how it updates to a posterior as you add data points. Compare informative vs. flat priors and see how sample size affects the posterior.",
      type: "power-analysis",
    },
  },
};
