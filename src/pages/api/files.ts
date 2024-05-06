// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import fetchFiles from "../function/repository";

type Data = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  try {
    const page: number = req.query.page as unknown as number;
    const data: any = await fetchFiles(page);
    res.status(200).json(data);
  }
  catch (error) {
    res.status(500).json({ name: "John Doe" });
  }
}