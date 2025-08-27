/**
 * Formatting utility functions
 */

/**
 * Format a number as currency
 * @param amount - The amount to format
 * @param currency - The currency code (default: USD)
 * @returns Formatted currency string
 */
export const formatCurrency = (amount: number, currency = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Format a date string
 * @param dateString - The date string to format
 * @param options - Intl.DateTimeFormatOptions
 * @returns Formatted date string
 */
export const formatDate = (
  dateString: string,
  options: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }
): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', options).format(date);
};

/**
 * Format a date and time string
 * @param dateString - The date string to format
 * @returns Formatted date and time string
 */
export const formatDateTime = (dateString: string): string => {
  return formatDate(dateString, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

/**
 * Format a percentage
 * @param value - The value to format as percentage
 * @param decimals - Number of decimal places
 * @returns Formatted percentage string
 */
export const formatPercentage = (value: number, decimals = 2): string => {
  return `${value.toFixed(decimals)}%`;
};

/**
 * Format a number with commas
 * @param value - The number to format
 * @returns Formatted number string
 */
export const formatNumber = (value: number): string => {
  return new Intl.NumberFormat('en-US').format(value);
};

/**
 * Format a phone number
 * @param phone - The phone number to format
 * @returns Formatted phone number
 */
export const formatPhoneNumber = (phone: string): string => {
  // Basic US phone number formatting
  const cleaned = phone.replace(/\D/g, '');
  const match = cleaned.match(/^(\d{3})(\d{3})(\d{4})$/);
  
  if (match) {
    return `(${match[1]}) ${match[2]}-${match[3]}`;
  }
  
  return phone;
};

/**
 * Truncate a string to a maximum length
 * @param str - The string to truncate
 * @param maxLength - Maximum length
 * @returns Truncated string
 */
export const truncateString = (str: string, maxLength: number): string => {
  if (str.length <= maxLength) {
    return str;
  }
  
  return `${str.substring(0, maxLength)}...`;
};

/**
 * Format a file size
 * @param bytes - The file size in bytes
 * @returns Formatted file size string
 */
export const formatFileSize = (bytes: number): string => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
};

/**
 * Format a duration in seconds to minutes and seconds
 * @param seconds - The duration in seconds
 * @returns Formatted duration string
 */
export const formatDuration = (seconds: number): string => {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  
  return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
};

/**
 * Format a name as initials
 * @param name - The full name
 * @returns Initials
 */
export const formatInitials = (name: string): string => {
  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase();
};

