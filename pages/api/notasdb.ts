import { unstable_getServerSession } from "next-auth/next";
import { authOptions } from "./auth/[...nextauth]";
import { GoogleSpreadsheet } from "google-spreadsheet";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  const session = await unstable_getServerSession(req, res, authOptions);
  if (session) {
    let data_notas = [];
    const doc = new GoogleSpreadsheet(process.env.SPREADSHEET_ID);
    await doc.useServiceAccountAuth({
      client_email: process.env.CLIENT_EMAIL,
      private_key: process.env.PRIVATE_KEY,
    });
    await doc.loadInfo();
    const sheet = doc.sheetsByTitle['notasDB'];
    let rows = await sheet.getRows();
    for(let i=0; i < rows.length; i++){
      data_notas.push({
        'row':i,//obtenemos el registro id
        'rowNumber' : rows[i].rowNumber,// obtenemos el numero de fila de la hoja notas db
        'seccion': rows[i].Seccion,
        'asignatura': rows[i].Asignatura,
        'estudiante': rows[i].Estudiante,
        'nota': rows[i].Nota,
        'trimestre': rows[i].Trimestre,
      })
    }
    return res.send(JSON.stringify(data_notas,null,2));
  }
  res.send({
   error: "You must be signed in to view the protected content on this page.",
 })

}
