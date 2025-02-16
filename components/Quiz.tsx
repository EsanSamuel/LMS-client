"use client";
import React, { useState } from "react";
import { Input } from "./ui/input";
import { Separator } from "./ui/separator";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useAuth } from "@clerk/nextjs";

interface QuestionPayload {
  userId: string;
  courseId: string;
  questions: {
    text: string;
    options: string[];
    correctAnswer: string;
  }[];
}

const Quiz = ({ courseId }: { courseId: string }) => {
  const { userId } = useAuth();
  const [title, setTitle] = useState("");
  const [questions, setQuestions] = useState<any[]>([
    {
      text: "",
      options: ["", ""], //two options by default
      correctAnswer: "",
    },
  ]);

  const handleQuestionChange = (
    index: number,
    field: string,
    value: string
  ) => {
    //spread the question array
    const updatedQuestions = [...questions];
    //get the updated question by the index and field passed...
    //updatedQuestions[0]["text"] = e.target.value
    updatedQuestions[index][field] = value;
    setQuestions(updatedQuestions);
  };

  const addQuestions = () => {
    const updatedQuestions = [...questions];
    updatedQuestions.push({
      text: "",
      options: ["", ""],
      correctAnswer: "",
    });
    setQuestions(updatedQuestions);
  };

  const handleOptionChange = (
    qIndex: number,
    optIndex: number,
    value: string
  ) => {
    const updatedQuestions = [...questions];
    //updatedQuestions[0].options[1] = e.target.value;
    updatedQuestions[qIndex].options[optIndex] = value;
    setQuestions(updatedQuestions);
  };

  const addOptions = (qIndex: number) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].options.push("");
    setQuestions(updatedQuestions);
  };

  const removeQuestion = (index: number) => {
    const question = questions.filter((_, i) => i !== index);
    setQuestions(question);
  };

  const removeQuestionOption = (qIndex: number, optIndex: number) => {
    const updatedQuestions = [...questions];
    const removeOption = updatedQuestions[qIndex].options.filter(
      (_: any, i: any) => i !== optIndex
    );
    setQuestions(removeOption);
  };

  const mutation = useMutation<void, Error, QuestionPayload>({
    mutationFn: (data: QuestionPayload) => {
      return axios.post("http://localhost:8080/v1/create-quiz", data);
    },
  });

  const handleQuiz = () => {
    const data = {
      title,
      courseId: courseId,
      userId: userId,
      questions,
    };
    mutation.mutate(data as any);
    console.log(data);
  };
  return (
    <div className="lg:px-10 px-3 py-10">
      <div>
        <header>
          <h1 className="font-bold text-[20px] text-gray-600">Create Quiz</h1>
          <p className="text-[13px] text-gray-600">
            Create a quiz for this course
          </p>
        </header>
        <div className="w-full mt-10">
          <div className="flex flex-col gap-1 ">
            <label className="text-[13px] text-gray-600 font-bold">
              Quiz title
            </label>
            <Input
              className=""
              placeholder="Enter Title of quiz"
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          <Separator className="my-3" />
          <div className="flex flex-col gap-4 overflow-y-auto">
            {questions.map((question, qIndex) => (
              <div className="flex flex-col gap-2 overflow-y-auto border rounded-md p-5 shadow-md">
                <div className="w-full flex justify-between items-center mt-5">
                  <h1 className="font-bold text-[14px] text-gray-600">
                    Quiz {qIndex + 1}
                  </h1>
                </div>
                <div className="flex flex-col gap-1 ">
                  <label className="text-[13px] text-gray-600 font-bold">
                    Question
                  </label>
                  <Input
                    className=""
                    placeholder="Enter Question"
                    value={question.text}
                    onChange={(e) =>
                      handleQuestionChange(qIndex, "text", e.target.value)
                    }
                  />
                </div>
                <div className="flex flex-col gap-1 ">
                  <label className="text-[13px] text-gray-600 font-bold">
                    Answer
                  </label>
                  <Input
                    className=""
                    placeholder="Enter Correct answer"
                    value={question.correctAnswer}
                    onChange={(e) =>
                      handleQuestionChange(
                        qIndex,
                        "correctAnswer",
                        e.target.value
                      )
                    }
                  />
                </div>

                <div className="">
                  <h1 className="text-[15px] font-bold text-gray-600 py-3">
                    Quiz Options:
                  </h1>
                  <div className="flex flex-col gap-2">
                    {question?.options?.map((option: any, optIndex: number) => (
                      <div className="flex flex-col gap-2">
                        <div className="flex flex-col gap-1 ">
                          <label className="text-[13px] text-gray-600 font-bold">
                            Enter Quiz options {optIndex + 1}
                          </label>
                          <Input
                            className=""
                            placeholder={`Option ${optIndex + 1}`}
                            value={option}
                            onChange={(e) =>
                              handleOptionChange(
                                qIndex,
                                optIndex,
                                e.target.value
                              )
                            }
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="w-full justify-end">
                  <Button
                    className="bg-[#8c6dfd] mt-3 w-auto"
                    onClick={() => addOptions(qIndex)}
                  >
                    Add Options
                  </Button>
                </div>

                <Separator className="my-5" />
              </div>
            ))}
          </div>
          <div className="flex justify-end my-3">
            <Button
              onClick={() => addQuestions()}
              className="bg-[#8c6dfd] flex gap-1 font-bold items-center text-white py-2 px-4 rounded-md text-[14px]"
            >
              <Plus className="font-bold" size={15} />
              Add Question
            </Button>
          </div>
          <Separator className="my-5" />
          <div className="w-full ">
            <Button
              onClick={handleQuiz}
              className="bg-[#8c6dfd] flex gap-1 font-bold items-center text-white py-2 px-4 rounded-md text-[14px] w-full"
            >
              <Plus className="font-bold" size={15} />
              Create Quiz
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
