import { MigrateUpArgs, MigrateDownArgs, sql } from '@payloadcms/db-postgres'

export async function up({ db, payload, req }: MigrateUpArgs): Promise<void> {
  await db.execute(sql`
   CREATE TYPE "public"."_locales" AS ENUM('es', 'en');
  CREATE TYPE "public"."enum_products_lifecycle" AS ENUM('concept', 'building', 'beta', 'live');
  CREATE TYPE "public"."enum_products_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__products_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__products_v_published_locale" AS ENUM('es', 'en');
  CREATE TYPE "public"."enum_work_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__work_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__work_v_published_locale" AS ENUM('es', 'en');
  CREATE TYPE "public"."enum_labs_stage" AS ENUM('idea', 'prototype', 'testing', 'graduated');
  CREATE TYPE "public"."enum_labs_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__labs_v_version_stage" AS ENUM('idea', 'prototype', 'testing', 'graduated');
  CREATE TYPE "public"."enum__labs_v_version_status" AS ENUM('draft', 'published');
  CREATE TYPE "public"."enum__labs_v_published_locale" AS ENUM('es', 'en');
  CREATE TYPE "public"."enum_leads_status" AS ENUM('new', 'contacted', 'qualified', 'closed');
  CREATE TYPE "public"."enum_users_role" AS ENUM('admin', 'editor', 'viewer');
  CREATE TYPE "public"."enum_payload_jobs_log_task_slug" AS ENUM('inline', 'schedulePublish');
  CREATE TYPE "public"."enum_payload_jobs_log_state" AS ENUM('failed', 'succeeded');
  CREATE TYPE "public"."enum_payload_jobs_task_slug" AS ENUM('inline', 'schedulePublish');
  CREATE TABLE "products_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"image_id" integer
  );
  
  CREATE TABLE "products" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"status" "enum_products_lifecycle" DEFAULT 'building',
  	"cover_id" integer,
  	"url" varchar,
  	"seo_image_id" integer,
  	"slug" varchar,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_products_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "products_locales" (
  	"title" varchar,
  	"summary" varchar,
  	"body" jsonb,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_products_v_version_gallery" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"image_id" integer,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_products_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_status" "enum_products_lifecycle" DEFAULT 'building',
  	"version_cover_id" integer,
  	"version_url" varchar,
  	"version_seo_image_id" integer,
  	"version_slug" varchar,
  	"version_order" numeric DEFAULT 0,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__products_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__products_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_products_v_locales" (
  	"version_title" varchar,
  	"version_summary" varchar,
  	"version_body" jsonb,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "work_results" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"value" varchar
  );
  
  CREATE TABLE "work_results_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "work" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"client" varchar,
  	"year" numeric,
  	"cover_id" integer,
  	"url" varchar,
  	"seo_image_id" integer,
  	"slug" varchar,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_work_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "work_locales" (
  	"title" varchar,
  	"summary" varchar,
  	"challenge" jsonb,
  	"solution" jsonb,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "work_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"services_id" integer
  );
  
  CREATE TABLE "_work_v_version_results" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"value" varchar,
  	"_uuid" varchar
  );
  
  CREATE TABLE "_work_v_version_results_locales" (
  	"label" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_work_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_client" varchar,
  	"version_year" numeric,
  	"version_cover_id" integer,
  	"version_url" varchar,
  	"version_seo_image_id" integer,
  	"version_slug" varchar,
  	"version_order" numeric DEFAULT 0,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__work_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__work_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_work_v_locales" (
  	"version_title" varchar,
  	"version_summary" varchar,
  	"version_challenge" jsonb,
  	"version_solution" jsonb,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_work_v_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"services_id" integer
  );
  
  CREATE TABLE "labs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"stage" "enum_labs_stage" DEFAULT 'idea',
  	"cover_id" integer,
  	"seo_image_id" integer,
  	"slug" varchar,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"_status" "enum_labs_status" DEFAULT 'draft'
  );
  
  CREATE TABLE "labs_locales" (
  	"title" varchar,
  	"summary" varchar,
  	"body" jsonb,
  	"seo_title" varchar,
  	"seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "_labs_v" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"parent_id" integer,
  	"version_stage" "enum__labs_v_version_stage" DEFAULT 'idea',
  	"version_cover_id" integer,
  	"version_seo_image_id" integer,
  	"version_slug" varchar,
  	"version_order" numeric DEFAULT 0,
  	"version_updated_at" timestamp(3) with time zone,
  	"version_created_at" timestamp(3) with time zone,
  	"version__status" "enum__labs_v_version_status" DEFAULT 'draft',
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"snapshot" boolean,
  	"published_locale" "enum__labs_v_published_locale",
  	"latest" boolean,
  	"autosave" boolean
  );
  
  CREATE TABLE "_labs_v_locales" (
  	"version_title" varchar,
  	"version_summary" varchar,
  	"version_body" jsonb,
  	"version_seo_title" varchar,
  	"version_seo_description" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "services" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" numeric DEFAULT 0,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "services_locales" (
  	"title" varchar NOT NULL,
  	"description" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "media" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"url" varchar,
  	"thumbnail_u_r_l" varchar,
  	"filename" varchar,
  	"mime_type" varchar,
  	"filesize" numeric,
  	"width" numeric,
  	"height" numeric,
  	"focal_x" numeric,
  	"focal_y" numeric,
  	"sizes_card_url" varchar,
  	"sizes_card_width" numeric,
  	"sizes_card_height" numeric,
  	"sizes_card_mime_type" varchar,
  	"sizes_card_filesize" numeric,
  	"sizes_card_filename" varchar,
  	"sizes_wide_url" varchar,
  	"sizes_wide_width" numeric,
  	"sizes_wide_height" numeric,
  	"sizes_wide_mime_type" varchar,
  	"sizes_wide_filesize" numeric,
  	"sizes_wide_filename" varchar,
  	"sizes_og_url" varchar,
  	"sizes_og_width" numeric,
  	"sizes_og_height" numeric,
  	"sizes_og_mime_type" varchar,
  	"sizes_og_filesize" numeric,
  	"sizes_og_filename" varchar
  );
  
  CREATE TABLE "media_locales" (
  	"alt" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "leads" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar NOT NULL,
  	"email" varchar NOT NULL,
  	"company" varchar,
  	"message" varchar NOT NULL,
  	"status" "enum_leads_status" DEFAULT 'new',
  	"locale" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "users_sessions" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"created_at" timestamp(3) with time zone,
  	"expires_at" timestamp(3) with time zone NOT NULL
  );
  
  CREATE TABLE "users" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"role" "enum_users_role" DEFAULT 'viewer' NOT NULL,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"email" varchar NOT NULL,
  	"reset_password_token" varchar,
  	"reset_password_expiration" timestamp(3) with time zone,
  	"salt" varchar,
  	"hash" varchar,
  	"reset_password_requested_at" timestamp(3) with time zone,
  	"login_attempts" numeric DEFAULT 0,
  	"lock_until" timestamp(3) with time zone
  );
  
  CREATE TABLE "payload_kv" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar NOT NULL,
  	"data" jsonb NOT NULL
  );
  
  CREATE TABLE "payload_jobs_log" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"executed_at" timestamp(3) with time zone NOT NULL,
  	"completed_at" timestamp(3) with time zone NOT NULL,
  	"task_slug" "enum_payload_jobs_log_task_slug" NOT NULL,
  	"task_i_d" varchar NOT NULL,
  	"input" jsonb,
  	"output" jsonb,
  	"state" "enum_payload_jobs_log_state" NOT NULL,
  	"error" jsonb
  );
  
  CREATE TABLE "payload_jobs" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"input" jsonb,
  	"completed_at" timestamp(3) with time zone,
  	"total_tried" numeric DEFAULT 0,
  	"has_error" boolean DEFAULT false,
  	"error" jsonb,
  	"task_slug" "enum_payload_jobs_task_slug",
  	"queue" varchar DEFAULT 'default',
  	"wait_until" timestamp(3) with time zone,
  	"processing" boolean DEFAULT false,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"global_slug" varchar,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_locked_documents_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"products_id" integer,
  	"work_id" integer,
  	"labs_id" integer,
  	"services_id" integer,
  	"media_id" integer,
  	"leads_id" integer,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_preferences" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"key" varchar,
  	"value" jsonb,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "payload_preferences_rels" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"order" integer,
  	"parent_id" integer NOT NULL,
  	"path" varchar NOT NULL,
  	"users_id" integer
  );
  
  CREATE TABLE "payload_migrations" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"name" varchar,
  	"batch" numeric,
  	"updated_at" timestamp(3) with time zone DEFAULT now() NOT NULL,
  	"created_at" timestamp(3) with time zone DEFAULT now() NOT NULL
  );
  
  CREATE TABLE "home_why_pillars" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "home_why_pillars_locales" (
  	"verb" varchar NOT NULL,
  	"text" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home_philosophy_lines" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL
  );
  
  CREATE TABLE "home_philosophy_lines_locales" (
  	"text" varchar NOT NULL,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" varchar NOT NULL
  );
  
  CREATE TABLE "home" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "home_locales" (
  	"hero_eyebrow" varchar,
  	"hero_title" varchar,
  	"hero_lead" varchar,
  	"hero_cta" varchar,
  	"why_title" varchar,
  	"philosophy_title" varchar,
  	"contact_title" varchar,
  	"contact_lead" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  CREATE TABLE "site_social" (
  	"_order" integer NOT NULL,
  	"_parent_id" integer NOT NULL,
  	"id" varchar PRIMARY KEY NOT NULL,
  	"label" varchar NOT NULL,
  	"url" varchar NOT NULL
  );
  
  CREATE TABLE "site" (
  	"id" serial PRIMARY KEY NOT NULL,
  	"contact_email" varchar,
  	"updated_at" timestamp(3) with time zone,
  	"created_at" timestamp(3) with time zone
  );
  
  CREATE TABLE "site_locales" (
  	"footer_note" varchar,
  	"id" serial PRIMARY KEY NOT NULL,
  	"_locale" "_locales" NOT NULL,
  	"_parent_id" integer NOT NULL
  );
  
  ALTER TABLE "products_gallery" ADD CONSTRAINT "products_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_gallery" ADD CONSTRAINT "products_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "products" ADD CONSTRAINT "products_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products" ADD CONSTRAINT "products_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "products_locales" ADD CONSTRAINT "products_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v_version_gallery" ADD CONSTRAINT "_products_v_version_gallery_image_id_media_id_fk" FOREIGN KEY ("image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v_version_gallery" ADD CONSTRAINT "_products_v_version_gallery_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_products_v" ADD CONSTRAINT "_products_v_parent_id_products_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."products"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v" ADD CONSTRAINT "_products_v_version_cover_id_media_id_fk" FOREIGN KEY ("version_cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v" ADD CONSTRAINT "_products_v_version_seo_image_id_media_id_fk" FOREIGN KEY ("version_seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_products_v_locales" ADD CONSTRAINT "_products_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_products_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "work_results" ADD CONSTRAINT "work_results_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."work"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "work_results_locales" ADD CONSTRAINT "work_results_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."work_results"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "work" ADD CONSTRAINT "work_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "work" ADD CONSTRAINT "work_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "work_locales" ADD CONSTRAINT "work_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."work"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "work_rels" ADD CONSTRAINT "work_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."work"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "work_rels" ADD CONSTRAINT "work_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_work_v_version_results" ADD CONSTRAINT "_work_v_version_results_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_work_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_work_v_version_results_locales" ADD CONSTRAINT "_work_v_version_results_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_work_v_version_results"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_work_v" ADD CONSTRAINT "_work_v_parent_id_work_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."work"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_work_v" ADD CONSTRAINT "_work_v_version_cover_id_media_id_fk" FOREIGN KEY ("version_cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_work_v" ADD CONSTRAINT "_work_v_version_seo_image_id_media_id_fk" FOREIGN KEY ("version_seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_work_v_locales" ADD CONSTRAINT "_work_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_work_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_work_v_rels" ADD CONSTRAINT "_work_v_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."_work_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_work_v_rels" ADD CONSTRAINT "_work_v_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "labs" ADD CONSTRAINT "labs_cover_id_media_id_fk" FOREIGN KEY ("cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "labs" ADD CONSTRAINT "labs_seo_image_id_media_id_fk" FOREIGN KEY ("seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "labs_locales" ADD CONSTRAINT "labs_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."labs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "_labs_v" ADD CONSTRAINT "_labs_v_parent_id_labs_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."labs"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_labs_v" ADD CONSTRAINT "_labs_v_version_cover_id_media_id_fk" FOREIGN KEY ("version_cover_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_labs_v" ADD CONSTRAINT "_labs_v_version_seo_image_id_media_id_fk" FOREIGN KEY ("version_seo_image_id") REFERENCES "public"."media"("id") ON DELETE set null ON UPDATE no action;
  ALTER TABLE "_labs_v_locales" ADD CONSTRAINT "_labs_v_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."_labs_v"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "services_locales" ADD CONSTRAINT "services_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "media_locales" ADD CONSTRAINT "media_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "users_sessions" ADD CONSTRAINT "users_sessions_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_jobs_log" ADD CONSTRAINT "payload_jobs_log_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."payload_jobs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_locked_documents"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_products_fk" FOREIGN KEY ("products_id") REFERENCES "public"."products"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_work_fk" FOREIGN KEY ("work_id") REFERENCES "public"."work"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_labs_fk" FOREIGN KEY ("labs_id") REFERENCES "public"."labs"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_services_fk" FOREIGN KEY ("services_id") REFERENCES "public"."services"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_media_fk" FOREIGN KEY ("media_id") REFERENCES "public"."media"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_leads_fk" FOREIGN KEY ("leads_id") REFERENCES "public"."leads"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_locked_documents_rels" ADD CONSTRAINT "payload_locked_documents_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_parent_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."payload_preferences"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "payload_preferences_rels" ADD CONSTRAINT "payload_preferences_rels_users_fk" FOREIGN KEY ("users_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_why_pillars" ADD CONSTRAINT "home_why_pillars_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_why_pillars_locales" ADD CONSTRAINT "home_why_pillars_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_why_pillars"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_philosophy_lines" ADD CONSTRAINT "home_philosophy_lines_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_philosophy_lines_locales" ADD CONSTRAINT "home_philosophy_lines_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home_philosophy_lines"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "home_locales" ADD CONSTRAINT "home_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."home"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_social" ADD CONSTRAINT "site_social_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site"("id") ON DELETE cascade ON UPDATE no action;
  ALTER TABLE "site_locales" ADD CONSTRAINT "site_locales_parent_id_fk" FOREIGN KEY ("_parent_id") REFERENCES "public"."site"("id") ON DELETE cascade ON UPDATE no action;
  CREATE INDEX "products_gallery_order_idx" ON "products_gallery" USING btree ("_order");
  CREATE INDEX "products_gallery_parent_id_idx" ON "products_gallery" USING btree ("_parent_id");
  CREATE INDEX "products_gallery_image_idx" ON "products_gallery" USING btree ("image_id");
  CREATE INDEX "products_cover_idx" ON "products" USING btree ("cover_id");
  CREATE INDEX "products_seo_seo_image_idx" ON "products" USING btree ("seo_image_id");
  CREATE UNIQUE INDEX "products_slug_idx" ON "products" USING btree ("slug");
  CREATE INDEX "products_updated_at_idx" ON "products" USING btree ("updated_at");
  CREATE INDEX "products_created_at_idx" ON "products" USING btree ("created_at");
  CREATE INDEX "products__status_idx" ON "products" USING btree ("_status");
  CREATE UNIQUE INDEX "products_locales_locale_parent_id_unique" ON "products_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_products_v_version_gallery_order_idx" ON "_products_v_version_gallery" USING btree ("_order");
  CREATE INDEX "_products_v_version_gallery_parent_id_idx" ON "_products_v_version_gallery" USING btree ("_parent_id");
  CREATE INDEX "_products_v_version_gallery_image_idx" ON "_products_v_version_gallery" USING btree ("image_id");
  CREATE INDEX "_products_v_parent_idx" ON "_products_v" USING btree ("parent_id");
  CREATE INDEX "_products_v_version_version_cover_idx" ON "_products_v" USING btree ("version_cover_id");
  CREATE INDEX "_products_v_version_seo_version_seo_image_idx" ON "_products_v" USING btree ("version_seo_image_id");
  CREATE INDEX "_products_v_version_version_slug_idx" ON "_products_v" USING btree ("version_slug");
  CREATE INDEX "_products_v_version_version_updated_at_idx" ON "_products_v" USING btree ("version_updated_at");
  CREATE INDEX "_products_v_version_version_created_at_idx" ON "_products_v" USING btree ("version_created_at");
  CREATE INDEX "_products_v_version_version__status_idx" ON "_products_v" USING btree ("version__status");
  CREATE INDEX "_products_v_created_at_idx" ON "_products_v" USING btree ("created_at");
  CREATE INDEX "_products_v_updated_at_idx" ON "_products_v" USING btree ("updated_at");
  CREATE INDEX "_products_v_snapshot_idx" ON "_products_v" USING btree ("snapshot");
  CREATE INDEX "_products_v_published_locale_idx" ON "_products_v" USING btree ("published_locale");
  CREATE INDEX "_products_v_latest_idx" ON "_products_v" USING btree ("latest");
  CREATE INDEX "_products_v_autosave_idx" ON "_products_v" USING btree ("autosave");
  CREATE UNIQUE INDEX "_products_v_locales_locale_parent_id_unique" ON "_products_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "work_results_order_idx" ON "work_results" USING btree ("_order");
  CREATE INDEX "work_results_parent_id_idx" ON "work_results" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "work_results_locales_locale_parent_id_unique" ON "work_results_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "work_cover_idx" ON "work" USING btree ("cover_id");
  CREATE INDEX "work_seo_seo_image_idx" ON "work" USING btree ("seo_image_id");
  CREATE UNIQUE INDEX "work_slug_idx" ON "work" USING btree ("slug");
  CREATE INDEX "work_updated_at_idx" ON "work" USING btree ("updated_at");
  CREATE INDEX "work_created_at_idx" ON "work" USING btree ("created_at");
  CREATE INDEX "work__status_idx" ON "work" USING btree ("_status");
  CREATE UNIQUE INDEX "work_locales_locale_parent_id_unique" ON "work_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "work_rels_order_idx" ON "work_rels" USING btree ("order");
  CREATE INDEX "work_rels_parent_idx" ON "work_rels" USING btree ("parent_id");
  CREATE INDEX "work_rels_path_idx" ON "work_rels" USING btree ("path");
  CREATE INDEX "work_rels_services_id_idx" ON "work_rels" USING btree ("services_id");
  CREATE INDEX "_work_v_version_results_order_idx" ON "_work_v_version_results" USING btree ("_order");
  CREATE INDEX "_work_v_version_results_parent_id_idx" ON "_work_v_version_results" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "_work_v_version_results_locales_locale_parent_id_unique" ON "_work_v_version_results_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_work_v_parent_idx" ON "_work_v" USING btree ("parent_id");
  CREATE INDEX "_work_v_version_version_cover_idx" ON "_work_v" USING btree ("version_cover_id");
  CREATE INDEX "_work_v_version_seo_version_seo_image_idx" ON "_work_v" USING btree ("version_seo_image_id");
  CREATE INDEX "_work_v_version_version_slug_idx" ON "_work_v" USING btree ("version_slug");
  CREATE INDEX "_work_v_version_version_updated_at_idx" ON "_work_v" USING btree ("version_updated_at");
  CREATE INDEX "_work_v_version_version_created_at_idx" ON "_work_v" USING btree ("version_created_at");
  CREATE INDEX "_work_v_version_version__status_idx" ON "_work_v" USING btree ("version__status");
  CREATE INDEX "_work_v_created_at_idx" ON "_work_v" USING btree ("created_at");
  CREATE INDEX "_work_v_updated_at_idx" ON "_work_v" USING btree ("updated_at");
  CREATE INDEX "_work_v_snapshot_idx" ON "_work_v" USING btree ("snapshot");
  CREATE INDEX "_work_v_published_locale_idx" ON "_work_v" USING btree ("published_locale");
  CREATE INDEX "_work_v_latest_idx" ON "_work_v" USING btree ("latest");
  CREATE INDEX "_work_v_autosave_idx" ON "_work_v" USING btree ("autosave");
  CREATE UNIQUE INDEX "_work_v_locales_locale_parent_id_unique" ON "_work_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_work_v_rels_order_idx" ON "_work_v_rels" USING btree ("order");
  CREATE INDEX "_work_v_rels_parent_idx" ON "_work_v_rels" USING btree ("parent_id");
  CREATE INDEX "_work_v_rels_path_idx" ON "_work_v_rels" USING btree ("path");
  CREATE INDEX "_work_v_rels_services_id_idx" ON "_work_v_rels" USING btree ("services_id");
  CREATE INDEX "labs_cover_idx" ON "labs" USING btree ("cover_id");
  CREATE INDEX "labs_seo_seo_image_idx" ON "labs" USING btree ("seo_image_id");
  CREATE UNIQUE INDEX "labs_slug_idx" ON "labs" USING btree ("slug");
  CREATE INDEX "labs_updated_at_idx" ON "labs" USING btree ("updated_at");
  CREATE INDEX "labs_created_at_idx" ON "labs" USING btree ("created_at");
  CREATE INDEX "labs__status_idx" ON "labs" USING btree ("_status");
  CREATE UNIQUE INDEX "labs_locales_locale_parent_id_unique" ON "labs_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "_labs_v_parent_idx" ON "_labs_v" USING btree ("parent_id");
  CREATE INDEX "_labs_v_version_version_cover_idx" ON "_labs_v" USING btree ("version_cover_id");
  CREATE INDEX "_labs_v_version_seo_version_seo_image_idx" ON "_labs_v" USING btree ("version_seo_image_id");
  CREATE INDEX "_labs_v_version_version_slug_idx" ON "_labs_v" USING btree ("version_slug");
  CREATE INDEX "_labs_v_version_version_updated_at_idx" ON "_labs_v" USING btree ("version_updated_at");
  CREATE INDEX "_labs_v_version_version_created_at_idx" ON "_labs_v" USING btree ("version_created_at");
  CREATE INDEX "_labs_v_version_version__status_idx" ON "_labs_v" USING btree ("version__status");
  CREATE INDEX "_labs_v_created_at_idx" ON "_labs_v" USING btree ("created_at");
  CREATE INDEX "_labs_v_updated_at_idx" ON "_labs_v" USING btree ("updated_at");
  CREATE INDEX "_labs_v_snapshot_idx" ON "_labs_v" USING btree ("snapshot");
  CREATE INDEX "_labs_v_published_locale_idx" ON "_labs_v" USING btree ("published_locale");
  CREATE INDEX "_labs_v_latest_idx" ON "_labs_v" USING btree ("latest");
  CREATE INDEX "_labs_v_autosave_idx" ON "_labs_v" USING btree ("autosave");
  CREATE UNIQUE INDEX "_labs_v_locales_locale_parent_id_unique" ON "_labs_v_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "services_updated_at_idx" ON "services" USING btree ("updated_at");
  CREATE INDEX "services_created_at_idx" ON "services" USING btree ("created_at");
  CREATE UNIQUE INDEX "services_locales_locale_parent_id_unique" ON "services_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "media_updated_at_idx" ON "media" USING btree ("updated_at");
  CREATE INDEX "media_created_at_idx" ON "media" USING btree ("created_at");
  CREATE UNIQUE INDEX "media_filename_idx" ON "media" USING btree ("filename");
  CREATE INDEX "media_sizes_card_sizes_card_filename_idx" ON "media" USING btree ("sizes_card_filename");
  CREATE INDEX "media_sizes_wide_sizes_wide_filename_idx" ON "media" USING btree ("sizes_wide_filename");
  CREATE INDEX "media_sizes_og_sizes_og_filename_idx" ON "media" USING btree ("sizes_og_filename");
  CREATE UNIQUE INDEX "media_locales_locale_parent_id_unique" ON "media_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "leads_updated_at_idx" ON "leads" USING btree ("updated_at");
  CREATE INDEX "leads_created_at_idx" ON "leads" USING btree ("created_at");
  CREATE INDEX "users_sessions_order_idx" ON "users_sessions" USING btree ("_order");
  CREATE INDEX "users_sessions_parent_id_idx" ON "users_sessions" USING btree ("_parent_id");
  CREATE INDEX "users_updated_at_idx" ON "users" USING btree ("updated_at");
  CREATE INDEX "users_created_at_idx" ON "users" USING btree ("created_at");
  CREATE UNIQUE INDEX "users_email_idx" ON "users" USING btree ("email");
  CREATE UNIQUE INDEX "payload_kv_key_idx" ON "payload_kv" USING btree ("key");
  CREATE INDEX "payload_jobs_log_order_idx" ON "payload_jobs_log" USING btree ("_order");
  CREATE INDEX "payload_jobs_log_parent_id_idx" ON "payload_jobs_log" USING btree ("_parent_id");
  CREATE INDEX "payload_jobs_completed_at_idx" ON "payload_jobs" USING btree ("completed_at");
  CREATE INDEX "payload_jobs_total_tried_idx" ON "payload_jobs" USING btree ("total_tried");
  CREATE INDEX "payload_jobs_has_error_idx" ON "payload_jobs" USING btree ("has_error");
  CREATE INDEX "payload_jobs_task_slug_idx" ON "payload_jobs" USING btree ("task_slug");
  CREATE INDEX "payload_jobs_queue_idx" ON "payload_jobs" USING btree ("queue");
  CREATE INDEX "payload_jobs_wait_until_idx" ON "payload_jobs" USING btree ("wait_until");
  CREATE INDEX "payload_jobs_processing_idx" ON "payload_jobs" USING btree ("processing");
  CREATE INDEX "payload_jobs_updated_at_idx" ON "payload_jobs" USING btree ("updated_at");
  CREATE INDEX "payload_jobs_created_at_idx" ON "payload_jobs" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_global_slug_idx" ON "payload_locked_documents" USING btree ("global_slug");
  CREATE INDEX "payload_locked_documents_updated_at_idx" ON "payload_locked_documents" USING btree ("updated_at");
  CREATE INDEX "payload_locked_documents_created_at_idx" ON "payload_locked_documents" USING btree ("created_at");
  CREATE INDEX "payload_locked_documents_rels_order_idx" ON "payload_locked_documents_rels" USING btree ("order");
  CREATE INDEX "payload_locked_documents_rels_parent_idx" ON "payload_locked_documents_rels" USING btree ("parent_id");
  CREATE INDEX "payload_locked_documents_rels_path_idx" ON "payload_locked_documents_rels" USING btree ("path");
  CREATE INDEX "payload_locked_documents_rels_products_id_idx" ON "payload_locked_documents_rels" USING btree ("products_id");
  CREATE INDEX "payload_locked_documents_rels_work_id_idx" ON "payload_locked_documents_rels" USING btree ("work_id");
  CREATE INDEX "payload_locked_documents_rels_labs_id_idx" ON "payload_locked_documents_rels" USING btree ("labs_id");
  CREATE INDEX "payload_locked_documents_rels_services_id_idx" ON "payload_locked_documents_rels" USING btree ("services_id");
  CREATE INDEX "payload_locked_documents_rels_media_id_idx" ON "payload_locked_documents_rels" USING btree ("media_id");
  CREATE INDEX "payload_locked_documents_rels_leads_id_idx" ON "payload_locked_documents_rels" USING btree ("leads_id");
  CREATE INDEX "payload_locked_documents_rels_users_id_idx" ON "payload_locked_documents_rels" USING btree ("users_id");
  CREATE INDEX "payload_preferences_key_idx" ON "payload_preferences" USING btree ("key");
  CREATE INDEX "payload_preferences_updated_at_idx" ON "payload_preferences" USING btree ("updated_at");
  CREATE INDEX "payload_preferences_created_at_idx" ON "payload_preferences" USING btree ("created_at");
  CREATE INDEX "payload_preferences_rels_order_idx" ON "payload_preferences_rels" USING btree ("order");
  CREATE INDEX "payload_preferences_rels_parent_idx" ON "payload_preferences_rels" USING btree ("parent_id");
  CREATE INDEX "payload_preferences_rels_path_idx" ON "payload_preferences_rels" USING btree ("path");
  CREATE INDEX "payload_preferences_rels_users_id_idx" ON "payload_preferences_rels" USING btree ("users_id");
  CREATE INDEX "payload_migrations_updated_at_idx" ON "payload_migrations" USING btree ("updated_at");
  CREATE INDEX "payload_migrations_created_at_idx" ON "payload_migrations" USING btree ("created_at");
  CREATE INDEX "home_why_pillars_order_idx" ON "home_why_pillars" USING btree ("_order");
  CREATE INDEX "home_why_pillars_parent_id_idx" ON "home_why_pillars" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "home_why_pillars_locales_locale_parent_id_unique" ON "home_why_pillars_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "home_philosophy_lines_order_idx" ON "home_philosophy_lines" USING btree ("_order");
  CREATE INDEX "home_philosophy_lines_parent_id_idx" ON "home_philosophy_lines" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "home_philosophy_lines_locales_locale_parent_id_unique" ON "home_philosophy_lines_locales" USING btree ("_locale","_parent_id");
  CREATE UNIQUE INDEX "home_locales_locale_parent_id_unique" ON "home_locales" USING btree ("_locale","_parent_id");
  CREATE INDEX "site_social_order_idx" ON "site_social" USING btree ("_order");
  CREATE INDEX "site_social_parent_id_idx" ON "site_social" USING btree ("_parent_id");
  CREATE UNIQUE INDEX "site_locales_locale_parent_id_unique" ON "site_locales" USING btree ("_locale","_parent_id");`)
}

