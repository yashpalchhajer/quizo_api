-- Config Seeder --


INSERT INTO `qa_merchant_masters` (`id`, `name`, `password`, `email`, `contact_number`, `api_key`, `status`, `createdAt`, `updatedAt`) VALUES (NULL, 'Quizo', '12345678', 'yashpalchhajer@gmail.com', '9509807418', '44d4a56s4d564asd46a4sd4as6d4a64sd64sa64d6sa46d5', 'ACTIVE', CURRENT_TIMESTAMP, '2019-05-10 08:20:27');

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

ALTER TABLE `qa_question_masters` DROP FOREIGN KEY `quiz-category`; 
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
