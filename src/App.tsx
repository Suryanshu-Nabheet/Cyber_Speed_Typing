import React, { useState, useEffect, useCallback } from 'react';
import { Rocket, RotateCcw, Timer, Trophy, Target, KeyRound, AlertCircle, ArrowLeft, Zap, ChevronRight } from 'lucide-react';

const sampleTexts = [
  "In the year 2157, quantum neural networks had revolutionized the way humans interfaced with technology. The crystalline matrices of data streams flowed through the cybernetic enhancement ports, allowing direct neural access to the vast digital landscape that had become humanity's second home.",
  
  "The neon-lit streets of Neo Tokyo pulsed with electromagnetic energy as hover vehicles wove between towering arcologies that pierced the stratosphere. Holographic advertisements danced across the surfaces of buildings, their AI-driven algorithms adapting in real-time to the biorhythms of passing citizens.",
  
  "Deep within the quantum computing labs of the Stellar Corporation, scientists had achieved what many thought impossible: true artificial consciousness. The breakthrough came not from traditional binary systems, but from quantum entanglement processors that could maintain coherence at room temperature.",
  
  "The terraforming of Mars had entered its final phase, with vast fields of engineered bacteria converting the thin carbon dioxide atmosphere into breathable air. Massive space elevators, constructed from carbon nanotubes, ferried resources and colonists between the red planet.",
  
  "In the depths of Europa's subsurface ocean, autonomous research vessels discovered signs of silicon-based life forms thriving in the high-pressure environment. The alien microorganisms used quantum effects to harvest energy from the moon's magnetic field, challenging everything we knew."
];

