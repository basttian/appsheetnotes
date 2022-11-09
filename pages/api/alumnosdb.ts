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
    let data_alumnos:any[] = []
    const doc = new GoogleSpreadsheet(process.env.SPREADSHEET_ID);
    await doc.useServiceAccountAuth({
      client_email: process.env.CLIENT_EMAIL,
      private_key: process.env.PRIVATE_KEY,
    });
    await doc.loadInfo();
    const sheet = doc.sheetsByTitle['alumnosDB'];
    const rows = await sheet.getRows();
    for(let i=0; i < rows.length; i++){
      data_alumnos.push({ 'rowNumber' : rows[i].rowNumber, 'id': parseInt(rows[i].SECCION), 'name': rows[i].ESTUDIANTE })
    }
    res.send(data_alumnos);
   }
  res.send({
   error: "You must be signed in to view the protected content on this page.",
 })

}