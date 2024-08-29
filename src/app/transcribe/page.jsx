'use client'

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';

export default function Transcribe() {
  const [file, setFile] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [transcript, setTranscript] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef(null);
  const audioRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) return;

    setIsLoading(true);
    
    const formData = new FormData();
    formData.append('audio', file);

    try {
      const response = await fetch('/api/transcribe', {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      setTranscript(data.transcript);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setAudioUrl(URL.createObjectURL(selectedFile));
    }
  };

  const copyTranscript = () => {
    navigator.clipboard.writeText(transcript);
    alert('Transcript copied to clipboard!');
  };

  const downloadTranscript = () => {
    const element = document.createElement('a');
    const file = new Blob([transcript], {type: 'text/plain'});
    element.href = URL.createObjectURL(file);
    element.download = 'transcript.txt';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-600 via-pink-700 to-blue-800 py-12 px-4 sm:px-6 lg:px-8 flex flex-col justify-center">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white shadow-2xl rounded-3xl overflow-hidden"
        >
          <div className="px-6 py-8 sm:p-10">
            <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-8 text-center">
              Audio Transcription
            </h1>

            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="flex items-center justify-center w-full">
                <label 
                  htmlFor="dropzone-file" 
                  className="flex flex-col items-center justify-center w-full h-64 border-2 border-purple-300 border-dashed rounded-2xl cursor-pointer bg-gray-50 hover:bg-gray-100 transition duration-300 ease-in-out transform hover:scale-105"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg className="w-12 h-12 mb-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
                    <p className="mb-2 text-sm text-gray-500"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                    <p className="text-xs text-gray-500">MP3, WAV, or M4A (MAX. 10MB)</p>
                  </div>
                  <input 
                    ref={fileInputRef}
                    id="dropzone-file" 
                    type="file" 
                    className="hidden" 
                    accept=".mp3,.wav,.m4a"
                    onChange={handleFileChange}
                  />
                </label>
              </div>
              {file && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-gray-500 text-center bg-purple-100 rounded-lg p-3"
                >
                  <p className="font-medium text-purple-700">Selected file: {file.name}</p>
                </motion.div>
              )}
              {audioUrl && (
                <div className="mt-6">
                  <audio ref={audioRef} controls className="w-full">
                    <source src={audioUrl} type={file.type} />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              )}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className={`w-full py-4 px-6 border border-transparent rounded-xl shadow-sm text-lg font-medium text-white ${
                  isLoading || !file ? 'bg-gray-400 cursor-not-allowed' : 'bg-gradient-to-r from-purple-500 to-pink-600 hover:from-purple-600 hover:to-pink-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500'
                }`}
                disabled={isLoading || !file}
              >
                {isLoading ? 'Transcribing...' : 'Transcribe'}
              </motion.button>
            </form>

            {transcript && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="mt-10 p-6 bg-purple-50 rounded-xl shadow-inner"
              >
                <h2 className="text-2xl font-semibold mb-4 text-purple-700">Transcript:</h2>
                <p className="text-base text-gray-700 whitespace-pre-wrap leading-relaxed">{transcript}</p>
                <div className="mt-6 flex space-x-4">
                  <button onClick={copyTranscript} className="flex-1 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition duration-300 font-medium">
                    Copy
                  </button>
                  <button onClick={downloadTranscript} className="flex-1 bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600 transition duration-300 font-medium">
                    Download
                  </button>
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </div>
  );
}