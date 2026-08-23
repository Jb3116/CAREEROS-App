/**
 * CAREEROS - Authentication & Account Registry Security Service
 * Handles password complexity validation and strict Sign In / Sign Up enforcement.
 */

export interface PasswordCriteria {
  length: boolean;
  uppercase: boolean;
  lowercase: boolean;
  number: boolean;
  special: boolean;
}

export interface PasswordValidationResult {
  isValid: boolean;
  criteria: PasswordCriteria;
  errors: string[];
}

export interface RegisteredAccount {
  id: string;
  name: string;
  email: string;
  password: string;
  college?: string;
  degree?: string;
  role: 'student' | 'admin';
  createdAt: string;
}

export const ACCOUNTS_STORAGE_KEY = 'careeros_registered_accounts';

export const DEFAULT_ACCOUNTS: RegisteredAccount[] = [
  {
    id: 's123',
    name: 'Alex Chen',
    email: 'alex.chen@vit.edu',
    password: 'CareerOS2026!',
    college: 'Vellore Institute of Technology, Chennai',
    degree: 'B.Tech in Computer Science & Engineering',
    role: 'student',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'admin1',
    name: 'TPO Placement Cell',
    email: 'tpo.placement@vit.ac.in',
    password: '••••••••••••',
    college: 'Vellore Institute of Technology, Vellore',
    role: 'admin',
    createdAt: new Date().toISOString(),
  },
];

/**
 * Validates password against strict complexity security rules:
 * - Minimum 8 characters
 * - At least 1 uppercase letter (A-Z)
 * - At least 1 lowercase letter (a-z)
 * - At least 1 numeric digit (0-9)
 * - At least 1 special character (@, $, !, %, *, ?, &, #, etc.)
 */
export function validatePasswordComplexity(password: string): PasswordValidationResult {
  const criteria: PasswordCriteria = {
    length: password.length >= 8,
    uppercase: /[A-Z]/.test(password),
    lowercase: /[a-z]/.test(password),
    number: /[0-9]/.test(password),
    special: /[@$!%*?&#^()_+\-=[\]{};':"\\|,.<>/?]/.test(password),
  };

  const errors: string[] = [];
  if (!criteria.length) errors.push('Password must be at least 8 characters long.');
  if (!criteria.uppercase) errors.push('Password must contain at least one uppercase letter (A-Z).');
  if (!criteria.lowercase) errors.push('Password must contain at least one lowercase letter (a-z).');
  if (!criteria.number) errors.push('Password must contain at least one numeric digit (0-9).');
  if (!criteria.special) errors.push('Password must contain at least one special character (e.g. @, $, !, %, *, ?).');

  return {
    isValid: Object.values(criteria).every(Boolean),
    criteria,
    errors,
  };
}

/**
 * Retrieve all registered accounts from localStorage with defaults fallback
 */
export function getRegisteredAccounts(): RegisteredAccount[] {
  if (typeof window === 'undefined') {
    return DEFAULT_ACCOUNTS;
  }

  try {
    const raw = localStorage.getItem(ACCOUNTS_STORAGE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Error reading registered accounts:', e);
  }

  // Initialize storage with defaults if empty
  try {
    localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(DEFAULT_ACCOUNTS));
  } catch (e) {}

  return DEFAULT_ACCOUNTS;
}

/**
 * Find account by email or username (case-insensitive)
 */
export function findRegisteredAccount(identifier: string): RegisteredAccount | null {
  if (!identifier) return null;
  const cleanId = identifier.trim().toLowerCase();
  const accounts = getRegisteredAccounts();

  return (
    accounts.find(
      (acc) =>
        acc.email.toLowerCase() === cleanId ||
        acc.id.toLowerCase() === cleanId ||
        acc.name.toLowerCase() === cleanId
    ) || null
  );
}

/**
 * Register a new student account into the accounts registry
 */
export function registerNewAccount(accountData: {
  name: string;
  email: string;
  password: string;
  college?: string;
  degree?: string;
}): { success: boolean; error?: string; account?: RegisteredAccount } {
  const cleanEmail = accountData.email.trim().toLowerCase();
  if (!cleanEmail) {
    return { success: false, error: 'Email address is required.' };
  }

  const existing = findRegisteredAccount(cleanEmail);
  if (existing) {
    return {
      success: false,
      error: 'An account with this email already exists. Please sign in instead.',
    };
  }

  const validation = validatePasswordComplexity(accountData.password);
  if (!validation.isValid) {
    return {
      success: false,
      error: validation.errors[0] || 'Password does not meet complexity requirements.',
    };
  }

  const newAccount: RegisteredAccount = {
    id: `s_${Date.now()}`,
    name: accountData.name.trim(),
    email: cleanEmail,
    password: accountData.password,
    college: accountData.college?.trim() || 'Vellore Institute of Technology, Chennai',
    degree: accountData.degree?.trim() || 'B.Tech in Computer Science & Engineering',
    role: 'student',
    createdAt: new Date().toISOString(),
  };

  const accounts = getRegisteredAccounts();
  accounts.push(newAccount);

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(ACCOUNTS_STORAGE_KEY, JSON.stringify(accounts));
    } catch (e) {
      console.error('Failed to save account:', e);
    }
  }

  return { success: true, account: newAccount };
}

/**
 * Strictly verify credentials on Sign In:
 * - Returns error if account does not exist
 * - Returns error if password is incorrect
 */
export function verifyStudentCredentials(
  identifier: string,
  password: string
): { success: boolean; error?: string; account?: RegisteredAccount } {
  const cleanId = identifier.trim().toLowerCase();
  const account = findRegisteredAccount(cleanId);

  if (!account) {
    return {
      success: false,
      error: 'Account not found. Please sign up first to create your CareerOS profile.',
    };
  }

  if (account.password !== password) {
    return {
      success: false,
      error: 'Incorrect password. Please verify your password and try again.',
    };
  }

  return { success: true, account };
}
