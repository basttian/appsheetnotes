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

    const fetchData = await req.body;

    let notasPorAlumnoA :any[] = [];
    let notasPorAlumnoB :any[] = [];
    let notasPorAlumnoC :any[] = [];
    let found;
    for(let i in fetchData.estudiantes){

    let resultA = data_notas.filter(
      (notas) => notas.seccion === fetchData.clase &&
               notas.asignatura === fetchData.asignatura &&
               notas.estudiante === fetchData.estudiantes[i] &&
               notas.trimestre === "1" );
      found = resultA.find(element => element.estudiante === fetchData.estudiantes[i] );
      if(found){
        notasPorAlumnoA.push({"nota":found.nota,"rowNumber":found.rowNumber})
      }else{
        notasPorAlumnoA.push('')
      }

      let resultB = data_notas.filter(
      (notas) => notas.seccion === fetchData.clase &&
               notas.asignatura === fetchData.asignatura &&
               notas.estudiante === fetchData.estudiantes[i] &&
               notas.trimestre === "2" );
      found = resultB.find(element => element.estudiante === fetchData.estudiantes[i] );
      if(found){
        notasPorAlumnoB.push({"nota":found.nota,"rowNumber":found.rowNumber})
      }else{
        notasPorAlumnoB.push('')
      }

      let resultC = data_notas.filter(
      (notas) => notas.seccion === fetchData.clase &&
               notas.asignatura === fetchData.asignatura &&
               notas.estudiante === fetchData.estudiantes[i] &&
               notas.trimestre === "3" );
      found = resultC.find(element => element.estudiante === fetchData.estudiantes[i] );
      if(found){
        notasPorAlumnoC.push({"nota":found.nota,"rowNumber":found.rowNumber})
      }else{
        notasPorAlumnoC.push('')
      }

 }

  let reformattedtr1 = notasPorAlumnoA.map(function(obj){
     var rObj = [];
     rObj.push(obj.nota,obj.rowNumber);
     return rObj;
  });
  let reformattedtr2 = notasPorAlumnoB.map(function(obj){
     var rObj = [];
     rObj.push(obj.nota,obj.rowNumber);
     return rObj;
  });
  let reformattedtr3 = notasPorAlumnoC.map(function(obj){
     var rObj = [];
     rObj.push(obj.nota,obj.rowNumber);
     return rObj;
  });

   let resultado:any[] = [];
    for(const [i, v] of fetchData.estudiantes.entries()){
      resultado.push({
        id:parseInt(i),
        estudiante: fetchData.estudiantes[i],
        T1: reformattedtr1[i][0],
        T2: reformattedtr2[i][0],
        T3: reformattedtr3[i][0],
        CELDASTR1: reformattedtr1[i][1],
        CELDASTR2: reformattedtr2[i][1],
        CELDASTR3: reformattedtr3[i][1],
      })
    }

    return res.send(JSON.stringify(resultado,null,2));
  }
  res.send({
   error: "You must be signed in to view the protected content on this page.",
 })

}
