"use client";

import { Test } from "@prisma/client";
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

interface TestsListProps {
  items: Test[];
  onReorder: (updateData: { id: string; position: number }[]) => void;
  onEdit: (id: string) => void;
};

export const TestsList = ({
  items,
  onReorder,
  onEdit
}: TestsListProps) => {
  const [isMounted, setIsMounted] = useState(false);
  const [tests, setTests] = useState(items);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    setTests(items);
  }, [items]);

  const onDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const items = Array.from(tests);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);

    const startIndex = Math.min(result.source.index, result.destination.index);
    const endIndex = Math.max(result.source.index, result.destination.index);

    const updatedTests = items.slice(startIndex, endIndex + 1);

    setTests(items);

    const bulkUpdateData = updatedTests.map((test) => ({
      id: test.id,
      position: items.findIndex((item) => item.id === test.id)
    }));

    onReorder(bulkUpdateData);
  }

  if (!isMounted) {
    return null;
  }

  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <Droppable droppableId="tests">
        {(provided) => (
          <div {...provided.droppableProps} ref={provided.innerRef}>
            {tests.map((test, index) => (
              <Draggable 
                key={test.id} 
                draggableId={test.id} 
                index={index}
              >
                {(provided) => (
                  <div
                    className={cn(
                      "flex items-center gap-x-2 bg-slate-200 border-slate-200 border text-slate-700 rounded-md mb-4 text-sm",
                      test.isPublished && "bg-sky-100 border-sky-200 text-sky-700"
                    )}
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                  >
                    <div
                      className={cn(
                        "px-2 py-3 border-r border-r-slate-200 hover:bg-slate-300 rounded-l-md transition",
                        test.isPublished && "border-r-sky-200 hover:bg-sky-200"
                      )}
                      {...provided.dragHandleProps}
                    >
                      <Grip
                        className="h-5 w-5"
                      />
                    </div>
                    {test.question}
                    <div className="ml-auto pr-2 flex items-center gap-x-2">
                      <Badge
                        className={cn(
                          "bg-slate-500",
                          test.isPublished && "bg-sky-700"
                        )}
                      >
                        {test.isPublished ? "Published" : "Draft"}
                      </Badge>
                      <Pencil
                        onClick={() => onEdit(test.id)}
                        className="w-4 h-4 cursor-pointer hover:opacity-75 transition"
                      />
                    </div>
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