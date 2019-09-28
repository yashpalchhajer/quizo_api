-- Config Seeder --


INSERT INTO `qa_merchant_masters` (`id`, `name`, `password`, `email`, `contact_number`, `api_key`, `status`, `createdAt`, `updatedAt`) VALUES (NULL, 'Quizo', '12345678', 'yashpalchhajer@gmail.com', '9509807418', '44d4a56s4d564asd46a4sd4as6d4a64sd64sa64d6sa46d5', 'ACTIVE', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);

INSERT INTO `qa_quiz_categories` (`id`, `name`, `status`, `createdAt`, `updatedAt`) VALUES (NULL, 'Gen', 'ACTIVE', CURRENT_TIMESTAMP, NULL);


INSERT INTO `qa_quiz_configs` (`id`, `category_id`, `name`, `icon`, `quiz_cost`, `team_size`, `min_members`, `winner_prize`,`quiz_duration`,`no_of_questions`,`question_interval`, `status`, `createdAt`, `updatedAt`) VALUES (NULL, '1', 'General', NULL, '6', '2', '2', '10','5','10','30', 'ACTIVE', CURRENT_TIMESTAMP, NULL);

-- set composit primary key
ALTER TABLE `qa_quiz_teams` ADD PRIMARY KEY( `team_id`, `player_id`);
ALTER TABLE `qa_quiz_teams` ADD INDEX(`id`);
ALTER TABLE `qa_quiz_teams` CHANGE `id` `id` INT(11) NOT NULL AUTO_INCREMENT;

-- set Foreign key 
ALTER TABLE `qa_quiz_teams` ADD CONSTRAINT `quiz_ref` FOREIGN KEY (`quiz_id`) REFERENCES `qa_quiz_configs`(`id`) ON DELETE RESTRICT ON UPDATE NO ACTION;

ALTER TABLE `qa_quiz_teams` CHANGE `updatedAt` `updatedAt` DATETIME on update CURRENT_TIMESTAMP;


ALTER TABLE `qa_quiz_categories` CHANGE `updatedAt` `updatedAt` DATETIME on update CURRENT_TIMESTAMP;


ALTER TABLE `qa_quiz_configs` CHANGE `updatedAt` `updatedAt` DATETIME on update CURRENT_TIMESTAMP NULL;


ALTER TABLE `qa_player_questions` CHANGE `updatedAt` `updatedAt` DATETIME on update CURRENT_TIMESTAMP NULL;

ALTER TABLE `qa_question_masters` ADD CONSTRAINT `quiz-id` FOREIGN KEY (`quiz_id`) REFERENCES `qa_quiz_configs`(`id`) ON DELETE RESTRICT ON UPDATE NO ACTION;

-- to change Quiz Config table add new coloms



--add values to new coloms
ALTER TABLE `qa_quiz_configs` ADD `quiz_duration` INT(3) NOT NULL AFTER `winner_prize`, ADD `no_of_questions` INT(3) NOT NULL AFTER `quiz_duration`, ADD `question_interval` INT(3) NOT NULL AFTER `no_of_questions`;

UPDATE `qa_quiz_configs` SET `quiz_duration` = '300' WHERE `qa_quiz_configs`.`id` = 1;
UPDATE `qa_quiz_configs` SET `no_of_questions` = '10' WHERE `qa_quiz_configs`.`id` = 1;
UPDATE `qa_quiz_configs` SET `question_interval` = '30' WHERE `qa_quiz_configs`.`id` = 1;

ALTER TABLE `qa_players` ADD `is_otp_verified` ENUM('YES','NO') NOT NULL DEFAULT 'NO' AFTER `status`;


/** 14 May 19 **/

ALTER TABLE `qa_players` ADD UNIQUE(`contact_number`);
ALTER TABLE `qa_players` ADD INDEX(`contact_number`);

/** 15 May 19 **/

ALTER TABLE `qa_player_questions`   
  ADD COLUMN `quiz_id` INT(11) DEFAULT 1 NOT NULL AFTER `player_id`, 
  DROP PRIMARY KEY,
  ADD PRIMARY KEY (`player_id`, `quiz_id`),
  ADD CONSTRAINT `playerId` FOREIGN KEY (`player_id`) REFERENCES `qa_players`(`id`) ON UPDATE RESTRICT ON DELETE RESTRICT,
  ADD CONSTRAINT `quizId` FOREIGN KEY (`quiz_id`) REFERENCES `qa_quiz_configs`(`id`) ON UPDATE RESTRICT ON DELETE RESTRICT;

ALTER TABLE `qa_player_questions` CHANGE `quiz_id` `quiz_id` INT(11) NOT NULL;
ALTER TABLE `qa_quiz_teams` CHANGE `final_score` `final_score` INT(11) DEFAULT 0 NOT NULL;


/** 17 May 19 **/
ALTER TABLE `qa_quiz_teams` ADD COLUMN `pushed_questions` INT(11) DEFAULT 0 NOT NULL AFTER `final_score`;


