import React from 'react';
import '../styles/DocumentationPage.css';

const DocumentationPage = () => {
  return (
    <div className="documentation-container">
      <h1 className="documentation-title">KIIT GPA Calculator Documentation</h1>
      
      <div className="documentation-section">
        <h2>Overview</h2>
        <p>
          The KIIT GPA Calculator is a tool designed to help KIIT University students calculate their Semester Grade Point Average (SGPA) 
          and Cumulative Grade Point Average (CGPA). This documentation will guide you through the various features and 
          functions of the calculator.
        </p>
      </div>

      <div className="documentation-section">
        <h2>SGPA Calculator</h2>
        <p>The SGPA Calculator allows you to calculate your grade point average for a single semester.</p>
        
        <h3>How to use the SGPA Calculator:</h3>
        <ol>
          <li>
            <strong>Add Subjects</strong>: Enter your subject name, credit hours, and the grade you received. 
            The system will suggest course names as you type.
          </li>
          <li>
            <strong>Subject List</strong>: All added subjects will appear in a list below the input form. You can edit or delete 
            subjects from this list.
          </li>
          <li>
            <strong>Calculate SGPA</strong>: Click the "Calculate SGPA" button to calculate your SGPA for the semester.
          </li>
          <li>
            <strong>Sample Data</strong>: You can load sample data for different semesters to see how the calculator works.
          </li>
          <li>
            <strong>Reset</strong>: Use the reset button to clear all subjects and start over.
          </li>
        </ol>
        
        <h3>SGPA Formula:</h3>
        <p>
          SGPA = (Sum of (Credit × Grade Point)) / Total Credits
        </p>
        
        <h3>Grade Point Values:</h3>
        <table className="documentation-table">
          <thead>
            <tr>
              <th>Grade</th>
              <th>Grade Point</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>O (Outstanding)</td><td>10</td></tr>
            <tr><td>E (Excellent)</td><td>9</td></tr>
            <tr><td>A (Very Good)</td><td>8</td></tr>
            <tr><td>B (Good)</td><td>7</td></tr>
            <tr><td>C (Average)</td><td>6</td></tr>
            <tr><td>D (Pass)</td><td>5</td></tr>
            <tr><td>F (Fail)</td><td>0</td></tr>
          </tbody>
        </table>
      </div>

      <div className="documentation-section">
        <h2>CGPA Calculator</h2>
        <p>The CGPA Calculator allows you to calculate your cumulative GPA across multiple semesters.</p>
        
        <h3>How to use the CGPA Calculator:</h3>
        <ol>
          <li>
            <strong>Switch to CGPA</strong>: Click on the "CGPA" tab at the top of the calculator.
          </li>
          <li>
            <strong>Add Semester</strong>: After calculating your SGPA for a semester, click "Add to CGPA" to include it in your CGPA calculation.
          </li>
          <li>
            <strong>Semester List</strong>: All added semesters will appear in a list. You can edit or delete semesters from this list.
          </li>
          <li>
            <strong>Calculate CGPA</strong>: Click the "Calculate CGPA" button to calculate your overall CGPA.
          </li>
          <li>
            <strong>Reset</strong>: Use the reset button to clear all semesters and start over.
          </li>
        </ol>
        
        <h3>CGPA Formula:</h3>
        <p>
          CGPA = (Sum of (SGPA × Semester Credits)) / Total Credits across all semesters
        </p>
      </div>

      <div className="documentation-section">
        <h2>Result Page</h2>
        <p>The Result Page displays a summary of your calculated SGPA or CGPA.</p>
        
        <h3>Features:</h3>
        <ul>
          <li>
            <strong>Detailed Breakdown</strong>: View a breakdown of your subjects, credits, and grades for each semester.
          </li>
          <li>
            <strong>Graphical Representation</strong>: Visual charts to help you understand your performance.
          </li>
          <li>
            <strong>Download/Share</strong>: Options to download or share your results.
          </li>
          <li>
            <strong>Return to Calculator</strong>: Easily navigate back to the calculator to make adjustments.
          </li>
        </ul>
      </div>

      <div className="documentation-section">
        <h2>Tips for Using the Calculator</h2>
        <ul>
          <li>
            <strong>Course Suggestions</strong>: The calculator suggests course names and automatically fills in course codes based on KIIT's curriculum.
          </li>
          <li>
            <strong>Sample Data</strong>: Use the sample data feature to see how the calculator works with pre-filled semester data.
          </li>
          <li>
            <strong>Local Storage</strong>: Your data is saved in your browser's local storage, so you can close the browser and come back to your calculations later.
          </li>
          <li>
            <strong>Edit Mode</strong>: Click on any subject or semester to edit its details.
          </li>
        </ul>
      </div>

      <div className="documentation-section">
        <h2>Frequently Asked Questions</h2>
        <div className="faq-item">
          <h3>Is my data secure?</h3>
          <p>
            All your data is stored locally on your device. We do not collect or store any of your academic information on our servers.
          </p>
        </div>
        <div className="faq-item">
          <h3>Can I use this calculator for other universities?</h3>
          <p>
            This calculator is specifically designed for KIIT University's grading system. The course suggestions and grade point values are based on KIIT's curriculum.
          </p>
        </div>
        <div className="faq-item">
          <h3>How accurate is the calculator?</h3>
          <p>
            The calculator uses the official KIIT University grading system and formulas for calculating SGPA and CGPA, so the results should be accurate.
          </p>
        </div>
        <div className="faq-item">
          <h3>What if I made a mistake in entering my grades?</h3>
          <p>
            You can easily edit or delete any subject or semester by clicking on it in the list.
          </p>
        </div>
      </div>
    </div>
  );
};

export default DocumentationPage;
