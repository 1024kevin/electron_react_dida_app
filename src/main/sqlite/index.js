import { app } from 'electron';
import path from 'path';
import sqlite3 from 'sqlite3';

const dbFilePath = path.join(path.dirname(app.getPath('userData')), '/sys_db.db');

console.log('sql path:', dbFilePath);

const db = new sqlite3.Database(dbFilePath);

// 版本更新需要执行的SQL脚本
const updateTable = () => {

};


const createTable = () => {
    db.serialize(() => {
        db.run(`CREATE TABLE IF NOT EXISTS agent_matters (
                    id                          VARCHAR (50) NOT NULL,
                    title                       VARCHAR (50) NOT NULL,
                    four_quadrant_value         VARCHAR (50) NOT NULL,
                    state                       INT DEFAULT 0 NOT NULL,
                    begin_time                  VARCHAR (100) NOT NULL,
                    end_time                    VARCHAR (100) NOT NULL,
                    description                 TEXT NOT NULL,
                    primary key (id)
                );`
        )
    });
}



// 不可修改
Object.assign(db);

export default () => {

    const dbVersion = '0.0.1';

    db.run(
        `CREATE TABLE IF NOT EXISTS sql_info (
            version Varchar (50),
            primary key (version));`,
        [],
        () => {
            db.get('SELECT * FROM sql_info ORDER BY version DESC LIMIT 1', [], (_error, result) => {
                if (!result || (result && result.version !== dbVersion)) {
                    updateTable();
                    db.run('INSERT INTO sql_info (version) VALUES (?)', [dbVersion], () => { });
                }
                createTable();
            });
        }
    );
};

export {
    db
}