import React, { useState, useEffect } from 'react';
import { GoogleGenerativeAI } from "@google/generative-ai";

const Course = () => {
  const [topic, setTopic] = useState('javascript');
  const [courseSections, setCourseSections] = useState([]);
  const [currentSectionContent, setCurrentSectionContent] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [currentSection, setCurrentSection] = useState(0);

  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_GEMINI_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-pro" });

  useEffect(() => {
    generateCourseOutline();
  }, []);

  useEffect(() => {
    if (courseSections.length > 0) {
      generateSectionContent(courseSections[currentSection]);
    }
  }, [currentSection, courseSections]);

  const generateCourseOutline = async () => {
    setIsLoading(true);
    const prompt = `Generate a comprehensive course outline on "${topic}" with 5 sections. For each section, provide only a title. Format the response as a numbered list.`;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      const sections = text.split('\n').filter(section => section.trim() !== '');
      setCourseSections(sections);
    } catch (error) {
      console.error('Error generating course outline:', error);
      setCourseSections(['Error generating course outline. Please try again.']);
    }
    setIsLoading(false);
  };

  const generateSectionContent = async (sectionTitle) => {
    setIsLoading(true);
    const prompt = `Provide detailed content for the following section of a ${topic} course: "${sectionTitle}". Include explanations, examples, and key points.`;

    try {
      const result = await model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      const parsedContent = parseContent(text);
      setCurrentSectionContent(parsedContent);
    } catch (error) {
      console.error('Error generating section content:', error);
      setCurrentSectionContent('Error generating content. Please try again.');
    }
    setIsLoading(false);
  };

  const parseContent = (text) => {
    // Remove asterisks and other unnecessary formatting
    let cleanedText = text.replace(/\*\*/g, '').trim();

    // Split the content into lines
    const lines = cleanedText.split('\n');

    // Process lines to determine significance
    const structuredContent = lines.map(line => {
      // Example: Determine if the line is a heading or paragraph
      if (line.match(/^#\s/)) {
        return `<h3>${line.replace(/^#\s/, '')}</h3>`; // Treat as a subheading
      } else if (line.match(/^\*\s/)) {
        return `<li>${line.replace(/^\*\s/, '')}</li>`; // Treat as a list item
      } else {
        return `<p>${line}</p>`; // Treat as a paragraph
      }
    });

    // Join structured content into a single HTML string
    return structuredContent.join('');
  };

  const handleNextSection = () => {
    if (currentSection < courseSections.length - 1) {
      setCurrentSection(currentSection + 1);
    }
  };

  const handlePrevSection = () => {
    if (currentSection > 0) {
      setCurrentSection(currentSection - 1);
    }
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <div className="w-1/4 bg-white p-6 overflow-y-auto shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-indigo-600">Course Generator</h1>
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter course topic"
          className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
        />
        <button
          onClick={generateCourseOutline}
          disabled={isLoading}
          className="w-full bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-200 ease-in-out"
        >
          {isLoading ? 'Generating...' : 'Generate Course'}
        </button>
        {courseSections.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4 text-gray-700">Sections</h2>
            <ul className="space-y-2">
              {courseSections.map((section, index) => (
                <li
                  key={index}
                  className={`cursor-pointer p-2 rounded transition duration-200 ease-in-out ${
                    currentSection === index ? 'bg-indigo-100 text-indigo-800' : 'hover:bg-gray-100'
                  }`}
                  onClick={() => setCurrentSection(index)}
                >
                  {section.replace(/^\d+\.\s*/, '')}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="flex-1 p-6 overflow-y-auto">
        {courseSections.length > 0 && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold mb-4 text-indigo-800">
              {courseSections[currentSection].replace(/^\d+\.\s*/, '')}
            </h2>
            {isLoading ? (
              <p>Loading section content...</p>
            ) : (
              <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: currentSectionContent }} />
            )}
            <div className="mt-6 flex justify-between items-center">
              <button
                onClick={handlePrevSection}
                disabled={currentSection === 0}
                className="bg-indigo-100 text-indigo-800 px-4 py-2 rounded-lg hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-200 ease-in-out disabled:opacity-50"
              >
                Previous Section
              </button>
              <span className="text-gray-600">
                Section {currentSection + 1} of {courseSections.length}
              </span>
              <button
                onClick={handleNextSection}
                disabled={currentSection === courseSections.length - 1}
                className="bg-indigo-100 text-indigo-800 px-4 py-2 rounded-lg hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-200 ease-in-out disabled:opacity-50"
              >
                Next Section
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Course;
