import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { todos } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const url = new URL(request.url);
  const statusFilter = url.searchParams.get("status");
  let items;

  if (statusFilter === "todo" || statusFilter === "inProgress" || statusFilter === "done") {
    items = await db.select().from(todos).where(eq(todos.status, statusFilter));
  } else {
    items = await db.select().from(todos);
  }

  return NextResponse.json(items);
}

export async function POST(request: NextRequest) {
  const { title, description, status } = await request.json();
  if (!title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }

  const [inserted] = await db
    .insert(todos)
    .values({ title, description, status, })
    .returning();

  return NextResponse.json(inserted, { status: 201 });
}
