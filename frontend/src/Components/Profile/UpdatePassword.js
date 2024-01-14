import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useState } from "react";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Alert, Autocomplete, Snackbar } from '@mui/material';
import AxiosInstance from '../../AxiosInstance';
import { getUserData } from '../Base/helper/helper';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        Organization Management
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}


const defaultTheme = createTheme();

export default function UpdatePassword() {
  const initialValues = {
    firstName: "",
    lastName: "",
    email: "",
    password: "",
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


  const validate = (fieldValues) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;
    let temp = { ...errors };

    if ("password" in fieldValues) {
      temp.password = fieldValues.password === "" ? "Password is required" : "";
    }

    if ("confirmPassword" in fieldValues) {
      temp.confirmPassword = fieldValues.confirmPassword === "" ? "Confirm Password is required" : "";
    }
    if (fieldValues?.password) {
      if (!regex.test(fieldValues?.password)) {
        temp.password = "Password must be at least 8 characters and Include Numbers, Symbols, and Uppercase and Lowercase "
      }
    }
    if (fieldValues?.password && fieldValues?.confirmPassword) {
      if (fieldValues?.password !== fieldValues?.confirmPassword) {
        temp.confirmPassword = "Doesn't match with the passwo"
      }
    }

    setErrors({
      ...temp,
    });

    return Object.values(temp).every((x) => x === "");
  };
  const handleSubmit = (event) => {
    event.preventDefault();
    if (validate(inputData)) {

      AxiosInstance(`/update-password/`, {
        method: "POST",
        data: {
          "email": getUserData()?.email,
          "password": inputData?.password,
        }
      })
        .then((res) => {
          console.log(res)
          setInputData(initialValues)
          setOpen(true)
          setAlertType("success")
          setMessage("Your password has been updated successfully!")
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

  const handleInputChange = (e) => {
    e.preventDefault();
    setInputData({
      ...inputData,
      [e?.target?.name]: e?.target?.value,
    });

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
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Typography component="h1" variant="h5">
            Update Password
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  size="small"
                  required
                  fullWidth
                  value={inputData?.password}
                  id="password"
                  onChange={handleInputChange}
                  label="Password"
                  type={showPassword ? "text" : "password"}
                  name="password"
                  {...(errors.password && {
                    error: true,
                    helperText: errors.password,
                  })}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          tabIndex={-1}
                          aria-label="toggle password visibility"
                          onClick={() => {
                            setShowPassword(!showPassword);
                          }}
                        >
                          {showPassword ? (
                            <Visibility fontSize="small" />
                          ) : (
                            <VisibilityOff fontSize="small" />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  size="small"
                  required
                  value={inputData?.confirmPassword}
                  fullWidth
                  id="confirmPassword"
                  onChange={handleInputChange}
                  autoComplete="password"
                  label="Confirm Password"
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  {...(errors.confirmPassword && {
                    error: true,
                    helperText: errors.confirmPassword,
                  })}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          tabIndex={-1}
                          aria-label="toggle password visibility"
                          onClick={() => {
                            setShowConfirmPassword(!showConfirmPassword);
                          }}
                        >
                          {showConfirmPassword ? (
                            <Visibility fontSize="small" />
                          ) : (
                            <VisibilityOff fontSize="small" />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
            </Grid>
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Update
            </Button>
          </Box>
        </Box>
        <Copyright sx={{ mt: 5 }} />
      </Container>
    </ThemeProvider>
  );
}