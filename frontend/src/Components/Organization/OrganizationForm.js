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
import { Alert,  FormControl, InputLabel, MenuItem, Select, Snackbar } from '@mui/material';
import AxiosInstance from '../../AxiosInstance';


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

export default function OrganizationForm({gridMode={gridMode}}) {
  const initialValues = {
    name: "",
    website: "",
    email: "",
    phone: "",
    confirmPassword: "",
    organization: ""
  };

  const [inputData, setInputData] = useState(initialValues);
  const [errors, setErrors] = useState({});
  const [orgData, setOrgData] = useState([]);
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
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
    getOrg()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
      console.log(inputData)

      AxiosInstance(`/register/`, {
        method: "POST",
        data: {
          "first_name": inputData?.name,
          "last_name": inputData?.website,
          "email": inputData?.email,
          "password": inputData?.password,
          "phone": inputData?.phone,
        }
      })
        .then((res) => {
          console.log(res)
          
        }).catch(err => {
          console.log(err)
          setOpen(true)
          setAlertType("error")
          if (err?.response?.data?.email?.[0])
          setMessage(err?.response?.data?.email?.[0])
          else
          setMessage("Unable to register")
        })

    }

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


  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Snackbar open={open} autoHideDuration={6000} onClose={handleClose} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
        <Alert onClose={handleClose} severity={alertType} sx={{ width: '100%' }}>
          {message}
        </Alert>
      </Snackbar>
      <Button
      size='small'
              variant="contained"
              onClick={gridMode}
              sx={{ mt: 3, mb: 2 }}
            >
              Back to Grid
            </Button>
        <Box>
          
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="name"
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
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  size="small"
                  id="website"
                  label="Website"
                  name="website"
                  autoComplete="website"
                  onChange={handleInputChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  fullWidth
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
              <Grid item xs={12}>
              <FormControl fullWidth>
  <InputLabel id="demo-simple-select-label">Organization Type</InputLabel>
  <Select
  size='small'
  defaultValue={'company'}
    labelId="demo-simple-select-label"
    id="demo-simple-select"
    value={inputData?.org_type}
    label="Organization Type"
    onChange={handleInputChange}
  >
    <MenuItem value={'company'}>Company</MenuItem>
    <MenuItem value={'non-profit'}>Non-Profit</MenuItem>
    <MenuItem value={'educational'}>Educational Institution</MenuItem>
    <MenuItem value={'educational'}>Educational Institution</MenuItem>
    <MenuItem value={'other'}>Other</MenuItem>
  </Select>
</FormControl>
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  required
                  fullWidth
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

              
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Sign Up
            </Button>
            <Grid container justifyContent="flex-end">
              <Grid item>
                <Link href="/" variant="body2">
                  Already have an account? Sign in
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
}