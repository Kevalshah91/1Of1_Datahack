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
    const prompt = `Provide detailed content for the following section of a ${topic} course: "${sectionTitle}". Include explanations, examples, and key points. Use bullet points for main ideas and create subsections where appropriate.`;

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
    let cleanedText = text.replace(/\*\*/g, '').trim();
    const lines = cleanedText.split('\n');

    const structuredContent = lines.map(line => {
      if (line.match(/^#\s/)) {
        return `<p class="text-lg font-bold text-indigo-700 mb-3 mt-6">${line.replace(/^#\s/, '')}</p>`;
      } else if (line.match(/^\s*[-•]\s/)) {
        return `<li class="mb-2 font-bold">${line.replace(/^\s*[-•]\s/, '')}</li>`;
      } else {
        return `<p class="mb-4 leading-relaxed italic">${line}</p>`;
      }
    });

    return `<ul class="list-disc pl-5 mb-4">${structuredContent.join('')}</ul>`;
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
    <div className="flex h-screen bg-gradient-to-br from-indigo-100 to-purple-100">
      <div className="w-1/4 bg-white p-6 overflow-y-auto shadow-lg">
        <h1 className="text-3xl font-bold mb-6 text-indigo-600 border-b pb-2">Course Generator</h1>
        <input
          type="text"
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="Enter course topic"
          className="w-full p-3 border border-indigo-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 mb-4"
        />
        <button
          onClick={generateCourseOutline}
          disabled={isLoading}
          className="w-full bg-indigo-600 text-white p-3 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-200 ease-in-out disabled:opacity-50"
        >
          {isLoading ? 'Generating...' : 'Generate Course'}
        </button>
        {courseSections.length > 0 && (
          <div className="mt-6">
            <h2 className="text-xl font-semibold mb-4 text-indigo-700">Sections</h2>
            <ul className="space-y-2">
              {courseSections.map((section, index) => (
                <li
                  key={index}
                  className={`cursor-pointer p-2 rounded transition duration-200 ease-in-out ${
                    currentSection === index ? 'bg-indigo-100 text-indigo-800 font-semibold' : 'hover:bg-indigo-50'
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
          <div className="bg-white rounded-lg shadow-lg p-8">
            <h2 className="text-3xl font-bold mb-6 text-indigo-800 border-b pb-2">
              {courseSections[currentSection].replace(/^\d+\.\s*/, '')}
            </h2>
            {isLoading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-indigo-500"></div>
              </div>
            ) : (
              <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: currentSectionContent }} />
            )}
            <div className="mt-8 flex justify-between items-center">
              <button
                onClick={handlePrevSection}
                disabled={currentSection === 0}
                className="bg-indigo-100 text-indigo-800 px-6 py-2 rounded-lg hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-200 ease-in-out disabled:opacity-50"
              >
                Previous
              </button>
              <span className="text-indigo-600 font-semibold">
                Section {currentSection + 1} of {courseSections.length}
              </span>
              <button
                onClick={handleNextSection}
                disabled={currentSection === courseSections.length - 1}
                className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition duration-200 ease-in-out disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Course;