/** 20 May */
ALTER TABLE `qa_quiz_teams` ADD `player_status` ENUM('ACTIVE','INACTIVE') NOT NULL DEFAULT 'ACTIVE' AFTER `quiz_id`;

/** 12 Jun */
ALTER TABLE `qa_quiz_teams` ADD `quit_time` DATETIME NULL AFTER `player_status`;

ALTER TABLE `qa_quiz_configs`   
	CHANGE `quiz_duration` `quiz_duration` DOUBLE(5,2) NOT NULL,
	CHANGE `question_interval` `question_interval` DOUBLE(5,2) NOT NULL;


ALTER TABLE `quizo_api`.`qa_quiz_teams`   
	CHANGE `player_status` `player_status` ENUM('ACTIVE','INACTIVE','TERMINATED') CHARSET latin1 COLLATE latin1_swedish_ci DEFAULT 'ACTIVE' NOT NULL;

*************** 22 Aug 2019 **************

ALTER TABLE `qa_api_providers` ADD `icon` VARCHAR(255) NULL AFTER `email`;
ALTER TABLE `qa_payment_masters` ADD `transaction_type` ENUM('ADD','REDEEM') NOT NULL AFTER `provider_id`;

/** table comments */
ALTER TABLE `qa_payment_masters` CHANGE `id` `id` INT(11) NOT NULL AUTO_INCREMENT COMMENT 'Auto incremented id', CHANGE `transaction_number` `transaction_number` VARCHAR(20) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL COMMENT 'Unique txn number of system to show users.', CHANGE `player_id` `player_id` INT(11) NOT NULL COMMENT 'player table primary key', CHANGE `amount` `amount` DOUBLE NOT NULL DEFAULT '0' COMMENT 'amount to be transact', CHANGE `plan_id` `plan_id` VARCHAR(50) CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL COMMENT 'Plan that is created in mongodb', CHANGE `provider_id` `provider_id` INT(11) NOT NULL COMMENT 'by which txn has to be done [api provider primary key]', CHANGE `transaction_type` `transaction_type` ENUM('ADD','REDEEM') CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL COMMENT 'either money add or redeem', CHANGE `status` `status` ENUM('INITIATED','HOLD','SUCCESS','FAILED','REFUND') CHARACTER SET latin1 COLLATE latin1_swedish_ci NOT NULL COMMENT 'txn status at diff level', CHANGE `provider_message` `provider_message` TEXT CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT NULL COMMENT 'message from provider', CHANGE `provider_transaction_number` `provider_transaction_number` VARCHAR(50) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT '' COMMENT 'provider transaction id', CHANGE `ref1_no` `ref1_no` INT(11) NULL DEFAULT NULL COMMENT 'self primary key in case of status refund or refund amount', CHANGE `reference_number` `reference_number` VARCHAR(50) CHARACTER SET latin1 COLLATE latin1_swedish_ci NULL DEFAULT '' COMMENT 'provider reference number in case of provider provide', CHANGE `createdAt` `createdAt` DATETIME NOT NULL COMMENT 'current timestamp', CHANGE `updatedAt` `updatedAt` DATETIME NOT NULL COMMENT 'last update time';


INSERT INTO `qa_api_providers` (`id`, `name`, `contact_number`, `email`, `icon`, `type`, `status`, `credentials`, `createdAt`, `updatedAt`) VALUES (NULL, 'Paytm', '8098565898', 'support@paytm.com', NULL, 'PAYMENT', 'ACTIVE', '{"MID":"MhLVOC68539327443881","WEBSITE":"WEBSTAGING","CHANNEL_ID":"APP","INDUSTRY_TYPE_ID":"Retail","MERCHANT_KEY":"WuqxX@Ec2L%KgBWv","TRANSACTION_URL":"https://securegw-stage.paytm.in/theia/processTransaction","REQUERY_URL":"https://securegw-stage.paytm.in/merchant-status/getTxnStatus","CALLBACK_URL":"http://ec2-18-219-98-11.us-east-2.compute.amazonaws.com:8080/paytm-call-back"}', CURRENT_TIMESTAMP, CURRENT_TIMESTAMP);


-- Test Skills
INSERT INTO `qa_quiz_categories` (`name`, `status`, `createdAt`, `updatedAt`) VALUES ('Test', 'ACTIVE', CURRENT_TIMESTAMP, NULL);

INSERT INTO `qa_quiz_configs` (`category_id`, `name`, `icon`, `quiz_cost`, `team_size`, `min_members`, `winner_prize`, `quiz_duration`, `no_of_questions`, `question_interval`, `status`, `createdAt`, `updatedAt`) VALUES (2, 'Test Skills', NULL, '0', '1', '1', '10', '2.5', '5', '30', 'ACTIVE', CURRENT_TIMESTAMP, NULL);


