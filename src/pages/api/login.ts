
import type { NextApiRequest, NextApiResponse } from "next";
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
    const data: any = await fetchLogin(uname, pass);
    res.status(200).json(data);
  }
  catch (error) {
    res.status(500).json({ name: "John Doe" });
  }
}