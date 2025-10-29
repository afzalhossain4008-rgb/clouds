
import React, { useState } from 'react';
import { CalcButton } from './CalcButton';

interface CalculatorProps {
  onResultChange: (result: string) => void;
}

export const Calculator: React.FC<CalculatorProps> = ({ onResultChange }) => {
  const [displayValue, setDisplayValue] = useState('0');
  const [firstOperand, setFirstOperand] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [waitingForSecondOperand, setWaitingForSecondOperand] = useState(false);

  const inputDigit = (digit: string) => {
    if (waitingForSecondOperand) {
      setDisplayValue(digit);
      setWaitingForSecondOperand(false);
    } else {
      setDisplayValue(displayValue === '0' ? digit : displayValue + digit);
    }
  };

  const inputDecimal = () => {
    if (waitingForSecondOperand) {
      setDisplayValue('0.');
      setWaitingForSecondOperand(false);
      return;
    }
    if (!displayValue.includes('.')) {
      setDisplayValue(displayValue + '.');
    }
  };

  const clearAll = () => {
    setDisplayValue('0');
    setFirstOperand(null);
    setOperator(null);
    setWaitingForSecondOperand(false);
    onResultChange('0');
  };

  const performOperation = (nextOperator: string) => {
    const inputValue = parseFloat(displayValue);

    if (operator && waitingForSecondOperand) {
      setOperator(nextOperator);
      return;
    }

    if (firstOperand === null) {
      setFirstOperand(inputValue);
    } else if (operator) {
      const result = calculate(firstOperand, inputValue, operator);
      const resultStr = String(parseFloat(result.toPrecision(15)));
      setDisplayValue(resultStr);
      setFirstOperand(result);
      onResultChange(resultStr);
    }

    setWaitingForSecondOperand(true);
    setOperator(nextOperator);
  };
  
  const handleEquals = () => {
    if (operator && firstOperand !== null) {
      const inputValue = parseFloat(displayValue);
      const result = calculate(firstOperand, inputValue, operator);
      const resultStr = String(parseFloat(result.toPrecision(15)));
      setDisplayValue(resultStr);
      setFirstOperand(null); // Reset for new calculation
      setOperator(null);
      setWaitingForSecondOperand(false);
      onResultChange(resultStr);
    }
  };

  const calculate = (first: number, second: number, op: string): number => {
    switch (op) {
      case '+': return first + second;
      case '-': return first - second;
      case '*': return first * second;
      case '/': return first / second;
      default: return second;
    }
  };
  
  const toggleSign = () => {
      setDisplayValue(String(parseFloat(displayValue) * -1));
  };
  
  const inputPercent = () => {
      const currentValue = parseFloat(displayValue);
      setDisplayValue(String(currentValue / 100));
  }

  return (
    <div className="bg-gray-800 rounded-3xl p-4 sm:p-6 shadow-2xl w-full max-w-sm mx-auto">
      <div className="bg-gray-900 rounded-2xl text-right p-6 mb-4 overflow-x-auto">
        <p className="text-5xl font-light text-white break-words">{displayValue}</p>
      </div>
      <div className="grid grid-cols-4 gap-2 sm:gap-4">
        <CalcButton onClick={clearAll} variant="special">AC</CalcButton>
        <CalcButton onClick={toggleSign} variant="special">+/-</CalcButton>
        <CalcButton onClick={inputPercent} variant="special">%</CalcButton>
        <CalcButton onClick={() => performOperation('/')} variant="operator">/</CalcButton>
        
        <CalcButton onClick={() => inputDigit('7')}>7</CalcButton>
        <CalcButton onClick={() => inputDigit('8')}>8</CalcButton>
        <CalcButton onClick={() => inputDigit('9')}>9</CalcButton>
        <CalcButton onClick={() => performOperation('*')} variant="operator">x</CalcButton>

        <CalcButton onClick={() => inputDigit('4')}>4</CalcButton>
        <CalcButton onClick={() => inputDigit('5')}>5</CalcButton>
        <CalcButton onClick={() => inputDigit('6')}>6</CalcButton>
        <CalcButton onClick={() => performOperation('-')} variant="operator">-</CalcButton>
        
        <CalcButton onClick={() => inputDigit('1')}>1</CalcButton>
        <CalcButton onClick={() => inputDigit('2')}>2</CalcButton>
        <CalcButton onClick={() => inputDigit('3')}>3</CalcButton>
        <CalcButton onClick={() => performOperation('+')} variant="operator">+</CalcButton>

        <CalcButton onClick={() => inputDigit('0')} className="col-span-2">0</CalcButton>
        <CalcButton onClick={inputDecimal}>.</CalcButton>
        <CalcButton onClick={handleEquals} variant="operator">=</CalcButton>
      </div>
    </div>
  );
};
