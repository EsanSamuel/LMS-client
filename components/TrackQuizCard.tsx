import useLocalStorage from "@/hooks/useLocalStorage";
import { useAuth } from "@clerk/nextjs";
import axios from "axios";
import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import { TableCell, TableRow } from "./ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "./ui/button";
import QuizCard from "./QuizCard";

interface IProps {
  quiz: any;
  handleAnswerChange: any;
  answers: any;
}

const TrackQuizCard = ({ quiz, handleAnswerChange, answers }: IProps) => {
  const { userId } = useAuth();
  const [score, setScore] = useLocalStorage<any>("score", null);
  const [userQuiz, setUserQuiz] = useState<boolean>(false);
  const [answeredAt, setAnsweredAt] = useState("");
  const [showQuiz, setShowQuiz] = useState(false);
  useEffect(() => {
    const getQuizGrade = async () => {
      const response = await axios.post(
        `http://localhost:8080/v1/grade-quiz/${quiz.id}`
      );
      const grades = response.data.data;
      setAnsweredAt(grades?.answeredAt);
      const user = grades.filter((grade: any) => grade.user.clerkId === userId);

      if (user.length > 0) {
        setUserQuiz(true);
        const score = grades.filter((grade: any) => grade.isCorrect).length;
        setScore(score);
      } else {
        setUserQuiz(false);
        setScore(null);
      }
    };
    getQuizGrade();
  }, [quiz.id, userId]);

  return (
    <>
      <TableRow className="w-full" key={quiz.id}>
        <TableCell className="font-medium text-gray-600 ">
          {quiz?.title}
        </TableCell>
        <TableCell>
          {answeredAt
            ? format(new Date(answeredAt), "dd/MM/yyyy")
            : "Not taken"}
        </TableCell>
        <TableCell className="text-gray-600">
          {" "}
          {score} / {quiz?.questions?.length}
        </TableCell>
        <TableCell
          className={`text-gray-600 ${
            ((score / quiz.questions.length).toFixed(2) as any) * 100 > 50
              ? "text-green-500"
              : "text-red-500"
          }`}
        >
          {((score / quiz?.questions?.length).toFixed(2) as any) * 100 > 50
            ? "Passed"
            : "Failed"}
        </TableCell>
        <TableCell
          className="text-right text-gray-600"
          onClick={() => setShowQuiz(true)}
        >
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline">View Quiz</Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <QuizCard
                  quiz={quiz}
                  answers={answers}
                  handleAnswerChange={handleAnswerChange}
                />
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="w-full rounded-full text-gray-600">
                  Cancel
                </AlertDialogCancel>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </TableCell>
      </TableRow>
    </>
  );
};

export default TrackQuizCard;
