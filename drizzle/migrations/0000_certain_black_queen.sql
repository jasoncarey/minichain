CREATE TABLE `blocks` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`index` integer NOT NULL,
	`timestamp` integer NOT NULL,
	`previous_hash` text NOT NULL,
	`hash` text NOT NULL,
	`nonce` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `mempool` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`from` text NOT NULL,
	`to` text NOT NULL,
	`amount` integer NOT NULL,
	`nonce` integer NOT NULL,
	`signature` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `state` (
	`address` text PRIMARY KEY NOT NULL,
	`balance` integer NOT NULL,
	`nonce` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `transactions` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`block_id` integer,
	`from` text NOT NULL,
	`to` text NOT NULL,
	`amount` integer NOT NULL,
	`nonce` integer NOT NULL,
	`signature` text NOT NULL,
	FOREIGN KEY (`block_id`) REFERENCES `blocks`(`id`) ON UPDATE no action ON DELETE no action
);
