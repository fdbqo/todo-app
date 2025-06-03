"use client";

import { useState } from "react";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import Column from "@/components/Column";

type Task = { id: string; title: string };

export default function DashboardPage() {
  const [columns, setColumns] = useState<{
    todo: Task[];
    inProgress: Task[];
    done: Task[];
  }>({ todo: [], inProgress: [], done: [] });

  function onDragEnd(result: DropResult) {
    const { source, destination } = result;
    if (!destination) return;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const srcColKey = source.droppableId as keyof typeof columns;
    const destColKey = destination.droppableId as keyof typeof columns;
    const srcTasks = Array.from(columns[srcColKey]);
    const [moved] = srcTasks.splice(source.index, 1);

    if (srcColKey === destColKey) {
      srcTasks.splice(destination.index, 0, moved);
      setColumns(prev => ({ ...prev, [srcColKey]: srcTasks }));
    } else {
      const destTasks = Array.from(columns[destColKey]);
      destTasks.splice(destination.index, 0, moved);
      setColumns(prev => ({ ...prev, [srcColKey]: srcTasks, [destColKey]: destTasks }));
    }
  }

  function handleAddTask(column: "todo" | "inProgress" | "done") {
  }

  function handleMarkInProgress(id: string) {
  }

  function handleMarkDone(id: string) {
  }

  return (
    <main className="flex flex-col h-screen bg-gray-50">
      <header className="flex items-center justify-between p-8">
        <h1 className="text-3xl font-bold text-gray-800">My Kanban Board</h1>
        <button className="rounded bg-blue-600 px-4 py-2 text-white">+ Add New Board</button>
      </header>
      <DragDropContext onDragEnd={onDragEnd}>
        <div className="flex flex-grow justify-center space-x-6 overflow-x-auto px-8 pb-8">
          <Column
            title="To Do"
            droppableId="todo"
            status="todo"
            tasks={columns.todo}
            onMarkInProgress={handleMarkInProgress}
            onMarkDone={handleMarkDone}
            onAddTask={() => handleAddTask("todo")}
          />
          <Column
            title="In Progress"
            droppableId="inProgress"
            status="inProgress"
            tasks={columns.inProgress}
            onMarkDone={handleMarkDone}
            onAddTask={() => handleAddTask("inProgress")}
          />
          <Column
            title="Done"
            droppableId="done"
            status="done"
            tasks={columns.done}
            onMarkDone={handleMarkDone}
            onAddTask={() => handleAddTask("done")}
          />
        </div>
      </DragDropContext>
    </main>
  );
}
