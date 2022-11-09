import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import { GoogleSpreadsheet } from "google-spreadsheet";
import type { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "next-auth/react";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await unstable_getServerSession(req, res, authOptions);
  if (session) {
    let data_seccion:any[] = [];
    const doc = new GoogleSpreadsheet(process.env.SPREADSHEET_ID);
    await doc.useServiceAccountAuth({
      client_email: process.env.CLIENT_EMAIL,
      private_key: process.env.PRIVATE_KEY,
    });
    await doc.loadInfo();
    const sheet = doc.sheetsByTitle['aulasDB'];
    const rows = await sheet.getRows();
    for(let i=0; i < rows.length; i++){
      data_seccion.push({ 'id': rows[i].SECCION, 'name': rows[i].NOMBRE })
    }
    return res.send(JSON.stringify(data_seccion,null,2));
   }
  res.send({
   error: "You must be signed in to view the protected content on this page.",
 })

}
