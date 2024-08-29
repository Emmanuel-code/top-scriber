import Link from 'next/link'
import { motion, AnimatePresence } from 'framer-motion';

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 flex flex-col justify-center items-center px-4">
      <h1 className="text-4xl md:text-6xl font-bold text-white mb-8 text-center">Audio Transcription App</h1>
      <p className="text-xl text-white mb-12 text-center max-w-2xl">
        Transform your audio into text with our state-of-the-art transcription service. 
        Fast, accurate, and easy to use.
      </p>
      <Link href="/transcribe" 
        className="bg-white text-purple-600 font-bold py-3 px-8 rounded-full text-xl hover:bg-gray-100 transition duration-300"
      >
        Start Transcribing
      </Link>
     
    </div>
  )
}