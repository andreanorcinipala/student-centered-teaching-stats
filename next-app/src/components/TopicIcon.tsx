export default function TopicIcon({ name }: { name: string }) {
  const cls = "w-8 h-8 text-brand-500";

  switch (name) {
    case "null-hypothesis":
      return (
        <svg className={cls} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <circle cx="24" cy="24" r="16" />
          <line x1="14" y1="14" x2="34" y2="34" />
        </svg>
      );
    case "probability":
      return (
        <svg className={cls} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <rect x="8" y="8" width="13" height="13" rx="2" />
          <rect x="27" y="8" width="13" height="13" rx="2" />
          <rect x="8" y="27" width="13" height="13" rx="2" />
          <rect x="27" y="27" width="13" height="13" rx="2" />
          <circle cx="14.5" cy="14.5" r="1.5" fill="currentColor" stroke="none" />
          <circle cx="31" cy="12" r="1.5" fill="currentColor" stroke="none" />
          <circle cx="35" cy="16" r="1.5" fill="currentColor" stroke="none" />
          <circle cx="14.5" cy="33.5" r="1.5" fill="currentColor" stroke="none" />
          <circle cx="11" cy="30" r="1.5" fill="currentColor" stroke="none" />
          <circle cx="18" cy="30" r="1.5" fill="currentColor" stroke="none" />
          <circle cx="11" cy="37" r="1.5" fill="currentColor" stroke="none" />
          <circle cx="18" cy="37" r="1.5" fill="currentColor" stroke="none" />
          <circle cx="33" cy="33" r="1.5" fill="currentColor" stroke="none" />
        </svg>
      );
    case "linear-regression":
      return (
        <svg className={cls} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="8" y1="40" x2="40" y2="40" />
          <line x1="8" y1="8" x2="8" y2="40" />
          <line x1="10" y1="36" x2="38" y2="12" strokeWidth="2" />
          <circle cx="14" cy="33" r="2" fill="currentColor" stroke="none" />
          <circle cx="19" cy="28" r="2" fill="currentColor" stroke="none" />
          <circle cx="24" cy="26" r="2" fill="currentColor" stroke="none" />
          <circle cx="29" cy="20" r="2" fill="currentColor" stroke="none" />
          <circle cx="35" cy="15" r="2" fill="currentColor" stroke="none" />
        </svg>
      );
    case "logistic-regression":
      return (
        <svg className={cls} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="8" y1="40" x2="40" y2="40" />
          <line x1="8" y1="8" x2="8" y2="40" />
          <path d="M10 36 C16 36, 20 35, 24 24 C28 13, 32 12, 38 12" strokeWidth="2" />
          <line x1="6" y1="12" x2="40" y2="12" strokeDasharray="3 3" strokeWidth="1" opacity="0.4" />
          <line x1="6" y1="36" x2="40" y2="36" strokeDasharray="3 3" strokeWidth="1" opacity="0.4" />
        </svg>
      );
    case "multivariable-linear":
      return (
        <svg className={cls} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="8" y1="40" x2="40" y2="40" />
          <line x1="8" y1="8" x2="8" y2="40" />
          <line x1="10" y1="34" x2="38" y2="14" strokeWidth="2" />
          <line x1="10" y1="30" x2="38" y2="18" strokeWidth="1.5" strokeDasharray="4 2" opacity="0.5" />
          <line x1="10" y1="38" x2="38" y2="10" strokeWidth="1.5" strokeDasharray="4 2" opacity="0.5" />
          <circle cx="15" cy="32" r="2" fill="currentColor" stroke="none" />
          <circle cx="20" cy="27" r="2" fill="currentColor" stroke="none" />
          <circle cx="26" cy="23" r="2" fill="currentColor" stroke="none" />
          <circle cx="32" cy="18" r="2" fill="currentColor" stroke="none" />
          <circle cx="18" cy="34" r="2" fill="#5c8a7e" stroke="none" opacity="0.5" />
          <circle cx="28" cy="20" r="2" fill="#5c8a7e" stroke="none" opacity="0.5" />
        </svg>
      );
    case "multivariable-logistic":
      return (
        <svg className={cls} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="8" y1="40" x2="40" y2="40" />
          <line x1="8" y1="8" x2="8" y2="40" />
          <path d="M10 36 C16 36, 20 35, 24 24 C28 13, 32 12, 38 12" strokeWidth="2" />
          <path d="M10 34 C14 34, 18 32, 22 24 C26 16, 30 14, 38 14" strokeWidth="1.5" strokeDasharray="4 2" opacity="0.5" />
          <circle cx="14" cy="35" r="1.5" fill="currentColor" stroke="none" />
          <circle cx="22" cy="28" r="1.5" fill="currentColor" stroke="none" />
          <circle cx="30" cy="14" r="1.5" fill="currentColor" stroke="none" />
          <circle cx="18" cy="33" r="1.5" fill="#5c8a7e" stroke="none" opacity="0.5" />
          <circle cx="26" cy="18" r="1.5" fill="#5c8a7e" stroke="none" opacity="0.5" />
          <circle cx="34" cy="12" r="1.5" fill="#5c8a7e" stroke="none" opacity="0.5" />
        </svg>
      );
    case "poisson-regression":
      return (
        <svg className={cls} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="8" y1="40" x2="40" y2="40" />
          <line x1="8" y1="8" x2="8" y2="40" />
          <rect x="12" y="32" width="4" height="8" rx="1" fill="currentColor" opacity="0.3" />
          <rect x="18" y="24" width="4" height="16" rx="1" fill="currentColor" opacity="0.5" />
          <rect x="24" y="14" width="4" height="26" rx="1" fill="currentColor" opacity="0.8" />
          <rect x="30" y="22" width="4" height="18" rx="1" fill="currentColor" opacity="0.5" />
          <rect x="36" y="30" width="4" height="10" rx="1" fill="currentColor" opacity="0.3" />
        </svg>
      );
    case "missing-data":
      return (
        <svg className={cls} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <rect x="8" y="10" width="32" height="6" rx="1.5" />
          <rect x="8" y="21" width="32" height="6" rx="1.5" />
          <rect x="8" y="32" width="32" height="6" rx="1.5" />
          <line x1="18" y1="23" x2="30" y2="25" stroke="currentColor" strokeWidth="2" opacity="0.4" />
          <text x="24" y="37" textAnchor="middle" fontSize="7" fontWeight="bold" fill="currentColor" stroke="none">?</text>
        </svg>
      );
    case "glmm":
      return (
        <svg className={cls} viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <circle cx="16" cy="16" r="8" opacity="0.3" fill="currentColor" stroke="none" />
          <circle cx="32" cy="16" r="8" opacity="0.3" fill="currentColor" stroke="none" />
          <circle cx="24" cy="32" r="8" opacity="0.3" fill="currentColor" stroke="none" />
          <line x1="16" y1="16" x2="32" y2="16" strokeWidth="1.5" />
          <line x1="16" y1="16" x2="24" y2="32" strokeWidth="1.5" />
          <line x1="32" y1="16" x2="24" y2="32" strokeWidth="1.5" />
          <circle cx="16" cy="16" r="2.5" fill="currentColor" stroke="none" />
          <circle cx="32" cy="16" r="2.5" fill="currentColor" stroke="none" />
          <circle cx="24" cy="32" r="2.5" fill="currentColor" stroke="none" />
        </svg>
      );
    default:
      return null;
  }
}
