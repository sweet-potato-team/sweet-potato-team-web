-- 【temp_tb_Users】使用者資料表
CREATE TABLE IF NOT EXISTS `cloud-db-sweet-potato`.`temp_tb_Users` (
  `sys_user_id`            INT UNSIGNED NOT NULL AUTO_INCREMENT,  -- 主鍵
  `user_line_id`           VARCHAR(100) NOT NULL,                -- 使用者LINE ID
  `user_name`              VARCHAR(100) NOT NULL,                -- 使用者名稱
  `user_gender`            VARCHAR(10) NOT NULL,                 -- 使用者性別
  `user_age`               INT UNSIGNED NOT NULL,                -- 使用者年齡
  `user_education`         VARCHAR(100) NOT NULL,                -- 使用者教育程度
  `user_cohabitant`        VARCHAR(100) NOT NULL,                -- 同住者
  `user_medical_frequency` VARCHAR(100) NOT NULL,                -- 心理診所就醫頻率
  `user_view_times`        INT UNSIGNED NOT NULL DEFAULT 0,      -- 查看次數(月)
  `doctor_view_or_not`     TINYINT(1) NOT NULL DEFAULT 0,        -- 是否讓醫師檢視資料
  PRIMARY KEY (`sys_user_id`),
  UNIQUE INDEX `sys_user_id_UNIQUE` (`sys_user_id` ASC),
  UNIQUE INDEX `user_line_id_UNIQUE` (`user_line_id` ASC)
) ENGINE = InnoDB;

-- 【temp_tb_Emotion_Analysis】情緒分析資料表
CREATE TABLE IF NOT EXISTS `cloud-db-sweet-potato`.`temp_tb_Emotion_Analysis` (
  `emo_id`                 INT UNSIGNED NOT NULL AUTO_INCREMENT,  -- 主鍵
  `sys_user_id`            INT UNSIGNED NOT NULL,                 -- 使用者系統ID
  `session_id`             VARCHAR(100) NOT NULL,                 -- 會話ID
  `user_message`           VARCHAR(250) NOT NULL,                 -- 會話內容
  `created_time`           DATETIME NOT NULL,                     -- 創建時間
  `depression_pct`         FLOAT NOT NULL,                        -- 憂鬱百分比
  `toxicity_pct`           FLOAT NOT NULL,                        -- 毒性百分比
  `emotion_tendency_score` FLOAT NOT NULL,                        -- 情緒傾向分數
  `final_score`            FLOAT NOT NULL,                        -- 最終分數
  `emotion_recog_1_label`  VARCHAR(100) NOT NULL,                 -- 情緒識別1標籤
  `emotion_recog_1_score`  FLOAT NOT NULL,                        -- 情緒識別1分數
  `emotion_recog_2_label`  VARCHAR(100) NULL,                     -- 情緒識別2標籤（可為空）
  `emotion_recog_2_score`  FLOAT NULL,                            -- 情緒識別2分數（可為空）
  `class_introspection_per` FLOAT NOT NULL,                       -- 內省百分比
  `class_temper_per`       FLOAT NOT NULL,                        -- 脾氣百分比
  `class_attitude_per`     FLOAT NOT NULL,                        -- 態度百分比
  `class_sensitivity_per`  FLOAT NOT NULL,                        -- 敏感性百分比
  PRIMARY KEY (`emo_id`),

) ENGINE = InnoDB;

