import React, { useState } from "react";
import axios from "axios";

function App() {
  const [text, setText] = useState("");
  const [translatedText, setTranslatedText] = useState("");
  const [summary, setSummary] = useState("");
  const [pdfSummary, setPdfSummary] = useState("");
  const [inputLanguage, setInputLanguage] = useState("en");
  const [outputLanguage, setOutputLanguage] = useState("fr");
  const [pdfFile, setPdfFile] = useState(null);
  const [isDarkMode, setIsDarkMode] = useState(false); 

  const [isTranslating, setIsTranslating] = useState(false);
  const [isSummarizingText, setIsSummarizingText] = useState(false);
  const [isSummarizingPdf, setIsSummarizingPdf] = useState(false);

  const translateText = async () => {
    setIsTranslating(true);
    try {
      const route = `http://127.0.0.1:5000/translate_${inputLanguage}_to_${outputLanguage}`;
      const response = await axios.post(route, { text });
      setTranslatedText(response.data.translated_text);
    } catch (error) {
      console.error("Error translating text", error);
    } finally {
      setIsTranslating(false);
    }
  };

  const summarizeText = async () => {
    setIsSummarizingText(true);
    try {
      const response = await axios.post("http://127.0.0.1:5000/summarize", {
        text,
      });
      setSummary(response.data.summary);
    } catch (error) {
      console.error("Error summarizing text", error);
    } finally {
      setIsSummarizingText(false);
    }
  };

  const summarizePdf = async () => {
    const formData = new FormData();
    formData.append("file", pdfFile);
    setIsSummarizingPdf(true);

    try {
      const response = await axios.post("http://127.0.0.1:5000/summarize_pdf", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setPdfSummary(response.data.summary);
    } catch (error) {
      console.error("Error summarizing PDF", error);
    } finally {
      setIsSummarizingPdf(false);
    }
  };

  return (
    <div className={`min-h-screen ${isDarkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-black"} flex flex-col items-center p-6`}>
      <h1 className="text-3xl font-bold mb-6">Polytechnique Student Translator</h1>
      
      <div className="absolute top-16 right-16">
      


      
  <label className="flex items-center space-x-2">
  
    <span className="text-lg font-medium">{isDarkMode ? "Dark Mode" : "Light Mode"}</span>
    <div
      onClick={() => setIsDarkMode(!isDarkMode)}
      className={`w-14 h-8 flex items-center rounded-full p-1 cursor-pointer transition-colors ${
        isDarkMode ? "bg-gray-800" : "bg-gray-300"
      }`}
    >
      <div
        className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform ${
          isDarkMode ? "translate-x-6" : "translate-x-0"
        }`}
      />
    </div>
  </label>
</div>



<div className="mt-8 mb-8  space-x-4">
            <select
              value={inputLanguage}
              onChange={(e) => setInputLanguage(e.target.value)}
              className={`border rounded-lg p-2 ${isDarkMode ? "bg-gray-800 border-gray-600 text-white" : "bg-white border-gray-300 text-black"}`}
            >
              <option value="en">English</option>
              <option value="fr">French</option>
              <option value="ar">Arabic</option>
            </select>

            <select
              value={outputLanguage}
              onChange={(e) => setOutputLanguage(e.target.value)}
              className={`border rounded-lg p-2 ${isDarkMode ? "bg-gray-800 border-gray-600 text-white" : "bg-white border-gray-300 text-black"}`}
            >
              <option value="fr">French</option>
              <option value="en">English</option>
              <option value="ar">Arabic</option>
            </select>
          </div>


      <div className="flex flex-col md:flex-row gap-6 w-full max-w-4xl">
        <div className="w-full md:w-1/2">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Enter text"
            className={`w-full h-64 p-4 border rounded-lg shadow-sm focus:outline-none ${
              isDarkMode ? "bg-gray-800 border-gray-600 text-white" : "bg-white border-gray-300 text-black"
            }`}
          ></textarea>

          

          <div className="mt-4 flex space-x-4">
            <button
              onClick={translateText}
              disabled={isTranslating}
              className={`px-4 py-2 rounded-lg shadow-md transition ${
                isTranslating ? 'opacity-50 cursor-not-allowed' : ''
              } ${isDarkMode ? "bg-blue-600 text-white" : "bg-blue-500 text-white"} hover:${isDarkMode ? "bg-blue-700" : "bg-blue-600"}`}
            >
              {isTranslating ? "Loading..." : "Translate"}
            </button>
            <button
              onClick={summarizeText}
              disabled={isSummarizingText}
              className={`px-4 py-2 rounded-lg shadow-md transition ${
                isSummarizingText ? 'opacity-50 cursor-not-allowed' : ''
              } ${isDarkMode ? "bg-green-600 text-white" : "bg-green-500 text-white"} hover:${isDarkMode ? "bg-green-700" : "bg-green-600"}`}
            >
              {isSummarizingText ? "Loading..." : "Summarize Text"}
            </button>
          </div>

          <div className="mt-4">
            <input
              type="file"
              accept=".pdf"
              onChange={(e) => setPdfFile(e.target.files[0])}
              className={`border rounded-lg p-2 ${isDarkMode ? "bg-gray-800 border-gray-600 text-white" : "bg-white border-gray-300 text-black"}`}
            />
            <button
              onClick={summarizePdf}
              disabled={isSummarizingPdf}
              className={`mt-2 px-4 py-2 rounded-lg shadow-md transition ${
                isSummarizingPdf ? 'opacity-50 cursor-not-allowed' : ''
              } ${isDarkMode ? "bg-purple-600 text-white" : "bg-purple-500 text-white"} hover:${isDarkMode ? "bg-purple-700" : "bg-purple-600"}`}
            >
              {isSummarizingPdf ? "Loading..." : "Summarize PDF"}
            </button>
          </div>
        </div>

        <div className="w-full md:w-1/2">
          {translatedText && (
            <div className={`p-4 border rounded-lg shadow-md ${isDarkMode ? "bg-gray-800 border-gray-600" : "bg-white border-gray-300"}`}>
              <h2 className="text-xl font-semibold mb-2">Translation:</h2>
              <p>{translatedText}</p>
            </div>
          )}

          {summary && (
            <div className={`p-4 border rounded-lg shadow-md mt-4 ${isDarkMode ? "bg-gray-800 border-gray-600" : "bg-white border-gray-300"}`}>
              <h2 className="text-xl font-semibold mb-2">Summary:</h2>
              <p>{summary}</p>
            </div>
          )}

          {pdfSummary && (
            <div className={`p-4 border rounded-lg shadow-md mt-4 ${isDarkMode ? "bg-gray-800 border-gray-600" : "bg-white border-gray-300"}`}>
              <h2 className="text-xl font-semibold mb-2">PDF Summary:</h2>
              <p>{pdfSummary}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
