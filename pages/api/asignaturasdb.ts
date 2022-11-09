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
    let data_materias:any[] = [];
    const doc = new GoogleSpreadsheet(process.env.SPREADSHEET_ID);
    await doc.useServiceAccountAuth({
      client_email: process.env.CLIENT_EMAIL,
      private_key: process.env.PRIVATE_KEY,
    });
      await doc.loadInfo();
      const sheet = doc.sheetsByTitle['asignaturasDB'];
      const rows = await sheet.getRows();
      const fetchData = await req.body;//fetchData.clase
      rows.forEach((item) => {
        data_materias.push({ 'seccion': item.SECCION, 'id': item.ASIGNATURA, 'name': item.ASIGNATURA });
      });
      //let set = new Set(data_materias.map( JSON.stringify ))
      //let resultValueUniques = Array.from( set ).map( JSON.parse );
      let result:any[] = data_materias.filter(
      (asignaturas) => asignaturas.seccion === fetchData.clase );

      res.send(JSON.stringify(result,null,2));
   }
  res.send({
   error: "You must be signed in to view the protected content on this page.",
 })

}
