/**
 * Validation utility functions for form validation
 */

/**
 * Validates an email address
 * @param email - The email address to validate
 * @returns True if the email is valid, false otherwise
 */
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validates a password meets minimum requirements
 * @param password - The password to validate
 * @returns True if the password meets requirements, false otherwise
 */
export const isValidPassword = (password: string): boolean => {
  // Password must be at least 8 characters long and contain at least one number, 
  // one uppercase letter, one lowercase letter, and one special character
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return passwordRegex.test(password);
};

/**
 * Validates that two passwords match
 * @param password - The original password
 * @param confirmPassword - The confirmation password
 * @returns True if the passwords match, false otherwise
 */
export const passwordsMatch = (password: string, confirmPassword: string): boolean => {
  return password === confirmPassword;
};

/**
 * Validates that a string is not empty
 * @param value - The string to validate
 * @returns True if the string is not empty, false otherwise
 */
export const isNotEmpty = (value: string): boolean => {
  return value.trim().length > 0;
};

/**
 * Validates that a string is at least a certain length
 * @param value - The string to validate
 * @param minLength - The minimum length required
 * @returns True if the string is at least the minimum length, false otherwise
 */
export const isMinLength = (value: string, minLength: number): boolean => {
  return value.length >= minLength;
};

/**
 * Validates that a string is not longer than a certain length
 * @param value - The string to validate
 * @param maxLength - The maximum length allowed
 * @returns True if the string is not longer than the maximum length, false otherwise
 */
export const isMaxLength = (value: string, maxLength: number): boolean => {
  return value.length <= maxLength;
};

/**
 * Validates that a value is a number
 * @param value - The value to validate
 * @returns True if the value is a number, false otherwise
 */
export const isNumber = (value: string): boolean => {
  return !isNaN(Number(value));
};

/**
 * Validates that a value is a positive number
 * @param value - The value to validate
 * @returns True if the value is a positive number, false otherwise
 */
export const isPositiveNumber = (value: string): boolean => {
  const num = Number(value);
  return !isNaN(num) && num > 0;
};

/**
 * Validates a phone number
 * @param phone - The phone number to validate
 * @returns True if the phone number is valid, false otherwise
 */
export const isValidPhone = (phone: string): boolean => {
  // Basic phone validation - can be adjusted based on regional requirements
  const phoneRegex = /^\+?[0-9]{10,15}$/;
  return phoneRegex.test(phone);
};

/**
 * Validates a date is in the future
 * @param date - The date to validate
 * @returns True if the date is in the future, false otherwise
 */
export const isFutureDate = (date: Date): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date >= today;
};

/**
 * Validates a date is in the past
 * @param date - The date to validate
 * @returns True if the date is in the past, false otherwise
 */
export const isPastDate = (date: Date): boolean => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return date < today;
};

/**
 * Creates a validation error message object
 * @param field - The field name
 * @param message - The error message
 * @returns An object with the field name and error message
 */
export const createValidationError = (field: string, message: string): { field: string; message: string } => {
  return { field, message };
};

/**
 * Validates form data against a set of validation rules
 * @param data - The form data to validate
 * @param rules - The validation rules to apply
 * @returns An array of validation errors, empty if no errors
 */
export const validateForm = (
  data: Record<string, any>,
  rules: Record<string, Array<(value: any) => boolean | { valid: boolean; message: string }>>
): Array<{ field: string; message: string }> => {
  const errors: Array<{ field: string; message: string }> = [];

  Object.entries(rules).forEach(([field, validations]) => {
    const value = data[field];

    validations.forEach((validation) => {
      const result = validation(value);

      if (typeof result === 'boolean') {
        if (!result) {
          errors.push({ field, message: `Invalid ${field}` });
        }
      } else if (!result.valid) {
        errors.push({ field, message: result.message });
      }
    });
  });

  return errors;
};

