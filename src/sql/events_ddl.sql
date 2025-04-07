-- public.events definition

-- DROP TABLE public.events;

CREATE TABLE public.events (
	id int4 NOT NULL,
	title varchar(255) NOT NULL,
	description text NULL,
	"content" text NULL,
	link text NULL,
	author text NULL,
	pub_date timestamptz NULL,
	created_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
	updated_at timestamptz DEFAULT CURRENT_TIMESTAMP NULL,
	image_url text NULL,
	"location" text NULL,
	event_end_date timestamptz NULL,
	event_start_date timestamptz NULL,
	base_url text NULL,
	event_time_zone text DEFAULT 'UTC'::text NULL,
	geo_location public.geography(point, 4326) NULL,
	CONSTRAINT valid_timezone CHECK (is_valid_timezone(event_time_zone))
);
