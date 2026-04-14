"use client";

import { useState, useCallback } from "react";

export default function Calculator() {
  const [display, setDisplay] = useState("0");
  const [prevValue, setPrevValue] = useState<number | null>(null);
  const [operator, setOperator] = useState<string | null>(null);
  const [resetNext, setResetNext] = useState(false);

  const handleNumber = useCallback((num: string) => {
    setDisplay((prev) => {
      if (resetNext) {
        setResetNext(false);
        return num;
      }
      return prev === "0" ? num : prev + num;
    });
  }, [resetNext]);

  const handleOperator = useCallback((op: string) => {
    const current = parseFloat(display);
    if (prevValue !== null && operator) {
      let result = prevValue;
      switch (operator) {
        case "+": result = prevValue + current; break;
        case "-": result = prevValue - current; break;
        case "×": result = prevValue * current; break;
        case "÷": result = current !== 0 ? prevValue / current : 0; break;
      }
      setDisplay(String(result));
      setPrevValue(result);
    } else {
      setPrevValue(current);
    }
    setOperator(op);
    setResetNext(true);
  }, [display, prevValue, operator]);

  const handleEquals = useCallback(() => {
    if (prevValue === null || !operator) return;
    const current = parseFloat(display);
    let result = prevValue;
    switch (operator) {
      case "+": result = prevValue + current; break;
      case "-": result = prevValue - current; break;
      case "×": result = prevValue * current; break;
      case "÷": result = current !== 0 ? prevValue / current : 0; break;
    }
    setDisplay(String(result));
    setPrevValue(null);
    setOperator(null);
    setResetNext(true);
  }, [display, prevValue, operator]);

  const handleClear = useCallback(() => {
    setDisplay("0");
    setPrevValue(null);
    setOperator(null);
    setResetNext(false);
  }, []);

  const handlePercent = useCallback(() => {
    setDisplay((prev) => String(parseFloat(prev) / 100));
  }, []);

  const handleToggleSign = useCallback(() => {
    setDisplay((prev) => String(-parseFloat(prev)));
  }, []);

  const handleDecimal = useCallback(() => {
    setDisplay((prev) => (prev.includes(".") ? prev : prev + "."));
  }, []);

  const handleBackspace = useCallback(() => {
    setDisplay((prev) => prev.length > 1 ? prev.slice(0, -1) : "0");
  }, []);

  const Button = ({ label, onClick, className = "" }: { label: string; onClick: () => void; className?: string }) => (
    <button
      onClick={onClick}
      className={`h-12 rounded-xl text-base font-medium transition-all active:scale-95 ${className}`}
    >
      {label}
    </button>
  );

  return (
    <div className="h-full flex flex-col bg-zinc-900 p-3">
      {/* Display */}
      <div className="mb-3 p-4 bg-zinc-800/50 rounded-xl text-right">
        {operator && <div className="text-xs text-zinc-500 mb-1">{prevValue} {operator}</div>}
        <div className="text-3xl font-light text-white truncate">{display}</div>
      </div>

      {/* Buttons */}
      <div className="flex-1 grid grid-cols-4 gap-1.5">
        <Button label="AC" onClick={handleClear} className="bg-zinc-700 text-zinc-200 hover:bg-zinc-600" />
        <Button label="+/-" onClick={handleToggleSign} className="bg-zinc-700 text-zinc-200 hover:bg-zinc-600" />
        <Button label="%" onClick={handlePercent} className="bg-zinc-700 text-zinc-200 hover:bg-zinc-600" />
        <Button label="÷" onClick={() => handleOperator("÷")} className="bg-orange-500 text-white hover:bg-orange-400" />

        <Button label="7" onClick={() => handleNumber("7")} className="bg-zinc-800 text-zinc-200 hover:bg-zinc-700" />
        <Button label="8" onClick={() => handleNumber("8")} className="bg-zinc-800 text-zinc-200 hover:bg-zinc-700" />
        <Button label="9" onClick={() => handleNumber("9")} className="bg-zinc-800 text-zinc-200 hover:bg-zinc-700" />
        <Button label="×" onClick={() => handleOperator("×")} className="bg-orange-500 text-white hover:bg-orange-400" />

        <Button label="4" onClick={() => handleNumber("4")} className="bg-zinc-800 text-zinc-200 hover:bg-zinc-700" />
        <Button label="5" onClick={() => handleNumber("5")} className="bg-zinc-800 text-zinc-200 hover:bg-zinc-700" />
        <Button label="6" onClick={() => handleNumber("6")} className="bg-zinc-800 text-zinc-200 hover:bg-zinc-700" />
        <Button label="-" onClick={() => handleOperator("-")} className="bg-orange-500 text-white hover:bg-orange-400" />

        <Button label="1" onClick={() => handleNumber("1")} className="bg-zinc-800 text-zinc-200 hover:bg-zinc-700" />
        <Button label="2" onClick={() => handleNumber("2")} className="bg-zinc-800 text-zinc-200 hover:bg-zinc-700" />
        <Button label="3" onClick={() => handleNumber("3")} className="bg-zinc-800 text-zinc-200 hover:bg-zinc-700" />
        <Button label="+" onClick={() => handleOperator("+")} className="bg-orange-500 text-white hover:bg-orange-400" />

        <Button label="⌫" onClick={handleBackspace} className="bg-zinc-800 text-zinc-200 hover:bg-zinc-700" />
        <Button label="0" onClick={() => handleNumber("0")} className="bg-zinc-800 text-zinc-200 hover:bg-zinc-700" />
        <Button label="." onClick={handleDecimal} className="bg-zinc-800 text-zinc-200 hover:bg-zinc-700" />
        <Button label="=" onClick={handleEquals} className="bg-blue-600 text-white hover:bg-blue-500" />
      </div>
    </div>
  );
}
