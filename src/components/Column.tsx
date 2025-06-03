"use client";

import { Droppable } from "@hello-pangea/dnd";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import TaskCard from "./TaskCard";

type Task = { id: string; title: string };
type Status = "todo" | "inProgress" | "done";

interface ColumnProps {
  title: string;
  droppableId: Status;
  tasks: Task[];
  status: Status;
  onMarkInProgress?: (id: string) => void;
  onMarkDone: (id: string) => void;
  onAddTask: () => void;
}

export default function Column({
  title,
  droppableId,
  tasks,
  status,
  onMarkInProgress,
  onMarkDone,
  onAddTask,
}: ColumnProps) {
  return (
    <Droppable droppableId={droppableId}>
      {(provided) => (
        <Card
          ref={provided.innerRef}
          {...provided.droppableProps}
          className="flex flex-col flex-shrink-0 w-80 bg-white shadow h-full"
        >
          <CardHeader className="border-b">
            <CardTitle className="text-lg font-semibold">{title}</CardTitle>
          </CardHeader>
          <CardContent className="flex-grow space-y-4 overflow-y-auto p-4">
            {tasks.map((task, index) => (
              <TaskCard
                key={task.id}
                task={task}
                index={index}
                status={status}
                onMarkInProgress={onMarkInProgress}
                onMarkDone={onMarkDone}
              />
            ))}
            {provided.placeholder}
          </CardContent>
          <CardFooter className="border-t p-2">
            <Button size="sm" variant="outline" className="w-full" onClick={onAddTask}>
              + Add Task
            </Button>
          </CardFooter>
        </Card>
      )}
    </Droppable>
  );
}
