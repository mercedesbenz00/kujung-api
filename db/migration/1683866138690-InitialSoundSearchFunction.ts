import { MigrationInterface, QueryRunner } from 'typeorm';

export class InitialSoundSearchFunction1683866138690
  implements MigrationInterface
{
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      DROP FUNCTION IF EXISTS fn_initial_sound;
    `);
    await queryRunner.query(`
    CREATE FUNCTION fn_initial_sound(str VARCHAR(2000)) RETURNS varchar(2000) CHARSET utf8 DETERMINISTIC
    BEGIN
      DECLARE rtrnStr VARCHAR(2000);
      DECLARE cnt INT;
      DECLARE i INT;
      DECLARE j INT;
      DECLARE tmpStr VARCHAR(2000);
      DECLARE blankCnt INT;
      SET blankCnt = (CHAR_LENGTH(str) - CHAR_LENGTH(REPLACE(str, ' ', ''))) / 2;
      IF str IS NULL THEN
        RETURN '';
      END IF;
      SET cnt = CEIL(LENGTH(str) / 3) + blankCnt;
      SET i = 1;
      SET j = 1;
      WHILE i <= cnt DO
        SET tmpStr = SUBSTRING(str, i, j);
        SET rtrnStr = CONCAT(IFNULL(rtrnStr, ''), 
          CASE
            WHEN tmpStr REGEXP '^(ㄱ|ㄲ)' OR (tmpStr >= '가' AND tmpStr < '나') THEN 'ㄱ'
            WHEN tmpStr REGEXP '^ㄴ' OR (tmpStr >= '나' AND tmpStr < '다') THEN 'ㄴ'
            WHEN tmpStr REGEXP '^(ㄷ|ㄸ)' OR (tmpStr >= '다' AND tmpStr < '라') THEN 'ㄷ'
            WHEN tmpStr REGEXP '^ㄹ' OR (tmpStr >= '라' AND tmpStr < '마') THEN 'ㄹ'
            WHEN tmpStr REGEXP '^ㅁ' OR (tmpStr >= '마' AND tmpStr < '바') THEN 'ㅁ'
            WHEN tmpStr REGEXP '^ㅂ' OR (tmpStr >= '바' AND tmpStr < '사') THEN 'ㅂ'
            WHEN tmpStr REGEXP '^(ㅅ|ㅆ)' OR (tmpStr >= '사' AND tmpStr < '아') THEN 'ㅅ'
            WHEN tmpStr REGEXP '^ㅇ' OR (tmpStr >= '아' AND tmpStr < '자') THEN 'ㅇ'
            WHEN tmpStr REGEXP '^(ㅈ|ㅉ)' OR (tmpStr >= '자' AND tmpStr < '차') THEN 'ㅈ'
            WHEN tmpStr REGEXP '^ㅊ' OR (tmpStr >= '차' AND tmpStr < '카') THEN 'ㅊ'
            WHEN tmpStr REGEXP '^ㅋ' OR (tmpStr >= '카' AND tmpStr < '타') THEN 'ㅋ'
            WHEN tmpStr REGEXP '^ㅌ' OR (tmpStr >= '타' AND tmpStr < '파') THEN 'ㅌ'
            WHEN tmpStr REGEXP '^ㅍ' OR (tmpStr >= '파' AND tmpStr < '하') THEN 'ㅍ'
            WHEN tmpStr REGEXP '^ㅎ' OR (tmpStr >= '하') THEN 'ㅎ'
            ELSE ' '
          END
        );
        SET i = i + 1;
      END WHILE;
      RETURN rtrnStr;
    END;
  `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // If needed, you can define the down method to drop the custom function here
    await queryRunner.query('DROP FUNCTION IF EXISTS fn_initial_sound');
  }
}
