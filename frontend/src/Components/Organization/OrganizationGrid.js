import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import AxiosInstance from '../../AxiosInstance';
import { Alert, Button, IconButton, Snackbar } from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ConfirmationDialog from '../Base/views/ConfirmationDialog';
import AddIcon from '@mui/icons-material/Add';



export default function OrganizationGrid({ currentData, changeAddMode, handleSetCurrentData }) {

  const columns = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
      field: 'name',
      headerName: 'Name',
      width: 200,
    },
    {
      field: 'org_type',
      headerName: 'Organization Type',
      width: 150,
      // editable: true,
    },
    {
      field: 'website',
      headerName: 'Website',
      // type: 'number',
      width: 200,
    },
    {
      field: 'address',
      headerName: 'Address',
      // type: 'number',
      width: 200,
    },
    {
      field: 'email',
      headerName: 'Email',
      // type: 'number',
      width: 200,
    },
    {
      field: 'phone',
      headerName: 'Phone',
      // type: 'number',
      width: 110,
    },
    {
      field: 'edit',
      headerName: 'Edit',
      width: 80,
      sortable: false,
      renderCell: (params) => (
        <IconButton color="primary" aria-label="Edit" onClick={() => handleEditClick(params)}>
          <EditIcon fontSize='small' />
        </IconButton>
      ),
    },
    {
      field: 'delete',
      headerName: 'Delete',
      width: 80,
      sortable: false,
      renderCell: (params) => (
        <IconButton color="error" aria-label="Delete" onClick={() => handleConfirmDelete(params)}>
          <DeleteIcon fontSize='small' />
        </IconButton>
      ),
    }
  ];


  const [orgData, setOrgData] = React.useState([]);
  const [openDialog, setOpenDialog] = React.useState(false);

  const handleConfirmDelete = (rowData) => {
    setOpenDialog(true);
    if (rowData?.row)
      handleSetCurrentData(rowData?.row)
  
};

  const handleDelete = () => {
    setOpenDialog(false);
    if (currentData?.id)
    AxiosInstance(`/organization/${currentData?.id}/`, {
      method: "DELETE",
    })
      .then((res) => {
        getOrg()
        setOpen(true)
            setAlertType("success")
            setMessage("Organization Deleted successfully!")
      }).catch(err => {
        console.log(err)
      })
};

  const getOrg = () => {
    AxiosInstance(`/organization/`, {
      method: "GET",
    })
      .then((res) => {
        if (res?.data) setOrgData(res?.data)
      }).catch(err => {
        console.log(err)
      })
  }
  React.useEffect(() => {
    getOrg()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  const handleEditClick = (params) => {
    changeAddMode()
    if (params?.row)
      handleSetCurrentData(params?.row)
  };

  // For Alert
  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState("")
  const [alertType, setAlertType] = React.useState("")
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };
  const handleAdd = () => {
    changeAddMode()
  }
  return (
    <Box sx={{ height: 400, width: '100%' }}>
      <Snackbar open={open} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
          <Alert onClose={handleClose} severity={alertType} sx={{ width: '100%' }}>
            {message}
          </Alert>
        </Snackbar>
        <Button 
        onClick={()=>handleAdd()}
         startIcon={<AddIcon />} sx={{textTransform:"none"}}>Add</Button>
      <DataGrid
        rows={orgData}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 5,
            },
          },
        }}
        pageSizeOptions={[5]}
        disableRowSelectionOnClick
      />

<ConfirmationDialog
                title="Do you wish to proceed?"
                openDialog={openDialog}
                closeDialog={setOpenDialog}
                popupTitle="Education Management"
                OkButtonText="OK"
                onSubmit={handleDelete}
            />
    </Box>
  );
}