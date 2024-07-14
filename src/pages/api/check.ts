import type { NextApiRequest, NextApiResponse } from "next";
import { latestFile } from "../function/repository";


type Res = {
    ID: number;
    URL: string;
    UploadAt: string;
}

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<Res>,
) {
    try {
        const data: any = await latestFile();
        // console.log(data, "<<< data")
        const data2 = data[0]
        res.status(200).json({
            ID: data2.id,
            URL: data2.url,
            // URL: process.env.HOST_URL +  data2.url,
            UploadAt: data2.upload_at
        });
    }
    catch (error) {
        res.status(400).json({
            ID: 0,
            URL: "",
            UploadAt: ""
        });
    }
}