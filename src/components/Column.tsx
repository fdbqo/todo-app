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
}

interface ColumnProps {
  title: string;
  droppableId: Status;
  tasks: Task[];
  onMarkInProgress: (id: string) => Promise<void>;
  onMarkDone: (id: string) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
  onAddSuccess: () => void;
}

export default function Column({
  title,
  droppableId,
  tasks,
  onMarkInProgress,
  onMarkDone,
  onDelete,
  onAddSuccess,
}: ColumnProps) {
  return (
    <Droppable droppableId={droppableId}>
      {(provided) => (
        <Card
          ref={provided.innerRef}
          {...provided.droppableProps}
          className="flex flex-col flex-shrink-0 w-80 bg-white shadow h-[85vh]"
        >
          <CardHeader className="border-b">
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
                />
              ))}
            </div>
            {provided.placeholder}
          </CardContent>
          <CardFooter className="border-t p-2">
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
