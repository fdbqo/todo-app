"use client";

import { useState, useEffect } from "react";
import { DragDropContext, DropResult } from "@hello-pangea/dnd";
import Column from "@/components/Column";

type Status = "todo" | "inProgress" | "done";

interface Task {
  id: string;
  title: string;
  description?: string;
  status: Status;
  createdAt: string;
  updatedAt: string;
}

export default function DashboardPage() {
  const [columns, setColumns] = useState<{
    todo: Task[];
    inProgress: Task[];
    done: Task[];
  }>({ todo: [], inProgress: [], done: [] });

  async function fetchTasks() {
    const res = await fetch("/api/todos");
    const all: Array<{
      id: number;
      title: string;
      description?: string;
      status: Status;
      created_at: string;
      updated_at: string;
    }> = await res.json();

    const asString: Task[] = all.map((t) => ({
      id: String(t.id),
      title: t.title,
      description: t.description || "",
      status: t.status,
      createdAt: t.created_at,
      updatedAt: t.updated_at,
    }));

    setColumns({
      todo: asString.filter((t) => t.status === "todo"),
      inProgress: asString.filter((t) => t.status === "inProgress"),
      done: asString.filter((t) => t.status === "done"),
    });
  }

  useEffect(() => {
    fetchTasks();
  }, []);

  async function handleMarkInProgress(id: string): Promise<void> {
    setColumns((prev) => {
      const task = prev.todo.find((t) => t.id === id);
      if (!task) return prev;
      const newTodo = prev.todo.filter((t) => t.id !== id);
      task.status = "inProgress";
      task.updatedAt = new Date().toISOString();
      const newInProgress = [task, ...prev.inProgress];
      return { ...prev, todo: newTodo, inProgress: newInProgress, done: prev.done };
    });
    fetch(`/api/todos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "inProgress" }),
    });
  }

  async function handleMarkDone(id: string): Promise<void> {
    setColumns((prev) => {
      let task = prev.todo.find((t) => t.id === id);
      let newTodo = prev.todo;
      let newInProgress = prev.inProgress;
      if (task) {
        newTodo = prev.todo.filter((t) => t.id !== id);
      } else {
        task = prev.inProgress.find((t) => t.id === id);
        newInProgress = prev.inProgress.filter((t) => t.id !== id);
      }
      if (!task) return prev;
      task.status = "done";
      task.updatedAt = new Date().toISOString();
      const newDone = [task, ...prev.done];
      return { todo: newTodo, inProgress: newInProgress, done: newDone };
    });
    fetch(`/api/todos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "done" }),
    });
  }

  async function handleDelete(id: string): Promise<void> {
    setColumns((prev) => ({
      todo: prev.todo.filter((t) => t.id !== id),
      inProgress: prev.inProgress.filter((t) => t.id !== id),
      done: prev.done.filter((t) => t.id !== id),
    }));
    fetch(`/api/todos/${id}`, { method: "DELETE" });
  }

  function onDragEnd(result: DropResult): void {
    const { source, destination } = result;
    if (!destination) return;
    const srcCol = source.droppableId as Status;
    const destCol = destination.droppableId as Status;

    if (srcCol === destCol) {
      if (source.index === destination.index) return;
      setColumns((prev) => {
        const updated = Array.from(prev[srcCol]);
        const [moved] = updated.splice(source.index, 1);
        updated.splice(destination.index, 0, moved);
        return { ...prev, [srcCol]: updated };
      });
      const movedId = columns[srcCol][source.index]?.id;
      if (movedId) {
        fetch(`/api/todos/${movedId}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ status: destCol }),
        });
      }
      return;
    }

    setColumns((prev) => {
      const sourceTasks = Array.from(prev[srcCol]);
      const [moved] = sourceTasks.splice(source.index, 1);
      moved.status = destCol;
      moved.updatedAt = new Date().toISOString();
      const destTasks = Array.from(prev[destCol]);
      destTasks.splice(destination.index, 0, moved);
      return { ...prev, [srcCol]: sourceTasks, [destCol]: destTasks };
    });
    const movedId = columns[srcCol][source.index]?.id;
    if (movedId) {
      fetch(`/api/todos/${movedId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: destCol }),
      });
    }
  }

  const incompleteCount = columns.todo.length + columns.inProgress.length;
  const completeCount = columns.done.length;

  return (
    <main className="flex flex-col h-screen bg-gray-50 overflow-hidden">
      <header className="flex flex-col items-center justify-center h-16">
        <h1 className="text-2xl font-bold text-gray-800">Todo App</h1>
        <p className="mt-1 text-sm text-gray-600">
          Incomplete: {incompleteCount} | Complete: {completeCount}
        </p>
      </header>

      <div className="flex flex-grow overflow-hidden px-4 pb-4">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex flex-grow justify-center space-x-4 overflow-x-auto">
            <Column
              title="To Do"
              droppableId="todo"
              tasks={columns.todo}
              onMarkInProgress={handleMarkInProgress}
              onMarkDone={handleMarkDone}
              onDelete={handleDelete}
              onAddSuccess={fetchTasks}
              onEditSuccess={fetchTasks}
            />
            <Column
              title="In Progress"
              droppableId="inProgress"
              tasks={columns.inProgress}
              onMarkInProgress={handleMarkInProgress}
              onMarkDone={handleMarkDone}
              onDelete={handleDelete}
              onAddSuccess={fetchTasks}
              onEditSuccess={fetchTasks}
            />
            <Column
              title="Done"
              droppableId="done"
              tasks={columns.done}
              onMarkInProgress={handleMarkInProgress}
              onMarkDone={handleMarkDone}
              onDelete={handleDelete}
              onAddSuccess={fetchTasks}
              onEditSuccess={fetchTasks}
            />
          </div>
        </DragDropContext>
      </div>
    </main>
  );
}
