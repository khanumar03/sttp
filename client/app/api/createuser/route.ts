import { NextApiResponse } from "next";

export function POST(req: Request, res: NextApiResponse) {
    return res.json({msg: [1,2,3,4,5]})
}