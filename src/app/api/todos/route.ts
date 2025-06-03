import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { todos } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const showDoneParam = searchParams.get("showDone");
  let items;

  if (showDoneParam === "true") {
    items = await db.select().from(todos).where(eq(todos.is_done, true));
  } else if (showDoneParam === "false") {
    items = await db.select().from(todos).where(eq(todos.is_done, false));
  } else {
    items = await db.select().from(todos);
  }

  return NextResponse.json(items);
}

export async function POST(request: NextRequest) {
  const { title, description } = await request.json();
  if (!title) {
    return NextResponse.json({ error: "Title is required" }, { status: 400 });
  }
  const [inserted] = await db.insert(todos).values({ title, description }).returning();
  return NextResponse.json(inserted, { status: 201 });
}
