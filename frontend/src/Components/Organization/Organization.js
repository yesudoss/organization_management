import * as React from 'react';
import Box from '@mui/material/Box';
import OrganizationForm from './OrganizationForm';
import OrganizationGrid from './OrganizationGrid';


export default function Organization() {
  const [currentData, setCurrentData] = React.useState()
  const [mode, setMode] = React.useState('grid')

  const changeGridMode = () => {
    setMode('grid')
  }
  const changeAddMode = () => {
    setMode('form')
  }

  const handleSetCurrentData = (data) => {
    setCurrentData(data)
  }

  return (
    <Box sx={{ height: 400, width: '100%' }}>
      {
        mode === 'grid' ?
          <OrganizationGrid currentData={currentData} changeAddMode={changeAddMode} handleSetCurrentData={handleSetCurrentData} /> :
          <OrganizationForm currentData={currentData} gridMode={changeGridMode} handleSetCurrentData={handleSetCurrentData} />
      }
    </Box>
  );
}