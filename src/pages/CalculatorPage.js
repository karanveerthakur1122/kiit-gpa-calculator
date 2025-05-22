import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import '../styles/CalculatorPage.css';
import '../styles/Autocomplete.css';
import '../styles/SubjectDisplay.css';
import '../styles/SampleModal.css';
import { courseMapping, findCourseByName, findCourseByCode } from '../utils/courseData';

// Grade points mapping according to KIIT grading system
const gradePoints = {
  'O': 10,
  'E': 9,
  'A': 8,
  'B': 7,
  'C': 6,
  'D': 5,
  'F': 0
};

// Storage keys for localStorage
const STORAGE_KEYS = {
  CALCULATOR_TYPE: 'kiit_calculator_type',
  SUBJECTS: 'kiit_subjects',
  SEMESTERS: 'kiit_semesters',
  SGPA_RESULT: 'kiit_sgpa_result',
  SEMESTER_CREDITS: 'kiit_semester_credits',
  CGPA_RESULT: 'kiit_cgpa_result',
  SHOW_ANNOUNCEMENT: 'kiit_show_announcement'
};

// Utility functions for safely accessing localStorage
const safelyGetItem = (key, defaultValue = null) => {
  try {
    const item = localStorage.getItem(key);
    return item !== null ? item : defaultValue;
  } catch (error) {
    console.error(`Error getting item ${key} from localStorage:`, error);
    return defaultValue;
  }
};

const safelySetItem = (key, value) => {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch (error) {
    console.error(`Error setting item ${key} in localStorage:`, error);
    return false;
  }
};

const safelyRemoveItem = (key) => {
  try {
    localStorage.removeItem(key);
    return true;
  } catch (error) {
    console.error(`Error removing item ${key} from localStorage:`, error);
    return false;
  }
};

