import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { useState } from "react";
import { useEffect } from "react";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Alert, FormControl, InputLabel, MenuItem, Select, Snackbar } from '@mui/material';
import AxiosInstance from '../../AxiosInstance';
import LoadingButton from '@mui/lab/LoadingButton';


function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}


const defaultTheme = createTheme();

export default function OrganizationForm({ currentData, gridMode, handleSetCurrentData }) {
  const initialValues = {
    name: "",
    website: "",
    email: "",
    phone: "",
    address: "",
    org_type: "",
    description: ""
  };

  const [inputData, setInputData] = useState(initialValues);
  const [loading, setLoading] = React.useState(false);
  const [errors, setErrors] = useState({});
  // For Alert
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("")
  const [alertType, setAlertType] = useState("")
  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  useEffect(() => {
    if (currentData) {
      setInputData({
        ...currentData,
        name: currentData?.name || "",
        website: currentData?.website || "",
        email: currentData?.email,
        phone: currentData?.phone || "",
        address: currentData?.address || "",
        org_type: currentData?.org_type || "",
        description: currentData?.description || ""
      })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  console.log(errors)

  const validate = (fieldValues) => {
    let temp = { ...errors };

    if ("name" in fieldValues) {
      temp.name = fieldValues.name === "" ? "First Name is required" : "";
    }

    if ("email" in fieldValues) {
      temp.email = fieldValues.email === "" ? "Email is required" : "";
    }
    if ("email" in fieldValues) {
      temp.email =
        fieldValues.email === ""
          ? "Email ID is Required"
          : /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(fieldValues.email)
            ? ""
            : "Invalid Email.";
    }
    if (fieldValues?.website){
      console.log(fieldValues?.website)
      const urlRegex = /^(ftp|http|https):\/\/[^ "]+$/;
      if (!urlRegex.test(fieldValues?.website))
      temp.website = "Invalid Website address"
    } else 
    temp.website = ""

    if ("phone" in fieldValues) {
      temp.phone = fieldValues.phone === "" ? "Phone is required" : "";
    }
    setErrors({
      ...temp,
    });

    return Object.values(temp).every((x) => x === "");
  };
  const handleSubmit = (event) => {
    
    event.preventDefault();
    if (validate(inputData)) {
      setLoading(true)

      if (inputData?.id) {
        AxiosInstance(`/organization/${inputData?.id}/`, {
          method: "PUT",
          data: {
            "name": inputData?.name,
            "org_type": inputData?.org_type || "company",
            "email": inputData?.email,
            "phone": inputData?.phone,
            "website": inputData?.website,
            "address": inputData?.address,
            "description": inputData?.description,
          }
        })
          .then((res) => {
            setLoading(false)
            gridMode()
          }).catch(err => {
            console.log(err)
            setOpen(true)
            setAlertType("error")
            setLoading(false)
            if (err?.response?.data?.email?.[0])
              setMessage(err?.response?.data?.email?.[0])
            else
              setMessage("Unable to Update Organization")
          })
      } else {
        AxiosInstance(`/organization/`, {
          method: "POST",
          data: {
            "name": inputData?.name,
            "org_type": inputData?.org_type || "company",
            "email": inputData?.email,
            "phone": inputData?.phone,
            "website": inputData?.website,
            "address": inputData?.address,
            "description": inputData?.description,
          }
        })
          .then((res) => {
            setLoading(false)
            gridMode()
          }).catch(err => {
            setLoading(false)
            console.log(err)
            setOpen(true)
            setAlertType("error")
            if (err?.response?.data?.email?.[0])
              setMessage(err?.response?.data?.email?.[0])
            else
              setMessage("Unable to add Organization")
          })
      }
    }
    handleSetCurrentData(initialValues)

  };

  const handleInputChange = (e, value) => {
    // e.preventDefault();
    if (e === "organization") {
      if (value) {
        setInputData({ ...inputData, "organization": value })
      } else {
        setInputData({ ...inputData, "organization": "" })
      }
    } else {
      setInputData({
        ...inputData,
        [e?.target?.name]: e?.target?.value,
      });
    }

    Object.values?.(errors)?.find((res) => res !== "")?.length > 0 &&
      validate({ ...inputData, [e.target.name]: e.target.value });
  };


  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main">
        <CssBaseline />
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
          <Alert onClose={handleClose} severity={alertType} sx={{ width: '100%' }}>
            {message}
          </Alert>
        </Snackbar>
        <Button
          size='small'
          onClick={()=>{gridMode(); handleSetCurrentData(initialValues)}}
          sx={{ mt: 3, mb: 2 }}
        >
          Back to Grid
        </Button>
        <Box>

          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={6} sm={4}>
                <TextField
                  autoComplete="name"
                  value={inputData?.name}
                  name="name"
                  required
                  fullWidth
                  size="small"
                  id="name"
                  label="Name"
                  autoFocus
                  onChange={handleInputChange}
                  {...(errors.name && {
                    error: true,
                    helperText: errors.name,
                  })}
                />
              </Grid>
              <Grid item xs={6} sm={4}>
                <TextField
                  fullWidth
                  size="small"
                  value={inputData?.website}
                  id="website"
                  label="Website"
                  name="website"
                  autoComplete="website"
                  onChange={handleInputChange}
                  {...(errors.website && {
                    error: true,
                    helperText: errors.website,
                  })}
                />
              </Grid>
              <Grid item xs={6} sm={4}>
                <TextField
                  fullWidth
                  value={inputData?.phone}
                  size="small"
                  id="phone"
                  label="phone Number"
                  name="phone"
                  onChange={handleInputChange}
                  {...(errors.phone && {
                    error: true,
                    helperText: errors.phone,
                  })}
                />
              </Grid>

              <Grid item xs={6}>
                <TextField
                  fullWidth
                  multiline
                  value={inputData?.address}
                  rows={4}
                  size="small"
                  id="address"
                  label="Address"
                  name="address"
                  onChange={handleInputChange}
                  {...(errors.address && {
                    error: true,
                    helperText: errors.address,
                  })}
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  fullWidth
                  multiline
                  value={inputData?.description}
                  rows={4}
                  size="small"
                  id="description"
                  label="Description"
                  name="description"
                  onChange={handleInputChange}
                  {...(errors.description && {
                    error: true,
                    helperText: errors.description,
                  })}
                />
              </Grid>
              <Grid item xs={6}>
                <FormControl fullWidth>
                  <InputLabel id="demo-simple-select-label">Organization Type</InputLabel>
                  <Select
                    name='org_type'
                    size='small'
                    defaultValue={'company'}
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={inputData?.org_type}
                    label="Organization Type"
                    onChange={handleInputChange}
                  >
                    <MenuItem defaultChecked value={'company'}>Company</MenuItem>
                    <MenuItem value={'non-profit'}>Non-Profit</MenuItem>
                    <MenuItem value={'educational'}>Educational Institution</MenuItem>
                    <MenuItem value={'other'}>Other</MenuItem>
                  </Select>
                </FormControl>
              </Grid>

              <Grid item xs={6}>
                <TextField
                  required
                  fullWidth
                  value={inputData?.email}
                  size="small"
                  id="email"
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  onChange={handleInputChange}
                  {...(errors.email && {
                    error: true,
                    helperText: errors.email,
                  })}
                />
              </Grid>


            </Grid >
            <LoadingButton variant="contained" type="submit"
              sx={{ mt: 3, mb: 2 }} loading={loading}>
              Submit
            </LoadingButton>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
}