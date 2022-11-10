import * as React from 'react';
import type { NextPage } from 'next'

import Layout from "../components/layout"
import { useState, useRef, useEffect } from 'react';
import { GetServerSideProps } from 'next';
import Box from '@mui/material/Box';

//components
import SelectLabels from '../components/select';
//Tabla
import TableData from './tabledata';

interface Props{
  alumnos: Array<any>,
	aulas: Array<any>,
}


///////////////////////////////AdminNotas////////////////
function AdminNotas(props : Props){
  //referencia al select asignatura
  const mySelRef = React.useRef(null);
  const [clase, setClase] = useState(0);
  const [asignaturaValues, setAsignaturaValues] = useState("");
  const [asignatura, setAsignatura] = useState(0);
  const [columnA, setColumnA] = useState([]);
  //loading
  const [isLoading, setLoading] = useState(false);
  const [loadingSelect, setLoadingSelect] = useState(false);
  // notas
  const [notas, setNotas] = useState([]);


  const [Aulas, setAulas] = useState([]);
  const [Alumnos, setAlumnos] = useState([]);
  useEffect(() => {
    setLoadingSelect(true)
      fetch('./api/aulasdb')
        .then((res) => res.json())
        .then((data) => {
          setAulas(data)
            fetch('./api/alumnosdb')
              .then((res) => res.json())
              .then((data) => {
                setAlumnos(data)
                setLoadingSelect(false)
            })
      });
  },[])



  //Selector de clases
  const onchangecloseaula = (select: any) => {
    //console.log(select.target.dataset.value)
    //Limpio select Asignatura
		mySelRef.current.state.value = "";
    setClase(select.target.dataset.value);
    setLoadingSelect(true);
    let ColumnaEstudiante:any[] = [];
    Alumnos.filter(
      alumnos => alumnos.id === parseInt(select.target.dataset.value))
      .reduce((acc, obj) => {
        ColumnaEstudiante.push(obj.name);
      }, 0);
    setColumnA(ColumnaEstudiante);
    //Limpiamos la tabla
    setNotas([]);
    fetch('./api/asignaturasdb', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 'clase': select.target.dataset.value })
    }).then((res) => res.json())
      .then((data) => {
        //console.log(data);
        setAsignaturaValues(data);
        setLoadingSelect(false);
      });
  };

  //Selector de asignaturas
  const onchangecloseasignatura = (select: any) => {
    //console.log(select.target.dataset.value)
    setAsignatura(select.target.dataset.value);
    ///Lo llamo para no tener que repetir el llamdado en tablenotas
    setLoading(true);
    fetch('./api/rows', {
      method: 'post',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ 'estudiantes': columnA, 'clase': clase, 'asignatura': select.target.dataset.value })
    }).then((res) => res.json())
      .then((data) => {
        setNotas(data);
        setLoading(false);
      });
  };

  return (
		<>
    <Layout loader={loadingSelect}>
      <SelectLabels
          title="Clases"
          help="Seleccionar clase."
          onchange={onchangecloseaula}
          values={Aulas} />
      <br/>
      <SelectLabels
          ref={mySelRef}
          title='Asignaturas'
          help='Seleccionar asignatura.'
          onchange={onchangecloseasignatura}
          values={asignaturaValues} />
      <br/>
      <TableData
        loading={isLoading}
        student={columnA}
        clase={clase}
        asignatura={asignatura}
        notas={notas} />
    </Layout>
		</>
  );
}

export default AdminNotas

AdminNotas.auth = {
  role: "admin",
  unauthorized: "/", // redirect to this url
}
