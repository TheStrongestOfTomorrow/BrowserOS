"use client";

import { useState, useCallback } from "react";

const BUTTONS = [
  ["C", "±", "%", "÷"],
  ["7", "8", "9", "×"],
  ["4", "5", "6", "-"],
  ["1", "2", "3", "+"],
  ["0", ".", "="],
];

export default function Calculator() {
  const [display, setDisplay] = useState("0");
  const [prevValue, setPrevValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [waitingForOperand, setWaitingForOperand] = useState(false);

  const calculate = useCallback((firstOperand: number, secondOperand: number, op: string) => {
    switch (op) {
      case "+": return firstOperand + secondOperand;
      case "-": return firstOperand - secondOperand;
      case "×": return firstOperand * secondOperand;
      case "÷": return firstOperand / secondOperand;
      default: return secondOperand;
    }
  }, []);

  const handleInput = useCallback((val: string) => {
    if (/[0-9]/.test(val)) {
      if (waitingForOperand) {
        setDisplay(val);
        setWaitingForOperand(false);
      } else {
        setDisplay(display === "0" ? val : display + val);
      }
    } else if (val === ".") {
      if (waitingForOperand) {
        setDisplay("0.");
        setWaitingForOperand(false);
      } else if (!display.includes(".")) {
        setDisplay(display + ".");
      }
    } else if (val === "C") {
      setDisplay("0");
      setPrevValue(null);
      setOperation(null);
      setWaitingForOperand(false);
    } else if (val === "±") {
      setDisplay((parseFloat(display) * -1).toString());
    } else if (val === "%") {
      setDisplay((parseFloat(display) / 100).toString());
    } else if (["+", "-", "×", "÷"].includes(val)) {
      const currentVal = parseFloat(display);
      if (prevValue === null) {
        setPrevValue(currentVal);
      } else if (operation) {
        const result = calculate(prevValue, currentVal, operation);
        setPrevValue(result);
        setDisplay(result.toString());
      }
      setWaitingForOperand(true);
      setOperation(val);
    } else if (val === "=") {
      const currentVal = parseFloat(display);
      if (prevValue !== null && operation) {
        const result = calculate(prevValue, currentVal, operation);
        setDisplay(result.toString());
        setPrevValue(null);
        setOperation(null);
        setWaitingForOperand(true);
      }
    }
  }, [calculate, display, operation, prevValue, waitingForOperand]);

  return (
    <div className="h-full flex flex-col bg-black text-white p-4 select-none">
      <div className="flex-1 flex flex-col justify-end pb-4">
        <div className="text-right text-zinc-500 text-sm mb-1 h-5">
          {prevValue !== null && `${prevValue} ${operation || ""}`}
        </div>
        <div className="text-right text-5xl font-light tracking-tight truncate">
          {display}
        </div>
      </div>
      <div className="grid grid-cols-4 gap-3">
        {BUTTONS.map((row, i) => (
          <div key={i} className="contents">
            {row.map((btn) => (
              <button
                key={btn}
                onClick={() => handleInput(btn)}
                className={`
                  h-14 rounded-full flex items-center justify-center text-xl font-medium transition-all active:scale-95
                  ${btn === "0" ? "col-span-2" : ""}
                  ${["÷", "×", "-", "+", "="].includes(btn)
                    ? "bg-orange-500 hover:bg-orange-400"
                    : ["C", "±", "%"].includes(btn)
                      ? "bg-zinc-400 text-black hover:bg-zinc-300"
                      : "bg-zinc-800 hover:bg-zinc-700"}
                `}
              >
                {btn}
              </button>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
