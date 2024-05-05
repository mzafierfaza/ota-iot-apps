import { postsReadDbClient } from "@/lib/db";

export default async function fetchPosts(): Promise<any> {
    const p: Promise<any> = new Promise((resolve, reject) => {
        const client: any = postsReadDbClient();

        client.connect();
        // console.log(client, "<<<< client")

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
