// Utility functions for generating math questions offline

export interface Question {
  question: string;
  answer: number | string; // Updated to handle string answers for trigonometry
  options: (number | string)[]; // Updated to handle string options
}

const getRandomNumber = (min: number, max: number): number => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

const shuffleArray = (array: (number | string)[]): (number | string)[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

// Exact trigonometry values from the reference table
const trigonometryTable = {
  0: {
    sin: "0",
    cos: "1", 
    tan: "0",
    cosec: "undefined",
    sec: "1",
    cot: "undefined"
  },
  30: {
    sin: "1/2",
    cos: "√3/2",
    tan: "1/√3", 
    cosec: "2",
    sec: "2/√3",
    cot: "√3"
  },
  45: {
    sin: "√2/2",
    cos: "√2/2",
    tan: "1",
    cosec: "√2", 
    sec: "√2",
    cot: "1"
  },
  60: {
    sin: "√3/2",
    cos: "1/2",
    tan: "√3",
    cosec: "2/√3",
    sec: "2", 
    cot: "1/√3"
  },
  90: {
    sin: "1",
    cos: "0",
    tan: "undefined",
    cosec: "1",
    sec: "undefined",
    cot: "0"
  }
};

// All possible trigonometry values for generating realistic options
const allTrigValues = [
  "0", "1", "1/2", "√2/2", "√3/2", "√3", "1/√3", "2", "2/√3", "√2", "undefined"
];

// Generate comprehensive trigonometry questions
const generateTrigQuestion = () => {
  const angles = [0, 30, 45, 60, 90];
  const functions = ['sin', 'cos', 'tan', 'cosec', 'sec', 'cot'];
  
  const randomAngle = angles[Math.floor(Math.random() * angles.length)];
  const randomFunction = functions[Math.floor(Math.random() * functions.length)];
  
  const question = `${randomFunction} ${randomAngle}° = ?`;
  const answer = trigonometryTable[randomAngle as keyof typeof trigonometryTable][randomFunction as keyof typeof trigonometryTable[0]];
  
  return { question, answer };
};

const generateOptions = (correctAnswer: number | string, operation: string): (number | string)[] => {
  const options = new Set<number | string>();
  options.add(correctAnswer);

  const generateWrongOption = (): number | string => {
    let wrong: number | string;
    
    switch (operation) {
      case 'trigonometry':
        // Generate realistic wrong options from the trigonometry table
        const availableValues = allTrigValues.filter(val => val !== correctAnswer);
        
        // If correct answer is undefined, prefer finite values as wrong options
        if (correctAnswer === "undefined") {
          const finiteValues = availableValues.filter(val => val !== "undefined");
          wrong = finiteValues[Math.floor(Math.random() * finiteValues.length)];
        } else {
          // For finite answers, include a mix of values, sometimes including undefined
          wrong = availableValues[Math.floor(Math.random() * availableValues.length)];
        }
        break;
        
      case 'squares':
        // For squares, generate nearby perfect squares or common mistakes
        const baseNum = Math.sqrt(correctAnswer as number);
        const variations = [
          Math.pow(baseNum - 1, 2),
          Math.pow(baseNum + 1, 2),
          Math.pow(baseNum - 2, 2),
          Math.pow(baseNum + 2, 2),
          baseNum * 10,
          baseNum * baseNum + baseNum
        ];
        wrong = variations[Math.floor(Math.random() * variations.length)];
        break;
        
      case 'cubes':
        // Simplified cubes options - just use variation of the correct answer
        const randomFactor = [0.5, 0.8, 1.2, 1.5, 2, 3][Math.floor(Math.random() * 6)];
        wrong = Math.round((correctAnswer as number) * randomFactor);
        
        // Also add some common mistakes
        const cubeBase = Math.round(Math.pow(correctAnswer as number, 1/3));
        const commonMistakes = [
          cubeBase * cubeBase, // Square instead of cube
          cubeBase * 10, // Base times 10
          (correctAnswer as number) + cubeBase, // Adding base to result
          Math.pow(cubeBase + 1, 3), // Next cube
          Math.pow(cubeBase - 1, 3)  // Previous cube
        ];
        
        if (Math.random() < 0.5) {
          wrong = commonMistakes[Math.floor(Math.random() * commonMistakes.length)];
        }
        break;
        
      default:
        // For other operations, generate numbers within a reasonable range
        const range = Math.max(10, Math.abs((correctAnswer as number) * 0.5));
        wrong = (correctAnswer as number) + getRandomNumber(-range, range);
        if (wrong <= 0 && (correctAnswer as number) > 0) wrong = Math.abs(wrong) + 1;
        break;
    }
    
    return operation === 'trigonometry' ? wrong : Math.round(Math.abs(wrong as number));
  };

  // Safety counter to prevent infinite loops
  let attempts = 0;
  while (options.size < 4 && attempts < 20) {
    const wrongOption = generateWrongOption();
    if (wrongOption !== correctAnswer && (operation === 'trigonometry' || (wrongOption as number) > 0)) {
      options.add(wrongOption);
    }
    attempts++;
  }

  // If we couldn't generate enough options, add some simple variations
  while (options.size < 4) {
    if (operation === 'trigonometry') {
      const remainingValues = allTrigValues.filter(val => !options.has(val));
      if (remainingValues.length > 0) {
        const randomValue = remainingValues[Math.floor(Math.random() * remainingValues.length)];
        options.add(randomValue);
      }
    } else {
      const baseVariation = (correctAnswer as number) + getRandomNumber(-50, 50);
      if (baseVariation > 0 && baseVariation !== correctAnswer) {
        options.add(baseVariation);
      }
    }
  }

  return shuffleArray(Array.from(options));
};

export const generateQuestion = (operation: string, min: number, max: number): Question => {
  let num1: number, num2: number, answer: number | string, questionText: string;

  switch (operation.toLowerCase()) {
    case 'trigonometry':
      // Generate a random trigonometry question using the table
      const trigQ = generateTrigQuestion();
      return {
        question: trigQ.question,
        answer: trigQ.answer,
        options: generateOptions(trigQ.answer, 'trigonometry')
      };

    case 'addition':
      num1 = getRandomNumber(min, max);
      num2 = getRandomNumber(min, max);
      answer = num1 + num2;
      questionText = `${num1} + ${num2} = ?`;
      break;

    case 'subtraction':
      num1 = getRandomNumber(min, max);
      num2 = getRandomNumber(min, Math.min(num1, max));
      answer = num1 - num2;
      questionText = `${num1} - ${num2} = ?`;
      break;

    case 'multiplication':
      num1 = getRandomNumber(min, max);
      num2 = getRandomNumber(min, max);
      answer = num1 * num2;
      questionText = `${num1} × ${num2} = ?`;
      break;

    case 'division':
      // Generate division where divisor and quotient are within user's range
      // Keep the dividend reasonable
      num2 = getRandomNumber(Math.max(2, min), Math.min(max, 20)); // Divisor within user's range but capped
      const quotient = getRandomNumber(Math.max(2, min), max); // Quotient within user's range
      num1 = num2 * quotient; // Dividend = divisor × quotient
      answer = quotient;
      questionText = `${num1} ÷ ${num2} = ?`;
      break;

    case 'squares':
      // Generate numbers from the user's range and square them
      num1 = getRandomNumber(min, max);
      answer = num1 * num1;
      questionText = `${num1}² = ?`;
      break;

    case 'cubes':
      // Generate numbers from the user's range and cube them
      num1 = getRandomNumber(min, max);
      answer = num1 * num1 * num1;
      questionText = `${num1}³ = ?`;
      break;

    case 'mixed':
    case 'daily challenge':
      // Random operation for mixed mode (excluding trigonometry for mixed mode)
      const operations = ['addition', 'subtraction', 'multiplication', 'division', 'squares', 'cubes'];
      const randomOp = operations[Math.floor(Math.random() * operations.length)];
      return generateQuestion(randomOp, min, max);

    default:
      throw new Error(`Unknown operation: ${operation}`);
  }

  const options = generateOptions(answer, operation.toLowerCase());
  
  return {
    question: questionText,
    answer,
    options
  };
};

// Generate multiple questions at once
export function generateQuestions(type: string, count: number, min: number = 1, max: number = 100): Question[] {
  const questions: Question[] = [];
  for (let i = 0; i < count; i++) {
    questions.push(generateQuestion(type, min, max));
  }
  return questions;
}