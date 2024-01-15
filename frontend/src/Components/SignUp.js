import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useState } from "react";
import { useEffect } from "react";
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AxiosInstance from '../AxiosInstance';
import { Alert, Autocomplete, Snackbar } from '@mui/material';
import { useNavigate } from 'react-router-dom';


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

export default function SignUp() {
  let navigate = useNavigate()
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

  useEffect(() => {
    getOrg()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const validate = (fieldValues) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;
    let temp = { ...errors };

    if ("firstName" in fieldValues) {
      temp.firstName = fieldValues.firstName === "" ? "First Name is required" : "";
    }
    if ("lastName" in fieldValues) {
      temp.lastName = fieldValues.lastName === "" ? "Last Name is required" : "";
    }
    if ("mobile" in fieldValues) {
      temp.mobile = fieldValues.mobile === "" ? "Mobile is required" : "";
    }

    if ("organization" in fieldValues) {
      temp.organization = fieldValues.organization === "" ? "Organization Name is required" : "";
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
      console.log(inputData)

      AxiosInstance(`/register/`, {
        method: "POST",
        data: {
          "first_name": inputData?.firstName,
          "last_name": inputData?.lastName,
          "email": inputData?.email,
          "password": inputData?.password,
          "mobile": inputData?.mobile,
          "organization": inputData?.organization?.id
        }
      })
        .then((res) => {
          setOpen(true)
          setAlertType("success")
          setMessage("You have registered successfully, An email has been sent to your registered email with secured access code. Please use that code for your account verification.")
          setTimeout(() => { navigate("/") }, 3000)


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
      validate({ ...inputData, [e?.target?.name]: e?.target?.value });
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
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign up
          </Typography>
          <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <Autocomplete
                  isOptionEqualToValue={(option, value) =>
                    +option.id === +value.id
                  }
                  options={orgData || []}
                  value={inputData?.organization}
                  size="small"
                  name="organization"
                  getOptionLabel={(option) => option?.name || ""}
                  onChange={(e, value) => handleInputChange("organization", value)}
                  renderInput={(params) => <TextField
                    {...params}
                    required={true}
                    label="Organization"
                    {...(errors.organization && {
                      error: true,
                      helperText: errors.organization,
                    })}
                  />}

                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  autoComplete="first-name"
                  name="firstName"
                  required
                  fullWidth
                  size="small"
                  id="firstName"
                  label="First Name"
                  autoFocus
                  onChange={handleInputChange}
                  {...(errors.firstName && {
                    error: true,
                    helperText: errors.firstName,
                  })}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  fullWidth
                  required
                  size="small"
                  id="lastName"
                  label="Last Name"
                  name="lastName"
                  autoComplete="family-name"
                  onChange={handleInputChange}
                  {...(errors.lastName && {
                    error: true,
                    helperText: errors.lastName,
                  })}
                />
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

              <Grid item xs={12} sm={12}>
                <TextField
                  fullWidth
                  required
                  size="small"
                  id="mobile"
                  label="Mobile Number"
                  name="mobile"
                  onChange={handleInputChange}
                  {...(errors.mobile && {
                    error: true,
                    helperText: errors.mobile,
                  })}
                />
              </Grid>

              <Grid item xs={12}>
                <TextField
                  size="small"
                  required
                  fullWidth
                  id="password"
                  onChange={handleInputChange}
                  autoComplete="password"
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