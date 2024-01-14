import * as React from 'react';
import Box from '@mui/material/Box';
import { DataGrid } from '@mui/x-data-grid';
import AxiosInstance from '../../AxiosInstance';
import { Button } from '@mui/material';
import OrganizationForm from './OrganizationForm';
import OrganizationGrid from './OrganizationGrid';

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


export default function Organization() {
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
        setMode('form')
      }
      const changeGridMode = () => {
        setMode('grid')
      }
      const changeAddMode = () => {
        setMode('form')
      }

  return (
    <Box sx={{ height: 400, width: '100%' }}>
        {
            mode === 'grid' ? <>
            <Button
            size='small'
            onClick={hancleclick}
            // onClick={()=>setMode('form')}
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Add data
            </Button>
            {/* <OrganizationGrid /> */}
      </> : 
      <>
      <OrganizationForm data={data} gridMode={changeGridMode}/>
      </>
        }
    </Box>
  );
}