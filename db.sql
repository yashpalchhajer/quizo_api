-- Config Seeder --


INSERT INTO `qa_merchant_masters` (`id`, `name`, `password`, `email`, `contact_number`, `api_key`, `status`, `createdAt`, `updatedAt`) VALUES (NULL, 'Quizo', '12345678', 'yashpalchhajer@gmail.com', '9509807418', '44d4a56s4d564asd46a4sd4as6d4a64sd64sa64d6sa46d5', 'ACTIVE', CURRENT_TIMESTAMP, '2019-05-10 08:20:27');

INSERT INTO `qa_quiz_categories` (`id`, `name`, `status`, `createdAt`, `updatedAt`) VALUES (NULL, 'Gen', 'ACTIVE', CURRENT_TIMESTAMP, NULL);


INSERT INTO `qa_quiz_configs` (`id`, `category_id`, `name`, `icon`, `quiz_cost`, `team_size`, `min_members`, `winner_prize`, `status`, `createdAt`, `updatedAt`) VALUES (NULL, '1', 'General', NULL, '6', '2', '2', '10', 'ACTIVE', CURRENT_TIMESTAMP, NULL);

-- set composit primary key
ALTER TABLE `qa_quiz_teams` ADD PRIMARY KEY( `team_id`, `player_id`);
ALTER TABLE `qa_quiz_teams` CHANGE `id` `id` INT(11) NOT NULL AUTO_INCREMENT;

-- set Foreign key 
ALTER TABLE `qa_quiz_teams` ADD CONSTRAINT `quiz_ref` FOREIGN KEY (`quiz_id`) REFERENCES `qa_quiz_configs`(`id`) ON DELETE RESTRICT ON UPDATE NO ACTION;


ALTER TABLE `qa_quiz_categories` CHANGE `updatedAt` `updatedAt` DATETIME on update CURRENT_TIMESTAMP NOT NULL;


ALTER TABLE `qa_quiz_configs` CHANGE `updatedAt` `updatedAt` DATETIME on update CURRENT_TIMESTAMP NULL;

-- to change Quiz Config table add new coloms

ALTER TABLE `qa_quiz_configs` ADD `quiz_duration` INT(3) NOT NULL AFTER `winner_prize`, ADD `no_of_questions` INT(3) NOT NULL AFTER `quiz_duration`, ADD `question_interval` INT(3) NOT NULL AFTER `no_of_questions`;

--add values to new coloms

UPDATE `qa_quiz_configs` SET `quiz_duration` = '300' WHERE `qa_quiz_configs`.`id` = 1;
UPDATE `qa_quiz_configs` SET `no_of_questions` = '10' WHERE `qa_quiz_configs`.`id` = 1;
UPDATE `qa_quiz_configs` SET `question_interval` = '30' WHERE `qa_quiz_configs`.`id` = 1;