export async function down({ db, payload, req }: MigrateDownArgs): Promise<void> {
  await db.execute(sql`
   DROP TABLE "products_gallery" CASCADE;
  DROP TABLE "products" CASCADE;
  DROP TABLE "products_locales" CASCADE;
  DROP TABLE "_products_v_version_gallery" CASCADE;
  DROP TABLE "_products_v" CASCADE;
  DROP TABLE "_products_v_locales" CASCADE;
  DROP TABLE "work_results" CASCADE;
  DROP TABLE "work_results_locales" CASCADE;
  DROP TABLE "work" CASCADE;
  DROP TABLE "work_locales" CASCADE;
  DROP TABLE "work_rels" CASCADE;
  DROP TABLE "_work_v_version_results" CASCADE;
  DROP TABLE "_work_v_version_results_locales" CASCADE;
  DROP TABLE "_work_v" CASCADE;
  DROP TABLE "_work_v_locales" CASCADE;
  DROP TABLE "_work_v_rels" CASCADE;
  DROP TABLE "labs" CASCADE;
  DROP TABLE "labs_locales" CASCADE;
  DROP TABLE "_labs_v" CASCADE;
  DROP TABLE "_labs_v_locales" CASCADE;
  DROP TABLE "services" CASCADE;
  DROP TABLE "services_locales" CASCADE;
  DROP TABLE "media" CASCADE;
  DROP TABLE "media_locales" CASCADE;
  DROP TABLE "leads" CASCADE;
  DROP TABLE "users_sessions" CASCADE;
  DROP TABLE "users" CASCADE;
  DROP TABLE "payload_kv" CASCADE;
  DROP TABLE "payload_jobs_log" CASCADE;
  DROP TABLE "payload_jobs" CASCADE;
  DROP TABLE "payload_locked_documents" CASCADE;
  DROP TABLE "payload_locked_documents_rels" CASCADE;
  DROP TABLE "payload_preferences" CASCADE;
  DROP TABLE "payload_preferences_rels" CASCADE;
  DROP TABLE "payload_migrations" CASCADE;
  DROP TABLE "home_why_pillars" CASCADE;
  DROP TABLE "home_why_pillars_locales" CASCADE;
  DROP TABLE "home_philosophy_lines" CASCADE;
  DROP TABLE "home_philosophy_lines_locales" CASCADE;
  DROP TABLE "home" CASCADE;
  DROP TABLE "home_locales" CASCADE;
  DROP TABLE "site_social" CASCADE;
  DROP TABLE "site" CASCADE;
  DROP TABLE "site_locales" CASCADE;
  DROP TYPE "public"."_locales";
  DROP TYPE "public"."enum_products_lifecycle";
  DROP TYPE "public"."enum_products_status";
  DROP TYPE "public"."enum__products_v_version_status";
  DROP TYPE "public"."enum__products_v_published_locale";
  DROP TYPE "public"."enum_work_status";
  DROP TYPE "public"."enum__work_v_version_status";
  DROP TYPE "public"."enum__work_v_published_locale";
  DROP TYPE "public"."enum_labs_stage";
  DROP TYPE "public"."enum_labs_status";
  DROP TYPE "public"."enum__labs_v_version_stage";
  DROP TYPE "public"."enum__labs_v_version_status";
  DROP TYPE "public"."enum__labs_v_published_locale";
  DROP TYPE "public"."enum_leads_status";
  DROP TYPE "public"."enum_users_role";
  DROP TYPE "public"."enum_payload_jobs_log_task_slug";
  DROP TYPE "public"."enum_payload_jobs_log_state";
  DROP TYPE "public"."enum_payload_jobs_task_slug";`)
}