const CalculatorPage = () => {
  const navigate = useNavigate();
    // Initialize state with values from localStorage if available - default to SGPA calculator
  const [calculatorType, setCalculatorType] = useState(() => {
    try {
      // Always set SGPA as default even if localStorage has different value
      return 'sgpa';
    } catch (error) {
      console.error('Error reading calculator type from localStorage:', error);
      return 'sgpa';
    }
  });
  
  const [subjects, setSubjects] = useState(() => {
    try {
      const savedSubjects = localStorage.getItem(STORAGE_KEYS.SUBJECTS);
      return savedSubjects ? JSON.parse(savedSubjects) : [];
    } catch (error) {
      console.error('Error reading subjects from localStorage:', error);
      return [];
    }
  });    const [semesters, setSemesters] = useState(() => {
    try {
      const savedSemesters = localStorage.getItem(STORAGE_KEYS.SEMESTERS);
      
      if (savedSemesters) {
        try {
          // Parse the JSON data with nested try-catch
          const parsedSemesters = JSON.parse(savedSemesters);
          
          // Validate that it's an array
          if (Array.isArray(parsedSemesters)) {
            // Further validate each semester object for data integrity
            const validatedSemesters = parsedSemesters.filter(semester => {
              // Check if the semester object has valid properties
              const hasSgpa = typeof semester.sgpa !== 'undefined';
              const hasCredits = typeof semester.credits !== 'undefined';
              const hasId = typeof semester.id !== 'undefined';
              
              return hasSgpa && hasCredits && hasId;
            }).map(semester => ({
              ...semester,
              // Ensure the values are proper numbers
              sgpa: parseFloat(parseFloat(semester.sgpa).toFixed(2)),
              credits: parseFloat(semester.credits)
            }));
            
            console.log("Loaded semesters from localStorage:", validatedSemesters);
            return validatedSemesters;
          } else {
            console.warn("Semesters from localStorage is not an array");
            // Reset localStorage if not an array
            localStorage.removeItem(STORAGE_KEYS.SEMESTERS);
          }
        } catch (parseError) {
          console.error("Error parsing semesters JSON:", parseError);
          // If JSON is corrupted, reset it
          localStorage.removeItem(STORAGE_KEYS.SEMESTERS);
        }
      }
      
      // Default: empty array
      return [];
    } catch (error) {
      console.error('Error reading semesters from localStorage:', error);
      // Reset the localStorage value to prevent future errors
      try {
        localStorage.removeItem(STORAGE_KEYS.SEMESTERS);
      } catch (e) {
        // Ignore if this fails too
      }
      return [];
    }
  });
  const [subjectName, setSubjectName] = useState('');
  const [credit, setCredit] = useState(3);
  const [grade, setGrade] = useState('O');
    // For suggestions
  const [courseSuggestions, setCourseSuggestions] = useState([]);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);
  const suggestionsRef = useRef(null);
  
  // For editing subjects
  const [editingSubject, setEditingSubject] = useState(null);
  const [editCredit, setEditCredit] = useState(3);
  const [editGrade, setEditGrade] = useState('O');
  
  const [semesterSgpa, setSemesterSgpa] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.SGPA_RESULT) || '';
    } catch (error) {
      console.error('Error reading SGPA result from localStorage:', error);
      return '';
    }
  });
  
  const [semesterCredits, setSemesterCredits] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.SEMESTER_CREDITS) || '';
    } catch (error) {
      console.error('Error reading semester credits from localStorage:', error);
      return '';
    }
  });
  
  const [cgpa, setCgpa] = useState(() => {
    try {
      return localStorage.getItem(STORAGE_KEYS.CGPA_RESULT) || '';
    } catch (error) {
      console.error('Error reading CGPA result from localStorage:', error);
      return '';
    }
  });
  
  const [showAnnouncement, setShowAnnouncement] = useState(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SHOW_ANNOUNCEMENT);
      return saved === null ? true : saved === 'true';
    } catch (error) {
      console.error('Error reading announcement setting from localStorage:', error);
      return true;
    }
  });  // Save data to localStorage when it changes
  useEffect(() => {
    safelySetItem(STORAGE_KEYS.CALCULATOR_TYPE, calculatorType);
  }, [calculatorType]);

  useEffect(() => {
    safelySetItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    safelySetItem(STORAGE_KEYS.SEMESTERS, JSON.stringify(semesters));
  }, [semesters]);

  useEffect(() => {
    safelySetItem(STORAGE_KEYS.SGPA_RESULT, semesterSgpa);
  }, [semesterSgpa]);

  useEffect(() => {
    safelySetItem(STORAGE_KEYS.SEMESTER_CREDITS, semesterCredits);
  }, [semesterCredits]);

  useEffect(() => {
    safelySetItem(STORAGE_KEYS.CGPA_RESULT, cgpa);
  }, [cgpa]);
  useEffect(() => {
    safelySetItem(STORAGE_KEYS.SHOW_ANNOUNCEMENT, showAnnouncement);
  }, [showAnnouncement]);
  
  // Handle click outside suggestions to dismiss them
  useEffect(() => {
    function handleClickOutside(event) {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setCourseSuggestions([]);
        setActiveSuggestionIndex(-1);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  
  // Handle subject name input changes and show suggestions
  const handleSubjectNameChange = (e) => {
    const value = e.target.value;
    setSubjectName(value);
    
    if (!value.trim()) {
      setCourseSuggestions([]);
      return;
    }
    
    // Filter course suggestions
    const query = value.toLowerCase().trim();
    
    // First, find exact matches (starts with the query)
    const exactMatches = courseMapping.filter(course => 
      course.courseName.toLowerCase().startsWith(query)
    );
    
    // Then find partial matches (contains but doesn't start with)
    const partialMatches = courseMapping.filter(course => 
      course.courseName.toLowerCase().includes(query) && 
      !course.courseName.toLowerCase().startsWith(query)
    );
    
    // Combine and limit to 5 suggestions
    const filteredSuggestions = [...exactMatches, ...partialMatches].slice(0, 5);
    setCourseSuggestions(filteredSuggestions);
    setActiveSuggestionIndex(-1);
  };
  
  // Handle suggestion selection
  const handleSelectSuggestion = (suggestion) => {
    setSubjectName(suggestion.courseName);
    setCourseSuggestions([]);
  };
  
  // Handle keyboard navigation for suggestions
  const handleKeyDown = (e) => {
    // Only process if suggestions are visible
    if (!courseSuggestions.length) {
      return;
    }
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setActiveSuggestionIndex(prevIndex => {
          const newIndex = prevIndex < courseSuggestions.length - 1 ? prevIndex + 1 : 0;
          return newIndex;
        });
        break;
        
      case 'ArrowUp':
        e.preventDefault();
        setActiveSuggestionIndex(prevIndex => {
          const newIndex = prevIndex > 0 ? prevIndex - 1 : courseSuggestions.length - 1;
          return newIndex;
        });
        break;
        
      case 'Enter':
        e.preventDefault();
        if (activeSuggestionIndex >= 0 && activeSuggestionIndex < courseSuggestions.length) {
          handleSelectSuggestion(courseSuggestions[activeSuggestionIndex]);
        }
        break;
        
      case 'Escape':
        e.preventDefault();
        setCourseSuggestions([]);
        break;
        
      default:
        break;
    }
  };
  // Add subject to the list
  const addSubject = () => {
    if (!subjectName.trim()) {
      alert('Please enter a subject name');
      return;
    }
    
    if (isNaN(credit) || credit <= 0) {
      alert('Please enter a valid credit value (greater than 0)');
      return;
    }
    
    try {
      // Check if there's a matching course code for this subject
      const matchedCourse = findCourseByName(subjectName);
      
      // Create the subject - use the matched course name if available
      const newSubject = {
        id: Date.now(),
        name: matchedCourse ? matchedCourse.courseName : subjectName,
        courseCode: matchedCourse ? matchedCourse.courseNumber : '',
        credit: parseFloat(credit),
        grade: grade,
        gradePoint: gradePoints[grade]
      };
      
      // Add the new subject
      setSubjects([...subjects, newSubject]);
      
      // Reset input fields
      setSubjectName('');
      setCredit(3);
      setGrade('O');
      
      // Clear suggestions
      setCourseSuggestions([]);
    } catch (error) {
      alert('Something went wrong. Please try again.');
      console.error(error);
    }
  };
  // Remove subject from the list
  const removeSubject = (id) => {
    setSubjects(subjects.filter(subject => subject.id !== id));
  };

  // Start editing a subject
  const startEditSubject = (subject) => {
    setEditingSubject(subject);
    setEditCredit(subject.credit);
    setEditGrade(subject.grade);
  };

  // Save edited subject
  const saveEditSubject = () => {
    if (!editingSubject) return;
    
    try {
      const updatedSubjects = subjects.map(subject => {
        if (subject.id === editingSubject.id) {
          return {
            ...subject,
            credit: parseFloat(editCredit),
            grade: editGrade,
            gradePoint: gradePoints[editGrade]
          };
        }
        return subject;
      });
      
      setSubjects(updatedSubjects);
      setEditingSubject(null);
    } catch (error) {
      console.error('Error saving subject edits:', error);
      alert('There was an error saving your changes. Please try again.');
    }
  };

  // Cancel editing
  const cancelEditSubject = () => {
    setEditingSubject(null);
  };

  // Calculate SGPA
  const calculateSgpa = () => {
    if (subjects.length === 0) {
      alert('Please add at least one subject');
      return;
    }
    
    try {
      let totalCreditPoints = 0;
      let totalCredits = 0;
      
      subjects.forEach(subject => {
        totalCreditPoints += subject.credit * subject.gradePoint;
        totalCredits += subject.credit;
      });
      
      if (totalCredits === 0) {
        throw new Error('Total credits cannot be zero');
      }
      
      const sgpa = totalCreditPoints / totalCredits;
      setSemesterSgpa(sgpa.toFixed(2));
      setSemesterCredits(totalCredits);
    } catch (error) {
      alert('Error calculating SGPA: ' + error.message);
      console.error(error);
    }
  };  // Reset SGPA calculator
  const resetSgpa = () => {
    try {
      setSubjects([]);
      setSubjectName('');
      setCredit(3);
      setGrade('O');
      setSemesterSgpa('');
      setSemesterCredits('');
      
      // Clear SGPA related localStorage items
      safelyRemoveItem(STORAGE_KEYS.SUBJECTS);
      safelyRemoveItem(STORAGE_KEYS.SGPA_RESULT);
      safelyRemoveItem(STORAGE_KEYS.SEMESTER_CREDITS);
    } catch (error) {
      console.error('Error resetting SGPA calculator:', error);
      alert('There was an error resetting the calculator. Please try again.');
    }
  };    // Sample semester data for 5 different semesters
  const sampleSemesterData = {
    semester1: [
      {
        id: Date.now(),
        name: 'Differential Equations and Linear Algebra',
        courseCode: 'MA11001',
        credit: 4,
        grade: 'O',
        gradePoint: gradePoints['O']
      },
      {
        id: Date.now() + 1,
        name: 'Chemistry',
        courseCode: 'CH10001',
        credit: 3,
        grade: 'E',
        gradePoint: gradePoints['E']
      },
      {
        id: Date.now() + 2,
        name: 'English',
        courseCode: 'HS10001',
        credit: 3,
        grade: 'A',
        gradePoint: gradePoints['A']
      },
      {
        id: Date.now() + 3,
        name: 'Basic Electronics',
        courseCode: 'EC10001',
        credit: 3,
        grade: 'B',
        gradePoint: gradePoints['B']
      },
      {
        id: Date.now() + 4,
        name: 'Chemistry Lab',
        courseCode: 'CH19001',
        credit: 1,
        grade: 'O',
        gradePoint: gradePoints['O']
      },
      {
        id: Date.now() + 5,
        name: 'Engineering Lab',
        courseCode: 'EX19001',
        credit: 1,
        grade: 'E',
        gradePoint: gradePoints['E']
      },
      {
        id: Date.now() + 6,
        name: 'Workshop',
        courseCode: 'ME18001',
        credit: 1,
        grade: 'A',
        gradePoint: gradePoints['A']
      },
      {
        id: Date.now() + 7,
        name: 'Communication Lab',
        courseCode: 'HS18001',
        credit: 1,
        grade: 'O',
        gradePoint: gradePoints['O']
      },
      {
        id: Date.now() + 8,
        name: 'Yoga',
        courseCode: 'YG18001',
        credit: 1,
        grade: 'O',
        gradePoint: gradePoints['O']
      },
      {
        id: Date.now() + 9,
        name: 'Basic Electrical Engineering',
        courseCode: 'EE10002',
        credit: 2,
        grade: 'A',
        gradePoint: gradePoints['A']
      },
      {
        id: Date.now() + 10,
        name: 'Socio-Political Environment',
        courseCode: 'SO10043',
        credit: 2,
        grade: 'B',
        gradePoint: gradePoints['B']
      }
    ],
      semester2: [
      {
        id: Date.now(),
        name: 'Transforms and Numerical Methods',
        courseCode: 'MA11002',
        credit: 4,
        grade: 'O',
        gradePoint: gradePoints['O']
      },
      {
        id: Date.now() + 1,
        name: 'Physics',
        courseCode: 'PH10001',
        credit: 3,
        grade: 'E',
        gradePoint: gradePoints['E']
      },
      {
        id: Date.now() + 2,
        name: 'Science of living Systems',
        courseCode: 'LS10001',
        credit: 3,
        grade: 'A',
        gradePoint: gradePoints['A']
      },
      {
        id: Date.now() + 3,
        name: 'Environmental Science',
        courseCode: 'CH10003',
        credit: 3,
        grade: 'B',
        gradePoint: gradePoints['B']
      },
      {
        id: Date.now() + 4,
        name: 'Physics Lab',
        courseCode: 'PH19001',
        credit: 1,
        grade: 'O',
        gradePoint: gradePoints['O']
      },
      {
        id: Date.now() + 5,
        name: 'Programming Lab',
        courseCode: 'CS13001',
        credit: 4,
        grade: 'E',
        gradePoint: gradePoints['E']
      },
      {
        id: Date.now() + 6,
        name: 'Engineering Drawing and Graphics',
        courseCode: 'CE18001',
        credit: 1,
        grade: 'A',
        gradePoint: gradePoints['A']
      },
      {
        id: Date.now() + 7,
        name: 'Biomedical Engineering',
        courseCode: 'EC10003',
        credit: 2,
        grade: 'O',
        gradePoint: gradePoints['O']
      },
      {
        id: Date.now() + 8,
        name: 'Smart Materials',
        courseCode: 'PH10003',
        credit: 2,
        grade: 'A',
        gradePoint: gradePoints['A']
      }
    ],
      semester3: [
      {
        id: Date.now(),
        name: 'Probability and Statistics',
        courseCode: 'MA21001',
        credit: 4,
        grade: 'A',
        gradePoint: gradePoints['A']
      },
      {
        id: Date.now() + 1,
        name: 'Industry 4.0 Technologies',
        courseCode: 'EX20001',
        credit: 2,
        grade: 'E',
        gradePoint: gradePoints['E']
      },
      {
        id: Date.now() + 2,
        name: 'Data Structures',
        courseCode: 'CS21001',
        credit: 4,
        grade: 'O',
        gradePoint: gradePoints['O']
      },
      {
        id: Date.now() + 3,
        name: 'Digital Systems Design',
        courseCode: 'EC20005',
        credit: 3,
        grade: 'B',
        gradePoint: gradePoints['B']
      },
      {
        id: Date.now() + 4,
        name: 'Automata Theory and Formal Languages',
        courseCode: 'CS21003',
        credit: 4,
        grade: 'A',
        gradePoint: gradePoints['A']
      },
      {
        id: Date.now() + 5,
        name: 'Data Structures Laboratory',
        courseCode: 'CS29001',
        credit: 1,
        grade: 'O',
        gradePoint: gradePoints['O']
      },
      {
        id: Date.now() + 6,
        name: 'Digital Systems Design Laboratory',
        courseCode: 'EC29005',
        credit: 1,
        grade: 'A',
        gradePoint: gradePoints['A']
      },
      {
        id: Date.now() + 7,
        name: 'Economics of Development',
        courseCode: 'HS20120',
        credit: 3,
        grade: 'B',
        gradePoint: gradePoints['B']
      }
    ],
      semester4: [
      {
        id: Date.now(),
        name: 'Scientific and Technical Writing',
        courseCode: 'EX20003',
        credit: 3,
        grade: 'O',
        gradePoint: gradePoints['O']
      },
      {
        id: Date.now() + 1,
        name: 'Discrete Mathematics',
        courseCode: 'MA21002',
        credit: 4,
        grade: 'E',
        gradePoint: gradePoints['E']
      },
      {
        id: Date.now() + 2,
        name: 'Operating Systems',
        courseCode: 'CS20002',
        credit: 3,
        grade: 'A',
        gradePoint: gradePoints['A']
      },
      {
        id: Date.now() + 3,
        name: 'Object Oriented Programming using Java',
        courseCode: 'CS20004',
        credit: 3,
        grade: 'B',
        gradePoint: gradePoints['B']
      },
      {
        id: Date.now() + 4,
        name: 'Database Management Systems',
        courseCode: 'CS20006',
        credit: 3,
        grade: 'A',
        gradePoint: gradePoints['A']
      },
      {
        id: Date.now() + 5,
        name: 'Computer Organization and Architecture',
        courseCode: 'CS21002',
        credit: 4,
        grade: 'O',
        gradePoint: gradePoints['O']
      },
      {
        id: Date.now() + 6,
        name: 'Operating Systems Laboratory',
        courseCode: 'CS29002',
        credit: 1,
        grade: 'A',
        gradePoint: gradePoints['A']
      },
      {
        id: Date.now() + 7,
        name: 'Java Programming Laboratory',
        courseCode: 'CS29004',
        credit: 1,
        grade: 'O',
        gradePoint: gradePoints['O']
      },
      {
        id: Date.now() + 8,
        name: 'Database Management Systems Laboratory',
        courseCode: 'CS29006',
        credit: 1,
        grade: 'E',
        gradePoint: gradePoints['E']
      },
      {
        id: Date.now() + 9,
        name: 'Computer aided Building Drawing',
        courseCode: 'CE28004',
        credit: 1,
        grade: 'A',
        gradePoint: gradePoints['A']
      }
    ],      semester5: [
      {
        id: Date.now(),
        name: 'Engineering Economics',
        courseCode: 'HS30101',
        credit: 3,
        grade: 'A',
        gradePoint: gradePoints['A']
      },
      {
        id: Date.now() + 1,
        name: 'Design and Analysis of Algorithms',
        courseCode: 'CS30001',
        credit: 3,
        grade: 'B',
        gradePoint: gradePoints['B']
      },
      {
        id: Date.now() + 2,
        name: 'Software Engineering',
        courseCode: 'CS31001',
        credit: 4,
        grade: 'O',
        gradePoint: gradePoints['O']
      },
      {
        id: Date.now() + 3,
        name: 'Computer Networks',
        courseCode: 'CS30003',
        credit: 3,
        grade: 'E',
        gradePoint: gradePoints['E']
      },
      {
        id: Date.now() + 4,
        name: 'High Performance Computing',
        courseCode: 'CS30005',
        credit: 3,
        grade: 'A',
        gradePoint: gradePoints['A']
      },
      {
        id: Date.now() + 5,
        name: 'Computational Intelligence',
        courseCode: 'CS30011',
        credit: 3,
        grade: 'B',
        gradePoint: gradePoints['B']
      },
      {
        id: Date.now() + 6,
        name: 'Algorithms Laboratory',
        courseCode: 'CS39001',
        credit: 1,
        grade: 'O',
        gradePoint: gradePoints['O']
      },
      {
        id: Date.now() + 7,
        name: 'Computer Networks Laboratory',
        courseCode: 'CS39003',
        credit: 1,
        grade: 'A',
        gradePoint: gradePoints['A']
      },      {
        id: Date.now() + 8,
        name: 'Photography and Videography',
        courseCode: 'SA38025',
        credit: 1,
        grade: 'O',
        gradePoint: gradePoints['O']
      }
    ],
    semester6: [
      {
        id: Date.now(),
        name: 'Universal Human Values',
        courseCode: 'HS30401',
        credit: 3,
        grade: 'A',
        gradePoint: gradePoints['A']
      },
      {
        id: Date.now() + 1,
        name: 'Artificial Intelligence',
        courseCode: 'CS30002',
        credit: 3,
        grade: 'B',
        gradePoint: gradePoints['B']
      },
      {
        id: Date.now() + 2,
        name: 'Machine Learning',
        courseCode: 'CS31002',
        credit: 4,
        grade: 'O',
        gradePoint: gradePoints['O']
      },
      {
        id: Date.now() + 3,
        name: 'Artificial Intelligence Laboratory',
        courseCode: 'CS39002',
        credit: 1,
        grade: 'E',
        gradePoint: gradePoints['E']
      },
      {
        id: Date.now() + 4,
        name: 'Applications Development Laboratory',
        courseCode: 'CS33002',
        credit: 2,
        grade: 'A',
        gradePoint: gradePoints['A']
      },
      {
        id: Date.now() + 5,
        name: 'Mini Project',
        courseCode: 'CS37001',
        credit: 2,
        grade: 'O',
        gradePoint: gradePoints['O']
      },
      {
        id: Date.now() + 6,
        name: 'Cloud Computing',
        courseCode: 'CS30010',
        credit: 3,
        grade: 'A',
        gradePoint: gradePoints['A']
      },
      {
        id: Date.now() + 7,
        name: 'Leadership and Team Effectiveness',
        courseCode: 'HS30225',
        credit: 3,
        grade: 'E',
        gradePoint: gradePoints['E']
      },
      {
        id: Date.now() + 8,
        name: 'Business Ethics and Corporate Governance',
        courseCode: 'OC30001',
        credit: 1,
        grade: 'O',
        gradePoint: gradePoints['O']
      }
    ]
  };

  // State for the sample selection modal
  const [showSampleModal, setShowSampleModal] = useState(false);
    // Load sample subjects
  const loadSampleSubjects = (semesterKey) => {
    try {
      // Ask for confirmation if there are already subjects added and no specific semester is selected
      if (!semesterKey && subjects.length > 0) {
        const confirmed = window.confirm('This will replace your current subjects. Continue?');
        if (!confirmed) {
          setShowSampleModal(false);
          return;
        }
      }
      
      // If no semester key is provided, show the selection modal
      if (!semesterKey) {
        setShowSampleModal(true);
        return;
      }
      
      // Get the sample subjects for the selected semester
      const baseData = sampleSemesterData[semesterKey];
      
      if (!baseData) {
        throw new Error(`Invalid semester key: ${semesterKey}`);
      }
      
      // Create a new copy of the data with fresh unique IDs
      const sampleSubjects = baseData.map((subject, index) => ({
        ...subject,
        id: Date.now() + index * 100 // Ensure IDs are sufficiently different
      }));
      
      // Set the sample subjects
      setSubjects(sampleSubjects);
      
      // Clear input fields
      setSubjectName('');
      setCredit(3);
      setGrade('O');
      
      // Hide the modal
      setShowSampleModal(false);
      
      // Auto-calculate SGPA
      setTimeout(() => {
        calculateSgpa();
      }, 100);
      
    } catch (error) {
      console.error('Error loading sample subjects:', error);
      alert('There was an error loading the sample subjects. Please try again.');
      setShowSampleModal(false);
    }
  };// Add semester to the CGPA calculation
  const addSemester = () => {
    console.log("addSemester called with:", { semesterSgpa, semesterCredits, subjects });
    
    if (!semesterSgpa) {
      alert('Please calculate SGPA first');
      return;
    }
    
    try {
      // Ensure we have valid numerical values
      const sgpaValue = parseFloat(semesterSgpa);
      const creditsValue = parseFloat(semesterCredits);
      
      if (isNaN(sgpaValue) || isNaN(creditsValue)) {
        throw new Error(`Invalid values: SGPA=${semesterSgpa}, Credits=${semesterCredits}`);
      }
      
      if (sgpaValue < 0 || sgpaValue > 10) {
        throw new Error('SGPA must be between 0 and 10');
      }
      
      if (creditsValue <= 0) {
        throw new Error('Credits must be greater than 0');
      }
      
      console.log("Creating new semester with:", { sgpaValue, creditsValue });
      
      // Create a deep copy of subjects to avoid reference issues
      const subjectsCopy = subjects.map(subject => ({...subject}));
      
      // Create the new semester object
      const newSemester = {
        id: Date.now(),
        sgpa: parseFloat(sgpaValue.toFixed(2)), // Ensure consistent decimal places
        credits: parseFloat(creditsValue),
        subjects: subjectsCopy,
        label: `Semester ${semesters.length + 1}` // Add a label for better identification
      };
      
      console.log("New semester object:", newSemester);
      
      // First get current semesters from localStorage to ensure we're working with latest data
      let currentSemesters = [];
      try {
        const savedSemesters = localStorage.getItem(STORAGE_KEYS.SEMESTERS);
        if (savedSemesters) {
          try {
            const parsed = JSON.parse(savedSemesters);
            if (Array.isArray(parsed)) {
              currentSemesters = parsed;
            } else {
              console.warn("Saved semesters is not an array, using state value");
              currentSemesters = Array.isArray(semesters) ? [...semesters] : [];
            }
          } catch (parseError) {
            console.error("Error parsing semesters JSON:", parseError);
            // If JSON is corrupted, use the state value
            currentSemesters = Array.isArray(semesters) ? [...semesters] : [];
          }
        }
      } catch (e) {
        console.error("Error reading current semesters from localStorage:", e);
        // If there's an error, we'll use the state value
        currentSemesters = Array.isArray(semesters) ? [...semesters] : [];
      }
      
      console.log("Current semesters:", currentSemesters);
      
      // Add the new semester
      const updatedSemesters = [...currentSemesters, newSemester];
      
      // Update localStorage first
      try {
        localStorage.setItem(STORAGE_KEYS.SEMESTERS, JSON.stringify(updatedSemesters));
        console.log("Successfully saved semesters to localStorage");
      } catch (error) {
        console.error("Failed to save semesters to localStorage:", error);
        alert("Failed to save semester data. Please try again.");
        return;
      }
      
      // Now update the state
      setSemesters(updatedSemesters);
      
      // Clear current SGPA calculation
      setSubjects([]);
      setSemesterSgpa('');
      setSemesterCredits('');
      
      // Clear localStorage for SGPA calculation
      try {
        localStorage.removeItem(STORAGE_KEYS.SUBJECTS);
        localStorage.removeItem(STORAGE_KEYS.SGPA_RESULT);
        localStorage.removeItem(STORAGE_KEYS.SEMESTER_CREDITS);
      } catch (e) {
        console.error("Error clearing SGPA data from localStorage:", e);
      }
      
      // Switch to CGPA tab for convenience
      setCalculatorType('cgpa');
      
      // Recalculate CGPA automatically
      setTimeout(() => {
        try {
          calculateCgpa();
        } catch (calcError) {
          console.error("Error calculating CGPA after adding semester:", calcError);
          // Don't show error to user, they can manually calculate
        }
      }, 100);
      
      alert("Semester added successfully to CGPA calculation!");
    } catch (error) {
      console.error("Error adding semester:", error);
      alert(`Failed to add semester: ${error.message}`);
    }
  };// Remove semester
  const removeSemester = (id) => {
    try {
      console.log(`Attempting to remove semester with ID: ${id}`);
      
      // First get the current semesters from localStorage
      let currentSemesters = [];
      try {
        const savedSemesters = localStorage.getItem(STORAGE_KEYS.SEMESTERS);
        if (savedSemesters) {
          try {
            const parsed = JSON.parse(savedSemesters);
            if (Array.isArray(parsed)) {
              currentSemesters = parsed;
            } else {
              console.warn("Saved semesters is not an array, using state value");
              currentSemesters = [...semesters];
            }
          } catch (parseError) {
            console.error("Error parsing semesters JSON:", parseError);
            // If JSON is corrupted, use the state value
            currentSemesters = [...semesters];
          }
        }
      } catch (e) {
        console.error("Error reading current semesters from localStorage:", e);
        // If there's an error, we'll use the state value
        currentSemesters = [...semesters];
      }
      
      console.log("Current semesters before removal:", currentSemesters);
      
      // Filter out the semester to remove with strict string comparison
      const updatedSemesters = currentSemesters.filter(semester => {
        // Convert both to strings to ensure comparison works correctly
        return String(semester.id) !== String(id);
      });
      
      console.log("Semesters after removal:", updatedSemesters);
      
      // Update localStorage first
      try {
        localStorage.setItem(STORAGE_KEYS.SEMESTERS, JSON.stringify(updatedSemesters));
        console.log("Successfully saved updated semesters to localStorage");
      } catch (error) {
        console.error("Failed to save updated semesters to localStorage:", error);
      }
      
      // Now update the state
      setSemesters(updatedSemesters);
      
      // If there are no semesters left, clear the CGPA
      if (updatedSemesters.length === 0) {
        setCgpa('');
        try {
          localStorage.removeItem(STORAGE_KEYS.CGPA_RESULT);
          localStorage.removeItem('kiit_total_credit_points');
          localStorage.removeItem('kiit_total_credits');
        } catch (e) {
          console.error("Error clearing CGPA result from localStorage:", e);
        }
      } else {
        // Recalculate CGPA automatically after removal
        setTimeout(() => {
          try {
            calculateCgpa();
          } catch (calcError) {
            console.error("Error recalculating CGPA after semester removal:", calcError);
            // Don't show error to user, they can manually recalculate
          }
        }, 100);
      }
      
      console.log("Semester removed successfully");
    } catch (error) {
      console.error("Error removing semester:", error);
      alert("There was an error removing the semester. Please try again.");
    }
  };  // Calculate CGPA
  const calculateCgpa = () => {
    try {
      // First get the latest semesters from localStorage
      let currentSemesters = [];
      try {
        const savedSemesters = localStorage.getItem(STORAGE_KEYS.SEMESTERS);
        if (savedSemesters) {
          try {
            const parsed = JSON.parse(savedSemesters);
            if (Array.isArray(parsed)) {
              currentSemesters = parsed;
            } else {
              console.warn("Saved semesters is not an array, using state value");
              currentSemesters = [...semesters];
            }
          } catch (parseError) {
            console.error("Error parsing semesters JSON:", parseError);
            // If JSON is corrupted, use the state value
            currentSemesters = [...semesters];
          }
        }
      } catch (e) {
        console.error("Error reading current semesters from localStorage:", e);
        // If there's an error, we'll use the state value
        currentSemesters = [...semesters];
      }
      
      console.log("Semesters for CGPA calculation:", currentSemesters);
      
      if (!Array.isArray(currentSemesters) || currentSemesters.length === 0) {
        alert('Please add at least one semester');
        return null;
      }
    
      // First validate that all semesters have valid data
      const validatedSemesters = [];
      let hasValidationErrors = false;
      let errorMessages = [];
      
      currentSemesters.forEach((semester, index) => {
        try {
          // Parse both values to ensure they're numbers
          const sgpaValue = parseFloat(semester.sgpa);
          const creditsValue = parseFloat(semester.credits);
          
          // Validate the values
          if (isNaN(sgpaValue) || isNaN(creditsValue)) {
            throw new Error(`Semester ${index + 1} has invalid SGPA or credits value`);
          }
          
          if (sgpaValue < 0 || sgpaValue > 10) {
            throw new Error(`Semester ${index + 1} has SGPA outside valid range (0-10)`);
          }
          
          if (creditsValue <= 0) {
            throw new Error(`Semester ${index + 1} has invalid credits (must be > 0)`);
          }
          
          // Store the validated values
          validatedSemesters.push({
            ...semester,
            sgpa: parseFloat(sgpaValue.toFixed(2)), // Ensure consistent decimal places
            credits: parseFloat(creditsValue)
          });
        } catch (error) {
          hasValidationErrors = true;
          errorMessages.push(error.message);
          console.error(`Validation error for semester ${index + 1}:`, error);
        }
      });
      
      if (hasValidationErrors) {
        throw new Error(`Validation errors:\n${errorMessages.join('\n')}`);
      }
      
      // Calculate CGPA with validated data
      let totalCreditPoints = 0;
      let totalCredits = 0;
      
      validatedSemesters.forEach((semester, index) => {
        totalCreditPoints += semester.sgpa * semester.credits;
        totalCredits += semester.credits;
        
        console.log(`Added semester ${index + 1} with SGPA: ${semester.sgpa}, Credits: ${semester.credits}`);
        console.log(`Running totals - Points: ${totalCreditPoints}, Credits: ${totalCredits}`);
      });
      
      if (totalCredits === 0) {
        throw new Error('Total credits cannot be zero');
      }
      
      const calculatedCgpa = totalCreditPoints / totalCredits;
      
      // Ensure the result is properly formatted
      if (isNaN(calculatedCgpa)) {
        throw new Error('Calculation resulted in an invalid number');
      }
      
      const formattedCgpa = calculatedCgpa.toFixed(2);
      console.log(`Final CGPA calculation: ${totalCreditPoints} / ${totalCredits} = ${formattedCgpa}`);
      
      // Save calculation details to localStorage
      try {
        localStorage.setItem(STORAGE_KEYS.CGPA_RESULT, formattedCgpa);
        localStorage.setItem('kiit_total_credit_points', totalCreditPoints.toString());
        localStorage.setItem('kiit_total_credits', totalCredits.toString());
        localStorage.setItem(STORAGE_KEYS.SEMESTERS, JSON.stringify(validatedSemesters));
      } catch (e) {
        console.error("Error saving calculation details to localStorage:", e);
      }
      
      // Update state with the calculated CGPA
      setCgpa(formattedCgpa);
      
      // Update the semesters state with the validated data
      setSemesters(validatedSemesters);
      
      return {
        totalCreditPoints,
        totalCredits,
        cgpa: formattedCgpa
      };
    } catch (error) {
      alert('Error calculating CGPA: ' + error.message);
      console.error(error);
      return null;
    }
  };// Reset CGPA calculator
  const resetCgpa = () => {
    try {
      setSemesters([]);
      setCgpa('');
      
      // Clear CGPA related localStorage items
      safelyRemoveItem(STORAGE_KEYS.SEMESTERS);
      safelyRemoveItem(STORAGE_KEYS.CGPA_RESULT);
    } catch (error) {
      console.error('Error resetting CGPA calculator:', error);
      alert('There was an error resetting the calculator. Please try again.');
    }
  };  // Toggle between SGPA and CGPA calculator without losing data
  const toggleCalculator = (type) => {
    // Save current state to localStorage before switching
    if (calculatorType === 'sgpa' && type === 'cgpa') {
      // Save SGPA data explicitly before switching to CGPA
      safelySetItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(subjects));
      safelySetItem(STORAGE_KEYS.SGPA_RESULT, semesterSgpa);
      safelySetItem(STORAGE_KEYS.SEMESTER_CREDITS, semesterCredits);
    } else if (calculatorType === 'cgpa' && type === 'sgpa') {
      // Save CGPA data explicitly before switching to SGPA
      safelySetItem(STORAGE_KEYS.SEMESTERS, JSON.stringify(semesters));
      safelySetItem(STORAGE_KEYS.CGPA_RESULT, cgpa);
    }
    
    // Update calculator type
    setCalculatorType(type);
  };  // Clear all data function with confirmation
  const clearAllData = () => {
    // Ask for confirmation before clearing data
    const isConfirmed = window.confirm(
      'Are you sure you want to clear all saved data? This action cannot be undone.'
    );
    
    if (!isConfirmed) {
      return; // User cancelled the operation
    }
    
    try {
      // Clear all state
      setSubjects([]);
      setSubjectName('');
      setCredit(3);
      setGrade('O');
      setSemesterSgpa('');
      setSemesterCredits('');
      setSemesters([]);
      setCgpa('');
      
      // Clear all localStorage items except show announcement
      Object.values(STORAGE_KEYS).forEach(key => {
        if (key !== STORAGE_KEYS.SHOW_ANNOUNCEMENT) {
          safelyRemoveItem(key);
        }
      });
      
      // Show confirmation
      alert('All calculator data has been cleared!');
    } catch (error) {
      console.error('Error clearing data:', error);
      alert('There was an error clearing your data. Please try again.');
    }
  };

  return (
    <div className="calculator-page">
      {showAnnouncement && (
        <div className="announcement-banner">
          <div className="announcement-content">
            <span className="announcement-icon">🎉</span>
            <p>We've updated our calculator with a modern blue theme and improved user interface!</p>
            <button 
              className="announcement-close" 
              onClick={() => setShowAnnouncement(false)}
              aria-label="Close announcement"
            >
              ×
            </button>
          </div>
        </div>
      )}
      
      <section className="intro-section">
        <h1 className="page-title">KIIT SGPA/CGPA Calculator</h1>
        <p className="page-description">
          Calculate your Semester Grade Point Average (SGPA) and Cumulative Grade Point Average (CGPA) 
          based on KIIT University's grading system.
        </p>
      </section>      <div className="calculator-type-selector">
        <button 
          className={`type-button ${calculatorType === 'sgpa' ? 'active' : ''}`}
          onClick={() => setCalculatorType('sgpa')}
        >
          SGPA Calculator
        </button>
        <button 
          className={`type-button ${calculatorType === 'cgpa' ? 'active' : ''}`}
          onClick={() => setCalculatorType('cgpa')}
        >
          CGPA Calculator
        </button>
        <button 
          className="type-button clear-all-btn"
          onClick={clearAllData}
          title="Clear all saved data"
        >
          Clear All Data
        </button>
      </div>

      {calculatorType === 'sgpa' ? (
        <div className="calculator-card">
          <h2>Semester GPA Calculator</h2>          {/* Input form */}
          <div className="form-group">
            <div className="form-control input-with-suggestions">
              <label htmlFor="subject-name">Subject Name</label>
              <input 
                type="text" 
                id="subject-name" 
                value={subjectName} 
                onChange={handleSubjectNameChange}
                onKeyDown={handleKeyDown}
                placeholder="Enter subject name"
                autoComplete="off"
              />
              {courseSuggestions.length > 0 && (
                <div className="suggestions-list" ref={suggestionsRef}>
                  {courseSuggestions.map((suggestion, index) => (
                    <div 
                      key={index} 
                      className={`suggestion-item ${index === activeSuggestionIndex ? 'active' : ''}`}
                      onClick={() => handleSelectSuggestion(suggestion)}
                    >
                      <span className="suggestion-code">{suggestion.courseNumber}</span>
                      <span className="suggestion-name">{suggestion.courseName}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="form-control">
              <label htmlFor="credit">Credit Hours</label>
              <input 
                type="number" 
                id="credit" 
                value={credit} 
                onChange={(e) => setCredit(e.target.value)}
                min="1"
                max="10"
              />
            </div>
            
            <div className="form-control">
              <label htmlFor="grade">Grade</label>
              <select 
                id="grade" 
                value={grade} 
                onChange={(e) => setGrade(e.target.value)}
              >
                <option value="O">O (Outstanding) - 90-100</option>
                <option value="E">E (Excellent) - 80-89</option>
                <option value="A">A (Very Good) - 70-79</option>
                <option value="B">B (Good) - 60-69</option>
                <option value="C">C (Average) - 50-59</option>
                <option value="D">D (Below Average) - 40-49</option>
                <option value="F">F (Fail) - Below 40</option>
              </select>
            </div>
          </div>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
            <button className="btn" onClick={addSubject}>Add Subject</button>
            <button className="btn btn-secondary sample-btn" onClick={() => loadSampleSubjects()}>
              <span className="icon">📋</span> Load Sample
            </button>
          </div>
            {/* Subject list */}
          {subjects.length > 0 && (
            <div className="subject-list">              <h3>Added Subjects</h3>
              {subjects.map(subject => (
                <div key={subject.id} className="subject-item">
                  {editingSubject && editingSubject.id === subject.id ? (
                    <div className="subject-edit-form">
                      <div className="subject-info">
                        <div className="subject-header">
                          <span className="subject-name">{subject.name}</span>
                          {subject.courseCode && (
                            <span className="subject-code">({subject.courseCode})</span>
                          )}
                        </div>
                        <div className="edit-controls">
                          <label>
                            Credits:
                            <input 
                              type="number" 
                              value={editCredit} 
                              onChange={(e) => setEditCredit(e.target.value)}
                              min="1"
                              max="10"
                              className="credit-input"
                            />
                          </label>
                          <label>
                            Grade:
                            <select 
                              value={editGrade} 
                              onChange={(e) => setEditGrade(e.target.value)}
                              className="grade-select"
                            >
                              <option value="O">O (Outstanding)</option>
                              <option value="E">E (Excellent)</option>
                              <option value="A">A (Very Good)</option>
                              <option value="B">B (Good)</option>
                              <option value="C">C (Average)</option>
                              <option value="D">D (Below Average)</option>
                              <option value="F">F (Fail)</option>
                            </select>
                          </label>
                        </div>
                      </div>
                      <div className="edit-buttons">
                        <button className="btn btn-small" onClick={saveEditSubject}>Save</button>
                        <button className="btn btn-small btn-secondary" onClick={cancelEditSubject}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="subject-info">
                        <div className="subject-header">
                          <span className="subject-name">{subject.name}</span>
                          {subject.courseCode && (
                            <span className="subject-code">({subject.courseCode})</span>
                          )}
                        </div>
                        <span className="subject-credits">{subject.credit} Credits</span>
                      </div>
                      <div className="subject-actions">
                        <span className="subject-grade">Grade: {subject.grade} ({subject.gradePoint})</span>
                        <div className="button-group">
                          <button className="edit-btn" onClick={() => startEditSubject(subject)} title="Edit subject">
                            ✏️
                          </button>
                          <button className="delete-btn" onClick={() => removeSubject(subject.id)} title="Remove subject">
                            ×
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ))}<div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <button className="btn" onClick={calculateSgpa}>Calculate SGPA</button>
                <button className="btn btn-secondary" onClick={resetSgpa}>Reset</button>                <button className="btn btn-primary" onClick={() => {
                  if (!semesterSgpa || subjects.length === 0) {
                    alert('Please calculate SGPA first');
                    return;
                  }                  // Format subject data for ResultPage
                  const formattedCourses = subjects.map(subject => ({
                    courseNumber: subject.courseCode || '',
                    courseName: subject.name || 'Unnamed Subject',
                    courseCredit: parseFloat(subject.credit) || 0,
                    grade: subject.grade || 'O'
                  }));
                  
                  // Save data to localStorage for ResultPage to use
                  try {
                    // Validate data before storing
                    if (!Array.isArray(formattedCourses) || formattedCourses.length === 0) {
                      throw new Error('No valid course data to transfer');
                    }
                    
                    const sgpaValue = parseFloat(semesterSgpa);
                    if (isNaN(sgpaValue)) {
                      throw new Error('Invalid SGPA value');
                    }
                    
                    const creditsValue = parseFloat(semesterCredits);
                    if (isNaN(creditsValue)) {
                      throw new Error('Invalid credits value');
                    }
                    
                    // Store the validated data
                    localStorage.setItem('kiit_result_courses', JSON.stringify(formattedCourses));
                    localStorage.setItem('kiit_result_sgpa', sgpaValue.toString());
                    localStorage.setItem('kiit_result_credits', creditsValue.toString());
                    
                    console.log('Sending data to result page:', {
                      courses: formattedCourses,
                      sgpa: sgpaValue,
                      credits: creditsValue
                    });
                    
                    // Navigate to Result Page
                    navigate('/result');                  } catch (error) {
                    console.error('Error saving data:', error);
                    alert(`An error occurred while preparing data for the result page: ${error.message}. Please try again.`);
                  }
                }}>Send to Result Page</button>
              </div>
            </div>
          )}
          
          {/* Results */}
          {semesterSgpa && (
            <div className="result-section">
              <p className="result-label">Your Semester GPA</p>
              <h2 className="result-value">{semesterSgpa}</h2>
              <p>Total Credits: {semesterCredits}</p>
              {calculatorType === 'sgpa' && (
                <button className="btn" onClick={addSemester} style={{ marginTop: '1rem' }}>
                  Add to CGPA Calculation
                </button>
              )}
            </div>
          )}
        </div>      ) : (        <div className="calculator-card">
          <h2>Cumulative GPA Calculator</h2>
          <p className="instruction-text">
            To add semesters to your CGPA calculation, first calculate your SGPA in the SGPA Calculator tab 
            and then click "Add to CGPA Calculation"
          </p>
          {/* Semester list */}
          {semesters.length > 0 ? (
            <div className="subject-list">
              <h3>Added Semesters</h3>
              {semesters.map((semester, index) => {
                // Ensure we have valid numeric values for display
                const sgpaValue = parseFloat(semester.sgpa);
                const creditsValue = parseFloat(semester.credits);
                
                return (
                  <div key={semester.id || index} className="subject-item">                  
                    <div className="subject-info">
                      <span className="subject-name">
                        {semester.label || `Semester ${index + 1}`}
                      </span>
                      <span className="subject-credits">
                        {isNaN(creditsValue) ? '0' : creditsValue.toFixed(1)} Total Credits
                      </span>
                    </div>
                    <span className="subject-grade">
                      SGPA: {isNaN(sgpaValue) ? '0.00' : sgpaValue.toFixed(2)}
                    </span>
                    <button 
                      className="delete-btn" 
                      onClick={() => removeSemester(semester.id || index)}
                      title="Remove this semester"
                    >
                      ×
                    </button>
                  </div>
                );
              })}
              
              <div style={{ marginTop: '1.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                <button className="btn" onClick={calculateCgpa}>Calculate CGPA</button>
                <button className="btn btn-secondary" onClick={resetCgpa}>Reset</button>
              </div>
            </div>
          ) : (
            <p>No semesters added yet. You can either calculate your SGPA first and add it to CGPA calculation or directly add semester details above.</p>
          )}              {/* Results */}
          {cgpa && (
            <div className="result-section">
              <p className="result-label">Your Cumulative GPA</p>
              <h2 className="result-value">{cgpa}</h2>              
              <p style={{marginTop: '1rem'}}>
                <button className="btn btn-primary" onClick={() => {
                  try {
                    // Recalculate to ensure we have fresh data
                    const calculationDetails = calculateCgpa();
                    
                    if (!calculationDetails) {
                      throw new Error("CGPA calculation failed. Please recalculate.");
                    }
                    
                    // Use the calculation details for more accuracy
                    const { totalCreditPoints, totalCredits, cgpa: calculatedCgpa } = calculationDetails;
                    
                    // Format for ResultPage
                    localStorage.setItem('kiit_cgpa', calculatedCgpa);
                    localStorage.setItem('kiit_cumulative_credits', totalCredits.toString());
                    localStorage.setItem('kiit_cumulative_credit_index', totalCreditPoints.toString());
                    
                    // Create placeholder course data for CGPA display on result page
                    const cgpaCourses = semesters.map((semester, index) => ({
                      courseNumber: `CGPA${index + 1}`,
                      courseName: `Semester ${index + 1} (CGPA: ${parseFloat(semester.sgpa).toFixed(2)})`,
                      courseCredit: parseFloat(semester.credits) || 0,
                      grade: "CGPA"
                    }));
                    
                    localStorage.setItem('kiit_result_courses', JSON.stringify(cgpaCourses));
                    localStorage.setItem('kiit_is_cgpa_result', 'true');
                    
                    console.log("Sending CGPA data to result page:", {
                      cgpa: calculatedCgpa,
                      totalCredits,
                      totalCreditPoints,
                      semesters: cgpaCourses.length
                    });
                    
                    // Navigate to result page
                    navigate('/result');
                  } catch (error) {
                    console.error('Error saving CGPA data:', error);
                    alert(`An error occurred while preparing CGPA data: ${error.message}`);
                  }
                }}>Send to Result Page</button>
              </p>
            </div>
          )}
        </div>
      )}

      {/* Grade Table */}
      <div className="calculator-card">
        <h2>KIIT Grading System</h2>
        <table className="grade-table">
          <thead>
            <tr>
              <th>Grade</th>
              <th>Score</th>
              <th>Grade Points</th>
              <th>Interpretation</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>O</td>
              <td>90-100</td>
              <td>10</td>
              <td>Outstanding</td>
            </tr>
            <tr>
              <td>E</td>
              <td>80-89</td>
              <td>9</td>
              <td>Excellent</td>
            </tr>
            <tr>
              <td>A</td>
              <td>70-79</td>
              <td>8</td>
              <td>Very Good</td>
            </tr>
            <tr>
              <td>B</td>
              <td>60-69</td>
              <td>7</td>
              <td>Good</td>
            </tr>
            <tr>
              <td>C</td>
              <td>50-59</td>
              <td>6</td>
              <td>Average</td>
            </tr>
            <tr>
              <td>D</td>
              <td>40-49</td>
              <td>5</td>
              <td>Below Average</td>
            </tr>
            <tr>
              <td>F</td>
              <td>Below 40</td>
              <td>0</td>
              <td>Fail</td>
            </tr>
          </tbody>
        </table>      </div>
      
      {/* Sample Selection Modal */}
      {showSampleModal && (
        <div className="sample-modal-overlay" onClick={() => setShowSampleModal(false)}>
          <div className="sample-modal" onClick={(e) => e.stopPropagation()}>
            <div className="sample-modal-header">
              <h3 className="sample-modal-title">Select Sample Data</h3>
              <button 
                className="sample-modal-close"
                onClick={() => setShowSampleModal(false)}
                aria-label="Close"
              >
                ×
              </button>
            </div>
            
            <div className="sample-list">              <div className="sample-card" onClick={() => loadSampleSubjects('semester1')}>
                <div className="sample-card-header">
                  <span>Semester 1</span>
                  <span>11 Subjects</span>
                </div>
                <div className="sample-card-subjects">
                  Mathematics, Chemistry, English, Basic Electronics...
                </div>
                <div className="sample-card-footer">
                  <span>22 Credits</span>
                  <span>1st Year</span>
                </div>
              </div>
                <div className="sample-card" onClick={() => loadSampleSubjects('semester2')}>
                <div className="sample-card-header">
                  <span>Semester 2</span>
                  <span>9 Subjects</span>
                </div>
                <div className="sample-card-subjects">
                  Physics, Transforms and Numerical Methods, Programming Lab...
                </div>
                <div className="sample-card-footer">
                  <span>23 Credits</span>
                  <span>1st Year</span>
                </div>
              </div>
                <div className="sample-card" onClick={() => loadSampleSubjects('semester3')}>
                <div className="sample-card-header">
                  <span>Semester 3</span>
                  <span>8 Subjects</span>
                </div>
                <div className="sample-card-subjects">
                  Data Structures, Probability and Statistics, Automata Theory...
                </div>
                <div className="sample-card-footer">
                  <span>22 Credits</span>
                  <span>2nd Year</span>
                </div>
              </div>
                <div className="sample-card" onClick={() => loadSampleSubjects('semester4')}>
                <div className="sample-card-header">
                  <span>Semester 4</span>
                  <span>10 Subjects</span>
                </div>
                <div className="sample-card-subjects">
                  Operating Systems, Database Management Systems, Discrete Mathematics...
                </div>
                <div className="sample-card-footer">
                  <span>24 Credits</span>
                  <span>2nd Year</span>
                </div>
              </div>                <div className="sample-card" onClick={() => loadSampleSubjects('semester5')}>
                <div className="sample-card-header">
                  <span>Semester 5</span>
                  <span>9 Subjects</span>
                </div>
                <div className="sample-card-subjects">
                  Engineering Economics, Design and Analysis of Algorithms, Software Engineering...
                </div>
                <div className="sample-card-footer">
                  <span>22 Credits</span>
                  <span>3rd Year</span>
                </div>
              </div>
                <div className="sample-card" onClick={() => loadSampleSubjects('semester6')}>
                <div className="sample-card-header">
                  <span>Semester 6</span>
                  <span>9 Subjects</span>
                </div>
                <div className="sample-card-subjects">
                  Universal Human Values, Artificial Intelligence, Machine Learning...
                </div>
                <div className="sample-card-footer">
                  <span>22 Credits</span>
                  <span>3rd Year</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CalculatorPage;
