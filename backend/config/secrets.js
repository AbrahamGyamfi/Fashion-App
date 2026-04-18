const { SecretsManagerClient, GetSecretValueCommand } = require('@aws-sdk/client-secrets-manager');

class SecretsManager {
  constructor() {
    this.client = new SecretsManagerClient({
      region: process.env.AWS_REGION || 'us-east-1'
    });
    this.cache = new Map();
    this.cacheTTL = 300000; // 5 minutes
  }

  async getSecret(secretName) {
    // Check cache first
    const cached = this.cache.get(secretName);
    if (cached && Date.now() - cached.timestamp < this.cacheTTL) {
      return cached.value;
    }

    try {
      const command = new GetSecretValueCommand({ SecretId: secretName });
      const response = await this.client.send(command);
      
      let secret;
      if (response.SecretString) {
        secret = JSON.parse(response.SecretString);
      } else {
        // Binary secret
        const buff = Buffer.from(response.SecretBinary, 'base64');
        secret = buff.toString('ascii');
      }

      // Cache the secret
      this.cache.set(secretName, {
        value: secret,
        timestamp: Date.now()
      });

      return secret;
    } catch (error) {
      console.error(`Error retrieving secret ${secretName}:`, error.message);
      throw error;
    }
  }

  async getDatabaseConfig() {
    if (process.env.NODE_ENV === 'production') {
      const secrets = await this.getSecret('shopnow/database');
      return {
        host: secrets.host,
        port: secrets.port,
        database: secrets.database,
        user: secrets.username,
        password: secrets.password,
        ssl: {
          rejectUnauthorized: true
        }
      };
    }

    // Development - use environment variables
    return {
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      database: process.env.DB_NAME,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      ssl: process.env.DB_SSL === 'true'
    };
  }

  async getRedisConfig() {
    if (process.env.NODE_ENV === 'production') {
      const secrets = await this.getSecret('shopnow/redis');
      return {
        host: secrets.host,
        port: secrets.port,
        password: secrets.password,
        tls: {
          rejectUnauthorized: true
        }
      };
    }

    // Development - use environment variables
    return {
      host: process.env.REDIS_HOST,
      port: process.env.REDIS_PORT,
      password: process.env.REDIS_PASSWORD || undefined
    };
  }

  clearCache() {
    this.cache.clear();
  }
}

module.exports = new SecretsManager();
