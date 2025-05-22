import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import "../styles/ResultPage.css";
import "../styles/CourseSuggestions.css";
import "../styles/CourseInputs.css";
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
import { saveAs } from "file-saver";
import { useReactToPrint } from "react-to-print";
import { findCourseByName, findCourseByCode } from "../utils/courseData";

const ResultPage = () => {
  const resultCardRef = useRef(null);
  const infoContentRef = useRef(null);

  // Template management
  const [templateName, setTemplateName] = useState("");
  const [savedTemplates, setSavedTemplates] = useState(() => {
    try {
      const templates = localStorage.getItem("kiit_result_templates");
      return templates ? JSON.parse(templates) : [];
    } catch (error) {
      console.error("Error loading templates:", error);
      return [];
    }
  });

  // Student info states with localStorage initialization
  const [yearOfAdmission, setYearOfAdmission] = useState(() => {
    try {
      return localStorage.getItem("kiit_year_of_admission") || "";
    } catch (error) {
      return "";
    }
  });
  const [school, setSchool] = useState(() => {
    try {
      return localStorage.getItem("kiit_school") || "";
    } catch (error) {
      return "";
    }
  });
  const [studentName, setStudentName] = useState(() => {
    try {
      return localStorage.getItem("kiit_student_name") || "";
    } catch (error) {
      return "";
    }
  });
  const [rollNumber, setRollNumber] = useState(() => {
    try {
      return localStorage.getItem("kiit_roll_number") || "";
    } catch (error) {
      return "";
    }
  });
  const [regnNumber, setRegnNumber] = useState(() => {
    try {
      return localStorage.getItem("kiit_regn_number") || "";
    } catch (error) {
      return "";
    }
  });
  const [semester, setSemester] = useState(() => {
    try {
      return localStorage.getItem("kiit_semester") || "";
    } catch (error) {
      return "";
    }
  });
  const [programme, setProgramme] = useState(() => {
    try {
      return localStorage.getItem("kiit_programme") || "";
    } catch (error) {
      return "";
    }
  });  // Course states with initialization from localStorage or defaults
  const [courses, setCourses] = useState(() => {
    try {
      const savedCourses = localStorage.getItem("kiit_result_courses");
      if (savedCourses) {
        const parsedCourses = JSON.parse(savedCourses);
        if (Array.isArray(parsedCourses) && parsedCourses.length > 0) {
          return parsedCourses;
        }
      }
        // Default courses if none are found in localStorage
      return [
        {
          courseNumber: "CS31002",
          courseName: "Machine Learning",
          courseCredit: 4,
          grade: "E",
        },
        {
          courseNumber: "CS30010",
          courseName: "Cloud Computing",
          courseCredit: 3,
          grade: "E",
        },
        {
          courseNumber: "HS30401",
          courseName: "Universal Human Values",
          courseCredit: 3,
          grade: "E",
        },
        {
          courseNumber: "CS30002",
          courseName: "Artificial Intelligence",
          courseCredit: 3,
          grade: "A",
        },
        {
          courseNumber: "HS30225",
          courseName: "Leadership and Team Effectiveness",
          courseCredit: 3,
          grade: "O",
        },
        {
          courseNumber: "CS39002",
          courseName: "Artificial Intelligence Laboratory",
          courseCredit: 1,
          grade: "O",
        },
        {
          courseNumber: "CS33002",
          courseName: "Applications Development Laboratory",
          courseCredit: 2,
          grade: "O",
        },
        {
          courseNumber: "CS37001",
          courseName: "Mini Project",
          courseCredit: 2,
          grade: "O",
        },
        {
          courseNumber: "OC30001",
          courseName: "Business Ethics and Corporate Governance",
          courseCredit: 1,
          grade: "O",
        },
      ];
    } catch (error) {
      console.error("Error loading courses from localStorage:", error);
      return [];
    }
  });
  // For displaying course suggestions when typing
  const [courseSuggestions, setCourseSuggestions] = useState([]);
  const [activeSuggestionField, setActiveSuggestionField] = useState(null);
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1);  
  
  // Performance states
  const [credits, setCredits] = useState(23);
  const [creditIndex, setCreditIndex] = useState(207);
  const [sgpa, setSgpa] = useState(9.0);
  const [cumulativeCredits, setCumulativeCredits] = useState(() => {
    try {
      return parseFloat(localStorage.getItem("kiit_cumulative_credits")) || 86;
    } catch (error) {
      return 86;
    }
  });
  const [cumulativeCreditIndex, setCumulativeCreditIndex] = useState(() => {
    try {
      return parseFloat(localStorage.getItem("kiit_cumulative_credit_index")) || 761;
    } catch (error) {
      return 761;
    }
  });
  const [cgpa, setCgpa] = useState(() => {
    try {
      return parseFloat(localStorage.getItem("kiit_cgpa")) || 8.85;
    } catch (error) {
      return 8.85;
    }
  });
  const [remarks, setRemarks] = useState(() => {
    try {
      return localStorage.getItem("kiit_remarks") || "PASS";
    } catch (error) {
      return "PASS";
    }
  });
  
  // Ref for handling click outside suggestions
  const suggestionsRef = useRef(null);
  
  // Handle click outside suggestions to dismiss them
  useEffect(() => {
    function handleClickOutside(event) {
      if (suggestionsRef.current && !suggestionsRef.current.contains(event.target)) {
        setCourseSuggestions([]);
        setActiveSuggestionField(null);
      }
    }
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);
  // Grade point calculation
  const getGradePoint = (grade) => {
    const gradePoints = {
      O: 10,
      E: 9,
      A: 8,
      B: 7,
      C: 6,
      D: 5,
      F: 0,
    };
    return gradePoints[grade] || 0;
  };
  // Calculate SGPA automatically when courses change
  const calculateSGPA = () => {
    if (courses.length === 0) return 0;

    let totalCreditPoints = 0;
    let totalCredits = 0;

    courses.forEach((course) => {
      const credit = parseFloat(course.courseCredit) || 0;
      const gradePoint = getGradePoint(course.grade);
      totalCreditPoints += credit * gradePoint;
      totalCredits += credit;
    });

    if (totalCredits === 0) return 0;
    return (totalCreditPoints / totalCredits).toFixed(2);
  };
  // Auto-calculate SGPA and update total credits when courses change
  useEffect(() => {
    const calculatedSGPA = calculateSGPA();
    setSgpa(calculatedSGPA);

    // Update total credits
    let totalCr = 0;
    courses.forEach((course) => {
      totalCr += parseFloat(course.courseCredit) || 0;
    });
    setCredits(totalCr);

    // Update credit index (SGPA * credits)
    setCreditIndex(Math.round(calculatedSGPA * totalCr));
    
    // Save courses to localStorage
    try {
      localStorage.setItem('kiit_result_courses', JSON.stringify(courses));
      localStorage.setItem('kiit_result_sgpa', calculatedSGPA);
      localStorage.setItem('kiit_result_credits', totalCr);
    } catch (error) {
      console.error("Error saving course data to localStorage:", error);
    }
  }, [courses]);  // Load calculator data from localStorage if available
  useEffect(() => {
    try {
      const savedCourses = localStorage.getItem("kiit_result_courses");
      const savedSgpa = localStorage.getItem("kiit_result_sgpa");
      const savedCredits = localStorage.getItem("kiit_result_credits");
      const isCgpaResult = localStorage.getItem("kiit_is_cgpa_result") === 'true';

      console.log("Loading data from localStorage:", { 
        savedCourses, 
        savedSgpa, 
        savedCredits,
        isCgpaResult
      });

      if (savedCourses) {
        try {
          const parsedCourses = JSON.parse(savedCourses);
          if (Array.isArray(parsedCourses) && parsedCourses.length > 0) {
            // Make sure we have valid course data
            const validCourses = parsedCourses.map(course => ({
              courseNumber: course.courseNumber || '',
              courseName: course.courseName || '',
              courseCredit: parseFloat(course.courseCredit) || 0,
              grade: course.grade || 'O'
            }));
            setCourses(validCourses);
            console.log("Loaded courses from calculator:", validCourses);
          } else {
            console.warn("No valid courses found in localStorage");
          }
        } catch (parseError) {
          console.error("Error parsing courses JSON:", parseError);
        }
      }

      // Handle CGPA data if this is a CGPA result
      if (isCgpaResult) {
        const savedCgpa = localStorage.getItem("kiit_cgpa");
        const savedCumulativeCredits = localStorage.getItem("kiit_cumulative_credits");
        const savedCumulativeCreditIndex = localStorage.getItem("kiit_cumulative_credit_index");
        
        if (savedCgpa) {
          setCgpa(parseFloat(savedCgpa));
        }
        
        if (savedCumulativeCredits) {
          setCumulativeCredits(parseFloat(savedCumulativeCredits));
        }
        
        if (savedCumulativeCreditIndex) {
          setCumulativeCreditIndex(parseFloat(savedCumulativeCreditIndex));
        }
        
        console.log("Loaded CGPA data:", {
          cgpa: savedCgpa,
          cumulativeCredits: savedCumulativeCredits,
          cumulativeCreditIndex: savedCumulativeCreditIndex
        });
        
        return; // Skip SGPA loading if this is a CGPA result
      }

      // Process SGPA data if not CGPA result
      if (savedSgpa) {
        try {
          const parsedSgpa = parseFloat(savedSgpa);
          if (!isNaN(parsedSgpa)) {
            setSgpa(parsedSgpa);
            console.log("Loaded SGPA from calculator:", parsedSgpa);
          } else {
            console.warn("Invalid SGPA value in localStorage:", savedSgpa);
          }
        } catch (parseError) {
          console.error("Error parsing SGPA:", parseError);
        }
      }      if (savedCredits) {
        try {
          const parsedCredits = parseFloat(savedCredits);
          if (!isNaN(parsedCredits)) {
            setCredits(parsedCredits);
            // Update credit index (SGPA * credits)
            if (savedSgpa) {
              const parsedSgpa = parseFloat(savedSgpa);
              if (!isNaN(parsedSgpa)) {
                const calculatedCreditIndex = Math.round(parsedSgpa * parsedCredits);
                setCreditIndex(calculatedCreditIndex);
                console.log("Calculated credit index:", calculatedCreditIndex);
              }
            }
          } else {
            console.warn("Invalid credits value in localStorage:", savedCredits);
          }
        } catch (parseError) {
          console.error("Error parsing credits:", parseError);
        }
      }
      
      // Clear CGPA flag after processing
      localStorage.removeItem("kiit_is_cgpa_result");
    } catch (error) {
      console.error("Error loading calculator data from localStorage:", error);
    }
  }, []);

  // Save student details to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem("kiit_year_of_admission", yearOfAdmission);
      localStorage.setItem("kiit_school", school);
      localStorage.setItem("kiit_student_name", studentName);
      localStorage.setItem("kiit_roll_number", rollNumber);
      localStorage.setItem("kiit_regn_number", regnNumber);
      localStorage.setItem("kiit_semester", semester);
      localStorage.setItem("kiit_programme", programme);
    } catch (error) {
      console.error("Error saving student details to localStorage:", error);
    }
  }, [yearOfAdmission, school, studentName, rollNumber, regnNumber, semester, programme]);

  // Save performance details to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem("kiit_cumulative_credits", cumulativeCredits);
      localStorage.setItem("kiit_cumulative_credit_index", cumulativeCreditIndex);
      localStorage.setItem("kiit_cgpa", cgpa);
      localStorage.setItem("kiit_remarks", remarks);
    } catch (error) {
      console.error("Error saving performance details to localStorage:", error);
    }
  }, [cumulativeCredits, cumulativeCreditIndex, cgpa, remarks]);

  // Add/remove course functions
  const addCourse = () => {
    setCourses([
      ...courses,
      { courseNumber: "", courseName: "", courseCredit: 0, grade: "O" },
    ]);
  };
  const removeCourse = (index) => {
    const updatedCourses = [...courses];
    updatedCourses.splice(index, 1);
    setCourses(updatedCourses);
  };
  
  const updateCourse = (index, field, value) => {
    const updatedCourses = [...courses];
    updatedCourses[index][field] = value;
    
    // Auto-fill functionality
    if (field === "courseName" && value) {
      // Try to find matching course by name
      const matchedCourse = findCourseByName(value);
      if (matchedCourse && !updatedCourses[index].courseNumber) {
        // If a match is found and course number is empty, auto-fill the course number
        updatedCourses[index].courseNumber = matchedCourse.courseNumber;
        
        // Add visual feedback for auto-filled field (we'll add CSS for this class later)
        setTimeout(() => {
          const courseNumberInputs = document.querySelectorAll('.course-row input[type="text"]');
          if (courseNumberInputs[index * 2]) {
            courseNumberInputs[index * 2].classList.add('auto-filled');
            setTimeout(() => {
              courseNumberInputs[index * 2].classList.remove('auto-filled');
            }, 1500);
          }
        }, 0);
      }
      
      // Debounce showing suggestions to avoid excessive lookups
      if (window.courseNameDebounceTimer) {
        clearTimeout(window.courseNameDebounceTimer);
      }
      window.courseNameDebounceTimer = setTimeout(() => {
        handleShowSuggestions(index, "courseName", value);
      }, 300);
    } else if (field === "courseNumber" && value) {
      // Try to find matching course by code
      const matchedCourse = findCourseByCode(value);
      if (matchedCourse && !updatedCourses[index].courseName) {
        // If a match is found and course name is empty, auto-fill the course name
        updatedCourses[index].courseName = matchedCourse.courseName;
        
        // Add visual feedback for auto-filled field
        setTimeout(() => {
          const courseNameInputs = document.querySelectorAll('.course-row input[type="text"]');
          if (courseNameInputs[index * 2 + 1]) {
            courseNameInputs[index * 2 + 1].classList.add('auto-filled');
            setTimeout(() => {
              courseNameInputs[index * 2 + 1].classList.remove('auto-filled');
            }, 1500);
          }
        }, 0);
      }
      
      // Debounce showing suggestions
      if (window.courseNumberDebounceTimer) {
        clearTimeout(window.courseNumberDebounceTimer);
      }
      window.courseNumberDebounceTimer = setTimeout(() => {
        handleShowSuggestions(index, "courseNumber", value);
      }, 300);
    } else {
      // Clear suggestions if any other field is being edited
      setCourseSuggestions([]);
      setActiveSuggestionField(null);
    }
    
    setCourses(updatedCourses);
    
    // Save courses to localStorage whenever they change
    try {
      localStorage.setItem('kiit_result_courses', JSON.stringify(updatedCourses));
    } catch (error) {
      console.error("Error saving courses to localStorage:", error);
    }
  };
