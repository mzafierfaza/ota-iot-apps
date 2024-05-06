import type { NextApiRequest, NextApiResponse } from "next";
import {uploadFiles} from "../function/repository";
import { NextRequest, NextResponse } from "next/server";
import { join } from "path";
import { promises as fs } from "fs";

import { writeFile } from "fs";
// import formidable from 'formidable';
import path from 'path';
import formidable, { File } from 'formidable';
import { cookies } from "next/headers";
import { parseCookies } from "nookies";

type ProcessedFiles = Array<[string, File]>;

export const config = {
    api: {
        bodyParser: false,
    }
};


export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const form = formidable({
        uploadDir: path.join(process.cwd(), 'public/ota'),
        keepExtensions: true
    });
    let fields;
    let files;
    console.log(req, "<<<< req.body")
    try {
        [fields, files] = await form.parse(req);
        console.log(fields["name"], "<<<< fields.name")
        console.log(files, "<<<< files")
        const fileName = fields["name"] as any;
        const {token} = parseCookies({req});
        const data: any = await uploadFiles(fileName, token,  "-");
        res.status(200).json({ message: "File uploaded successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error uploading file" });
        return;
    }
}