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
    // let fields as any;
    // let files ;
    console.log(req, "<<<< req.body")
    try {
        const [fields, files] = await form.parse(req);

        let newFileName = "";

        if (files && files.file && files.file.length > 0) {
            newFileName = files.file[0].newFilename;
            // Proceed with newFileName
        } else {
            // Handle the case where files.file is undefined or empty
            console.error("No files uploaded");
            // You can throw an error or return a response indicating the issue
        }
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