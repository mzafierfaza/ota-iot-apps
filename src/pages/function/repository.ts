import { postsReadDbClient } from "@/lib/db";
import { NextRequest } from "next/server";

export default async function fetchFiles(page: number): Promise<any> {
    const p: Promise<any> = new Promise((resolve, reject) => {
        const client: any = postsReadDbClient();
        client.connect();

        const offset = (page - 1) * 10;
        const query = 'SELECT * FROM files ORDER BY id DESC LIMIT 10 OFFSET ' + offset;
        client.query(query, (err: any, res: any) => {
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

export async function uploadFiles(name: string, token: string, url: string): Promise<any> {
    const p: Promise<any> = new Promise((resolve, reject) => {
        const client: any = postsReadDbClient();
        client.connect();
        const now = new Date();
        const jakartaTimezone = 'Asia/Jakarta';
        const jakartaTime = now.toLocaleString('en-US', { timeZone: jakartaTimezone });

        const query = `INSERT INTO files (name, url, upload_by, upload_at) VALUES ('${name}','${url}','${token}', '${jakartaTime}')`;
        client.query(query, (err: any, res: any) => {
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


export async function fetchPosts(): Promise<any> {
    const p: Promise<any> = new Promise((resolve, reject) => {
        const client: any = postsReadDbClient();
        client.connect();
        const query = 'SELECT * FROM test';
        client.query(query, (err: any, res: any) => {
            if (err) {
                console.log(err.stack);
                reject(err);
            } else {
                // console.log(res.rows);
                resolve(res.rows);
            }
        });
    });

    const result: any = await p;
    return result;
}


export async function fetchLogin(username: any, password: any): Promise<any> {
    const p: Promise<any> = new Promise((resolve, reject) => {
        const client: any = postsReadDbClient();

        client.connect();
        // console.log(client, "<<<< client")
        // console.log(username, password, "<<<< username, password")
        const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`; 
        client.query(query, (err: any, res: any) => {
            if (err) {
                console.log(err.stack);
                reject(err);
            } else {
                // console.log(res.rows);
                resolve(res.rows);
            }
        });


    });
    
    const result: any = await p;
    // console.log("query", result, "<<<< result")

    return result;
}
