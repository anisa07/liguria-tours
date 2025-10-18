/**
 * Accessibility Auditor Component Types
 *
 * Types for the accessibility auditor that integrates axe-core
 * for automated accessibility testing and violation reporting.
 */

export interface Props {
  /**
   * Whether the auditor is enabled (defaults to development mode only)
   */
  enabled?: boolean;

  /**
   * Whether to show violations panel
   */
  showViolations?: boolean;

  /**
   * Whether to show best practices recommendations
   */
  showBestPractices?: boolean;

  /**
   * Axe-core tags to include in the audit
   * Common tags: wcag2a, wcag2aa, wcag21aa, wcag21aaa, section508, best-practice
   */
  tags?: string[];

  /**
   * Additional CSS class names
   */
  className?: string;

  /**
   * Additional HTML attributes
   */
  [key: string]: unknown;
}

/**
 * Axe-core violation result structure
 */
export interface AxeViolation {
  id: string;
  impact?: "minor" | "moderate" | "serious" | "critical";
  tags: string[];
  description: string;
  help: string;
  helpUrl: string;
  nodes: AxeViolationNode[];
}

/**
 * Axe-core violation node structure
 */
export interface AxeViolationNode {
  any: AxeCheck[];
  all: AxeCheck[];
  none: AxeCheck[];
  impact?: "minor" | "moderate" | "serious" | "critical";
  html: string;
  target: string[];
  xpath?: string[];
  ancestry?: string[];
  failureSummary?: string;
}

/**
 * Axe-core check result structure
 */
export interface AxeCheck {
  id: string;
  impact?: "minor" | "moderate" | "serious" | "critical";
  message: string;
  data: Record<string, unknown>;
  relatedNodes?: AxeRelatedNode[];
}

/**
 * Axe-core related node structure
 */
export interface AxeRelatedNode {
  target: string[];
  html: string;
}

/**
 * Axe-core audit results structure
 */
export interface AxeResults {
  inapplicable: AxeViolation[];
  incomplete: AxeViolation[];
  passes: AxeViolation[];
  violations: AxeViolation[];
  timestamp: string;
  url: string;
}

/**
 * Auditor configuration options
 */
export interface AuditorConfig {
  tags: string[];
  rules: Record<string, { enabled: boolean }>;
  reporter?: "v1" | "v2" | "raw" | "raw-env" | "no-passes";
  resultTypes?: ("inapplicable" | "incomplete" | "passes" | "violations")[];
  elementRef?: boolean;
  selectors?: boolean;
  ancestry?: boolean;
  xpath?: boolean;
}

/**
 * Auditor status types
 */
export type AuditorStatus =
  | "checking"
  | "passed"
  | "violations"
  | "warnings"
  | "error";

/**
 * Violation display item for the UI
 */
export interface ViolationDisplayItem {
  id: string;
  type: "violation" | "warning";
  title: string;
  description: string;
  helpUrl: string;
  impact?: string;
  element?: string;
  selector?: string;
}

/**
 * Auditor event handlers
 */
export interface AuditorEventHandlers {
  onAuditStart?: () => void;
  onAuditComplete?: (results: AxeResults) => void;
  onAuditError?: (error: Error) => void;
  onViolationClick?: (violation: AxeViolation) => void;
}

/**
 * Auditor performance metrics
 */
export interface AuditorMetrics {
  auditDuration: number;
  violationCount: number;
  warningCount: number;
  passCount: number;
  elementCount: number;
  timestamp: string;
}
