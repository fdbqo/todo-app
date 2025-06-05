"use client";

import { Droppable } from "@hello-pangea/dnd";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import TaskCard from "./TaskCard";
import AddTaskDialog from "./AddTaskDialog";

type Status = "todo" | "inProgress" | "done";

interface Task {
  id: string;
  title: string;
  description?: string;
  status: Status;
  createdAt: string;
  updatedAt: string;
}

interface ColumnProps {
  title: string;
  droppableId: Status;
  tasks: Task[];
  onMarkInProgress: (id: string) => Promise<void>;
  onMarkDone: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onAddSuccess: () => void;
  onEditSuccess: () => void;
}

export default function Column({
  title,
  droppableId,
  tasks,
  onMarkInProgress,
  onMarkDone,
  onDelete,
  onAddSuccess,
  onEditSuccess,
}: ColumnProps) {
  return (
    <Droppable droppableId={droppableId}>
      {(provided) => (
        <Card
          ref={provided.innerRef}
          {...provided.droppableProps}
          className="flex flex-col w-80 bg-white shadow h-full"
        >
          <CardHeader className="border-b py-2 px-4 flex-shrink-0">
            <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          </CardHeader>

          <CardContent className="flex-grow overflow-y-auto p-4">
            <div className="space-y-4">
              {tasks.map((task, index) => (
                <TaskCard
                  key={task.id}
                  task={task}
                  index={index}
                  onMarkInProgress={onMarkInProgress}
                  onMarkDone={onMarkDone}
                  onDelete={onDelete}
                  onEditSuccess={onEditSuccess}
                />
              ))}
            </div>
            {provided.placeholder}
          </CardContent>

          <CardFooter className="border-t p-2 flex-shrink-0">
            <AddTaskDialog
              column={droppableId}
              onSuccess={onAddSuccess}
              trigger={
                <button className="w-full rounded border border-gray-300 px-2 py-1 text-sm hover:bg-gray-50">
                  + Add Task
                </button>
              }
            />
          </CardFooter>
        </Card>
      )}
    </Droppable>
  );
}
