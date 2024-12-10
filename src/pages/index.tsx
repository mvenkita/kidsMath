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

  // Toggle sound on/off
  const toggleSound = () => {
    setIsSoundEnabled(prev => !prev);
  };

  // Initialize first problem on component mount
  useEffect(() => {
    generateNewProblem();
  }, []);

  const [secret, setSecret] = useState("");
  const [primeNum, setPrimeNum] = useState("");
  const [shares, setShares] = useState([]);
  const [coefficients, setCoefficients] = useState([]);
  const [evaluations, setEvaluations] = useState([]);//<number[] | null>(null);
  const [leafValues, setLeafValues] = useState(['', '', '', '', '', '', '', '']);
  const [highlightedNodes, setHighlightedNodes] = useState(new Set());

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
  const computeSHA256 = async (input) => {
    if (!input) return '';
    
    try {
      const encoder = new TextEncoder();
      const data = encoder.encode(input);
      
      const hashBuffer = await crypto.subtle.digest('SHA-256', data);
      
      const hashArray = Array.from(new Uint8Array(hashBuffer));
      const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
      
      return hashHex;
    } catch (error) {
      console.error('Hashing failed:', error);
      return '';
    }
  };

  // Pure JavaScript SHA256 implementation
  const sha256 = (input) => {
    // Helper functions for SHA256
    const rotr = (n, x) => (x >>> n) | (x << (32 - n));
    const ch = (x, y, z) => (x & y) ^ (~x & z);
    const maj = (x, y, z) => (x & y) ^ (x & z) ^ (y & z);
    const sigma0 = (x) => rotr(2, x) ^ rotr(13, x) ^ rotr(22, x);
    const sigma1 = (x) => rotr(6, x) ^ rotr(11, x) ^ rotr(25, x);
    const gamma0 = (x) => rotr(7, x) ^ rotr(18, x) ^ (x >>> 3);
    const gamma1 = (x) => rotr(17, x) ^ rotr(19, x) ^ (x >>> 10);

    // Initial hash values
    let h0 = 0x6a09e667, h1 = 0xbb67ae85, h2 = 0x3c6ef372, h3 = 0xa54ff53a;
    let h4 = 0x510e527f, h5 = 0x9b05688c, h6 = 0x1f83d9ab, h7 = 0x5be0cd19;

    // Constants
    const k = [
      0x428a2f98, 0x71374491, 0xb5c0fbcf, 0xe9b5dba5, 0x3956c25b, 0x59f111f1, 0x923f82a4, 0xab1c5ed5,
      0xd807aa98, 0x12835b01, 0x243185be, 0x550c7dc3, 0x72be5d74, 0x80deb1fe, 0x9bdc06a7, 0xc19bf174,
      0xe49b69c1, 0xefbe4786, 0x0fc19dc6, 0x240ca1cc, 0x2de92c6f, 0x4a7484aa, 0x5cb0a9dc, 0x76f988da,
      0x983e5152, 0xa831c66d, 0xb00327c8, 0xbf597fc7, 0xc6e00bf3, 0xd5a79147, 0x06ca6351, 0x14292967,
      0x27b70a85, 0x2e1b2138, 0x4d2c6dfc, 0x53380d13, 0x650a7354, 0x766a0abb, 0x81c2c92e, 0x92722c85,
      0xa2bfe8a1, 0xa81a664b, 0xc24b8b70, 0xc76c51a3, 0xd192e819, 0xd6990624, 0xf40e3585, 0x106aa070,
      0x19a4c116, 0x1e376c08, 0x2748774c, 0x34b0bcb5, 0x391c0cb3, 0x4ed8aa4a, 0x5b9cca4f, 0x682e6ff3,
      0x748f82ee, 0x78a5636f, 0x84c87814, 0x8cc70208, 0x90befffa, 0xa4506ceb, 0xbef9a3f7, 0xc67178f2
    ];

    // Prepare input
    const msg = input || '';
    const msgLen = msg.length;
    const wordLen = 8;
    const byteLen = wordLen * 4;
    
    // Padding
    const paddedMsg = msg + String.fromCharCode(0x80);
    const zeroPadding = new Array(
      64 - ((msgLen + 9) % 64)
    ).fill(String.fromCharCode(0)).join('');
    
    const fullMsg = paddedMsg + zeroPadding + 
      String.fromCharCode(
        (msgLen >>> 24) & 0xFF,
        (msgLen >>> 16) & 0xFF,
        (msgLen >>> 8) & 0xFF,
        msgLen & 0xFF
      );

    // Process message in 64-byte chunks
    for (let i = 0; i < fullMsg.length; i += 64) {
      const chunk = fullMsg.slice(i, i + 64);
      const w = new Array(64).fill(0);
      
      // Prepare message schedule
      for (let j = 0; j < 16; j++) {
        w[j] = (chunk.charCodeAt(j * 4) << 24) |
               (chunk.charCodeAt(j * 4 + 1) << 16) |
               (chunk.charCodeAt(j * 4 + 2) << 8) |
               chunk.charCodeAt(j * 4 + 3);
      }

      for (let j = 16; j < 64; j++) {
        const s0 = gamma0(w[j - 15]);
        const s1 = gamma1(w[j - 2]);
        w[j] = (w[j - 16] + s0 + w[j - 7] + s1) & 0xFFFFFFFF;
      }

      // Working variables
      let [a, b, c, d, e, f, g, h] = 
        [h0, h1, h2, h3, h4, h5, h6, h7];

      // Main loop
      for (let j = 0; j < 64; j++) {
        const S1 = sigma1(e);
        const ch_result = ch(e, f, g);
        const temp1 = (h + S1 + ch_result + k[j] + w[j]) & 0xFFFFFFFF;
        const S0 = sigma0(a);
        const maj_result = maj(a, b, c);
        const temp2 = (S0 + maj_result) & 0xFFFFFFFF;

        h = g;
        g = f;
        f = e;
        e = (d + temp1) & 0xFFFFFFFF;
        d = c;
        c = b;
        b = a;
        a = (temp1 + temp2) & 0xFFFFFFFF;
      }

      // Update hash values
      h0 = (h0 + a) & 0xFFFFFFFF;
      h1 = (h1 + b) & 0xFFFFFFFF;
      h2 = (h2 + c) & 0xFFFFFFFF;
      h3 = (h3 + d) & 0xFFFFFFFF;
      h4 = (h4 + e) & 0xFFFFFFFF;
      h5 = (h5 + f) & 0xFFFFFFFF;
      h6 = (h6 + g) & 0xFFFFFFFF;
      h7 = (h7 + h) & 0xFFFFFFFF;
    }

    // Convert to hex string
    const toHex = (num) => {
      return num.toString(16).padStart(8, '0');
    };

    return [h0, h1, h2, h3, h4, h5, h6, h7]
      .map(toHex)
      .join('');
  };

  // Compute node values recursively
  const computeNodeValue = (index) => {
    if (index >= 7) {
      return leafValues[index - 7] || '';
    }
    const leftChild = computeNodeValue(2 * index + 1);
    const rightChild = computeNodeValue(2 * index + 2);
    return leftChild || rightChild 
      ? sha256(leftChild + rightChild) 
      : '';
  };

  // Update leaf and trigger highlighting
  const updateLeaf = (index, value) => {
    const newLeafValues = [...leafValues];
    newLeafValues[index] = value;
    setLeafValues(newLeafValues);

    // Highlight path from leaf to root
    const highlightPath = new Set();
    let currentIndex = index + 7;
    while (currentIndex > 0) {
      highlightPath.add(currentIndex);
      currentIndex = Math.floor((currentIndex - 1) / 2);
    }
    highlightPath.add(0); // Add root
    setHighlightedNodes(highlightPath);

    // Reset highlighting after 5 seconds
    setTimeout(() => {
      setHighlightedNodes(new Set());
    }, 5000);
  };


  const generateShares = () => {
    const secretNumber = parseInt(secret, 10);
    const pp = parseInt(primeNum, 10);

    if (isNaN(secretNumber) || secretNumber <= 0) {
      alert("Please enter a valid positive number as the secret.");
      return;
    }

    // Generate random coefficients for the polynomial
    const coeffs = [
      secretNumber, // Constant term (secret)
      ...Array(3)
        .fill(0)
        .map(() => Math.floor(Math.random() * 100) % pp), // Random coefficients for degree 3 polynomial
    ];

    setCoefficients(coeffs);

    // Generate 6 shares using Shamir's Secret Sharing
    // const points = shamir.split(generateRandomUint8Array, 6, 3, secretNumber); // 6 shares, 3 required to reconstruct
    const evaluatePolynomial = (coeff: number[], x: number): number => {
    return coeff.reduce((acc, coef, index) => (acc + coef * Math.pow(x, index))%pp, 0);
    };
    const results = Array.from({ length: 7 }, (_, x) => evaluatePolynomial(coeffs, x));
    setEvaluations(results);
  };
  // Node rendering function
  const renderNode = (index) => {
    const value = computeNodeValue(index);
    const isLeaf = index >= 7;
    const isHighlighted = highlightedNodes.has(index);

    return (
      <div
        key={index}
        className={`
          flex flex-col items-center
          ${isHighlighted ? 'bg-yellow-200' : 'bg-white'}
          border border-black p-2 rounded
          ${isLeaf ? 'w-24' : 'w-48'}
        `}
      >
        {isLeaf ? (
          <input
            type="text"
            value={leafValues[index - 7]}
            onChange={(e) => updateLeaf(index - 7, e.target.value)}
            placeholder="Enter value"
            className="border p-1 w-full"
          />
        ) : (
          <div className="text-center break-words w-full">{value}</div>
        )}
      </div>
    );
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold text-center mb-6">Modules</h1>
      
      <Tabs defaultValue="modular-arithmetic" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="modular-arithmetic">Modular Arithmetic</TabsTrigger>
          <TabsTrigger value="sha256-hash">SHA256 Hash</TabsTrigger>
          <TabsTrigger value="merkle">Merkle Tree</TabsTrigger>
          <TabsTrigger value="shamir">Secret Sharing</TabsTrigger>
        </TabsList>
        
        <TabsContent value="modular-arithmetic">
      <audio ref={correctSoundRef} src="/api/sounds/correct.mp3" preload="auto" />
      <audio ref={incorrectSoundRef} src="/api/sounds/incorrect.mp3" preload="auto" />

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
          <Card>
            <CardHeader>
              <CardTitle>SHA256 Hash Generator</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <Input 
                  placeholder="Enter string to hash" 
                  value={inputString}
                  onChange={(e) => setInputString(e.target.value)}
                />
                
                <Button 
                  onClick={calculateSHA256} 
                  className="w-full"
                >
                  Generate Hash
                </Button>
                
                {hashedOutput && (
                  <div className="break-words">
                    <strong>Hash:</strong> 
                    <span className="block bg-gray-100 p-2 rounded mt-2">
                      {hashedOutput}
                    </span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
       
        <TabsContent value="merkle">
          <Card>
            <CardHeader>
              <CardTitle>Merkle Tree</CardTitle>
            </CardHeader>
            <CardContent>
            <div className="flex flex-col items-center p-4 space-y-4">
              <h2 className="text-xl font-bold">Merkle Tree Visualization</h2>
              <div className="flex flex-col items-center space-y-4">
                {/* Root */}
                <div className="flex justify-center">{renderNode(0)}</div>

                {/* Second Level */}
                <div className="flex space-x-4">
                  {renderNode(1)}
                  {renderNode(2)}
                </div>

                {/* Third Level */}
                <div className="flex space-x-8">
                  {renderNode(3)}
                  {renderNode(4)}
                  {renderNode(5)}
                  {renderNode(6)}
                </div>

                {/* Leaves */}
                <div className="flex space-x-16">
                  {[7, 8, 9, 10, 11, 12, 13, 14].map(renderNode)}
                </div>
              </div>
            </div>
            </CardContent>
          </Card>
        </TabsContent>

          <TabsContent value="shamir">
      <Card className="max-w-md mx-auto mt-10">
      <CardHeader>
        <CardTitle>Shamir's Secret Sharing</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <label className="block text-sm font-medium mb-1">Enter Secret (Number):</label>
          <Input
            type="number"
            value={secret}
            onChange={(e) => setSecret(e.target.value)}
            placeholder="Enter a secret number"
          />
        </div>
      </CardContent>
      <CardContent>
        <div className="space-y-4">
          <label className="block text-sm font-medium mb-1">Enter Prime (Number):</label>
          <Input
            type="number"
            value={primeNum}
            onChange={(e) => setPrimeNum(e.target.value)}
            placeholder="Enter a prime number"
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={generateShares} className="w-full">
          Generate Shares
        </Button>
      </CardFooter>
        <CardContent>
          <h3 className="text-lg font-semibold">Polynomial Coefficients:</h3>
          <ul className="list-disc pl-5">
            {coefficients.map((coef, idx) => (
              <li key={idx}>
                Coefficient of x^{idx}: {coef}
              </li>
            ))}
          </ul>
          <h3 className="text-lg font-semibold mt-4">Shares:</h3>
          <ul className="list-disc pl-5">
            {evaluations.map((share, idx) => (
              <li key={idx}>
                Server {idx + 1}'s share is {share}. This is p({idx}).
              </li>
            ))}
          </ul>
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
