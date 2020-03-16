const { Pool } = require('pg');
const fs = require('fs');

module.exports = class Database {
    constructor (uri) {
        this.uri = uri;
        this.pool = new Pool({
            connectionString: process.env.DB_URI,
        });
        this.queryDirectoryPath = './sql';
        this.queries = {};
    }

    loadQueries () {
        const files = fs.readdirSync(this.queryDirectoryPath);
        for (const file of files) {
            if (!file.endsWith('.sql')) continue;
            const data = fs.readFileSync(this.queryDirectoryPath + file);
            this.queries[file.slice(0, -3).toUpperCase()] = data;
        }
    }

    async init (forceUpdate) {
        this.loadQueries();
        if (forceUpdate) {
            await this.query('SCHEMA');
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