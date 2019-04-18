-- set composit primary key
ALTER TABLE `qa_quiz_teams` ADD PRIMARY KEY( `team_id`, `player_id`);

-- set Foreign key 
ALTER TABLE `qa_quiz_teams` ADD CONSTRAINT `quiz_ref` FOREIGN KEY (`quiz_id`) REFERENCES `qa_quiz_configs`(`id`) ON DELETE RESTRICT ON UPDATE NO ACTION;


ALTER TABLE `qa_quiz_categories` CHANGE `updatedAt` `updatedAt` DATETIME on update CURRENT_TIMESTAMP NOT NULL;


ALTER TABLE `qa_quiz_configs` CHANGE `updatedAt` `updatedAt` DATETIME on update CURRENT_TIMESTAMP NULL;

