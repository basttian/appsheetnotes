import * as React from 'react';
import { DataGrid,
	GridEventListener,
	GridToolbar,
	GridToolbarContainer,
	GridToolbarExport,
	GridToolbarQuickFilter,
	GridLinkOperator,
  GridColDef,
	GridValueGetterParams,
  GridCellParams,
  GridRenderEditCellParams,
  GridCellClassNamePropType,
  GridRenderCellParams,
  GridValueOptionsParams,
 } from '@mui/x-data-grid';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import { useState, useEffect } from 'react';
import Snackbar from "../components/snackbar";
//import type { NextPage } from 'next'
//Tolbar tabla personalizada
function CustomToolbar() {
  return (
    <GridToolbarContainer>
			<Box sx={{ flexGrow: 1 }}>
			<GridToolbarExport printOptions={{
					disableToolbarButton: false,
					hideFooter: true,
    			hideToolbar: true,
    			fileName:"Notas",
				}} />
			</Box>
			<Box
			sx={{
			 display: 'flex',
			 flexDirection: 'row-reverse',
		 	}}
			>
			<GridToolbarQuickFilter
        quickFilterParser={(searchInput: string) =>
          searchInput
            .split(',')
            .map((value) => value.trim())
            .filter((value) => value !== '')
        }
      />
			</Box>
    </GridToolbarContainer>
  );
}

interface Props{
  clase: React.ReactNode,
  asignatura: React.ReactNode,
	notas: React.ReactNode,
	student: React.ReactNode,
}


