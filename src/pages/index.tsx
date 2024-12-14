import React, { useState, useRef, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import shamir from "shamir";
import { Volume2, VolumeX } from 'lucide-react';

const ModularApp = () => {
  const [num1, setNum1] = useState(0);
  const [num2, setNum2] = useState(0);
  const [userAnswer, setUserAnswer] = useState('');
  const [feedback, setFeedback] = useState('');
  const [score, setScore] = useState(0);
  const [totalQuestions, setTotalQuestions] = useState(0);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);

  // Sound effect references
  const correctSoundRef = useRef(null);
  const incorrectSoundRef = useRef(null);

  const generateNewProblem = () => {
    const newNum1 = Math.floor(Math.random() * 10);
    const newNum2 = Math.floor(Math.random() * 10);
    setNum1(newNum1);
    setNum2(newNum2);
    setUserAnswer('');
    setFeedback('');
  };

  const checkAnswer = () => {
    const correctAnswer = num1 + num2;
    const parsedUserAnswer = parseInt(userAnswer);

    setTotalQuestions(prev => prev + 1);

    if (parsedUserAnswer === correctAnswer) {
      setFeedback('Correct! 🎉');
      setScore(prev => prev + 1);
      
      // Play correct sound if enabled
      if (isSoundEnabled && correctSoundRef.current) {
        correctSoundRef.current.currentTime = 0;
        correctSoundRef.current.play();
      }
    } else {
      setFeedback(`Incorrect. The correct answer is ${correctAnswer}. Try again! 🤔`);
      
      // Play incorrect sound if enabled
      if (isSoundEnabled && incorrectSoundRef.current) {
        incorrectSoundRef.current.currentTime = 0;
        incorrectSoundRef.current.play();
      }
    }
  };
  const [minuend, setMinuend] = useState(0);
  const [subtrahend, setSubtrahend] = useState(0);
  //const [userAnswer, setUserAnswer] = useState('');
  //const [feedback, setFeedback] = useState('');
  //const [score, setScore] = useState(0);
  //const [totalQuestions, setTotalQuestions] = useState(0);
  //const [isSoundEnabled, setIsSoundEnabled] = useState(true);


  const generateNewSubProblem = () => {
    // Minuend between 0 and 19
    const newMinuend = Math.floor(Math.random() * 20);
    // Subtrahend between 0 and 9
    const newSubtrahend = Math.floor(Math.random() * 10);
    
    // Ensure subtrahend is not larger than minuend
    const adjustedMinuend = Math.max(newMinuend, newSubtrahend);
    const adjustedSubtrahend = Math.min(newMinuend, newSubtrahend);

    setMinuend(adjustedMinuend);
    setSubtrahend(adjustedSubtrahend);
    setUserAnswer('');
    setFeedback('');
  };

  const checkSubAnswer = () => {
    const correctAnswer = minuend - subtrahend;
    const parsedUserAnswer = parseInt(userAnswer);

    setTotalQuestions(prev => prev + 1);

    if (parsedUserAnswer === correctAnswer) {
      setFeedback('Correct! 🎉');
      setScore(prev => prev + 1);
      
      // Play correct sound if enabled
      if (isSoundEnabled && correctSoundRef.current) {
        correctSoundRef.current.currentTime = 0;
        correctSoundRef.current.play();
      }
    } else {
      setFeedback(`Incorrect. The correct answer is ${correctAnswer}. Try again! 🤔`);
      
      // Play incorrect sound if enabled
      if (isSoundEnabled && incorrectSoundRef.current) {
        incorrectSoundRef.current.currentTime = 0;
        incorrectSoundRef.current.play();
      }
    }
  };

  // Toggle sound on/off
  const toggleSound = () => {
    setIsSoundEnabled(prev => !prev);
  };

  // Initialize first problem on component mount
  useEffect(() => {
    generateNewProblem();
  }, []);

  // Toggle sound on/off
  const toggleSound = () => {
    setIsSoundEnabled(prev => !prev);
  };

  // Initialize first problem on component mount
  useEffect(() => {
    generateNewProblem();
  }, []);


  // SHA256 Hashing State
  const [inputString, setInputString] = useState('');
  const [hashedOutput, setHashedOutput] = useState('');

  // SHA256 Hashing Function
  const calculateSHA256 = async () => {
    if (!inputString) {
      setHashedOutput('');
      return;
    }

    try {
      // Convert string to UTF-8 encoded Uint8Array
      const encoder = new TextEncoder();
      const data = encoder.encode(inputString);

      // Hash the data using Web Crypto API
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);

      // Convert buffer to hex string
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');

      setHashedOutput(hashHex);
    } catch (error) {
      console.error('Hashing error:', error);
      setHashedOutput('Error generating hash');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Modules</h1>
      
      <Tabs defaultValue="modular-arithmetic" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="modular-arithmetic">Addition</TabsTrigger>
          <TabsTrigger value="subtraction">Subtraction</TabsTrigger>
        </TabsList>
        
        <TabsContent value="modular-arithmetic">
      <audio ref={correctSoundRef} src="https://github.com/mvenkita/kidsMath/blob/main/api/sounds/correct.mp3?raw=true" preload="auto" />
      <audio ref={incorrectSoundRef} src="https://github.com/mvenkita/kidsMath/blob/main/api/sounds/incorrect.mp3?raw=true" preload="auto" />

      <Card className="w-full max-w-md mx-auto mt-10">
        <CardHeader className="relative">
          <CardTitle className="text-center">Addition Practice</CardTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSound} 
            className="absolute right-0 top-1/2 -translate-y-1/2"
          >
            {isSoundEnabled ? <Volume2 /> : <VolumeX />}
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center text-2xl font-bold">
              {num1} + {num2} = ?
            </div>

            <Input 
              type="number" 
              value={userAnswer} 
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Enter your answer"
              className="text-center text-xl"
            />

            <div className="flex space-x-4">
              <Button 
                onClick={checkAnswer} 
                className="w-full"
                variant="default"
              >
                Check Answer
              </Button>
              <Button 
                onClick={generateNewProblem} 
                className="w-full"
                variant="secondary"
              >
                Next Problem
              </Button>
            </div>

            {feedback && (
              <div className={`text-center text-xl font-semibold ${
                feedback.includes('Correct') ? 'text-green-600' : 'text-red-600'
              }`}>
                {feedback}
              </div>
            )}

            <div className="text-center text-lg">
              Score: {score} / {totalQuestions}
            </div>
          </div>
        </CardContent>
      </Card>
        </TabsContent>
 
        <TabsContent value="sha256-hash">
    <Card className="w-full max-w-md mx-auto mt-10">
        <CardHeader className="relative">
          <CardTitle className="text-center">Subtraction Practice</CardTitle>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleSound} 
            className="absolute right-0 top-1/2 -translate-y-1/2"
          >
            {isSoundEnabled ? <Volume2 /> : <VolumeX />}
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-center text-2xl font-bold">
              {minuend} - {subtrahend} = ?
            </div>

            <Input 
              type="number" 
              value={userAnswer} 
              onChange={(e) => setUserAnswer(e.target.value)}
              placeholder="Enter your answer"
              className="text-center text-xl"
            />

            <div className="flex space-x-4">
              <Button 
                onClick={checkSubAnswer} 
                className="w-full"
                variant="default"
              >
                Check Answer
              </Button>
              <Button 
                onClick={generateNewSubProblem} 
                className="w-full"
                variant="secondary"
              >
                Next Problem
              </Button>
            </div>

            {feedback && (
              <div className={`text-center text-xl font-semibold ${
                feedback.includes('Correct') ? 'text-green-600' : 'text-red-600'
              }`}>
                {feedback}
              </div>
            )}

            <div className="text-center text-lg">
              Score: {score} / {totalQuestions}
            </div>
          </div>
        </CardContent>
      </Card>
        </TabsContent>
          
        </Tabs>
      
      <footer className="text-center text-sm text-gray-500 mt-6">
        © 2024 Ligero Inc.
      </footer>
    </div>
  );
};

export default ModularApp;
