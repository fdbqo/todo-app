import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { todos } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  const { id } = await request.json();
  const todoId = parseInt(id, 10);
  if (isNaN(todoId)) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }
  const [item] = await db.select().from(todos).where(eq(todos.id, todoId));
  if (!item) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  const [updated] = await db
    .update(todos)
    .set({ is_done: !item.is_done, updated_at: new Date() })
    .where(eq(todos.id, todoId))
    .returning();
  return NextResponse.json(updated);
}
