const { Pool } = require('pg');

const stores = require('./stores.json');
const crypto = require('crypto');

class ModelClass {
  constructor() {
    this.connection = new Pool({
      user: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      database: 'postgres',
      password: '12345',
      port: 5432,
    });
  }

  async connectDatabase() {
    await this.connection.connect();
  }

  async setupDatabase() {
    await this.connection.query(`
    CREATE TABLE IF NOT EXISTS public.stores
    (
        id SERIAL,
        name text,
        url text,
        district text,
        rating integer,
        CONSTRAINT stores_pkey PRIMARY KEY (id)
    )`);

    await this.connection.query(`
      ALTER TABLE IF EXISTS public.stores
          OWNER to postgres
    `);

    for (const store of stores) {

      const { rows } = await this.connection.query(`
        SELECT * FROM stores WHERE name = $1
      `, [store.name]);

      if (rows.length === 0) {
        console.log(`Inserting ${store.name}`);
        await this.connection.query(`
          INSERT INTO stores (name, url, district)
          VALUES ($1, $2, $3)
        `, [store.name, store.url, store.district]);
      }
    }

    await this.connection.query(`
    CREATE TABLE IF NOT EXISTS public.users
    (
        id SERIAL,
        email text UNIQUE,
        salt text,
        password text,
        CONSTRAINT user_pkey PRIMARY KEY (id)
    )`);

    await this.connection.query(`
      ALTER TABLE IF EXISTS public.users
          OWNER to postgres
    `);
  }

  async getStores() {
    const { rows } = await this.connection.query(`
      SELECT * FROM stores
    `);
    return rows;
  }

  async registerUser(email, password) {
    const salt = crypto.randomBytes(16).toString('hex');
    const hashedPassword = crypto
    .createHash('sha512')
    .update(email + salt + password)
    .digest('hex');

    try {
      await this.connection.query(`
        INSERT INTO users (email, salt, password)
        VALUES ($1, $2, $3)
      `, [email, salt, hashedPassword]);
      return { status: 'Success', message: 'User registered successfully' };
    } catch (error) {
      return { status: 'Error', message: error.message };
    }
  }

  async userLogin(email, password) {
    const { rows } = await this.connection.query(`
      SELECT * FROM users WHERE email = $1
    `, [email]);

    if (rows.length === 1) {
      const user = rows[0];
      const hashedPassword = crypto
        .createHash('sha512')
        .update(email + user.salt + password)
        .digest('hex');

      if (hashedPassword === user.password) {
        return true;
      } else {
        return false;
      }
    }
  }

  async sortStores(sortBy = 'name', sortOrder = 'asc') {
    const allowedSortByFields = ['name', 'district'];
    const allowedSortOrders = ['asc', 'desc'];

    if (!allowedSortByFields.includes(sortBy)) {
        throw new Error('Invalid sortBy parameter');
    }

    if (!allowedSortOrders.includes(sortOrder)) {
        throw new Error('Invalid sortOrder parameter');
    }

    const query = `
        SELECT * FROM stores
        ORDER BY ${sortBy} ${sortOrder}
    `;

    const { rows } = await this.connection.query(query);
    return rows;
  }

}

module.exports = ModelClass;
