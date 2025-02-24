import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import React, { useEffect, useState } from "react";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Label } from "./ui/label";
import { useAuth } from "@clerk/nextjs";

interface IQuestion {
  question: {
    text: string;
    id: string;
    options: any[];
    correctAnswer: string;
  };
  handleAnswerChange: any;
  qIndex: number;
  answers: any;
  score: string;
  userQuiz: boolean;
}

const Question = ({
  question,
  handleAnswerChange,
  qIndex,
  answers,
  score,
  userQuiz,
}: IQuestion) => {
  return (
    <div>
      <h1 className="text-[16px] text-gray-600 font-bold">
        {qIndex + 1}. {question.text}
      </h1>

      <RadioGroup
        value={answers[question.id]}
        onValueChange={(value: any) => handleAnswerChange(question.id, value)}
      >
        {question.options.map((opt: string, optindex: number) => {
          const optionInAlphabeth = () => {
            if (optindex === 0) {
              return "a";
            } else if (optindex === 1) {
              return "b";
            } else if (optindex === 2) {
              return "c";
            } else if (optindex === 3) {
              return "d";
            }
          };
          return (
            <div className="mt-4 gap-4 flex flex-col" key={optindex}>
              <div className="flex items-center space-x-2 pb-3">
                <RadioGroupItem
                  value={opt}
                  id={`option-${question.id}-${optindex}`}
                />
                {!userQuiz ? (
                  <Label
                    htmlFor={`option-${question.id}-${optindex}`}
                    className="text-gray-600"
                  >
                    {opt}
                  </Label>
                ) : (
                  <Label
                    htmlFor={`option-${question.id}-${optindex}`}
                    className={`p-2 rounded-md font-bold 
                        ${
                          opt === question.correctAnswer
                            ? "bg-green-100 text-green-700"
                            : ""
                        }
                        ${
                          answers[question.id] === opt &&
                          opt !== question.correctAnswer
                            ? "bg-red-100 text-red-700"
                            : ""
                        }
                        ${
                          answers[question.id] !== opt &&
                          opt !== question.correctAnswer
                            ? "bg-gray-100 text-gray-700"
                            : ""
                        }
                      
                      `}
                  >
                    {opt}
                  </Label>
                )}
              </div>
            </div>
          );
        })}
      </RadioGroup>
    </div>
  );
};

export default Question;
