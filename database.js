const { Pool } = require('pg');
const fs = require('fs');

module.exports = class Database {
    constructor (uri) {
        this.uri = uri;
        this.queryDirectoryPath = './sql/';
        this.queries = {};

        const [ url, user, password, host, port, database ] = process.env.DATABASE_URL.match(/postgres:\/\/(.*):(.*)@(.*):(.*)\/(.*)/);
        this.pool = new Pool({
            user, password, host, port, database,
            ssl: true,
        });
    }

    loadQueries () {
        const files = fs.readdirSync(this.queryDirectoryPath);
        for (const file of files) {
            if (!file.endsWith('.sql')) continue;
            const data = fs.readFileSync(this.queryDirectoryPath + file, 'utf-8');
            this.queries[file.slice(0, -4).toUpperCase()] = data;
        }
    }

    async init (forceUpdate) {
        this.loadQueries();
        if (forceUpdate) {
            try {
                await this.query('SCHEMA');
            } catch (err) {
                // console.error(err);
                console.error('Error trying to sync tables');
            }
            console.info('Successfully synced database.');
        }
    }

    async query (queryName, ...args) {
        const client = await this.pool.connect();
        try {
            return await client.query(this.queries[queryName], args);
        } finally {
            client.release();
        }
    }
}