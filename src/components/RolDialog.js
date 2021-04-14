import React, { useEffect, useState } from 'react';

import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

import { TextField } from '@material-ui/core';
import { fetchCustom } from "../helpers/fetch";

const initFormValues = {
  txtId:0,  
  txtDescription:''  
}

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

const MessageSnackBar = (props) =>{  
  const [open, setOpen] = useState(props.IsOpen);  
  const handleClose = () => {
    setOpen(false);        
  };
    return(
        <>
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{vertical: 'top',horizontal: 'center',}}>
          <Alert onClose={handleClose} severity={props.TypeMessage}>
            {props.Message}
          </Alert>
        </Snackbar> 
        </> 
    )
}

export default function RolDialog(props) {
    const [open, setOpen] = useState(props.isOpen);    
    const [FormState, setFormState] = useState(initFormValues);
    const [MessageState, setMessageState] = useState({
      IsMessage:false,
      TypeMessage:'error',
      Message:''
    });
    const [errors, setErrors] = useState({
      data:''
    }); 
    const { txtId, txtDescription } = FormState;
    const { IsMessage, TypeMessage, Message } = MessageState;
    const { isOpen, handleClose, DataMaster } = props;    
    
    useEffect(() => { 
      if (Object.keys(DataMaster).length !== 0 ) {        
        setFormState({
          txtId:DataMaster.Id,          
          txtDescription:DataMaster.Description
        });       
      }         
      return () =>{        
        initValues();               
      }
    }, [DataMaster,setFormState]);

    useEffect(() => {        
        setOpen(isOpen);
    }, [isOpen]);  

    const masterAddNew = async (request,idmaster) => {
      try { 
        let endpoint="SetMasters";
        let method="POST";
        if(idmaster!==0){
          endpoint="UpdMasters";
          method="PUT";                  
        }
        const apexApiCall = await fetchCustom(endpoint,request,method);
        const dataJson = await apexApiCall.json();         
        if(dataJson['status'] && idmaster === 0){                    
          initValues();                 
        }
        setMessageState({
          IsMessage:true,
          TypeMessage:dataJson['type'],
          Message:dataJson['message']
        });       
      } catch(err) {
          console.log("Error fetching data --> masterAddNew", err);            
      }
    }
    const handleInputChange = ({target}) => {
        setFormState({
          ...FormState,
          [target.name] : target.value
        });
    };

    const onSendSave = () => {        
        const request = {      
          'Id'          : txtId,  
          'description' : txtDescription,
          'master'      : 'rol'
        };
        const errors=ValidateFirstForm(request);               
        if (Object.keys(errors).length === 0 ) { 
            setMessageState({
              ...MessageState,
              IsMessage:false
            });                   
            masterAddNew(request,txtId);
            setErrors({data:''});         
        }
        else{          
          setErrors(errors); 
        }        
    };
    const initValues = () => {       
        setFormState(initFormValues)
    };

    const ValidateFirstForm = (values) => {
      let errors = {};            
      if (!values.description.trim()) {
          errors.description = 'Descripción es obligatorio.';
      }      
      return errors;   
    }

    return (
        <>
        {(IsMessage) && <MessageSnackBar IsOpen={IsMessage} TypeMessage={TypeMessage} Message={Message} /> }
         <Dialog fullWidth={true} maxWidth="sm" open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Administración de Roles</DialogTitle>
        <DialogContent> 
          <form noValidate autoComplete="off">                       
              <TextField variant="outlined" className="mat-form-field" error={errors.description?true:false}
                  margin="normal"
                  name="txtDescription"
                  label="Descripción"
                  type="text"
                  value={txtDescription}
                  onChange={handleInputChange}
                  helperText={errors.description} 
                  fullWidth
              />              
            </form>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="default">
            Cancelar
          </Button>
          <Button onClick={onSendSave} color="primary">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>
        
        </>
    );
}






