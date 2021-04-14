import React, { useEffect, useState } from 'react';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';
import FilterListIcon from '@material-ui/icons/FilterList';
import IconButton from '@material-ui/core/IconButton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import MoreVertIcon from '@material-ui/icons/MoreVert';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TablePagination from '@material-ui/core/TablePagination';
import TableRow from '@material-ui/core/TableRow';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Tooltip from '@material-ui/core/Tooltip';

import ProfileDialog from '../components/ProfileDialog';
import { fetchCustom } from "../helpers/fetch";

const headCells = [
  { id: 'Id', numeric: true, disablePadding: true, label: 'ID' },
  { id: 'Description', numeric: false, disablePadding: false, label: 'Descripción' },
  { id: 'Status', numeric: false, disablePadding: false, label: 'Estado' },
  { id: 'DateIns', numeric: false, disablePadding: false, label: 'F. Inserción' },
  { id: 'DateUpd', numeric: false, disablePadding: false, label: 'F. Actualización' }  
];

function HeaderTable() { 
  return (
    <TableHead>
      <TableRow>       
        {headCells.map((headCell) => (
          <TableCell
            key={headCell.id}
            align={headCell.numeric ? 'right' : 'left'}
            padding={headCell.disablePadding ? 'none' : 'default'} >            
              {headCell.label}            
          </TableCell>
        ))}
        <TableCell>
            Acciones
        </TableCell>
      </TableRow>
    </TableHead>
  );
}

const ToolbarTable = () => {  
  return (
    <Toolbar >     
        <Typography className="title-table" variant="h6" id="tableTitle" component="div">
          Listado de Perfiles
        </Typography>
        <Tooltip title="Filter list">
          <IconButton aria-label="filter list">
            <FilterListIcon />
          </IconButton>
        </Tooltip>
     
    </Toolbar>
  );
};

export default function ProfileScreen() {  
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);   
  const [anchorEl, setAnchorEl] = useState(null);
  const [AllData, setAllData] = useState([]);  
  const [DataMaster, setDataMaster] = useState({});
  const [OpenDialog, setOpenDialog] = useState(false);    
  const open = Boolean(anchorEl);  

  useEffect(() => {  
    getAllData();    
  }, []);
 
  const getAllData = async () => {
    try {
      const apexApiCall = await fetchCustom('GetMasters/profiles/All');
      const dataJson    = await apexApiCall.json();
      if(dataJson['status']){                    
        setAllData(dataJson['data']);          
      } 
    } catch(err) {
      console.log("Error fetching data --> getAllData", err);            
    }
  }

  const updStatusMaster = async (request) => {
    try {             
      const apexApiCall = await fetchCustom('UpdStatusMasters',request,"PUT");
      const dataJson    = await apexApiCall.json();     
      if(dataJson['status']){                    
        getAllData();        
      }      
    } catch(err) {
        console.log("Error fetching data --> updStatusMaster", err);            
    }
  }

  const delMenu = async (id) => {
    try {             
      const apexApiCall = await fetchCustom(`DelMasters/${id}/profiles`,undefined,"DELETE");
      const dataJson    = await apexApiCall.json();     
      if(dataJson['status']){                    
        getAllData();          
      }      
    } catch(err) {
        console.log("Error fetching data --> delMenu", err);            
    }
  }
 
  const handleClick = event => {
    let id=event.currentTarget.getAttribute('data-id');
    document.getElementById(id).classList.remove('hidden');
    setAnchorEl(event.currentTarget);
  };

  const handleClose = event => {    
    let id = event.currentTarget.parentElement.id;
    document.getElementById(id).classList.add('hidden');
    setAnchorEl(null);
  };

  const handleView = (event,row) => {    
    let id = event.target.getAttribute('last-id');    
    document.getElementById(id).classList.add('hidden');     
    setDataMaster(row);
    setAnchorEl(null);
    setOpenDialog(true);
  };

  const handleStatus = (event,status) => {    
    let id = event.target.getAttribute('last-id');    
    document.getElementById(id).classList.add('hidden');
    setAnchorEl(null);
    const request = {      
      'Id'    : id,  
      'master': 'profiles',           
      'Status':(status==='1'?'0':'1')
    }; 
    updStatusMaster(request);  
  };

  const handleDelete = (event) => {    
    let id = event.target.getAttribute('last-id');    
    document.getElementById(id).classList.add('hidden'); 
    setAnchorEl(null);          
    delMenu(id);
  };
 
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleOpenDialog = () => {     
    setOpenDialog(true);  
    setDataMaster({});
  };

  const handleCloseDialog = () => {
    setOpenDialog(false); 
    getAllData();   
  }; 

  const stringStatus = (status) => {
    if(status==="1") return "Activo";
    else return "Inactivo";
  }; 

  return (
      <>   
        <div className="md-fab-wrapper">
            <Fab color="primary" aria-label="add" onClick={handleOpenDialog}>
                <AddIcon />
            </Fab>
        </div>
        
        {(OpenDialog) && <ProfileDialog isOpen={OpenDialog} handleClose={handleCloseDialog} DataMaster={DataMaster} />}
        <Paper >                         
            <ToolbarTable />
            <TableContainer>
            <Table aria-labelledby="tableTitle" size= 'medium'>
                <HeaderTable/>
                <TableBody>
                {AllData.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row) => {                                   
                    return (                       
                      <TableRow hover key={row.Id} >                      
                        <TableCell align="right" padding="none">{row.Id}</TableCell>
                        <TableCell>{row.Description}</TableCell>                        
                        <TableCell>{stringStatus(row.Status)}</TableCell>
                        <TableCell>{row.DateIns}</TableCell>
                        <TableCell>{row.DateUpd}</TableCell>                                                
                        <TableCell>
                            <IconButton
                                data-id={row.Id}
                                aria-label="more"
                                aria-controls="long-menu"
                                aria-haspopup="true"
                                className="icon-button"
                                onClick={(event)=>handleClick(event)}>
                                <MoreVertIcon />
                            </IconButton>
                            <Menu
                                id={row.Id}
                                anchorEl={anchorEl}
                                keepMounted
                                open={open} 
                                className="hidden"                               
                                onClose={(event) => handleClose(event)}> 
                                <MenuItem last-id={row.Id} onClick={(event) => handleView(event,row)} > Visualizar</MenuItem>
                                <MenuItem last-id={row.Id} onClick={(event) => handleStatus(event,row.Status)} > Estado</MenuItem>
                                <MenuItem last-id={row.Id} onClick={(event) => handleDelete(event)} > Eliminar</MenuItem>
                            </Menu>
                        </TableCell>
                      </TableRow>
                    );
                    })}              
                </TableBody>
            </Table>
            </TableContainer>
            <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={AllData.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
            />
        </Paper>      
      </>
  );
}