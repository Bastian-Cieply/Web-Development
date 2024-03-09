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
        name text not null,
        url text,
        district text,
        rating float,
        mapsurl text,
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
          INSERT INTO stores (name, url, district, rating, mapsurl)
          VALUES ($1, $2, $3, $4, $5)
        `, [store.name, store.url, store.district, store.rating, store.mapsurl]);
      }
    }

    await this.connection.query(`
    CREATE TABLE IF NOT EXISTS public.users
    (
        id SERIAL,
        email text UNIQUE not null,
        salt text,
        password text not null,
        CONSTRAINT user_pkey PRIMARY KEY (id)
    )`);

    await this.connection.query(`
      ALTER TABLE IF EXISTS public.users
          OWNER to postgres
    `);
  }

  async getStores(sortBy = 'name', sortOrder = 'asc') {
    const allowedSortByFields = ['name', 'district', 'rating'];
    const allowedSortOrders = ['asc', 'desc'];

    if (!allowedSortByFields.includes(sortBy)) {
        throw new Error('Invalid sortBy parameter');
    }

    if (!allowedSortOrders.includes(sortOrder)) {
        throw new Error('Invalid sortOrder parameter');
    }

    const query = `
      SELECT name, url, district, rating, mapsurl FROM stores
      ORDER BY ${sortBy} ${sortOrder}
    `;

    const { rows } = await this.connection.query(query);

    return rows;
  }

  async addStore(name, url, district, rating, mapsurl) {
    try {
      await this.connection.query(`
        INSERT INTO stores (name, url, district, rating, mapsurl)
        VALUES ($1, $2, $3, $4, $5)
      `, [name, url, district, rating, mapsurl]);
      return { status: 'Success', message: 'Store added successfully' };
    } catch (error) {
      return { status: 'Error', message: error.message };
    }
  }

  async deleteStore(id) {
    try {
      await this.connection.query(`
        DELETE FROM stores
        WHERE id = $1
      `, [id]);
      return { status: 'Success', message: 'Store deleted successfully' };
    } catch (error) {
      return { status: 'Error', message: error.message };
    }
  }

  async editStore(id, name, url, district, rating, mapsurl) {
    try {
      await this.connection.query(`
        UPDATE stores
        SET name = $1, url = $2, district = $3, rating = $4, mapsurl = $5
        WHERE id = $6
      `, [name, url, district, rating, mapsurl, id]);
      return { status: 'Success', message: 'Store edited successfully' };
    } catch (error) {
      return { status: 'Error', message: error.message };
    }
  }

  async getStoreID(name, district) {
    const { rows } = await this.connection.query(`
      SELECT id FROM stores
      WHERE name = $1 AND district = $2 
    `, [name, district]);
    if (rows.length === 1) {
      return rows[0].id;
    } else {
      return null;
    }
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
        return { status: 'Success', message: 'User logged in successfully' };
      } else {
        return false;
      }
    }
  }
}

module.exports = ModelClass;
