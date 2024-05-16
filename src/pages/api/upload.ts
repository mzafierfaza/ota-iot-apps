import type { NextApiRequest, NextApiResponse } from "next";
import {uploadFiles} from "../function/repository";
import path from 'path';
import formidable, { File } from 'formidable';
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
        const newFileName = files.file[0].newFilename;
        const fileName = fields["name"] as any;
        const {token} = parseCookies({req});
        await uploadFiles(fileName, token, newFileName);
        res.status(200).json({ message: "File uploaded successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Error uploading file" });
        return;
    }
}