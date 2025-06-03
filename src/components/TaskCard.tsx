"use client";

import { Draggable } from "@hello-pangea/dnd";
import { Button } from "@/components/ui/button";

type Task = { id: string; title: string };
type Status = "todo" | "inProgress" | "done";

interface TaskCardProps {
  task: Task;
  index: number;
  status: Status;
  onMarkInProgress?: (id: string) => void;
  onMarkDone: (id: string) => void;
}

export default function TaskCard({
  task,
  index,
  status,
  onMarkInProgress,
  onMarkDone,
}: TaskCardProps) {
  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          className={`rounded border p-3 shadow-sm ${
            snapshot.isDragging ? "border-blue-300 bg-blue-50" : status === "done" ? "border-green-300 bg-green-50" : "border-gray-200 bg-white"
          }`}
        >
          <p className={`text-sm font-medium ${status === "done" ? "line-through text-gray-500" : "text-gray-800"}`}>
            {task.title}
          </p>
          {status !== "done" && (
            <div className="mt-2 flex space-x-2">
              {status === "todo" && onMarkInProgress && (
                <Button size="sm" variant="ghost" className="px-2 text-yellow-600 hover:bg-yellow-50" onClick={() => onMarkInProgress(task.id)}>
                  Mark In Progress
                </Button>
              )}
              <Button size="sm" variant="ghost" className="px-2 text-green-600 hover:bg-green-50" onClick={() => onMarkDone(task.id)}>
                Mark as Done
              </Button>
            </div>
          )}
        </div>
      )}
    </Draggable>
  );
}
