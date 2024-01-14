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
import { createTheme, ThemeProvider } from '@mui/material/styles';
import AxiosInstance from '../AxiosInstance';
import { useNavigate } from 'react-router-dom';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';
import InputAdornment from '@mui/material/InputAdornment';
import { addSessionData, getUserData } from './Base/helper/helper';

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

export default function SignIn() {
  const initialValues = {
    email: "",
    password: "",
  };

  const [inputData, setInputData] = React.useState(initialValues);
  const [verifyInputData, setVerifyInputData] = React.useState("");
  const [errors, setErrors] = React.useState({});
  const [verifyErrors, setVerifyErrors] = React.useState({});

  const [hasError, setHasError] = React.useState(false)
  const [message, setMessage] = React.useState("")
  const [showPassword, setShowPassword] = React.useState(false);
  const [userVerification, setUserVerification] = React.useState(true)

  let navigate = useNavigate()

  const validate = (fieldValues) => {

    let temp = { ...errors };
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
    setErrors({
      ...temp,
    });
    return Object.values(temp).every((x) => x === "");
  };


  const verifyValidate = (fieldValues) => {
    let temp = { ...verifyErrors };
    temp.access_code = fieldValues === "" ? "Access code is required" : "";
    setVerifyErrors({
      ...temp,
    });
    return Object.values(temp).every((x) => x === "");
  }

  const handleSubmit = () => {
    if (validate(inputData)) {
      AxiosInstance(`/token/`, {
        method: "POST",
        data: inputData
      })
        .then((res) => {

          const token = res?.data?.access;
          localStorage.setItem('token', token)
          sessionStorage.setItem('isSignedIn', true);
          setMessage("")
          if (res?.data?.user) addSessionData({ key: "userData", value: JSON.stringify(res?.data?.user) });
          if (res?.data?.user?.is_verified)
            navigate("/home")
          else
            setUserVerification(false)
        }).catch(err => {
          setHasError(true)
          console.log(err?.response?.data?.detail)
          if (err?.response?.data?.detail) setMessage(err?.response?.data?.detail)
          else setMessage("Unable to Login")
          console.log(err)
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

  const handleVerifyInputChange = (e) => {
    e.preventDefault();
    setVerifyInputData(e?.target?.value)
    Object.values?.(verifyErrors)?.find((res) => res !== "")?.length > 0 &&
      verifyValidate(e?.target?.value);
  };

  console.log(verifyErrors)

  const handleverifyUser = (e) => {
    if (verifyValidate(verifyInputData)) {
      AxiosInstance(`/verify-access-code/`, {
        method: "POST",
        data: {
          access_code: verifyInputData,
          email: getUserData()?.email
        }
      })
        .then((res) => {

          setMessage("")
          console.log(res)
          navigate("/home")
        }).catch(err => {
          setHasError(true)
          console.log(err?.response?.data?.error_message)
          if (err?.response?.data?.error_message) setMessage(err?.response?.data?.error_message)
          else setMessage("Failed to verify your access code")
          console.log(err)
        })
    }
  };


  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
            <LockOutlinedIcon />
          </Avatar>
          <Typography component="h1" variant="h5">
            Sign in
          </Typography>
          {
            userVerification ?
              <Login
                handleInputChange={handleInputChange}
                errors={errors}
                showPassword={showPassword}
                setShowPassword={setShowPassword}
                hasError={hasError}
                message={message}
                handleSubmit={handleSubmit} />
              :
              <UserVerification
                handleVerifyInputChange={handleVerifyInputChange}
                verifyErrors={verifyErrors}
                hasError={hasError}
                message={message}
                setVerifyInputData={setVerifyInputData}
                setUserVerification={setUserVerification}
                verifyInputData={verifyInputData}
                handleverifyUser={handleverifyUser}

              />
          }

        </Box>
        <Copyright sx={{ mt: 8, mb: 4 }} />
      </Container>
    </ThemeProvider>
  );
}

const Login = ({ handleInputChange, errors, showPassword, setShowPassword, hasError, message, handleSubmit }) => {
  return (
    <Box component="form" noValidate sx={{ mt: 1 }}>
      <TextField
        margin="normal"
        required
        fullWidth
        size="small"
        id="email"
        label="Email Address"
        name="email"
        autoComplete="email"
        autoFocus
        onChange={handleInputChange}
        {...(errors.email && {
          error: true,
          helperText: errors.email,
        })}
      />
      <TextField
        margin="normal"
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
      {hasError && <Typography textAlign={"center"} color={"error"}>{message}</Typography>}
      <Button
        onClick={handleSubmit}
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
      >
        Sign In
      </Button>
      <Grid container>
        <Grid item>
          <Link href="signup" variant="body2">
            {"Don't have an account? Sign Up"}
          </Link>
        </Grid>
      </Grid>
    </Box>
  )
}

const UserVerification = ({ verifyErrors, hasError, message, setUserVerification, handleVerifyInputChange, handleverifyUser, verifyInputData }) => {
  return (
    <Box component="form" noValidate sx={{ mt: 1 }}>
      <TextField
        margin="normal"
        required
        value={verifyInputData}
        fullWidth
        size="small"
        id="access_code"
        label="Access Code"
        name="access_code"
        autoComplete="access_code"
        autoFocus
        onChange={handleVerifyInputChange}
        {...(verifyErrors.access_code && {
          error: true,
          helperText: verifyErrors.access_code,
        })}
      />

      {hasError && <Typography textAlign={"center"} color={"error"}>{message}</Typography>}
      <Button
        onClick={handleverifyUser}
        fullWidth
        variant="contained"
        sx={{ mt: 3, mb: 2 }}
      >
        Verify your Access Code
      </Button>
      <Grid container>
        <Grid item>
          <Button onClick={() => { setUserVerification(true) }} size='small' sx={{ textTransform: "none" }}>Go Back</Button>
        </Grid>
        <Grid item>
          <Link href="signup" variant="body2">
            {"Don't have an account? Sign Up"}
          </Link>
        </Grid>
      </Grid>
    </Box>
  )
}