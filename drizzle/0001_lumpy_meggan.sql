CREATE TABLE "guests" (
	"id" text PRIMARY KEY NOT NULL,
	"meeting_id" text NOT NULL,
	"name" text NOT NULL,
	"email" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "guests" ADD CONSTRAINT "guests_meeting_id_meetings_id_fk" FOREIGN KEY ("meeting_id") REFERENCES "public"."meetings"("id") ON DELETE cascade ON UPDATE no action;