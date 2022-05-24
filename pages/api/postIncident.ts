import { NextApiRequest, NextApiResponse } from "next";
import q, { Collection, Create, Ref } from "faunadb";
import { faunaClient as client } from "../../utils/db";

interface Data {
    name: string;
    date: string;
    city: string;
    slug: string;
    phoneNumber: string;
    description?: string;
    time: string;
    email: string;
    location: {
        lat: number;
        lng: number;
    }
}

export default async function postIncident(req: NextApiRequest, res: NextApiResponse) {
    const data: Data = JSON.parse(JSON.stringify(req.body));
    // console.log(data);
    try {
        const refId = (new Date()).getTime();
        await client.query(
            Create(
                Ref(Collection("co-ordinates"), refId),
                { 
                    data: data
                }
            )
        )
        res.json({true: true, refId})
    } catch {
        res.json({
            false: false
        })
    }
}