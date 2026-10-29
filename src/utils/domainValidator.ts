/**
 * Domain parsing, normalization, validation, and DNS matching logic for ShieldNet
 */

export interface ValidationResult {
  isValid: boolean;
  normalizedDomain: string;
  hadPathOrQuery: boolean;
  warning?: string;
  error?: string;
}

/**
 * Normalizes user input and validates whether it represents a valid domain.
 */
export function validateAndNormalizeDomain(input: string): ValidationResult {
  if (!input || !input.trim()) {
    return {
      isValid: false,
      normalizedDomain: '',
      hadPathOrQuery: false,
      error: 'Please enter a domain name.',
    };
  }

  let raw = input.trim().toLowerCase();
  let hadPathOrQuery = false;

  // Check if user included protocol
  if (raw.startsWith('http://') || raw.startsWith('https://')) {
    raw = raw.replace(/^https?:\/\//, '');
  }

  // Check if user included path, query, or anchor
  if (raw.includes('/') || raw.includes('?') || raw.includes('#')) {
    hadPathOrQuery = true;
    raw = raw.split('/')[0].split('?')[0].split('#')[0];
  }

  // Strip port if present
  if (raw.includes(':')) {
    raw = raw.split(':')[0];
  }

  // Strip leading/trailing dots and spaces
  raw = raw.replace(/^\.+|\.+$/g, '').trim();

  // Validate domain format: at least one dot, valid labels
  const domainRegex = /^(?:[a-z0-9](?:[a-z0-9-]{0,61}[a-z0-9])?\.)+[a-z]{2,63}$/i;

  if (!domainRegex.test(raw)) {
    return {
      isValid: false,
      normalizedDomain: raw,
      hadPathOrQuery,
      error: 'Enter a valid domain name (e.g., example.com or news.site.org).',
    };
  }

  return {
    isValid: true,
    normalizedDomain: raw,
    hadPathOrQuery,
    warning: hadPathOrQuery
      ? 'Note: Device-level DNS filtering blocks the whole domain. Specific URL paths (/page) cannot be blocked separately under HTTPS.'
      : undefined,
  };
}

/**
 * Checks whether a requested domain is matched by a rule
 */
export function isDomainMatchedByRule(
  requestedDomain: string,
  ruleDomain: string,
  includeSubdomains: boolean
): boolean {
  const req = requestedDomain.toLowerCase().trim().replace(/^\.+|\.+$/g, '');
  const target = ruleDomain.toLowerCase().trim().replace(/^\.+|\.+$/g, '');

  // Exact match
  if (req === target) return true;

  // www equivalence
  if (req === `www.${target}` || target === `www.${req}`) return true;

  // Subdomain match (e.g. "m.facebook.com" matches "facebook.com" when includeSubdomains is true)
  if (includeSubdomains && req.endsWith(`.${target}`)) {
    return true;
  }

  return false;
}