-- 【temp_tb_Depression_scale_results】抑鬱症量表結果資料表
CREATE TABLE IF NOT EXISTS `cloud-db-sweet-potato`.`temp_tb_Depression_scale_results` (
  `scale_id`        INT UNSIGNED NOT NULL AUTO_INCREMENT,  -- 測試ID
  `sys_user_id`     INT UNSIGNED NOT NULL,                 -- 使用者系統ID
  `test_datetime`   DATETIME NOT NULL,                     -- 測試日期時間
  `test_year`       INT UNSIGNED NOT NULL,                 -- 測試年份
  `test_month`      INT UNSIGNED NOT NULL,                 -- 測試月份
  `test_day`        INT UNSIGNED NOT NULL,                 -- 測試日
  `total_score`     INT UNSIGNED NOT NULL,                 -- 總分
  `cat_emotion`     INT UNSIGNED NOT NULL,                 -- 情緒分類
  `cat_sleep`       INT UNSIGNED NOT NULL,                 -- 睡眠分類
  `cat_psych`       INT UNSIGNED NOT NULL,                 -- 心理分類
  `cat_anxiety`     INT UNSIGNED NOT NULL,                 -- 焦慮分類
  `cat_physical`    INT UNSIGNED NOT NULL,                 -- 身體分類
  `state_1`         INT UNSIGNED NOT NULL,                 -- 狀態 1
  `state_2`         INT UNSIGNED NOT NULL,                 -- 狀態 2
  `state_3`         INT UNSIGNED NOT NULL,                 -- 狀態 3
  `state_4`         INT UNSIGNED NOT NULL,                 -- 狀態 4
  `state_5`         INT UNSIGNED NOT NULL,                 -- 狀態 5
  `state_6`         INT UNSIGNED NOT NULL,                 -- 狀態 6
  `state_7`         INT UNSIGNED NOT NULL,                 -- 狀態 7
  `state_8`         INT UNSIGNED NOT NULL,                 -- 狀態 8
  `state_9`         INT UNSIGNED NOT NULL,                 -- 狀態 9
  `state_10`        INT UNSIGNED NOT NULL,                 -- 狀態 10
  `state_11`        INT UNSIGNED NOT NULL,                 -- 狀態 11
  `state_12`        INT UNSIGNED NOT NULL,                 -- 狀態 12
  `state_13`        INT UNSIGNED NOT NULL,                 -- 狀態 13
  `state_14`        INT UNSIGNED NOT NULL,                 -- 狀態 14
  `state_15`        INT UNSIGNED NOT NULL,                 -- 狀態 15
  `state_16`        INT UNSIGNED NOT NULL,                 -- 狀態 16
  `state_17`        INT UNSIGNED NOT NULL,                 -- 狀態 17
  `state_18`        INT UNSIGNED NOT NULL,                 -- 狀態 18
  `state_19`        INT UNSIGNED NOT NULL,                 -- 狀態 19
  `state_20`        INT UNSIGNED NOT NULL,                 -- 狀態 20
  `state_21`        INT UNSIGNED NOT NULL,                 -- 狀態 21
  `state_22`        INT UNSIGNED NOT NULL,                 -- 狀態 22
  `state_23`        INT UNSIGNED NOT NULL,                 -- 狀態 23
  `state_24`        INT UNSIGNED NOT NULL,                 -- 狀態 24
  PRIMARY KEY (`scale_id`),
) ENGINE = InnoDB;


-- 【temp_tb_Doctors】醫師資料表
CREATE TABLE IF NOT EXISTS `cloud-db-sweet-potato`.`temp_tb_Doctors` (
  `doctor_id`              INT UNSIGNED NOT NULL AUTO_INCREMENT,  -- 醫師ID
  `sys_user_id`            INT UNSIGNED NOT NULL,                 -- 使用者系統ID【外】
  `doctor_name`            VARCHAR(100) NOT NULL,                 -- 醫師名稱
  `doctor_link_user_date`  DATETIME NOT NULL,                     -- 建立連結日
  `doctor_picture_url`     VARCHAR(255) NULL,                     -- 醫生照片
  PRIMARY KEY (`doctor_id`),
) ENGINE = InnoDB;

-- 【temp_tb_Ads】廣告資料表
CREATE TABLE IF NOT EXISTS `cloud-db-sweet-potato`.`temp_tb_Ads` (
  `ad_id`                  INT UNSIGNED NOT NULL AUTO_INCREMENT,  -- 廣告ID
  `ad_cat`                 VARCHAR(100) NOT NULL,                 -- 廣告分類
  `ad_url`                 VARCHAR(255) NOT NULL,                 -- 廣告圖片連結
  `ad_update_date`         DATETIME NOT NULL,                     -- 廣告更新日
  PRIMARY KEY (`ad_id`)
) ENGINE = InnoDB;

