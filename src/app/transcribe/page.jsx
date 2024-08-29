

'use client'
import { FacebookShare } from 'react-share-kit'


import React, { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function TranscribeApp() {
  const [file, setFile] = useState(null);
  const [audioUrl, setAudioUrl] = useState(null);
  const [transcript, setTranscript] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [showContactModal, setShowContactModal] = useState(false);
  const titleToShare = 'Check out what this audio i just transcribed';

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

// contact
  const openContactModal = () => setShowContactModal(true);
  const closeContactModal = () => setShowContactModal(false);
  // pricing model
  const openPricingModal = () => setShowPricingModal(true);
  const closePricingModal = () => setShowPricingModal(false);

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 py-6 flex flex-col">
      <header className="w-full max-w-6xl mx-auto px-4 mb-8">
        <nav className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-white">EdioScribe</h1>
          <div className="space-x-4">
            <button             onClick={openPricingModal}
 className="bg-white text-purple-600 px-4 py-2 rounded-full hover:bg-purple-100 transition duration-300">Pricing</button>
            <button className="bg-purple-600 text-white px-4 py-2 rounded-full hover:bg-purple-700 transition duration-300">Sign Up</button>
          </div>
        </nav>
      </header>

      <main className="flex-grow flex flex-col items-center justify-center px-4">
        <div className="w-full max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white shadow-2xl rounded-3xl overflow-hidden"
          >
            <div className="p-8 md:p-12">
              <h2 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-600 mb-6 text-center">
                Transform Your Audio to Text
              </h2>

              <form onSubmit={handleSubmit} className="space-y-8">
              <div 
                className="flex items-center justify-center w-full"
                onClick={() => fileInputRef.current.click()}
              >
                <label 
                  htmlFor="dropzone-file" 
                  className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 hover:bg-gray-100 transition duration-300 ease-in-out transform hover:scale-105"
                >
                  <div className="flex flex-col items-center justify-center pt-5 pb-6">
                    <svg className="w-10 h-10 mb-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"></path></svg>
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
                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-sm text-gray-500 text-center"
                >
                  Selected file: {file.name}
                </motion.p>
              )}
              {audioUrl && (
                <audio ref={audioRef} controls className="w-full mt-4">
                  <source src={audioUrl} type={file.type} />
                  Your browser does not support the audio element.
                </audio>
              )}
                <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                type="submit"
                className={`w-full py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
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
                  className="mt-8 p-6 bg-gray-100 rounded-lg shadow-inner"
                >
                  <h2 className="text-lg font-semibold mb-4 text-gray-700">Transcript:</h2>
                  <p className="text-sm text-gray-600 whitespace-pre-wrap leading-relaxed">{transcript}</p>
                  <div className="mt-4 flex space-x-4">

<FacebookShare url={'https://tscriber.vercel.app/'} round='true' title='check this out.Ii just transcribed an audio i seconds for free..'/>
                    <button onClick={copyTranscript} className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600 transition duration-300">
                      Copy
                    </button>
                    <button onClick={downloadTranscript} className="bg-green-500 text-white px-4 py-2 rounded-full hover:bg-green-600 transition duration-300">
                      Download
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            <FeatureCard
              title="Advanced AI"
              description="State-of-the-art AI models for accurate transcription"
              icon={<svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" /></svg>}
            />
            <FeatureCard
              title="Multiple Languages"
              description="Support for over 30 languages and dialects"
              icon={<svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5h12M9 3v2m1.048 9.5A18.022 18.022 0 016.412 9m6.088 9h7M11 21l5-10 5 10M12.751 5C11.783 10.77 8.07 15.61 3 18.129" /></svg>}
            />
            <FeatureCard
              title="Secure & Private"
              description="Your audio files are encrypted and never stored"
              icon={<svg className="w-8 h-8 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>}
            />
          </div>
        </div>
      </main>

      <footer className="w-full max-w-6xl mx-auto px-4 py-8 mt-12">
        <div className="flex justify-between items-center">
          <p className="text-white">&copy; 2024 EdioScribe. All rights reserved.</p>
          <button 
            onClick={openContactModal}
            className="sm:hidden text-white underline hover:text-purple-200 transition duration-300"
          >
           Find me
          </button>
          <div className='flex flex-col '>
            <p>Developer:</p>
            
          EMMANUEL JIMAH
          <p>          Contact:
</p>
          +233541555607</div>
          <p>Powered by DEEPGRAM:</p>
 
          
        </div>
      </footer>

      <AnimatePresence>
        {showPricingModal && (
          <Modal onClose={closePricingModal}>
            <h2 className="text-2xl font-bold mb-4 text-orange">Pricing</h2>
            <p className="text-lg text-blue">Coming Soon!</p>
            <p className="mt-2 text-black">We're working on exciting pricing plans for AudioScribe. Stay tuned!</p>
          </Modal>
        )}
      </AnimatePresence>
      <AnimatePresence>
        {showContactModal && (
          <Modal onClose={closeContactModal}>
            <h2 className="text-2xl font-bold mb-4 text-black">contact</h2>
            <p className="text-lg text-black">I will be hyped to here from you!</p>
            <div className="flex">
            {/* <a href="tel:+233541555607"></a> */}

            <a href="http://facebook.com/bejmav">
              {' '}
              <h1 className="text-2lx pr-4 pl-4  pt-2 pb-2 rounded-full bg-blue-400 text-white font-extrabold m-2">
                Facebook
              </h1>
            </a>
            <a href="http://wa.me/+233541555607">
              {' '}
              <h1 className="text-2lx pr-4 pl-4  pt-2 pb-2 rounded-full bg-green-500 text-white font-extrabold m-2">
                WhatsApp
              </h1>
            </a>

            <a href="tel:+233541555607">
              <h1 className="text-2lx pr-4 pl-4  pt-2 pb-2 rounded-full bg-green-400 text-white font-extrabold m-2">
                Call
              </h1>
            </a>
            <a href="mailto:b.emma.j3@outlook.com">
              <h1 className="text-2lx pr-4 pl-4  pt-2 pb-2 rounded-full bg-lime-300 text-white font-extrabold m-2">
                Email
              </h1>
            </a>
          </div>
          </Modal>
        )}
      </AnimatePresence>
    </div>
  );
}

const FeatureCard = ({ title, description, icon }) => (
  <motion.div
    whileHover={{ scale: 1.05 }}
    className="bg-white p-6 rounded-xl shadow-lg"
  >
    <div className="flex items-center justify-center w-12 h-12 bg-purple-100 rounded-full mb-4">
      {icon}
    </div>
    <h3 className="text-xl font-semibold mb-2">{title}</h3>
    <p className="text-gray-600">{description}</p>
  </motion.div>
);

const Modal = ({ children, onClose }) => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    onClick={onClose}
    className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4"
  >
    <motion.div
      initial={{ scale: 0.95, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0.95, opacity: 0 }}
      onClick={(e) => e.stopPropagation()}
      className="bg-white rounded-lg p-8 max-w-md w-full"
    >
      {children}
      <button
        onClick={onClose}
        className="mt-6 bg-purple-600 text-white px-4 py-2 rounded-full hover:bg-purple-700 transition duration-300"
      >
        Close
      </button>
    </motion.div>
  </motion.div>
);