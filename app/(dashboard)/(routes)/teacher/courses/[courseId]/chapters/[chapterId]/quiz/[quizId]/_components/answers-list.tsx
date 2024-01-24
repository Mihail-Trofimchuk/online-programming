"use client";

import { AnswerOption, Test } from "@prisma/client";
import { useEffect, useState } from "react";
import {
  DragDropContext,
  Droppable,
  Draggable,
  DropResult,
} from "@hello-pangea/dnd";
import { Grip, Pencil } from "lucide-react";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface AnswerListProps {
  items: AnswerOption[];
  onReorder: (updateData: { id: string; position: number }[]) => void;
  onEdit: (id: string) => void;
};

export const AnswersList = ({
  items,
  onReorder,
  onEdit
}: AnswerListProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [answers, setTests] = useState(items);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setTests(items);
  }, [items]);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(answers);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const startIndex = Math.min(result.source.index, result.destination.index);
    const endIndex = Math.max(result.source.index, result.destination.index);

    const updatedAnswers = items.slice(startIndex, endIndex + 1);

    setTests(items);

    const bulkUpdateData = updatedAnswers.map((answer) => ({
      id: answer.id,
      position: items.findIndex((item) => item.id === answer.id)
    }));

    onReorder(bulkUpdateData);
  }

  if (!isMounted) {
    return null;
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="answers">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {answers.map((answer, index) => (
              <Draggable 
                key={answer.id} 
                draggableId={answer.id} 
                index={index}
              >
                {(provided) => (
                  <div
                    className={cn(
                      "flex items-center gap-x-2 bg-slate-200 border-slate-200 border text-slate-700 rounded-md mb-4 text-sm",
                     
                    )}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                  >
                    <div
                      className={cn(
                        "px-2 py-3 border-r border-r-slate-200 hover:bg-slate-300 rounded-l-md transition",
                      
                      )}
                      {...provided.dragHandleProps}
                    >
                      <Grip
                        className="h-5 w-5"
                      />
                    </div>
                    {answer.option}
                    { <div className="ml-auto pr-2 flex items-center gap-x-2">
					{answer.isCorrect && (
                        <Badge>
                          Correct
                        </Badge>
                      )}
                      {/* <Badge
                        className={cn(
                          "bg-slate-500",
                          test.isPublished && "bg-sky-700"
                        )}
                      >
                        {test.isPublished ? "Published" : "Draft"} */}
                      {/* </Badge> */}
                      <Pencil
                         onClick={() => onEdit(answer.id)}
                       className="w-4 h-4 cursor-pointer hover:opacity-75 transition"
                      />
                    </div> }
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  )
}