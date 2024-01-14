import { Box, Button, Checkbox, FormControl, FormControlLabel, FormLabel, Grid, Paper, Switch, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import { createStyles, makeStyles } from '@mui/styles';
import AddPhotoAlternateIcon from '@mui/icons-material/AddPhotoAlternate';
import "./css/styles.css"
// ** Third Party Imports
import { useDropzone } from 'react-dropzone'
// import toast from 'react-hot-toast';



const Profile = () => {
    // ** State
    const [files, setFiles] = useState([])

    // ** Hook
    const { getRootProps, getInputProps } = useDropzone({
        disabled: false,
        multiple: false,
        maxSize: 2000000,
        accept: {
            'image/*': ['.png', '.jpg', '.jpeg']
        },
        onDrop: acceptedFiles => {
            setFiles(acceptedFiles.map(file => Object.assign(file)))
        },
        onDropRejected: () => {
            // toast.error('You can only image upload image with maximum size of 2 MB.', {
            //     duration: 2000
            // })
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
    const handleSubmit = async () => {
        console.log(files?.[0]);
        let string = await convertBase64(files?.[0])
        console.log(string);
    }
    const img = files.map(file => (
        <img style={{ borderRadius: "50%", padding: "2px" }} width="100%" height="100%" key={file.name} alt={file.name} className='single-file-image' src={URL.createObjectURL(file)} />
    ))

    // const useStyles = makeStyles((theme) =>
    //     createStyles({
    //         paper: {
    //             boxShadow: "0px 3px 3px -2px #cbc3c3, 0px 3px 4px 0px rgb(242 242 242), 0px 1px 8px 0px rgb(242 242 242)",
    //             padding: "20px",
    //             borderRadius: "10px"
    //         },
    //         comingSoon: {
    //             fontWeight: 600,
    //             fontSize: "18px",
    //             marginTop: "30px",
    //             color: "white"

    //         }
    //     }),
    // );
    // const classes = useStyles();
    return (
        <Grid container>
            <Grid item xs={12} md={4} sx={{ paddingRight: "1.5rem", marginTop: "1.5rem" }}>
                <Box>
                    <Paper sx={{ padding: "80px 24px 40px", borderRadius: "16px" }}>
                        <span
                            style={{
                                height: "24px",
                                minWidth: "22px",
                                lineHeight: 0,
                                borderRadius: "6px",
                                alignItems: "center",
                                display: "inline-flex",
                                justifyContent: "center",
                                padding: "0px 8px",
                                color: "rgb(27, 128, 106)",
                                fontSize: "0.75rem",
                                backgroundColor: "rgba(54, 179, 126, 0.16)",
                                fontWeight: 700,
                                textTransform: "uppercase",
                                top: "24px",
                                right: "24px",
                            }}
                        >Active</span>
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
                        <FormControl component="fieldset">
                            <FormLabel sx={{ margin: "0px 0px 4px" }} component="legend">Disable Account</FormLabel>
                            <FormControlLabel
                                sx={{ fontWeight: 400, fontSize: "0.875rem", marginLeft: "0px" }}
                                value="start"
                                control={<Switch color="primary" />}
                                label="You can disable this user by clicking this option"
                                labelPlacement="start"
                            />
                        </FormControl>
                        <Button variant='contained' onClick={handleSubmit}>Save</Button>
                    </Paper>
                </Box>
            </Grid>
            <Grid item xs={12} md={8} sx={{ paddingRight: "1.5rem", marginTop: "1.5rem" }}>
                <TextField variant='outlined' size='small' />
                <Checkbox />
            </Grid>
        </Grid>
    )
}

export default Profile