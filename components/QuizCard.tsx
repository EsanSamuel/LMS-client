"use client";
import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import Question from "./Question";
import { Separator } from "./ui/separator";
import axios from "axios";
import useLocalStorage from "@/hooks/useLocalStorage";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useAuth } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { format, formatDistanceToNowStrict } from "date-fns";

interface IQuiz {
  quiz: any;
  answers: any;

  handleAnswerChange: any;
}

interface UserAnswerPayload {
  userId: string;
  answer: string;
  isCorrect: boolean | null;
}

const QuizCard = ({ quiz, answers, handleAnswerChange }: IQuiz) => {
  const { userId } = useAuth();
  const router = useRouter();
  const [score, setScore] = useLocalStorage<any>("score", null);
  const [userQuiz, setUserQuiz] = useState<boolean>(false);
  const [answeredAt, setAnsweredAt] = useState("");
  const [isSubmitting, setisSubmitting] = useState<boolean>(false);
  const [answerDetails, setAnswerDetails] = useState("");
  const mutation = useMutation<void, Error, UserAnswerPayload>({
    mutationFn: (data: UserAnswerPayload) => {
      return axios.post(
        `http://localhost:8080/v1/check-quizAnswer/${userId}`,
        data
      );
    },
  });

  async function fetchUserTracksQuiz(): Promise<IQuiz[]> {
    const response = await axios.get(
      `http://localhost:8080/v1/getTrackedQuiz/${userId}`
    );
    console.log(response.data.data);
    return response.data.data;
  }

  const {
    data: trackedQuiz,
    error,
    isLoading,
  } = useQuery({
    queryKey: [`trackQuiz:${userId}`],
    queryFn: fetchUserTracksQuiz,
  });

  const handleQuizSubmit = async (quizId: string) => {
    setisSubmitting(true);
    try {
      const data = {
        answers: Object.keys(answers).map((qId) => ({
          questionId: qId,
          answer: answers[qId],
        })),
      };
      mutation.mutate(data as any);

      const isTracked = trackedQuiz?.some((data) => data.quiz.id === quiz.id);

      if (!isTracked) {
        const response = await axios.post(
          `http://localhost:8080/v1/trackQuiz/${quizId}`,
          {
            userId: userId,
          }
        );
        if (response.status === 201) {
          alert("Quiz tracked");
        }
      } else {
        alert("Quiz already Tracked!");
      }
      router.refresh();
    } catch (error) {
      console.log(error);
    } finally {
      setisSubmitting(false);
    }
  };

  useEffect(() => {
    const getQuizGrade = async () => {
      const response = await axios.post(
        `http://localhost:8080/v1/grade-quiz/${quiz.id}`
      );
      const grades = response.data.data;
      setAnswerDetails(grades);
      const user = grades.filter((grade: any) => grade.user.clerkId === userId);
      console.log("User Answer:", user);

      if (user.length > 0) {
        setUserQuiz(true);
        console.log("Quiz Taken", user);
        const score = grades.filter((grade: any) => grade.isCorrect).length;
        setScore(score);
      } else {
        setUserQuiz(false);
        setScore(null);
      }
    };
    getQuizGrade();
  }, [quiz.id, userId]);

  const handleDeleteAnswers = async () => {
    try {
      await axios.delete(`http://localhost:8080/v1/delete-answers/${userId}`);
      localStorage.removeItem("quizId");
      localStorage.removeItem("hasUserTakenQuiz");
      localStorage.removeItem("answers");
      localStorage.removeItem("score");
      window.location.reload();
    } catch (error) {
      console.log(error);
    }
  };
  return (
    <div className="border shadow-md p-5 rounded-[10px]">
      <h1 className="font-bold text-gray-600 text-[20px]">{quiz.title}</h1>
      <Separator className="my-3" />
      <div className=" my-2 flex flex-col gap-4">
        {quiz.questions?.map((question: any, qIndex: number) => (
          <Question
            question={question}
            handleAnswerChange={handleAnswerChange}
            qIndex={qIndex}
            answers={answers}
            score={score}
            userQuiz={userQuiz}
          />
        ))}
      </div>

      <Separator className="my-5 " />
      <div className="flex lg:justify-between items-center">
        <div className="flex lg:justify-end">
          {!userQuiz ? (
            <Button
              onClick={() => handleQuizSubmit(quiz.id)}
              className="bg-[#8c6dfd]"
            >
              {mutation.isPending ? "Submitting..." : " Submit"}
            </Button>
          ) : (
            <div className="flex gap-2 flex-col items-center">
              {/*<h1 className="font-bold text-[14px] text-gray-600">
                You've taken this quiz
              </h1>*/}
              <Button onClick={handleDeleteAnswers} className="bg-[#8c6dfd]">
                Retake Quiz
              </Button>
            </div>
          )}
        </div>

        <div>
          {" "}
          {userQuiz && (
            <>
              <h1 className="font-bold text-gray-600">
                You scored: {score} / {quiz.questions.length} ({" "}
                {((score / quiz.questions.length).toFixed(2) as any) * 100}%)
              </h1>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default QuizCard;
