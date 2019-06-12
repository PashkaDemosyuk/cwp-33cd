'use strict'

const Sequelize = require('sequelize');
const config = require('../config.json');

module.exports = () => {
    console.log(process.env.NODE_ENV);
    let dbConfig = config.db['development'];

    if (process.env.NODE_ENV !== undefined)
    {
        console.log('production');
        console.log(config.db.production);
        dbConfig = config.db.production;
    }
    console.log(dbConfig);
    const options = {
        host: config.db.host,
        dialect: 'mysql',
        logging: false,
        define: {
            defaultScope: {
                attributes: {
                    exclude: ['createdAt', 'updatedAt']
                }
            }
        }
    };

    const sequelize = new Sequelize(config.db.name, config.db.user, config.db.password, options);

    const Repo = require('./repo')(Sequelize, sequelize);
    const Commit = require('./commit')(Sequelize, sequelize);

    Commit.belongsTo(Repo, { foreignKey: 'repoId', onDelete: 'cascade' });

    return {
        repos: Repo,
        commits: Commit,

        Sequelize,
        sequelize,
    };
};