function DataTable({...props}) {
//const DataTable: NextPage = ({...props}):Props => {

	// notas
	const [notas, setNotas] = useState([]);
	const [estudiantes, setEstudiantes] = useState([]);
  const [isLoading, setLoading] = useState(false);
	let clase = props.clase;
	let asignatura = props.asignatura;

	//variables para snackbar
	const [mostrarSnackbar, setMostrarSnackbar] = useState(false);
	const [mensajeSnackbar, setMensajeSnackbar] = useState("");

	//Bloquear celda a editar mientras envia datos
	const [isCellEdit, SetCellEdit] = useState(true);

	useEffect(() => {
		setNotas(props.notas);
		setEstudiantes(props.student);
	}, [clase])

	//realizo el pedido nuevamente a rows
	useEffect(() => {
			setLoading(true)
			fetch('./api/rows',{
				method: 'post',
				headers: {'Content-Type':'application/json'},
				body: JSON.stringify({
					'estudiantes':estudiantes,
					'clase':clase,
					'asignatura':asignatura })
				}).then((res) => res.json())
					.then((data) => {
						setNotas(data)
						setLoading(false)
				})
	}, [asignatura])

	const columns: GridColDef[] = [
	  { field: 'id', headerName: 'ID',hide: true ,hideable: false},
	  {
	    field: 'estudiante',
	    headerName: 'Estudiante',
	    flex: 1,
	  },
	  {
	    field: 'T1',
	    headerName: '1º Trimestre',
	    type: 'number',
	    editable: true,
	    flex: 1,
	    minWidth: 100,
	    valueOptions:notas.map((items)=>{
					return items.CELDASTR1
			})
	  },
	  {
	    field: 'T2',
	    headerName: '2º Trimestre',
	    type: 'number',
	    editable: true,
	    flex: 1,
	    minWidth: 100,
			valueOptions:notas.map((items)=>{
					return items.CELDASTR2;
			})
	  },
	  {

	    field: 'T3',
	    headerName: '3º Trimestre',
	    type: 'number',
	    editable: true,
	    flex: 1,
	    minWidth: 100,
			valueOptions:notas.map((items)=>{
					return items.CELDASTR3;
			})
	  },
	  {
	    field: 'promedio',
	    headerName: 'Promedio',
	    description: 'Promedio solo con tres notas',
	    sortable: false,
	    flex: 1,
	    type: 'string',
	    valueGetter: (params: GridValueGetterParams) => {
				if (
					Number.isNaN(Number.parseFloat(params.row.T1)) ||
					Number.isNaN(Number.parseFloat(params.row.T2)) ||
					Number.isNaN(Number.parseFloat(params.row.T3))
				){
			    return "-";
			  }else{
					let numberuno:string = JSON.stringify(params.row.T1);
					let numberdos:string = JSON.stringify(params.row.T2);
					let numbertres:string = JSON.stringify(params.row.T3);
					let valuno:number = parseFloat(JSON.parse(numberuno.replace(/,/g, '.')));
					let valdos:number = parseFloat(JSON.parse(numberdos.replace(/,/g, '.')));
					let valtres:number = parseFloat(JSON.parse(numbertres.replace(/,/g, '.')));
					const arr:number[] = [
						valuno,
						valdos,
						valtres
					];
					let sum:number = 0;
					for (var number of arr) {
					    sum += number;
					}
					let average:number = sum / arr.length;
					return (average).toFixed(2);
					}
				},
	  },
	];

	const Save = React.useCallback<GridEventListener<'cellKeyDown'>> (
    (params, event:any): void => {
			//Enviamos a la hoja el valor 1 si corresponde al primer tr 2 al segundo etc
      let trimestre;
			let cellids:any[] = []; //Creamos el array de celdas vacias, luego lo cargamos
      switch (params.field) {
        case 'T1':
          trimestre = 1;
        break;
        case 'T2':
          trimestre = 2;
        break;
        case 'T3':
          trimestre = 3;
        break;
        default:
          break;
      }
			//concatenamos el array que no es array pero esta almacenado como array :(
			cellids.push(params.colDef.valueOptions)
			//const: obtenemos la fila de la hoja notasDB
      const getidrow = cellids[0].find((e,i) => i === params.id);
      let datos = {
        'Seccion':parseInt(clase),
        'Asignatura':asignatura,
        'Trimestre':trimestre,
        'Estudiante':params.row.estudiante,
        'Nota':parseFloat(event.target.value),
        'fila': getidrow,
      };
      if(getidrow > 0 && event.keyCode === 9 || event.keyCode === 13){
					setLoading(true)
					SetCellEdit(false)//bloqueo la celda para que no sean editables
					//Envio a guardar las notas
					event.preventDefault()
					fetch('./api/storedb',{
						method: 'post',
						headers: {'Content-Type':'application/json'},
						body: JSON.stringify({'data':datos})
					}).then((res) => {
						setMostrarSnackbar(true)//snackbar
						setMensajeSnackbar("Nota almacenada con éxito..")//snackbar
						//solicite nuevamente los datos para actualizar la rows
						fetch('./api/rows',{
							method: 'post',
							headers: {'Content-Type':'application/json'},
							body: JSON.stringify({
								'estudiantes':estudiantes,
							  'clase':clase,
							  'asignatura':asignatura })
							}).then((res) => res.json())
								.then((data) => {
									setNotas(data)
									setLoading(false)
									setMostrarSnackbar(false)//snackbar
									setMensajeSnackbar("")//snackbar
									SetCellEdit(true)//Activo la edicion de la celda nuevamente
						});
					})
        }
    },
    [clase,asignatura]
  );

	let rows = notas;

  return (
    <div style={{ height: 680, width: '100%' }}>
      <DataGrid
			  isCellEditable={(params: GridCellParams)=>{
					return isCellEdit;
				}}
				rows={rows}
        columns={columns}
        //pageSize={10}
        //rowsPerPageOptions={[10]}
				onCellKeyDown={Save}
				components={{
					LoadingOverlay: LinearProgress,
					Toolbar: CustomToolbar,
				}}
				loading={props.loading || isLoading}
				experimentalFeatures={{ newEditingApi: true }}
      />
			<Snackbar open={mostrarSnackbar} message={mensajeSnackbar} />
    </div>
  );
}

export default DataTable
