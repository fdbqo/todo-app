"use client";

import { Draggable } from "@hello-pangea/dnd";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Trash2, Edit2 } from "lucide-react";
import EditTaskDialog from "./EditTaskDialog";

type Status = "todo" | "inProgress" | "done";

interface Task {
  id: string;
  title: string;
  status: Status;
  description?: string;
  createdAt: string;
  updatedAt: string;
}

interface TaskCardProps {
  task: Task;
  index: number;
  onMarkInProgress: (id: string) => Promise<void>;
  onMarkDone: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onEditSuccess: () => void;
}

function timeSince(isoDate: string): string {
  const seconds = Math.floor((Date.now() - new Date(isoDate).getTime()) / 1000);
  if (seconds < 60) return `${seconds} secs ago`;
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes} mins ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours} hrs ago`;
  const days = Math.floor(hours / 24);
  return `${days} days ago`;
}

export default function TaskCard({
  task,
  index,
  onMarkInProgress,
  onMarkDone,
  onDelete,
  onEditSuccess,
}: TaskCardProps) {
  const elapsed = timeSince(task.updatedAt);

  let timeLabel = "";
  if (task.status === "todo") {
    timeLabel = `Todo ${elapsed}`;
  } else if (task.status === "inProgress") {
    timeLabel = `In Progress ${elapsed}`;
  } else if (task.status === "done") {
    timeLabel = `Done ${elapsed}`;
  }

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`rounded border p-3 shadow-sm ${snapshot.isDragging
            ? "border-blue-300 bg-blue-50"
            : task.status === "done"
              ? "border-green-300 bg-green-50"
              : "border-gray-200 bg-white"
            }`}
        >
          <div className="flex justify-between items-start">
            <p
              className={`text-sm font-semibold break-words ${task.status === "done" ? "line-through text-gray-500" : "text-gray-800"
                }`}
            >
              {task.title}
            </p>
            <p className="ml-2 text-xs text-gray-500 italic flex-shrink-0">
              {timeLabel}
            </p>
          </div>
          {task.description && (
            <p className="mt-1 text-xs text-gray-600 break-words">
              {task.description}
            </p>
          )}
          <div className="mt-2 flex space-x-1">
            <EditTaskDialog
              id={task.id}
              initialTitle={task.title}
              initialDescription={task.description || ""}
              onSuccess={onEditSuccess}
              trigger={
                <Button
                  size="icon"
                  variant="ghost"
                  aria-label="Edit Task"
                  className="px-2"
                >
                  <Edit2 className="h-4 w-4 text-blue-600" />
                </Button>
              }
            />

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