-- 【temp_tb_Drug_Bag_Infos】藥袋資訊表
CREATE TABLE `temp_tb_Drug_Bag_Infos` (
  `drug_bag_id` int unsigned NOT NULL AUTO_INCREMENT,
  `sys_user_id` int unsigned NOT NULL,
  `upload_time` datetime DEFAULT NULL,
  `user_name` varchar(100) DEFAULT NULL,
  `user_gender` varchar(10) DEFAULT NULL,
  `user_birth` date DEFAULT NULL,
  `user_dispense_date` datetime DEFAULT NULL,
  `user_weight` float DEFAULT NULL,
  `user_age` int DEFAULT NULL,
  `user_department` varchar(100) DEFAULT NULL,
  `drug_dosage_days` int DEFAULT NULL,
  `drug_name` varchar(100) DEFAULT NULL,
  `drug_appearance` varchar(100) DEFAULT NULL,
  `drug_sideeffect` varchar(200) DEFAULT NULL,
  `drug_dosage` varchar(100) DEFAULT NULL,
  PRIMARY KEY (`drug_bag_id`),
  UNIQUE KEY `drug_bag_id_UNIQUE` (`drug_bag_id`),
  KEY `tb_Drug_to_user_id_idx` (`sys_user_id`)
) ENGINE=InnoDB AUTO_INCREMENT=66 DEFAULT CHARSET=utf8mb3;
-- -- 【temp_tb_Alert_Reminders】提醒時間表
-- CREATE TABLE IF NOT EXISTS `cloud-db-sweet-potato`.`temp_tb_Alert_Reminders` (
--   `sys_user_id`          INT UNSIGNED NOT NULL,     -- 使用者系統 ID【外+主】
--   `drug_bag_id`          INT UNSIGNED NOT NULL,     -- 藥袋ID【外】
--   `user_dispense_date`   DATETIME NOT NULL,         -- 配藥日期(調劑時間)
--   `alert_1`              DATETIME NULL,             -- 提醒(可NULL)
--   `alert_2`              DATETIME NULL,             -- 提醒(可NULL)
--   `alert_3`              DATETIME NULL,             -- 提醒(可NULL)
--   `alert_again_1`        DATETIME NULL,             -- 提醒twice(可NULL)
--   `alert_again_2`        DATETIME NULL,             -- 提醒twice(可NULL)
--   `alert_again_3`        DATETIME NULL,             -- 提醒twice(可NULL)
--   `alert_update_time`    DATETIME NOT NULL,         -- 提醒更新時間
--   PRIMARY KEY (`sys_user_id`, `drug_bag_id`),
--   FOREIGN KEY (`sys_user_id`) REFERENCES `temp_tb_Users` (`sys_user_id`),
--   FOREIGN KEY (`drug_bag_id`) REFERENCES `temp_tb_Drug_Bag_Infos` (`drug_bag_id`)
-- ) ENGINE = InnoDB;

-- 【temp_tb_Alert_Records】提醒紀錄表
CREATE TABLE IF NOT EXISTS `cloud-db-sweet-potato`.`temp_tb_Alert_Records` (
  `sys_user_id`         INT UNSIGNED NOT NULL,      -- 使用者系統 ID【外+主】
  `drug_bag_id`         INT UNSIGNED NOT NULL,      -- 藥袋ID【外】
  `record_alert_date`   DATETIME NOT NULL,          -- 紀錄有提醒的日期
  `record_state_1`      TINYINT UNSIGNED,           -- 1(按時)、2(提醒後)、3(沒吃)
  `record_state_2`      TINYINT UNSIGNED,           -- 這三個是用來記錄最多三個鬧鐘
  `record_state_3`      TINYINT UNSIGNED,           -- 使用者在該鬧鐘的狀態，可NULL
  `drug_sideeffect`     VARCHAR(100) NULL,          -- 藥品副作用
  PRIMARY KEY (`sys_user_id`, `drug_bag_id`),
) ENGINE = InnoDB;


