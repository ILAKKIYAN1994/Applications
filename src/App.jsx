import React, { useEffect, useState } from 'react';
import {
  Linkedin,
  Youtube,
  Sun,
  Moon,
  FileDown
} from 'lucide-react';
import jsPDF from 'jspdf';
import profilePic from './assets/profile.jpg';

const courses = [
  { code: 'OBA1101', title: 'Management Concepts and Organization Behavior', credits: 3 },
  { code: 'OBA1102', title: 'Managerial Economics', credits: 3 },
  { code: 'OBA1103', title: 'Human Resource Management', credits: 3 },
  { code: 'OBA1104', title: 'Marketing Management', credits: 3 },
  { code: 'OBA1105', title: 'Financial Management', credits: 3 },
  { code: 'OBA1106', title: 'Operations Management', credits: 3 },
  { code: 'OBA1107', title: 'Statistical Methods for Decision Making', credits: 3 },
  { code: 'OBA1108', title: 'R Programming', credits: 3 }
];

const getGradePoint = (total) => {
  if (total >= 90) return 10;
  if (total >= 80) return 9;
  if (total >= 70) return 8;
  if (total >= 60) return 7;
  if (total >= 55) return 6;
  if (total >= 50) return 5;
  return 0;
};

const getGrade = (total) => {
  if (total >= 90) return 'O';
  if (total >= 80) return 'A+';
  if (total >= 70) return 'A';
  if (total >= 60) return 'B+';
  if (total >= 55) return 'B';
  if (total >= 50) return 'C';
  return 'F';
};

export default function CGPACalculator() {
  const [marks, setMarks] = useState(
    courses.reduce((acc, c) => {
      acc[c.code] = { internal: '', external: '' };
      return acc;
    }, {})
  );

  const [darkMode, setDarkMode] = useState(
    () => JSON.parse(localStorage.getItem('theme')) ?? true
  );

  useEffect(() => {
    localStorage.setItem('theme', JSON.stringify(darkMode));
  }, [darkMode]);

  const [cgpa, setCgpa] = useState('0.00');

  useEffect(() => {
    let totalCredits = 0;
    let totalGradePoints = 0;

    courses.forEach((course) => {
      const internal = parseInt(marks[course.code].internal) || 0;
      const external = parseInt(marks[course.code].external) || 0;
      const total = internal + external;

      totalCredits += course.credits;
      totalGradePoints += getGradePoint(total) * course.credits;
    });

    setCgpa(
      totalCredits ? (totalGradePoints / totalCredits).toFixed(2) : '0.00'
    );
  }, [marks]);

  const handleChange = (code, type, value) => {
    const max = type === 'internal' ? 30 : 70;
    const v = value === '' ? '' : Math.min(Math.max(0, value), max);
    setMarks((p) => ({ ...p, [code]: { ...p[code], [type]: v } }));
  };

  /* ---------- UI ---------- */
  return (
    <div
      className={`min-h-screen py-8 px-4 ${
        darkMode ? 'bg-gray-900 text-gray-200' : 'bg-blue-50 text-gray-800'
      }`}
    >
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-3xl font-bold">CGPA Calculator</h1>
            <p className="text-sm opacity-70">
              MBA (Business Analytics) Semester - 1
            </p>
          </div>

          <button
            onClick={() => setDarkMode(!darkMode)}
            className="p-2 rounded-full hover:bg-indigo-500/20"
          >
            {darkMode ? <Sun /> : <Moon />}
          </button>
        </div>

        {/* SUBJECT ROWS – EXACT SCREENSHOT STYLE */}
        <div className="space-y-4">
          {courses.map((course) => {
            const internal = parseInt(marks[course.code].internal) || 0;
            const external = parseInt(marks[course.code].external) || 0;
            const total = internal + external;
            const grade = getGrade(total);
            const gp = getGradePoint(total);

            return (
              <div
                key={course.code}
                className="bg-white rounded-lg p-5 border flex flex-col md:flex-row md:items-center md:justify-between gap-4"
              >
                {/* Left */}
                <div className="md:w-1/3">
                  <div className="font-semibold">{course.code}</div>
                  <div className="text-sm text-gray-600">{course.title}</div>
                  <div className="text-xs text-gray-500 mt-1">
                    Credits: {course.credits}
                  </div>
                </div>

                {/* Right */}
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4 md:w-2/3 text-center">
                  <div>
                    <div className="text-xs mb-1">Internal (30)</div>
                    <input
                      type="number"
                      placeholder="0-30"
                      value={marks[course.code].internal}
                      onChange={(e) =>
                        handleChange(course.code, 'internal', e.target.value)
                      }
                      className="w-full border rounded-md px-2 py-1 text-center"
                    />
                  </div>

                  <div>
                    <div className="text-xs mb-1">External (70)</div>
                    <input
                      type="number"
                      placeholder="0-70"
                      value={marks[course.code].external}
                      onChange={(e) =>
                        handleChange(course.code, 'external', e.target.value)
                      }
                      className="w-full border rounded-md px-2 py-1 text-center"
                    />
                  </div>

                  <div>
                    <div className="text-xs mb-1">Total</div>
                    <div className="font-bold text-indigo-600">{total}</div>
                  </div>

                  <div>
                    <div className="text-xs mb-1">Grade</div>
                    <div className="font-bold text-green-600">{grade}</div>
                  </div>

                  <div>
                    <div className="text-xs mb-1">GP</div>
                    <div className="font-bold text-purple-600">{gp}</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* ⬇️ EVERYTHING BELOW IS UNCHANGED */}
        <div className="mt-8 text-center">
          <div className="text-5xl font-bold mb-4">{cgpa}</div>
          <button className="inline-flex items-center gap-2 px-6 py-2 bg-indigo-600 text-white rounded">
            <FileDown size={18} /> Export CGPA as PDF
          </button>
        </div>

        <div className="mt-8 bg-gray-800 p-6 rounded text-center">
          <img
            src={profilePic}
            alt="Ilakkiyan A V"
            className="w-20 h-20 rounded-full mx-auto mb-3 border-2 border-indigo-500"
          />
          <p className="mb-4">
            If you find this app useful ❤️, share your comments and feedback in my
            LinkedIn post.
          </p>
          <a
            href="#"
            className="inline-flex items-center gap-2 bg-indigo-600 px-6 py-2 rounded text-white"
          >
            <Linkedin size={18} /> View LinkedIn Post 
          </a>
        </div>

        <footer className="mt-10 flex justify-center gap-6 text-sm">
          <a
            href="https://www.linkedin.com/in/ilakkiyan-av/"
            target="_blank"
            className="flex items-center gap-2 bg-blue-600 px-4 py-2 rounded text-white"
          >
            <Linkedin size={18} /> Follow me on LinkedIn
          </a>
          <a
            href="https://www.youtube.com/@ilakkiyanav"
            target="_blank"
            className="flex items-center gap-2 bg-blue-600 px-4 py-2 rounded text-white"
          >
            <Youtube size={18} /> Subscribe to my YouTube channel
          </a>
        </footer>

      </div>
    </div>
  );
}