function App() {
  const [text, setText] = useState('');
  const [sampleText, setSampleText] = useState('');
  const [timeLeft, setTimeLeft] = useState(60);
  const [isTyping, setIsTyping] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [wpm, setWpm] = useState(0);
  const [accuracy, setAccuracy] = useState(100);
  const [completed, setCompleted] = useState(false);
  const [errors, setErrors] = useState(0);
  const [correctChars, setCorrectChars] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const startTest = useCallback(() => {
    const randomText = sampleTexts[Math.floor(Math.random() * sampleTexts.length)];
    setSampleText(randomText);
    setText('');
    setTimeLeft(60);
    setIsTyping(false);
    setHasStarted(false);
    setCompleted(false);
    setShowResults(false);
    setWpm(0);
    setAccuracy(100);
    setErrors(0);
    setCorrectChars(0);
  }, []);

  useEffect(() => {
    startTest();
  }, [startTest]);

  useEffect(() => {
    let timer: number;
    if (isTyping && timeLeft > 0) {
      timer = window.setInterval(() => {
        setTimeLeft((time) => time - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setIsTyping(false);
      setCompleted(true);
      setShowResults(true);
    }
    return () => clearInterval(timer);
  }, [isTyping, timeLeft]);

  const calculateResults = useCallback(() => {
    const words = text.trim().split(' ').length;
    const characters = text.length;
    const currentErrors = [...text].filter((char, i) => char !== sampleText[i]).length;
    const correctCharacters = characters - currentErrors;
    const accuracyScore = Math.max(0, Math.floor((correctCharacters / characters) * 100)) || 0;
    const wpmScore = Math.floor((words / ((60 - timeLeft) / 60)) || 0);

    setWpm(wpmScore);
    setAccuracy(accuracyScore);
    setErrors(currentErrors);
    setCorrectChars(correctCharacters);
  }, [text, sampleText, timeLeft]);

  useEffect(() => {
    if (isTyping) {
      calculateResults();
    }
  }, [text, isTyping, calculateResults]);

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const newText = e.target.value;
    setText(newText);
    
    if (!hasStarted && newText.length === 1) {
      setHasStarted(true);
      setIsTyping(true);
    }
  };

  const getGrade = () => {
    if (wpm >= 80 && accuracy >= 95) return 'S';
    if (wpm >= 70 && accuracy >= 90) return 'A';
    if (wpm >= 60 && accuracy >= 85) return 'B';
    if (wpm >= 50 && accuracy >= 80) return 'C';
    return 'D';
  };

  if (showResults) {
    return (
      <div className="h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex items-center justify-center p-4">
        <div className="w-[800px]">
          <div className="results-container p-6 rounded-xl animate-fade-in border border-cyan-500/20">
            <div className="text-center space-y-4">
              <h2 className="text-4xl font-bold mb-2 cyber-gradient">Performance Analysis</h2>
              <div className="text-8xl font-bold grade-display mb-2">{getGrade()}</div>
              <div className="flex items-center justify-center gap-2 text-lg text-cyan-400">
                <Zap className="w-5 h-5" />
                <span>Performance Grade</span>
              </div>
            </div>

            <div className="grid grid-cols-4 gap-4 mt-8">
              <div className="cyber-card p-4 rounded-lg text-center">
                <Trophy className="w-8 h-8 text-yellow-500 mx-auto mb-2" />
                <div className="text-2xl font-bold mb-1">{wpm}</div>
                <div className="text-xs text-cyan-400">WPM</div>
              </div>
              
              <div className="cyber-card p-4 rounded-lg text-center">
                <Target className="w-8 h-8 text-green-500 mx-auto mb-2" />
                <div className="text-2xl font-bold mb-1">{accuracy}%</div>
                <div className="text-xs text-cyan-400">Accuracy</div>
              </div>

              <div className="cyber-card p-4 rounded-lg text-center">
                <KeyRound className="w-8 h-8 text-blue-500 mx-auto mb-2" />
                <div className="text-2xl font-bold mb-1">{correctChars}</div>
                <div className="text-xs text-cyan-400">Correct</div>
              </div>

              <div className="cyber-card p-4 rounded-lg text-center">
                <AlertCircle className="w-8 h-8 text-red-500 mx-auto mb-2" />
                <div className="text-2xl font-bold mb-1">{errors}</div>
                <div className="text-xs text-cyan-400">Errors</div>
              </div>
            </div>

            <div className="cyber-card rounded-lg p-4 mt-6">
              <div className="mb-4 text-center">
                <h3 className="text-xl font-bold mb-1 cyber-gradient">Accuracy Distribution</h3>
                <p className="text-sm text-gray-400">Character-by-character analysis</p>
              </div>
              <div className="flex h-6 rounded-full overflow-hidden">
                <div 
                  className="bg-gradient-to-r from-green-500 to-green-400 transition-all duration-300"
                  style={{ width: `${accuracy}%` }}
                />
                <div 
                  className="bg-gradient-to-r from-red-500 to-red-400 transition-all duration-300"
                  style={{ width: `${100 - accuracy}%` }}
                />
              </div>
            </div>

            <div className="flex justify-center pt-6">
              <button
                onClick={startTest}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 rounded-lg transition-all duration-300 text-base font-semibold group"
              >
                <ArrowLeft className="w-4 h-4" />
                Try Again
                <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white flex items-center justify-center p-4">
      <div className="w-[800px] space-y-4">
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold flex items-center justify-center gap-2">
            <Rocket className="w-8 h-8 text-cyan-400" />
            <span className="cyber-gradient">Cyber Speed Typing</span>
          </h1>
          <p className="text-lg text-cyan-400">Test your typing prowess</p>
        </div>

        <div className="typing-container p-4 rounded-xl shadow-xl">
          <div className="flex justify-between items-center mb-3">
            <div className="flex items-center gap-2 bg-gray-800/50 px-3 py-1.5 rounded-lg">
              <Timer className="text-cyan-400 w-5 h-5" />
              <span className="text-xl font-mono">{timeLeft}s</span>
            </div>
            <button
              onClick={startTest}
              className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 rounded-lg transition-all duration-300"
            >
              <RotateCcw className="w-4 h-4" />
              Restart
            </button>
          </div>

          <div className="relative mb-3">
            <div 
              className="font-mono text-base p-4 bg-gray-900/50 rounded-lg border border-gray-700/50 text-gray-300 whitespace-pre-wrap h-[120px] overflow-y-auto typing-text"
            >
              {sampleText.split('').map((char, index) => {
                const userChar = text[index];
                const isCorrect = userChar === char;
                const isCurrent = index === text.length;
                
                return (
                  <span
                    key={index}
                    className={`relative inline-block transition-colors duration-150 ${
                      userChar === undefined
                        ? ''
                        : isCorrect
                        ? 'text-green-400'
                        : 'text-red-400'
                    }`}
                  >
                    {char}
                    {isCurrent && (
                      <span className="absolute top-0 left-0 h-full border-r-2 border-cyan-400 animate-pulse" />
                    )}
                  </span>
                );
              })}
            </div>
            <textarea
              value={text}
              onChange={handleInput}
              className="absolute inset-0 w-full h-full font-mono p-4 bg-transparent text-transparent caret-transparent resize-none focus:outline-none focus:ring-2 focus:ring-cyan-500/50 rounded-lg"
              disabled={completed}
              spellCheck={false}
              autoFocus
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="cyber-card p-3 rounded-lg">
              <div className="text-cyan-400 text-xs mb-1">Words per Minute</div>
              <div className="text-2xl font-bold flex items-center gap-2">
                <Trophy className="w-5 h-5 text-yellow-500" />
                {wpm}
              </div>
            </div>
            <div className="cyber-card p-3 rounded-lg">
              <div className="text-cyan-400 text-xs mb-1">Accuracy</div>
              <div className="text-2xl font-bold flex items-center gap-2">
                <Target className="w-5 h-5 text-green-500" />
                {accuracy}%
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;