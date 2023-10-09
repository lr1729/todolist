// Import the mysql2 module
import mysql from 'mysql2';

// Import the async-redis module
const asyncRedis = require("async-redis");

// Import and configure environment variables from .env file
require('dotenv').config();

// Import MysqlRedisAsync, HashTypes, and Caching from mysql-redis module
const { MysqlRedisAsync, HashTypes, Caching } = require("mysql-redis");

// Define cache options for Redis
const cacheOptions = {
    expire: 2629746, // Set the expiration time for cache in seconds
    keyPrefix: "sql.", // Prefix for all cache keys
    hashType: HashTypes.md5, // Use MD5 hash for cache keys
    caching: Caching.CACHE // Enable caching
};

// Create a Redis client with the defined cache options
const redis = asyncRedis.createClient(cacheOptions);

// Create a MySQL connection pool using environment variables
const poolPromise = mysql.createPool({
  host: process.env.DB_HOST, // Database host
  user: process.env.DB_USER, // Database user
  password: process.env.DB_PASS, // Database password
  database: process.env.DB_NAME // Database name
}).promise();

// Create a new instance of MysqlRedisAsync with the MySQL connection pool and Redis client
const mysqlRedis = new MysqlRedisAsync(
    poolPromise,
    redis
);

// Export an object containing HashTypes, Caching, and the MysqlRedisAsync instance (db)
export default {
  hashTypes: HashTypes,
  caching: Caching,
  db: mysqlRedis,
}
