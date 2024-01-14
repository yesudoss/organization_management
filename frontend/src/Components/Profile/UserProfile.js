import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import { useState } from "react";
import { useEffect } from "react";
import { useDropzone } from 'react-dropzone'
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Alert, Autocomplete, Paper, Snackbar } from '@mui/material';
import AxiosInstance from '../../AxiosInstance';
import { addSessionData, getUserData } from '../Base/helper/helper';
import "../css/styles.css"

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


export default function UserProfile() {
    const userData = getUserData()
    const initialValues = {
        first_name: "",
        last_name: "",
        email: "",
        mobile: "",
        organization: ""
    };

    const [inputData, setInputData] = useState(initialValues);
    console.log(inputData)
    const [errors, setErrors] = useState({});
    const [orgData, setOrgData] = useState([]);

    useEffect(() => {
        if (userData) {
          setInputData({
            // ...userData,
            id: userData?.id,
            first_name: userData?.first_name || "",
            last_name: userData?.last_name || "",
            website: userData?.website || "",
            email: userData?.email,
            mobile: userData?.mobile || "",
            address: userData?.address || "",
            organization: userData?.organization ? {id: userData?.organization, name: userData?.organization_name} : null,
            description: userData?.description || ""
          })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
      }, [])

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

        if ("first_name" in fieldValues) {
            temp.first_name = fieldValues.first_name === "" ? "First Name is required" : "";
        }
        if ("last_name" in fieldValues) {
            temp.last_name = fieldValues.last_name === "" ? "Last Name is required" : "";
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

        setErrors({
            ...temp,
        });

        return Object.values(temp).every((x) => x === "");
    };

    const fetchUserData = () =>{
        AxiosInstance(`/register/${inputData?.id}/`, {
            method: "GET",
            
        })
            .then((res) => {
                console.log(res)
                // setMessage('Your Profile has been updated successfully!')
                // setOpen(true)
                // setAlertType('success')
            }).catch(err => {
                console.log(err)
                setOpen(true)
                setAlertType("error")
                if (err?.response?.data?.email?.[0])
                    setMessage(err?.response?.data?.email?.[0])
                else
                    setMessage("Unable to Update")
            })
    }
    const handleSubmit = async (event) => {

        // console.log(files?.[0]);
        // let string = await convertBase64(files?.[0])
        // console.log(string);

        event.preventDefault();
        if (validate(inputData)) {
            console.log(inputData)

            AxiosInstance(`/register/${inputData?.id}/`, {
                method: "PUT",
                data: {
                    "first_name": inputData?.first_name,
                    "last_name": inputData?.last_name,
                    "email": inputData?.email,
                    "password": inputData?.password,
                    "mobile": inputData?.mobile,
                    "organization": inputData?.organization?.id || null
                }
            })
                .then((res) => {
                    console.log(res?.data)
                    if (res?.data) addSessionData({ key: "userData", value: JSON.stringify(res?.data) });
                    setMessage('Your Profile has been updated successfully!')
                    setOpen(true)
                    setAlertType('success')



                }).catch(err => {
                    console.log(err)
                    setOpen(true)
                    setAlertType("error")
                    if (err?.response?.data?.email?.[0])
                        setMessage(err?.response?.data?.email?.[0])
                    else
                        setMessage("Unable to Update")
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


    //   -------------------

    // ** State
    const [files, setFiles] = useState([])

    // ** Hook
    const { getRootProps, getInputProps } = useDropzone({
        disabled: false,
        multiple: false,
        maxSize: 1000000,
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg']
        },
        onDrop: acceptedFiles => {
            setFiles(acceptedFiles.map(file => Object.assign(file)))
        },
        onDropRejected: () => {
            setMessage('You can only image upload image with maximum size of 2 MB.')
            setOpen(true)
            setAlertType('error')
        }
    })

    const convertBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);
            fileReader.onload = () => {
                resolve(fileReader.result);
            };

            fileReader.onerror = (error) => {
                reject(error);
            }
        })
    }
    files.map(file => (
        convertBase64(file)
    ))
    // const handleSubmit = async () => {
    //     console.log(files?.[0]);
    //     let string = await convertBase64(files?.[0])
    //     console.log(string);
    // }
    const img = files.map(file => (
        <img style={{ borderRadius: "50%", padding: "2px" }} width="100%" height="100%" key={file.name} alt={file.name} className='single-file-image' src={URL.createObjectURL(file)} />
    ))


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
                        Profile Update
                    </Typography>


                    <Grid container>
                        <Grid item xs={12} md={4} sx={{ paddingRight: "1.5rem", marginTop: "1.5rem" }}>
                            <Box>
                                <Paper sx={{ padding: "80px 24px 40px", borderRadius: "16px" }}>

                                    <Box sx={{ marginBottom: "40px", border: "none", cursor: "default" }} {...getRootProps({ className: 'dropzone' })}>
                                        <input {...getInputProps()} />
                                        <div className='presentation'>
                                            <div className='placeholder'>
                                                {files.length ? img :
                                                    <>
                                                        <AddPhotoAlternateIcon />
                                                        <Typography variant="caption" display="block" gutterBottom>
                                                            Upload Photo
                                                        </Typography>
                                                    </>
                                                }
                                            </div>
                                        </div>
                                        <Typography sx={{ margin: "16px auto 0px" }} variant='caption' className='content'>
                                            Allowed *.jpeg, *.jpg, *.png, *.gif<br /> max size of 3.1 MB
                                        </Typography>
                                    </Box>
                                </Paper>
                            </Box>
                        </Grid>
                        <Grid item xs={12} md={8} sx={{ paddingRight: "1.5rem", marginTop: "1.5rem" }}>
                            <Box sx={{ mt: 3 }}>
                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            autoComplete="given-name"
                                            name="first_name"
                                            required
                                            fullWidth
                                            size="small"
                                            id="first_name"
                                            label="First Name"
                                            autoFocus
                                            value={inputData?.first_name}
                                            onChange={handleInputChange}
                                            {...(errors.first_name && {
                                                error: true,
                                                helperText: errors.first_name,
                                            })}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            value={inputData?.last_name}
                                            size="small"
                                            id="last_name"
                                            label="Last Name"
                                            name="last_name"
                                            autoComplete="family-name"
                                            onChange={handleInputChange}
                                            {...(errors.last_name && {
                                                error: true,
                                                helperText: errors.last_name,
                                            })}
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={12}>
                                        <TextField
                                            fullWidth
                                            value={inputData?.mobile}
                                            size="small"
                                            id="mobile"
                                            label="Mobile Number"
                                            name="mobile"
                                            onChange={handleInputChange}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Autocomplete
                                            options={orgData || []}
                                            value={inputData?.organization}
                                            size="small"
                                            name="organization"
                                            getOptionLabel={(option) => option.name || ""}
                                            onChange={(e, value) => handleInputChange("organization", value)}
                                            renderInput={(params) => <TextField
                                                {...params}
                                                required={true}
                                                label="Organization"
                                            />}
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
                                            onChange={handleInputChange}
                                            value={inputData?.email}
                                            {...(errors.email && {
                                                error: true,
                                                helperText: errors.email,
                                            })}
                                        />
                                    </Grid>
                                </Grid>
                                <Button
                                    // onClick={handleSubmit}
                                    onClick={fetchUserData}
                                    fullWidth
                                    variant="contained"
                                    sx={{ mt: 3, mb: 2 }}
                                >
                                    Fetch
                                </Button>

                                <Button
                                    onClick={handleSubmit}
                                    // onClick={fetchUserData}
                                    fullWidth
                                    variant="contained"
                                    sx={{ mt: 3, mb: 2 }}
                                >
                                Update
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
                <Copyright sx={{ mt: 5 }} />
            </Container>
        </ThemeProvider>
    );
}