import fs from 'fs';
import path from 'path';
import pg from 'pg';
import { DatabaseSync } from 'node:sqlite';
import { config } from '../config.js';

export interface QueryResult<T = any> {
  rows: T[];
  rowCount: number;
}

class DatabaseManager {
  private pgPool: pg.Pool | null = null;
  private sqliteDb: DatabaseSync | null = null;
  public isPostgres: boolean = false;

  constructor() {
    if (config.databaseUrl) {
      this.isPostgres = true;
      this.pgPool = new pg.Pool({
        connectionString: config.databaseUrl,
        ssl: config.databaseUrl.includes('localhost') ? false : { rejectUnauthorized: false },
      });
      console.log('📦 DatabaseManager initialized with PostgreSQL/Supabase');
    } else {
      this.isPostgres = false;
      const dbDir = path.dirname(config.sqlitePath);
      if (!fs.existsSync(dbDir)) {
        fs.mkdirSync(dbDir, { recursive: true });
      }
      this.sqliteDb = new DatabaseSync(config.sqlitePath);
      console.log(`📦 DatabaseManager initialized with SQLite at ${config.sqlitePath}`);
    }
  }

  async exec(sqlScript: string): Promise<void> {
    if (this.isPostgres && this.pgPool) {
      await this.pgPool.query(sqlScript);
    } else if (this.sqliteDb) {
      this.sqliteDb.exec(sqlScript);
    }
  }

  async query<T = any>(sql: string, params: any[] = []): Promise<QueryResult<T>> {
    if (this.isPostgres && this.pgPool) {
      const res = await this.pgPool.query(sql, params);
      return {
        rows: res.rows as T[],
        rowCount: res.rowCount || 0,
      };
    } else if (this.sqliteDb) {
      // Convert $1, $2 to ? for SQLite
      const sqliteSql = sql.replace(/\$(\d+)/g, '?');
      const trimmed = sqliteSql.trim();
      const isSelect = /^SELECT/i.test(trimmed) || /^WITH/i.test(trimmed);

      if (isSelect) {
        const stmt = this.sqliteDb.prepare(sqliteSql);
        const rows = stmt.all(...params) as T[];
        return {
          rows,
          rowCount: rows.length,
        };
      } else {
        const stmt = this.sqliteDb.prepare(sqliteSql);
        const info = stmt.run(...params);
        // If query has RETURNING, retrieve the inserted/updated row
        if (/RETURNING/i.test(sqliteSql)) {
          // For SQLite without native RETURNING or to ensure compatibility
          let returnedRows: any[] = [];
          if (info.lastInsertRowid) {
            returnedRows = [{ id: Number(info.lastInsertRowid) }];
          }
          return {
            rows: returnedRows as T[],
            rowCount: Number(info.changes),
          };
        }
        return {
          rows: [] as T[],
          rowCount: Number(info.changes),
        };
      }
    }

    return { rows: [], rowCount: 0 };
  }

  async close(): Promise<void> {
    if (this.pgPool) {
      await this.pgPool.end();
    }
    if (this.sqliteDb) {
      this.sqliteDb.close();
    }
  }
}

export const db = new DatabaseManager();
