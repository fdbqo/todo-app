ALTER TABLE "todos" ADD COLUMN "status" text DEFAULT 'todo' NOT NULL;--> statement-breakpoint
ALTER TABLE "todos" DROP COLUMN "is_done";