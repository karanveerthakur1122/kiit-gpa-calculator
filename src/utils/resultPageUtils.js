// Function to send calculated data to the Result Page
const sendToResultPage = () => {
  if (!semesterSgpa || subjects.length === 0) {
    alert('Please calculate SGPA first');
    return;
  }
  
  // Format subject data for ResultPage
  const formattedCourses = subjects.map(subject => ({
    courseNumber: '',
    courseName: subject.name,
    courseCredit: subject.credit,
    grade: subject.grade
  }));
  
  // Save data to localStorage for ResultPage to use
  localStorage.setItem('kiit_result_courses', JSON.stringify(formattedCourses));
  localStorage.setItem('kiit_result_sgpa', semesterSgpa);
  localStorage.setItem('kiit_result_credits', semesterCredits);
  
  // Navigate to Result Page
  navigate('/result');
};

/**
 * Safely gets an item from localStorage with optional default value
 * @param {string} key - The localStorage key
 * @param {any} defaultValue - Default value if key doesn't exist
 * @returns {any} The value from localStorage or default value
 */
export const safelyGetItem = (key, defaultValue = '') => {
  try {
    const item = localStorage.getItem(key);
    return item !== null ? item : defaultValue;
  } catch (error) {
    console.error(`Error getting ${key} from localStorage:`, error);
    return defaultValue;
  }
};

/**
 * Safely gets and parses a JSON item from localStorage with optional default value
 * @param {string} key - The localStorage key
 * @param {any} defaultValue - Default value if key doesn't exist or parsing fails
 * @returns {any} The parsed value from localStorage or default value
 */
export const safelyGetJSONItem = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item !== null ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.error(`Error getting or parsing ${key} from localStorage:`, error);
    return defaultValue;
  }
};

/**
 * Safely sets an item in localStorage
 * @param {string} key - The localStorage key
 * @param {any} value - The value to store
 * @returns {boolean} Success status
 */
export const safelySetItem = (key, value) => {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    console.error(`Error setting ${key} in localStorage:`, error);
    return false;
  }
};

/**
 * Safely removes an item from localStorage
 * @param {string} key - The localStorage key to remove
 * @returns {boolean} Success status
 */
export const safelyRemoveItem = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing ${key} from localStorage:`, error);
    return false;
  }
};

/**
 * Clear a group of localStorage keys
 * @param {string[]} keys - Array of localStorage keys to remove
 * @returns {boolean} Success status
 */
export const clearLocalStorageItems = (keys) => {
  try {
    keys.forEach(key => localStorage.removeItem(key));
    return true;
  } catch (error) {
    console.error(`Error clearing localStorage items:`, error);
    return false;
  }
};
