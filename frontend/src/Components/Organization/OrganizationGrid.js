import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import AxiosInstance from '../../AxiosInstance';
import { Button } from '@mui/material';

const columns = [
  { field: 'id', headerName: 'ID', width: 90 },
  {
    field: 'name',
    headerName: 'Name',
    // width: 150,
    // editable: true,
  },
  {
    field: 'org_type',
    headerName: 'Organization Type',
    // width: 150,
    // editable: true,
  },
  {
    field: 'website',
    headerName: 'Website',
    // type: 'number',
    // width: 110,
    // editable: true,
  },
  {
    field: 'address',
    headerName: 'Address',
    // type: 'number',
    // width: 110,
    // editable: true,
  },
  {
    field: 'email',
    headerName: 'Email',
    // type: 'number',
    // width: 110,
    // editable: true,
  },
  {
    field: 'phone',
    headerName: 'Phone',
    // type: 'number',
    // width: 110,
    // editable: true,
  },
];


export default function OrganizationGrid() {
    const [orgData, setOrgData] = React.useState([]);
    const [data, setData] = React.useState()
    const [mode, setMode] = React.useState('grid')
    console.log(mode)
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
      const hancleclick = (data) =>{
        console.log(data)
        setMode("form")
        setData(data)
      }
  return (
    <Box sx={{ height: 400, width: '100%' }}>
        
            
            <Button
            onClick={setMode('form')}
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
      <DataGrid
        rows={orgData}
        columns={columns}
        onRowClick={
            (e)=>hancleclick(e)
        }
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
     
        
    </Box>
  );
}