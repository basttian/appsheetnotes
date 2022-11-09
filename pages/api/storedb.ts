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
    let now = new Date();
    const session = await getSession({req});
    const doc = new GoogleSpreadsheet(process.env.SPREADSHEET_ID);
    await doc.useServiceAccountAuth({
      client_email: process.env.CLIENT_EMAIL,
      private_key: process.env.PRIVATE_KEY,
    });
    await doc.loadInfo();
    const sheet = doc.sheetsByTitle['notasDB'];
    const rows = await sheet.getRows();
    const fetchData = await req.body;
    if(fetchData.data.fila){
      try {
        if(rows[fetchData.data.fila-2]._rowNumber === parseInt(fetchData.data.fila)){
          const row = fetchData.data.fila-2;
          rows[row].TimeStamp = now.toUTCString();
          rows[row].Nota = fetchData.data.Nota;
          rows[row].Email = session.user.email;
          await rows[row].save();
        }
      } catch (err) {
        console.error(err);
      }
      return res.send("Nota actualizada con exito..");
    }else{
      try {
        const fila = await sheet.addRow(
          {
            TimeStamp:  now.toUTCString(),
            Seccion:    fetchData.data.Seccion,
            Asignatura: fetchData.data.Asignatura,
            Trimestre:  fetchData.data.Trimestre,
            Estudiante: fetchData.data.Estudiante,
            Nota:       fetchData.data.Nota,
            Email:      session.user.email,
        });
      } catch (err) {
        console.error(err);
      }
      return res.send("Nota agregada con exito..");
    }
  }
  res.send({
   error: "You must be signed in to view the protected content on this page.",
 })

}
