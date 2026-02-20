/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Delete, Divide, Minus, Plus, X, Equal, RotateCcw, History } from 'lucide-react';

type Operation = '+' | '-' | '*' | '/' | null;

interface HistoryItem {
  expression: string;
  result: string;
}

export default function App() {
  const [display, setDisplay] = useState('0');
  const [equation, setEquation] = useState('');
  const [prevValue, setPrevValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<Operation>(null);
  const [isNewNumber, setIsNewNumber] = useState(true);
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [showHistory, setShowHistory] = useState(false);

  const handleNumber = (num: string) => {
    if (isNewNumber) {
      setDisplay(num);
      setIsNewNumber(false);
    } else {
      setDisplay(display === '0' ? num : display + num);
    }
  };

  const handleDecimal = () => {
    if (isNewNumber) {
      setDisplay('0.');
      setIsNewNumber(false);
    } else if (!display.includes('.')) {
      setDisplay(display + '.');
    }
  };

  const calculate = (first: number, second: number, op: Operation): number => {
    switch (op) {
      case '+': return first + second;
      case '-': return first - second;
      case '*': return first * second;
      case '/': return second !== 0 ? first / second : 0;
      default: return second;
    }
  };

  const handleOperation = (op: Operation) => {
    const current = parseFloat(display);
    
    if (prevValue === null) {
      setPrevValue(current);
      setEquation(`${current} ${op}`);
    } else if (operation) {
      const result = calculate(prevValue, current, operation);
      setPrevValue(result);
      setEquation(`${result} ${op}`);
      setDisplay(String(result));
    }
    
    setOperation(op);
    setIsNewNumber(true);
  };

  const handleEqual = () => {
    if (prevValue === null || !operation) return;
    
    const current = parseFloat(display);
    const result = calculate(prevValue, current, operation);
    
    const newHistoryItem = {
      expression: `${prevValue} ${operation === '*' ? '×' : operation === '/' ? '÷' : operation} ${current}`,
      result: String(result)
    };
    
    setHistory([newHistoryItem, ...history].slice(0, 10));
    setDisplay(String(result));
    setEquation('');
    setPrevValue(null);
    setOperation(null);
    setIsNewNumber(true);
  };

  const clear = () => {
    setDisplay('0');
    setEquation('');
    setPrevValue(null);
    setOperation(null);
    setIsNewNumber(true);
  };

  const deleteLast = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
      setIsNewNumber(true);
    }
  };

  const toggleSign = () => {
    setDisplay(String(parseFloat(display) * -1));
  };

  const handlePercentage = () => {
    setDisplay(String(parseFloat(display) / 100));
  };

  // Keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (/[0-9]/.test(e.key)) handleNumber(e.key);
      if (e.key === '.') handleDecimal();
      if (e.key === '+') handleOperation('+');
      if (e.key === '-') handleOperation('-');
      if (e.key === '*') handleOperation('*');
      if (e.key === '/') handleOperation('/');
      if (e.key === 'Enter' || e.key === '=') handleEqual();
      if (e.key === 'Escape') clear();
      if (e.key === 'Backspace') deleteLast();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [display, prevValue, operation, isNewNumber]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-zinc-50 font-sans" dir="rtl">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl shadow-zinc-200/50 overflow-hidden border border-zinc-100 flex flex-col"
      >
        {/* Header */}
        <div className="p-6 flex justify-between items-center border-b border-zinc-50">
          <h1 className="text-sm font-semibold text-zinc-400 uppercase tracking-widest">حاسبة ذكية</h1>
          <button 
            onClick={() => setShowHistory(!showHistory)}
            className="p-2 hover:bg-zinc-100 rounded-full transition-colors text-zinc-500"
          >
            <History size={20} />
          </button>
        </div>

        {/* Display Area */}
        <div className="p-8 flex flex-col items-end justify-end min-h-[160px] bg-zinc-50/30">
          <AnimatePresence mode="wait">
            <motion.div 
              key={equation}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-zinc-400 text-lg font-mono mb-2 h-7"
            >
              {equation.replace('*', '×').replace('/', '÷')}
            </motion.div>
          </AnimatePresence>
          <motion.div 
            key={display}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="text-6xl font-light tracking-tighter text-zinc-900 font-mono overflow-hidden text-ellipsis w-full text-left"
            dir="ltr"
          >
            {display}
          </motion.div>
        </div>

        {/* Keypad */}
        <div className="p-6 grid grid-cols-4 gap-3 bg-white">
          {/* Row 1 */}
          <CalcButton onClick={clear} className="bg-zinc-100 text-zinc-600 hover:bg-zinc-200">
            <RotateCcw size={20} />
          </CalcButton>
          <CalcButton onClick={toggleSign} className="bg-zinc-100 text-zinc-600 hover:bg-zinc-200">+/-</CalcButton>
          <CalcButton onClick={handlePercentage} className="bg-zinc-100 text-zinc-600 hover:bg-zinc-200">%</CalcButton>
          <CalcButton onClick={() => handleOperation('/')} className="bg-orange-50 text-orange-600 hover:bg-orange-100">
            <Divide size={24} />
          </CalcButton>

          {/* Row 2 */}
          <CalcButton onClick={() => handleNumber('7')}>7</CalcButton>
          <CalcButton onClick={() => handleNumber('8')}>8</CalcButton>
          <CalcButton onClick={() => handleNumber('9')}>9</CalcButton>
          <CalcButton onClick={() => handleOperation('*')} className="bg-orange-50 text-orange-600 hover:bg-orange-100">
            <X size={24} />
          </CalcButton>

          {/* Row 3 */}
          <CalcButton onClick={() => handleNumber('4')}>4</CalcButton>
          <CalcButton onClick={() => handleNumber('5')}>5</CalcButton>
          <CalcButton onClick={() => handleNumber('6')}>6</CalcButton>
          <CalcButton onClick={() => handleOperation('-')} className="bg-orange-50 text-orange-600 hover:bg-orange-100">
            <Minus size={24} />
          </CalcButton>

          {/* Row 4 */}
          <CalcButton onClick={() => handleNumber('1')}>1</CalcButton>
          <CalcButton onClick={() => handleNumber('2')}>2</CalcButton>
          <CalcButton onClick={() => handleNumber('3')}>3</CalcButton>
          <CalcButton onClick={() => handleOperation('+')} className="bg-orange-50 text-orange-600 hover:bg-orange-100">
            <Plus size={24} />
          </CalcButton>

          {/* Row 5 */}
          <CalcButton onClick={() => handleNumber('0')} className="col-span-1">0</CalcButton>
          <CalcButton onClick={handleDecimal}>.</CalcButton>
          <CalcButton onClick={deleteLast} className="bg-zinc-50 text-zinc-400 hover:bg-zinc-100">
            <Delete size={20} />
          </CalcButton>
          <CalcButton onClick={handleEqual} className="bg-orange-500 text-white hover:bg-orange-600 shadow-lg shadow-orange-200">
            <Equal size={24} />
          </CalcButton>
        </div>

        {/* History Overlay */}
        <AnimatePresence>
          {showHistory && (
            <motion.div 
              initial={{ opacity: 0, y: '100%' }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: '100%' }}
              className="absolute inset-0 bg-white z-10 flex flex-col"
            >
              <div className="p-6 flex justify-between items-center border-b border-zinc-100">
                <h2 className="text-lg font-semibold text-zinc-800">السجل</h2>
                <button 
                  onClick={() => setShowHistory(false)}
                  className="p-2 hover:bg-zinc-100 rounded-full transition-colors"
                >
                  <X size={20} />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-6 space-y-4">
                {history.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-zinc-400 space-y-2">
                    <History size={48} strokeWidth={1} />
                    <p>لا يوجد عمليات سابقة</p>
                  </div>
                ) : (
                  history.map((item, i) => (
                    <motion.div 
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="text-left border-b border-zinc-50 pb-4"
                      dir="ltr"
                    >
                      <div className="text-zinc-400 text-sm mb-1">{item.expression} =</div>
                      <div className="text-zinc-800 text-xl font-mono">{item.result}</div>
                    </motion.div>
                  ))
                )}
              </div>
              {history.length > 0 && (
                <div className="p-6 border-t border-zinc-100">
                  <button 
                    onClick={() => setHistory([])}
                    className="w-full py-3 text-zinc-500 hover:text-red-500 transition-colors text-sm font-medium"
                  >
                    مسح السجل
                  </button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

function CalcButton({ 
  children, 
  onClick, 
  className = "", 
  colSpan = 1 
}: { 
  children: React.ReactNode; 
  onClick: () => void; 
  className?: string;
  colSpan?: number;
}) {
  return (
    <motion.button
      whileTap={{ scale: 0.92 }}
      onClick={onClick}
      className={`
        h-16 flex items-center justify-center rounded-2xl text-xl font-medium transition-all
        ${className || "bg-zinc-50 text-zinc-800 hover:bg-zinc-100"}
        ${colSpan > 1 ? `col-span-${colSpan}` : ""}
      `}
    >
      {children}
    </motion.button>
  );
}