// Handle showing course suggestions
  const handleShowSuggestions = (index, field, value) => {
    // Import the courseMapping from courseData.js using dynamic import
    import('../utils/courseData')
      .then(module => {
        const courseMapping = module.courseMapping;
        
        if (!value.trim()) {
          setCourseSuggestions([]);
          return;
        }
        
        let filteredSuggestions = [];
        const query = value.toLowerCase().trim();
        
        if (field === "courseName") {
          // Filter suggestions based on course name - prioritize those that start with the query
          const exactMatches = courseMapping.filter(course => 
            course.courseName.toLowerCase().startsWith(query)
          );
          
          const partialMatches = courseMapping.filter(course => 
            course.courseName.toLowerCase().includes(query) && 
            !course.courseName.toLowerCase().startsWith(query)
          );
          
          filteredSuggestions = [...exactMatches, ...partialMatches];
        } else if (field === "courseNumber") {
          // Filter suggestions based on course code
          const exactMatches = courseMapping.filter(course => 
            course.courseNumber.toLowerCase().startsWith(query)
          );
          
          const partialMatches = courseMapping.filter(course => 
            course.courseNumber.toLowerCase().includes(query) && 
            !course.courseNumber.toLowerCase().startsWith(query)
          );
          
          filteredSuggestions = [...exactMatches, ...partialMatches];
        }
        
        // Limit to 5 suggestions
        setCourseSuggestions(filteredSuggestions.slice(0, 5));
        setActiveSuggestionField({ index, field });
        setActiveSuggestionIndex(-1);
      })
      .catch(err => {
        console.error("Error loading course data:", err);
      });
  };
    // Handle suggestion selection
  const handleSelectSuggestion = (suggestion) => {
    if (activeSuggestionField) {
      const { index, field } = activeSuggestionField;
      const updatedCourses = [...courses];
      
      // Update both course name and number
      updatedCourses[index].courseNumber = suggestion.courseNumber;
      updatedCourses[index].courseName = suggestion.courseName;
      
      setCourses(updatedCourses);
      setCourseSuggestions([]);
      setActiveSuggestionField(null);
    }
  };
  
  // Handle keyboard navigation for suggestions
  const handleSuggestionKeyDown = (e, index) => {
    // Only process if suggestions are visible
    if (!courseSuggestions.length || !activeSuggestionField || activeSuggestionField.index !== index) {
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
        setActiveSuggestionField(null);
        break;
        
      default:
        break;
    }
  };
  // Export functions
  const validateBeforeExport = () => {
    let emptyFields = [];

    if (!studentName) emptyFields.push("Student Name");
    if (!rollNumber) emptyFields.push("Roll Number");
    if (!regnNumber) emptyFields.push("Registration Number");
    if (!semester) emptyFields.push("Semester");
    if (emptyFields.length > 0) {
      return window.confirm(
        `The following fields are empty: ${emptyFields.join(
          ", "
        )}.\nDo you want to continue exporting anyway?`
      );
    }

    return true;
  };  const handlePrint = useReactToPrint({
    content: () => {
      // Create a clone of the element with light theme for printing
      const originalElement = resultCardRef.current;
      const clone = originalElement.cloneNode(true);
      clone.classList.add('light-theme-export');
      return clone;
    },
    documentTitle: "KIIT-Result",
    onBeforePrint: () => {
      console.log("Preparing to print...");
    },
    onAfterPrint: () => {
      alert("PDF downloaded successfully!");
    },
    removeAfterPrint: true
  });const exportAsPDF = () => {
    if (validateBeforeExport()) {
      try {
        // Create a clone of the element in a hidden container
        const originalElement = resultCardRef.current;
        const cloneContainer = document.createElement('div');
        cloneContainer.style.position = 'absolute';
        cloneContainer.style.left = '-9999px';
        cloneContainer.style.top = '-9999px';
        document.body.appendChild(cloneContainer);
        
        // Clone the result card
        const clone = originalElement.cloneNode(true);
        cloneContainer.appendChild(clone);
        
        // Apply light theme styles to the clone only
        clone.classList.add('light-theme-export');
        
        const doc = new jsPDF({
          orientation: "portrait",
          unit: "mm",
          format: "a4",
          compress: true,
        });

        html2canvas(clone, {
          scale: 2,
          useCORS: true,
          logging: false,
          allowTaint: true,
          backgroundColor: "#ffffff",
        }).then((canvas) => {
          const imgData = canvas.toDataURL("image/jpeg", 1.0);
          const imgWidth = 210; // A4 width in mm
          const pageHeight = 297; // A4 height in mm
          const imgHeight = (canvas.height * imgWidth) / canvas.width;

          doc.addImage(imgData, "JPEG", 0, 0, imgWidth, imgHeight);
          doc.save("KIIT-Result.pdf");
          
          // Clean up the cloned elements
          document.body.removeChild(cloneContainer);
          
          alert("PDF downloaded successfully!");
        });
      } catch (error) {
        console.error("Error exporting as PDF:", error);
        alert("Failed to export as PDF. Falling back to print method.");
        handlePrint();
      }
    }
  };  const exportAsJPEG = async () => {
    if (!validateBeforeExport()) {
      return;
    }

    try {
      // Create a clone of the element in a hidden container
      const originalElement = resultCardRef.current;
      const cloneContainer = document.createElement('div');
      cloneContainer.style.position = 'absolute';
      cloneContainer.style.left = '-9999px';
      cloneContainer.style.top = '-9999px';
      document.body.appendChild(cloneContainer);
      
      // Clone the result card
      const clone = originalElement.cloneNode(true);
      cloneContainer.appendChild(clone);
      
      // Apply light theme styles to the clone only
      clone.classList.add('light-theme-export');

      const canvas = await html2canvas(clone, {
        scale: 2,
        useCORS: true,
        logging: false,
        backgroundColor: "#ffffff",
      });

      const imgData = canvas.toDataURL("image/jpeg", 1.0);
      saveAs(imgData, "KIIT-Result.jpg");
      
      // Clean up the cloned elements
      document.body.removeChild(cloneContainer);

      alert("JPEG downloaded successfully!");
    } catch (error) {
      console.error("Error exporting as JPEG:", error);
      alert("Failed to export as JPEG");
    }
  };// Reset form function
  const resetForm = () => {
    if (
      !window.confirm(
        "Are you sure you want to reset all form fields? This action cannot be undone."
      )
    ) {
      return;
    }

    // Reset student info
    setYearOfAdmission("");
    setSchool("");
    setStudentName("");
    setRollNumber("");
    setRegnNumber("");
    setSemester("");
    setProgramme("");    // Clear localStorage for student details
    try {
      localStorage.removeItem("kiit_year_of_admission");
      localStorage.removeItem("kiit_school");
      localStorage.removeItem("kiit_student_name");
      localStorage.removeItem("kiit_roll_number");
      localStorage.removeItem("kiit_regn_number");
      localStorage.removeItem("kiit_semester");
      localStorage.removeItem("kiit_programme");
      localStorage.removeItem("kiit_report_date");
      localStorage.removeItem("kiit_cumulative_credits");
      localStorage.removeItem("kiit_cumulative_credit_index");
      localStorage.removeItem("kiit_cgpa");
      localStorage.removeItem("kiit_remarks");
    } catch (error) {
      console.error("Error clearing student details from localStorage:", error);
    }

    // Reset courses
    setCourses([
      { courseNumber: "", courseName: "", courseCredit: 3, grade: "O" },
    ]);    // Set default date
    const currentDate = new Date();
    setReportDate(currentDate.toISOString().split("T")[0]);

    // Reset performance
    setCredits(0);
    setCreditIndex(0);
    setSgpa(0);
    setCumulativeCredits(0);
    setCumulativeCreditIndex(0);
    setCgpa(0);
    setRemarks("PASS");

    // Reset template name
    setTemplateName("");

    // Set default date
    const now = new Date();
    setReportDate(now.toISOString().split("T")[0]);
  };

  // Template management functions
  const saveTemplate = () => {
    if (!templateName.trim()) {
      alert("Please enter a template name");
      return;
    }
    // Check if template name already exists
    const templateExists = savedTemplates.some((t) => t.name === templateName);
    if (
      templateExists &&
      !window.confirm(
        `A template named "${templateName}" already exists. Do you want to overwrite it?`
      )
    ) {
      return;
    }

    try {
      // Create template object
      const templateData = {
        name: templateName,
        data: {
          yearOfAdmission,
          school,
          programme,
          courses,
          remarks,
        },
        savedOn: new Date().toISOString(),
      };

      // Update savedTemplates
      const updatedTemplates = savedTemplates.filter(
        (t) => t.name !== templateName
      );
      updatedTemplates.push(templateData);

      // Save to state and localStorage
      setSavedTemplates(updatedTemplates);
      localStorage.setItem(
        "kiit_result_templates",
        JSON.stringify(updatedTemplates)
      );

      alert(`Template "${templateName}" saved successfully!`);
    } catch (error) {
      console.error("Error saving template:", error);
      alert("Failed to save template. Please try again.");
    }
  };

  const loadTemplate = (templateData) => {
    try {
      // Load template values into state
      setYearOfAdmission(templateData.yearOfAdmission || "");
      setSchool(templateData.school || "");
      setProgramme(templateData.programme || "");
      setCourses(templateData.courses || []);
      setRemarks(templateData.remarks || "");

      alert(`Template loaded successfully!`);
    } catch (error) {
      console.error("Error loading template:", error);
      alert("Failed to load template. Please try again.");
    }
  };
  const deleteTemplate = (templateName) => {
    if (
      !window.confirm(
        `Are you sure you want to delete the template "${templateName}"?`
      )
    ) {
      return;
    }

    try {
      const updatedTemplates = savedTemplates.filter(
        (t) => t.name !== templateName
      );
      setSavedTemplates(updatedTemplates);
      localStorage.setItem(
        "kiit_result_templates",
        JSON.stringify(updatedTemplates)
      );
      alert(`Template "${templateName}" deleted successfully!`);
    } catch (error) {
      console.error("Error deleting template:", error);
      alert("Failed to delete template. Please try again.");
    }
  };  // Date state and formatting
  const [reportDate, setReportDate] = useState(() => {
    try {
      const savedDate = localStorage.getItem("kiit_report_date");
      if (savedDate) {
        return savedDate;
      }
      // Default to current date if no saved date
      const now = new Date();
      return now.toISOString().split("T")[0]; // YYYY-MM-DD format for input
    } catch (error) {
      // Fallback to current date on error
      const now = new Date();
      return now.toISOString().split("T")[0];
    }
  });

  // Save report date to localStorage when it changes
  useEffect(() => {
    try {
      localStorage.setItem("kiit_report_date", reportDate);
    } catch (error) {
      console.error("Error saving report date to localStorage:", error);
    }
  }, [reportDate]);

  // Format the date for display
  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    };
    return new Date(dateString)
      .toLocaleString("en-US", options)
      .replace(",", "");
  };

  const formattedDate = reportDate ? formatDate(reportDate) : "";

  // Handle case when user directly navigates to result page
  const [directNavigation, setDirectNavigation] = useState(false);

  useEffect(() => {
    try {
      const savedCourses = localStorage.getItem("kiit_result_courses");
      const savedSgpa = localStorage.getItem("kiit_result_sgpa");
      
      // Check if both essential data pieces are missing
      if (!savedCourses || !savedSgpa) {
        setDirectNavigation(true);
      } else {
        setDirectNavigation(false);
      }
    } catch (error) {
      console.error("Error checking localStorage:", error);
      setDirectNavigation(true);
    }
  }, []);

  // Message component for direct navigation
  const DirectNavigationMessage = () => (
    <div className="direct-navigation-message">
      <h3>No Course Data Found</h3>
      <p>You need to calculate your SGPA first before viewing results.</p>
      <Link to="/calculator" className="btn btn-primary">
        Go to Calculator
      </Link>
    </div>
  );

  return (
    <div className="result-page">
      {" "}
      <h1 className="page-title">KIIT Result Generator</h1>
      <p className="page-description">
        Create a sample semester grade report by filling in your details below.
      </p>
      <div className="info-section">
        <div
          className="info-header"
          onClick={() => infoContentRef.current.classList.toggle("show")}
        >
          <span className="info-icon">ⓘ</span> How to use this tool
          <span className="toggle-icon">▼</span>
        </div>
        <div className="info-content" ref={infoContentRef}>
          <ol>
            <li>
              Fill in your personal details (Year of Admission, School, Name,
              etc.)
            </li>
            <li>Add your courses with their respective credits and grades</li>
            <li>
              The SGPA will be calculated automatically based on your inputs
            </li>
            <li>You can save your data as a template for later use</li>
            <li>Export your result as a PDF or JPEG when ready</li>
          </ol>
          <p>
            <strong>Note:</strong> This is for informational purposes only and
            is not an official document.
          </p>
        </div>
      </div>
      <div className="result-container">
        <div className="form-section">
          <h2>Enter Your Details</h2>
          <div className="form-group">
            <div className="form-item">
              <label htmlFor="yearOfAdmission">Year of Admission</label>
              <input
                type="text"
                id="yearOfAdmission"
                value={yearOfAdmission}
                onChange={(e) => setYearOfAdmission(e.target.value)}
                placeholder="e.g. 2022"
              />
            </div>
            <div className="form-item">
              <label htmlFor="school">School</label>
              <input
                type="text"
                id="school"
                value={school}
                onChange={(e) => setSchool(e.target.value)}
                placeholder="e.g. COMPUTER ENGINEERING"
              />
            </div>
          </div>
          <div className="form-group">
            <div className="form-item">
              <label htmlFor="studentName">Student's Name</label>
              <input
                type="text"
                id="studentName"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                placeholder="Enter your name"
              />
            </div>
            <div className="form-item">
              <label htmlFor="rollNumber">Roll Number</label>
              <input
                type="text"
                id="rollNumber"
                value={rollNumber}
                onChange={(e) => setRollNumber(e.target.value)}
                placeholder="e.g. 22054390"
              />
            </div>
          </div>
          <div className="form-group">
            <div className="form-item">
              <label htmlFor="regnNumber">Registration Number</label>
              <input
                type="text"
                id="regnNumber"
                value={regnNumber}
                onChange={(e) => setRegnNumber(e.target.value)}
                placeholder="e.g. 226693xxxxx "
              />
            </div>{" "}
            <div className="form-item">
              <label htmlFor="semester">Semester</label>
              <input
                type="text"
                id="semester"
                value={semester}
                onChange={(e) => setSemester(e.target.value)}
                placeholder="e.g. 6th"
              />
            </div>
          </div>
          <div className="form-group">
            <div className="form-item">
              <label htmlFor="reportDate">Report Date</label>
              <input
                type="date"
                id="reportDate"
                value={reportDate}
                onChange={(e) => setReportDate(e.target.value)}
              />
            </div>
            <div className="form-item">
              <label htmlFor="programme">Programme</label>
              <input
                type="text"
                id="programme"
                value={programme}
                onChange={(e) => setProgramme(e.target.value)}
                placeholder="e.g. B.Tech (Computer Science and Engineering)"
              />
            </div>
          </div>{" "}
          <h3>Course Information</h3>
          <div className="course-headers">
            <div>Course Code</div>
            <div>Course Name</div>
            <div>Credit</div>
            <div>Grade</div>
            <div>Actions</div>
          </div>          {courses.map((course, index) => (
            <div className="course-row" key={index}>
              <div className="input-with-suggestions">
                <input
                  type="text"
                  placeholder="e.g. CS20002"
                  value={course.courseNumber}
                  onChange={(e) =>
                    updateCourse(index, "courseNumber", e.target.value)
                  }
                  onKeyDown={(e) => handleSuggestionKeyDown(e, index)}
                />                {activeSuggestionField && 
                 activeSuggestionField.index === index && 
                 activeSuggestionField.field === "courseNumber" && 
                 courseSuggestions.length > 0 && (
                  <div className="suggestions-list" ref={suggestionsRef}>
                    {courseSuggestions.map((suggestion, suggestionIndex) => (
                      <div 
                        key={suggestionIndex} 
                        className={`suggestion-item ${suggestionIndex === activeSuggestionIndex ? 'active' : ''}`}
                        onClick={() => handleSelectSuggestion(suggestion)}
                      >
                        <span className="suggestion-code">{suggestion.courseNumber}</span>
                        <span className="suggestion-name">{suggestion.courseName}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <div className="input-with-suggestions">
                <input
                  type="text"
                  placeholder="e.g. Operating Systems"
                  value={course.courseName}
                  onChange={(e) =>
                    updateCourse(index, "courseName", e.target.value)
                  }
                  onKeyDown={(e) => handleSuggestionKeyDown(e, index)}
                />                {activeSuggestionField && 
                 activeSuggestionField.index === index && 
                 activeSuggestionField.field === "courseName" && 
                 courseSuggestions.length > 0 && (
                  <div className="suggestions-list" ref={suggestionsRef}>
                    {courseSuggestions.map((suggestion, suggestionIndex) => (
                      <div 
                        key={suggestionIndex} 
                        className={`suggestion-item ${suggestionIndex === activeSuggestionIndex ? 'active' : ''}`}
                        onClick={() => handleSelectSuggestion(suggestion)}
                      >
                        <span className="suggestion-code">{suggestion.courseNumber}</span>
                        <span className="suggestion-name">{suggestion.courseName}</span>
                      </div>
                    ))}                  </div>
                )}
              </div>
              <div className="credit-input-container">
                <input
                  type="number"
                  placeholder="0-10"
                  value={course.courseCredit}
                  onChange={(e) =>
                    updateCourse(index, "courseCredit", e.target.value)
                  }
                  min="0"
                  max="10"
                  className="credit-input"
                  aria-label="Course Credit"
                />
                <span className="mobile-label">Credit</span>
              </div>
              <div className="grade-select-container">
                <select
                  value={course.grade}
                  onChange={(e) => updateCourse(index, "grade", e.target.value)}
                  className="grade-select"
                  aria-label="Course Grade"
                >
                <option value="O">O (10)</option>
                <option value="E">E (9)</option>
                <option value="A">A (8)</option>
                <option value="B">B (7)</option>
                <option value="C">C (6)</option>                <option value="D">D (5)</option>
                <option value="F">F (0)</option>
              </select>
                <span className="mobile-label">Grade</span>
              </div>
              <button
                className="remove-btn"
                onClick={() => removeCourse(index)}
              >
                Remove
              </button>
            </div>
          ))}
          <button className="add-course-btn" onClick={addCourse}>
            Add Course
          </button>{" "}
          <h3>Performance Details</h3>
          <div className="auto-calculated-notice">
            <span className="auto-icon">⚙️</span> These values are
            auto-calculated based on your courses
          </div>
          <div className="form-group">
            <div className="form-item">
              <label htmlFor="credits">Credits</label>
              <input
                type="number"
                id="credits"
                value={credits}
                onChange={(e) => setCredits(e.target.value)}
                readOnly
                className="auto-calculated"
              />
            </div>
            <div className="form-item">
              <label htmlFor="creditIndex">Credit Index</label>
              <input
                type="number"
                id="creditIndex"
                value={creditIndex}
                onChange={(e) => setCreditIndex(e.target.value)}
                readOnly
                className="auto-calculated"
              />
            </div>
            <div className="form-item">
              <label htmlFor="sgpa">SGPA</label>
              <input
                type="number"
                id="sgpa"
                value={sgpa}
                onChange={(e) => setSgpa(e.target.value)}
                step="0.01"
                readOnly
                className="auto-calculated"
              />
            </div>
          </div>
          <div className="form-group">
            <div className="form-item">
              <label htmlFor="cumulativeCredits">Cumulative Credits</label>
              <input
                type="number"
                id="cumulativeCredits"
                value={cumulativeCredits}
                onChange={(e) => setCumulativeCredits(e.target.value)}
              />
            </div>
            <div className="form-item">
              <label htmlFor="cumulativeCreditIndex">
                Cumulative Credit Index
              </label>
              <input
                type="number"
                id="cumulativeCreditIndex"
                value={cumulativeCreditIndex}
                onChange={(e) => setCumulativeCreditIndex(e.target.value)}
              />
            </div>
            <div className="form-item">
              <label htmlFor="cgpa">CGPA</label>
              <input
                type="number"
                id="cgpa"
                value={cgpa}
                onChange={(e) => setCgpa(e.target.value)}
                step="0.01"
              />
            </div>
          </div>
          <div className="form-item">
            <label htmlFor="remarks">Remarks</label>
            <input
              type="text"
              id="remarks"
              value={remarks}
              onChange={(e) => setRemarks(e.target.value)}
              placeholder="e.g. PASS"
            />
          </div>{" "}
          <h3>Save & Export</h3>
          <div className="template-section">
            <div className="template-input">
              <input
                type="text"
                placeholder="Template name"
                value={templateName}
                onChange={(e) => setTemplateName(e.target.value)}
              />
              <button className="template-btn save-btn" onClick={saveTemplate}>
                Save Template
              </button>
            </div>

            {savedTemplates.length > 0 && (
              <div className="saved-templates">
                <h4>Saved Templates</h4>
                <ul className="templates-list">
                  {savedTemplates.map((template, index) => (
                    <li key={index} className="template-item">
                      <span className="template-name">{template.name}</span>
                      <div className="template-actions">
                        <button
                          onClick={() => loadTemplate(template.data)}
                          className="template-action-btn load-btn"
                        >
                          Load
                        </button>
                        <button
                          onClick={() => deleteTemplate(template.name)}
                          className="template-action-btn delete-btn"
                        >
                          Delete
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>          <div className="export-buttons">
            <button className="export-btn" onClick={exportAsPDF}>
              Export as PDF
            </button>
            <button className="export-btn" onClick={exportAsJPEG}>
              Export as JPEG
            </button>
            <button className="reset-btn" onClick={resetForm}>
              Reset Form
            </button>
          </div>
        </div>

        <div className="preview-section">
          <h2>Preview</h2>{" "}
          <div className="result-card" ref={resultCardRef}>
            <div className="result-header">
              <div className="date-section">
                <p>
                  Date:{" "}
                  {formattedDate || (
                    <span className="placeholder">__/__/____, __:__ __</span>
                  )}
                </p>
              </div>
              <div className="logo">
                <img
                  src={`${process.env.PUBLIC_URL}/Images/kiiitlogo.png`}
                  alt="KIIT Logo"
                />
              </div>
            </div>            <div className="report-title">
              <h3>STUDENT COPY</h3>
              <h2>SEMESTER GRADE REPORT</h2>
            </div>

            <div className="admission-info">
              <p>
                YEAR OF ADMISSION:{" "}
                {yearOfAdmission || <span className="placeholder">____</span>}
              </p>
              <p>
                School of {school || <span className="placeholder">____</span>}
              </p>
            </div>

            <div className="student-info">
              <table>
                <tbody>
                  <tr>
                    <th>STUDENT'S NAME</th>
                    <th>ROLL NUMBER</th>
                    <th>REGN. NUMBER</th>
                    <th>SEMESTER</th>
                  </tr>
                  <tr>
                    <td>
                      {studentName || <span className="placeholder">____</span>}
                    </td>
                    <td>
                      {rollNumber || <span className="placeholder">____</span>}
                    </td>
                    <td>
                      {regnNumber || <span className="placeholder">____</span>}
                    </td>
                    <td>
                      {semester || <span className="placeholder">____</span>}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="programme-info">
              <p>
                PROGRAMME:{" "}
                {programme || <span className="placeholder">____</span>}
              </p>
            </div>

            <div className="course-info">
              <table>
                <thead>
                  <tr>
                    <th>COURSE NUMBER</th>
                    <th>COURSE NAME</th>
                    <th>COURSE CREDIT</th>
                    <th>GRADE</th>
                  </tr>
                </thead>
                <tbody>                  {courses.map((course, index) => (
                    <tr key={index}>
                      <td>{course.courseNumber || "-"}</td>
                      <td>{course.courseName}</td>
                      <td>{course.courseCredit}</td>
                      <td>{course.grade === "CGPA" ? "-" : course.grade}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="remarks-section">
              <p>REMARKS: {remarks}</p>
            </div>

            <div className="performance-section">
              <table>
                <thead>
                  <tr>
                    <th colSpan="3">CURRENT SEMESTER PERFORMANCE</th>
                    <th colSpan="3">CUMULATIVE PERFORMANCE</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>CREDITS</td>
                    <td>CREDIT INDEX</td>
                    <td>SGPA</td>
                    <td>CUMULATIVE CREDITS</td>
                    <td>CUMULATIVE CREDIT INDEX</td>
                    <td>CGPA</td>
                  </tr>
                  <tr>
                    <td>{credits}</td>
                    <td>{creditIndex}</td>
                    <td>{sgpa}</td>
                    <td>{cumulativeCredits}</td>
                    <td>{cumulativeCreditIndex}</td>
                    <td>{cgpa}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <br />
            <br />

            <div className="signatures">
              <div className="left-signature">
                <p>ACADEMIC OFFICE</p>
              </div>
              <div className="right-signature">
                <p>CONTROLLER OF EXAMINATIONS</p>
              </div>
            </div>

            <div className="disclaimer">
              <p>
                This is only a sample and not authorized by the University.
                Please collect your original from the University.
              </p>
            </div>
          </div>
        </div>
      </div>
      {directNavigation && <DirectNavigationMessage />}
    </div>
  );
};

export default ResultPage;
