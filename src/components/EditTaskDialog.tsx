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

interface EditTaskDialogProps {
    id: string;
    initialTitle: string;
    initialDescription: string;
    onSuccess: () => void;
    trigger: ReactNode;
}

export default function EditTaskDialog({
    id,
    initialTitle,
    initialDescription,
    onSuccess,
    trigger,
}: EditTaskDialogProps) {
    const [open, setOpen] = useState(false);
    const [title, setTitle] = useState(initialTitle);
    const [description, setDescription] = useState(initialDescription);
    const [isLoading, setIsLoading] = useState(false);

    // Reset local state
    function handleOpenChange(val: boolean) {
        setOpen(val);
        if (val) {
            setTitle(initialTitle);
            setDescription(initialDescription);
        }
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        if (!title.trim()) return;
        setIsLoading(true);

        await fetch(`/api/todos/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title: title.trim(),
                description: description.trim(),
            }),
        });

        setIsLoading(false);
        setOpen(false);
        onSuccess();
    }

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>{trigger}</DialogTrigger>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>Edit Task</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid w-full items-center gap-1.5">
                        <Label htmlFor="edit-task-title">Title</Label>
                        <Input
                            id="edit-task-title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="What needs to be done?"
                            required
                        />
                    </div>
                    <div className="grid w-full items-center gap-1.5">
                        <Label htmlFor="edit-task-desc">Description</Label>
                        <Textarea
                            id="edit-task-desc"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            placeholder="Optional details..."
                            rows={4}
                        />
                    </div>
                    <div className="flex justify-end space-x-2">
                        <Button
                            variant="outline"
                            onClick={() => setOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading}>
                            {isLoading ? "Saving…" : "Save Changes"}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
