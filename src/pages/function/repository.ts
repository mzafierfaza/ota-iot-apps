// "use server"
// import { postsReadDbClient } from "@/lib/db";

import { Pool } from 'pg';
const pool = new Pool({
  user: 'localdb',
  host: 'localhost',
  database: 'ota-iot',
  password: 'iatvmware',
  port: 5433, // port default PostgreSQL
});

export async function latestFile(): Promise<any> {
    const p: Promise<any> = new Promise((resolve, reject) => {
        // const client: any = postsReadDbClient();
        // client.connect();
        const query = 'SELECT * FROM files ORDER BY id DESC LIMIT 1';
        pool.query(query, (err: any, res: any) => {
            if (err) {
                console.log(err.stack);
                reject(err);
            } else {
                resolve(res.rows);
            }
        });
    });

    const result: any = await p;
    return result;
}

export default async function fetchFiles(page: number): Promise<any> {
    const p: Promise<any> = new Promise((resolve, reject) => {
        // const client: any = postsReadDbClient();

        // console.log("pool >> ", pool)

        const offset = (page - 1) * 10;
        const query = 'SELECT * FROM files ORDER BY id DESC LIMIT 10 OFFSET ' + offset;
        pool.query(query, (err: any, res: any) => {
            if (err) {
                console.log(err.stack);
                reject(err);
            } else {
                resolve(res.rows);
            }
        });
    });

    const result: any = await p;
    return result;
}

export async function uploadFiles(name: string, token: string, nameFile: string): Promise<any> {
    const p: Promise<any> = new Promise((resolve, reject) => {
        // const client: any = postsReadDbClient();
        // client.connect();
        const now = new Date();
        const jakartaTimezone = 'Asia/Jakarta';
        const jakartaTime = now.toLocaleString('en-US', { timeZone: jakartaTimezone });

        const query = `INSERT INTO files (name, url, upload_by, upload_at) VALUES ('${name}','${nameFile}','${token}', '${jakartaTime}')`;
        pool.query(query, (err: any, res: any) => {
            if (err) {
                console.log(err.stack);
                reject(err);
            } else {
                resolve(res.rows);
            }
        });
    });

    const result: any = await p;
    return result;
}


export async function fetchLogin(username: any, password: any): Promise<any> {
    const p: Promise<any> = new Promise((resolve, reject) => {
        // const client: any = postsReadDbClient();
        // client.connect();
        const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`; 
        pool.query(query, (err: any, res: any) => {
            if (err) {
                console.log(err.stack);
                reject(err);
            } else {
                resolve(res.rows);
            }
        });


    });
    
    const result: any = await p;
    // console.log("query", result, "<<<< result")

    return result;
}
