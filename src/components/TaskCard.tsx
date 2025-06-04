"use client";

import { Draggable } from "@hello-pangea/dnd";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Trash2 } from "lucide-react";

type Status = "todo" | "inProgress" | "done";

interface Task {
  id: string;
  title: string;
  status: Status;
  description?: string;
}

interface TaskCardProps {
  task: Task;
  index: number;
  onMarkInProgress: (id: string) => Promise<void>;
  onMarkDone: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export default function TaskCard({
  task,
  index,
  onMarkInProgress,
  onMarkDone,
  onDelete,
}: TaskCardProps) {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`rounded border p-3 shadow-sm ${
            snapshot.isDragging
              ? "border-blue-300 bg-blue-50"
              : task.status === "done"
              ? "border-green-300 bg-green-50"
              : "border-gray-200 bg-white"
          }`}
        >
          <p
            className={`text-sm font-semibold break-words ${
              task.status === "done" ? "line-through text-gray-500" : "text-gray-800"
            }`}
          >
            {task.title}
          </p>
          {task.description && (
            <p className="mt-1 text-xs text-gray-600 break-words">{task.description}</p>
          )}
          <div className="mt-2 flex space-x-1">
            {task.status === "todo" && (
              <Button
                size="icon"
                variant="ghost"
                aria-label="Mark In Progress"
                onClick={() => onMarkInProgress(task.id)}
              >
                <ArrowRight className="h-4 w-4 text-yellow-600" />
              </Button>
            )}
            {task.status !== "done" && (
              <Button
                size="icon"
                variant="ghost"
                aria-label="Mark as Done"
                onClick={() => onMarkDone(task.id)}
              >
                <Check className="h-4 w-4 text-green-600" />
              </Button>
            )}
            <Button
              size="icon"
              variant="ghost"
              aria-label="Delete Task"
              onClick={() => onDelete(task.id)}
            >
              <Trash2 className="h-4 w-4 text-red-600" />
            </Button>
          </div>
        </div>
      )}
    </Draggable>
  );
}
