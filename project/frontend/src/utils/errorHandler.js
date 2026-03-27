/**
 * Error Handling Utilities
 * Person 4: Integration Engineer
 */

/**
 * Format API error messages for user display
 */
export const getErrorMessage = (error) => {
  if (error.response) {
    // Server responded with error
    const { status, data } = error.response;

    switch (status) {
      case 400:
        return data.error || 'Invalid request. Please check your input.';
      case 401:
        return 'Your session has expired. Please log in again.';
      case 403:
        return 'You do not have permission to perform this action.';
      case 404:
        return data.error || 'The requested resource was not found.';
      case 409:
        return data.error || 'This action conflicts with existing data.';
      case 422:
        return data.error || 'Validation error. Please check your input.';
      case 500:
        return 'Server error. Please try again later.';
      default:
        return data.error || 'An unexpected error occurred.';
    }
  } else if (error.request) {
    // Request made but no response
    return 'Unable to connect to server. Please check your internet connection.';
  } else {
    // Something else happened
    return error.message || 'An unexpected error occurred.';
  }
};

/**
 * Log errors for debugging
 */
export const logError = (error, context = '') => {
  if (process.env.NODE_ENV === 'development') {
    console.error(`[Error ${context}]:`, {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
      stack: error.stack,
    });
  }
};

/**
 * Handle API errors with toast notifications
 */
export const handleApiError = (error, context = '') => {
  logError(error, context);
  const message = getErrorMessage(error);

  // Return formatted error for components to use
  return {
    message,
    status: error.response?.status,
    isNetworkError: !error.response,
  };
};

/**
 * Validate form data before submission
 */
export const validateFormData = (data, rules) => {
  const errors = {};

  Object.keys(rules).forEach((field) => {
    const rule = rules[field];
    const value = data[field];

    // Required check
    if (rule.required && (!value || value.toString().trim() === '')) {
      errors[field] = `${rule.label || field} is required`;
      return;
    }

    // Min length
    if (rule.minLength && value && value.length < rule.minLength) {
      errors[field] = `${rule.label || field} must be at least ${rule.minLength} characters`;
      return;
    }

    // Max length
    if (rule.maxLength && value && value.length > rule.maxLength) {
      errors[field] = `${rule.label || field} must be less than ${rule.maxLength} characters`;
      return;
    }

    // Email validation
    if (rule.email && value) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(value)) {
        errors[field] = 'Please enter a valid email address';
        return;
      }
    }

    // Number validation
    if (rule.number && value) {
      if (isNaN(value)) {
        errors[field] = `${rule.label || field} must be a number`;
        return;
      }

      if (rule.min !== undefined && parseFloat(value) < rule.min) {
        errors[field] = `${rule.label || field} must be at least ${rule.min}`;
        return;
      }

      if (rule.max !== undefined && parseFloat(value) > rule.max) {
        errors[field] = `${rule.label || field} must be at most ${rule.max}`;
        return;
      }
    }

    // Custom validation
    if (rule.custom && value) {
      const customError = rule.custom(value, data);
      if (customError) {
        errors[field] = customError;
      }
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Retry failed API calls
 */
export const retryApiCall = async (apiCall, maxRetries = 3, delay = 1000) => {
  let lastError;

  for (let i = 0; i < maxRetries; i++) {
    try {
      return await apiCall();
    } catch (error) {
      lastError = error;

      // Don't retry on client errors (4xx)
      if (error.response && error.response.status >= 400 && error.response.status < 500) {
        throw error;
      }

      // Wait before retrying
      if (i < maxRetries - 1) {
        await new Promise((resolve) => setTimeout(resolve, delay * (i + 1)));
      }
    }
  }

  throw lastError;
};

/**
 * Safe JSON parse with fallback
 */
export const safeJsonParse = (jsonString, fallback = null) => {
  try {
    return JSON.parse(jsonString);
  } catch (error) {
    logError(error, 'JSON Parse');
    return fallback;
  }
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  return !!token;
};

/**
 * Clear authentication and redirect to login
 */
export const clearAuthAndRedirect = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = '/login';
};

export default {
  getErrorMessage,
  logError,
  handleApiError,
  validateFormData,
  retryApiCall,
  safeJsonParse,
  isAuthenticated,
  clearAuthAndRedirect,
};
