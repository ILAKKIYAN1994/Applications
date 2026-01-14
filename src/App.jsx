import React, { useState } from 'react';
import { Calculator } from 'lucide-react';

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
    courses.reduce((acc, course) => {
      acc[course.code] = { internal: '', external: '' };
      return acc;
    }, {})
  );

  const handleMarkChange = (code, type, value) => {
    const numValue = value === '' ? '' : Math.min(Math.max(0, parseInt(value) || 0), type === 'internal' ? 30 : 70);
    setMarks(prev => ({
      ...prev,
      [code]: { ...prev[code], [type]: numValue }
    }));
  };

  const calculateCGPA = () => {
    let totalCredits = 0;
    let totalGradePoints = 0;

    courses.forEach(course => {
      const internal = parseInt(marks[course.code].internal) || 0;
      const external = parseInt(marks[course.code].external) || 0;
      const total = internal + external;
      const gradePoint = getGradePoint(total);
      
      totalCredits += course.credits;
      totalGradePoints += gradePoint * course.credits;
    });

    return totalCredits > 0 ? (totalGradePoints / totalCredits).toFixed(2) : '0.00';
  };

  const cgpa = calculateCGPA();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-xl p-6 mb-6">
          <div className="flex items-center gap-3 mb-2">
            <Calculator className="text-indigo-600" size={32} />
            <h1 className="text-3xl font-bold text-gray-800">CGPA Calculator</h1>
          </div>
          <p className="text-gray-600">Master of Business Administration (Business Analytics)</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <div className="space-y-4">
            {courses.map(course => {
              const internal = parseInt(marks[course.code].internal) || 0;
              const external = parseInt(marks[course.code].external) || 0;
              const total = internal + external;
              const grade = getGrade(total);
              const gradePoint = getGradePoint(total);

              return (
                <div key={course.code} className="border rounded-lg p-4 hover:shadow-md transition-shadow">
                  <div className="grid md:grid-cols-12 gap-4 items-center">
                    <div className="md:col-span-5">
                      <div className="font-semibold text-gray-800">{course.code}</div>
                      <div className="text-sm text-gray-600">{course.title}</div>
                      <div className="text-xs text-gray-500 mt-1">Credits: {course.credits}</div>
                    </div>
                    
                    <div className="md:col-span-7 grid grid-cols-2 md:grid-cols-5 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          Internal (30)
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="30"
                          value={marks[course.code].internal}
                          onChange={(e) => handleMarkChange(course.code, 'internal', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="0-30"
                        />
                      </div>
                      
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">
                          External (70)
                        </label>
                        <input
                          type="number"
                          min="0"
                          max="70"
                          value={marks[course.code].external}
                          onChange={(e) => handleMarkChange(course.code, 'external', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="0-70"
                        />
                      </div>
                      
                      <div className="text-center">
                        <div className="text-xs font-medium text-gray-700 mb-1">Total</div>
                        <div className="text-lg font-bold text-indigo-600">{total}</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-xs font-medium text-gray-700 mb-1">Grade</div>
                        <div className="text-lg font-bold text-green-600">{grade}</div>
                      </div>
                      
                      <div className="text-center">
                        <div className="text-xs font-medium text-gray-700 mb-1">GP</div>
                        <div className="text-lg font-bold text-purple-600">{gradePoint}</div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg shadow-xl p-8 text-white">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-2">Your CGPA</h2>
            <div className="text-6xl font-bold mb-4">{cgpa}</div>
            <div className="text-indigo-100">
              Based on a 10-point grading scale
            </div>
          </div>
        </div>

        <div className="mt-6 bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Grading Scale</h3>
          <div className="grid grid-cols-2 md:grid-cols-6 gap-3 text-sm">
            <div className="text-center p-2 bg-green-50 rounded">
              <div className="font-bold text-green-700">O (10)</div>
              <div className="text-xs text-gray-600">90-100</div>
            </div>
            <div className="text-center p-2 bg-blue-50 rounded">
              <div className="font-bold text-blue-700">A+ (9)</div>
              <div className="text-xs text-gray-600">80-89</div>
            </div>
            <div className="text-center p-2 bg-indigo-50 rounded">
              <div className="font-bold text-indigo-700">A (8)</div>
              <div className="text-xs text-gray-600">70-79</div>
            </div>
            <div className="text-center p-2 bg-purple-50 rounded">
              <div className="font-bold text-purple-700">B+ (7)</div>
              <div className="text-xs text-gray-600">60-69</div>
            </div>
            <div className="text-center p-2 bg-yellow-50 rounded">
              <div className="font-bold text-yellow-700">B (6)</div>
              <div className="text-xs text-gray-600">55-59</div>
            </div>
            <div className="text-center p-2 bg-orange-50 rounded">
              <div className="font-bold text-orange-700">C (5)</div>
              <div className="text-xs text-gray-600">50-54</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}