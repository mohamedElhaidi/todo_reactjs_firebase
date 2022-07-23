import {
  Avatar,
  Box,
  Button,
  Card,
  CircularProgress,
  Input,
  Modal,
  Stack,
  TextField,
} from "@mui/material";
import {
  getDownloadURL,
  ref,
  uploadBytes,
  uploadBytesResumable,
} from "firebase/storage";
import { useEffect, useState } from "react";
import { firebaseStorage } from "../../../js/services/firebase/firebase-storage";
import { v4 } from "uuid";
import { changeUserInfo } from "../../../js/services/user";
import EnhencedModal from "../EnhencedModal";
import LoadingOverlay from "../LoadingOverlay";
import { useRef } from "react";
import { useSnackbar } from "notistack";

const EditProfileModal = ({ open, handleClose, user }) => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const fileInputElement = useRef(null);
  const [picturePath, setPicturePath] = useState("");
  const [picture, setPicture] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [pfp, setPfp] = useState(null);
  const [uploadingProgress, setUploadingProgress] = useState(null);

  useEffect(() => {
    if (!open || !user) return;
    setPicturePath(user.pfp);
    setName(user.name);
    setEmail(user.email);
  }, [open, user]);

  const handleInputFileChange = ({ target }) => {
    setPicture(target.files[0]);
    const fileReader = new FileReader();
    fileReader.readAsDataURL(target.files[0]);

    var url = URL.createObjectURL(target.files[0]);
    setPicturePath(url);
    console.log(url);
    // fileReader.onload = (e) => {
    //   setPicture(e.target.result);
    // };
  };
  if (!user) return;

  const handleApply = () => {
    if (!user) return;
    if (!picture) {
      handleSubmit();
      return;
    }

    const imgRef = ref(
      firebaseStorage,
      `/images/profile/${v4() + picture.name}`
    );

    const uploadImg = uploadBytesResumable(imgRef, picture);

    uploadImg.on(
      "state_changed",
      (snapshot) => {
        // Observe state change events such as progress, pause, and resume
        // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log("Upload is " + progress + "% done");
        setUploadingProgress(progress);
      },
      (error) => {
        // Handle unsuccessful uploads
      },
      () => {
        // Handle successful uploads on complete
        // For instance, get the download URL: https://firebasestorage.googleapis.com/...
        getDownloadURL(uploadImg.snapshot.ref).then((downloadURL) => {
          setPfp(downloadURL);
          handleSubmit(downloadURL);
          setUploadingProgress(null);
          handleClose();
        });
      }
    );
  };

  const handleSubmit = (downloadURL) => {
    const data = {
      userId: user.id,
      name,
      email,
      pfp: downloadURL,
    };
    changeUserInfo(data)
      .then(({ data }) => {
        enqueueSnackbar(data.message, { variant: "success" });
        handleClose();
      })
      .catch((err) => {
        console.error(err);
        enqueueSnackbar(err.message, { variant: "error" });
      });
  };

  const handleOpenLocalFileBrowser = (e) => {
    console.dir(fileInputElement.current);
    fileInputElement.current.click();
  };
  return (
    <EnhencedModal open={open} handleClose={handleClose}>
      <Box p={5}>
        <LoadingOverlay
          loading={Boolean(uploadingProgress)}
          value={uploadingProgress}
        />
        <Stack direction="row" gap={2}>
          <Box
            position="relative"
            display="block"
            borderRadius="50%"
            overflow="hidden"
            width="fit-content"
            height="fit-content"
          >
            <Avatar src={picturePath} sx={{ width: 100, height: 100 }} />
            <Button
              sx={{
                display: "flex",
                justifyContent: "center",
                width: "100%",
                height: "50%",
                position: "absolute",
                top: "50%",
                transform: "translateY(25%)",
                backgroundColor: "#0000008b",
                color: "#fff",
                "&:hover": {
                  transform: "translateY(15%)",
                  cursor: "pointer",
                },
              }}
              onClick={handleOpenLocalFileBrowser}
            >
              Edit
            </Button>
          </Box>
          <Stack gap={2}>
            <TextField
              label="name"
              value={name}
              onChange={(e) => setName(e.currentTarget.value)}
            />
            <TextField
              disabled
              label="email"
              value={email}
              onChange={(e) => setEmail(e.currentTarget.value)}
            />
            <Button onClick={handleApply} variant="contained">
              Apply
            </Button>
            <input
              ref={fileInputElement}
              style={{ display: "none" }}
              type="file"
              accept=".jpg,.png,.jpge"
              onChange={handleInputFileChange}
            />
          </Stack>
        </Stack>
      </Box>
    </EnhencedModal>
  );
};

export default EditProfileModal;
