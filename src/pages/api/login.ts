// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import fetchPosts from "../function/repository";
import {fetchLogin} from "../function/repository";

type Data = {
  name: string;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>,
) {
  try {
    const uname = req.query.username;
    const pass = req.query.password;
    // console.log(req.query, "<<<< req.query")

    const data: any = await fetchLogin(uname, pass);
    // console.log(data, "<<<< data");

    // if (data.length === 0) {
    //     res.status(401).json({name: "John Doe"});
    //     return;
    // }

    res.status(200).json(data);
  }
  catch (error) {
    res.status(500).json({ name: "John Doe" });
  }
}