import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { todos } from "@/db/schema";
import { eq } from "drizzle-orm";

// gets number id from the url so we can work with it
function extractNumericId(request: NextRequest): number | null {
  const segments = new URL(request.url).pathname.split("/");
  const idString = segments[segments.length - 1];
  const numericId = parseInt(idString, 10);
  return isNaN(numericId) ? null : numericId;
}

export async function GET(request: NextRequest) {
  const numericId = extractNumericId(request);
  if (numericId === null) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  const [item] = await db.select().from(todos).where(eq(todos.id, numericId));
  if (!item) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(item);
}

export async function PATCH(request: NextRequest) {
  const numericId = extractNumericId(request);
  if (numericId === null) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  const { title, description, status } = await request.json();
  if (!title && !description && !status) {
    return NextResponse.json({ error: "Nothing to update" }, { status: 400 });
  }

  const dataToUpdate: {
    title?: string;
    description?: string;
    status?: string;
    updated_at: Date;
  } = { updated_at: new Date() };

  if (typeof title === "string") dataToUpdate.title = title;
  if (typeof description === "string") dataToUpdate.description = description;
  if (status === "todo" || status === "inProgress" || status === "done") {
    dataToUpdate.status = status;
  }

  const [updated] = await db
    .update(todos)
    .set(dataToUpdate)
    .where(eq(todos.id, numericId))
    .returning();

  if (!updated) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(updated);
}

export async function DELETE(request: NextRequest) {
  const numericId = extractNumericId(request);
  if (numericId === null) {
    return NextResponse.json({ error: "Invalid ID" }, { status: 400 });
  }

  await db.delete(todos).where(eq(todos.id, numericId));
  return new NextResponse(null, { status: 204 });
}
