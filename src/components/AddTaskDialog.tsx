"use client";

import { useState, ReactNode } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

type Status = "todo" | "inProgress" | "done";

interface AddTaskDialogProps {
  column: Status;
  onSuccess: () => void;
  trigger: ReactNode;
}

export default function AddTaskDialog({
  column,
  onSuccess,
  trigger,
}: AddTaskDialogProps) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setIsLoading(true);

    await fetch("/api/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        title: title.trim(),
        description: description.trim(),
        status: column,
      }),
    });

    setIsLoading(false);
    setTitle("");
    setDescription("");
    setOpen(false);
    onSuccess();
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Add a New Task</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="task-title">Title</Label>
            <Input
              id="task-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="What needs to be done?"
              required
            />
          </div>
          <div className="grid w-full items-center gap-1.5">
            <Label htmlFor="task-desc">Description</Label>
            <Textarea
              id="task-desc"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Optional details..."
              rows={4}
            />
          </div>
          <div className="flex justify-end space-x-2">
            <Button
              variant="outline"
              onClick={() => {
                setTitle("");
                setDescription("");
                setOpen(false);
              }}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Adding…" : "Add Task"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
