CREATE TABLE `charge_channel_series_items` (
	`id` integer PRIMARY KEY NOT NULL,
	`device_id` text NOT NULL,
	`channel` integer NOT NULL,
	`timestamp` integer NOT NULL,
	`values` blob NOT NULL,
	FOREIGN KEY (`device_id`) REFERENCES `devices`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `devices` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `devices_name_unique` ON `devices` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `nameIdx` ON `devices` (`name`);