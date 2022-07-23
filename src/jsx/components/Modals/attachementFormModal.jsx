import {
  Box,
  Button,
  Card,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { useState } from "react";
import AddCircleIcon from "@mui/icons-material/AddCircle";
import EnhencedModal from "../EnhencedModal";
import { useRef } from "react";
import { Container } from "@mui/system";
import TextEnhenced from "../TextEnhenced";
import CloseIcon from "@mui/icons-material/Close";
import { v4 } from "uuid";
import { useEffect } from "react";
import { firebaseStorage } from "../../../js/services/firebase/firebase-storage";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";
import LoadingOverlay from "../LoadingOverlay";
import { addAttachement } from "../../../js/services/tickets";
import { async } from "@firebase/util";
import { getFileType } from "../../../js/utils";
import { useSnackbar } from "notistack";
const AttachementFormModal = ({
  projectId,
  ticketId,

  open,
  handleClose,
}) => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();

  const [loading, setLoading] = useState(false);
  const [files, setFiles] = useState([]);

  const [description, setDescription] = useState("");

  const handleFormSubmit = (e) => {
    e.preventDefault();

    const fileNameSeperator = "_-__-_-_--";
    setLoading(true);
    const listeners = [];
    files.forEach((file) => {
      const name = v4() + fileNameSeperator + file.name;
      const fileRef = ref(
        firebaseStorage,
        `/images/tickets/attachements/${name}`
      );
      const uploadPromise = uploadBytes(fileRef, file);
      listeners.push(uploadPromise);
    });

    Promise.all(listeners)
      .then((uploadResults) => {
        // grab info about each file uploaded including thier public url
        // returns an array of object bello
        return Promise.all(
          // i tried forEach() but doesn't return a promise which is nessery in this case
          // map() works perfectly
          uploadResults.map(async (uploadResult) => {
            const { ref, metadata } = uploadResult;
            const downloadUrl = await getDownloadURL(ref);
            // delete the v4() hash part and grab the original name of the file
            const nameSplit = metadata.name.split(fileNameSeperator);
            const name = nameSplit[nameSplit.length - 1];
            return {
              name,
              contentType: metadata.contentType,
              size: metadata.size,
              md5Hash: metadata.md5Hash,
              url: downloadUrl,
            };
          })
        );
      })
      // after grabing url from and metadata from each result
      // we add new document in the database
      .then((filesArray) => {
        const data = {
          projectId: projectId,
          ticketId: ticketId,
          description,
          files: filesArray,
        };
        console.log(data);
        // send add request to cloud function addAttachement
        return addAttachement(data);
      })
      .then(({ data }) => {
        setLoading(false);
        console.log(data);
        enqueueSnackbar(data.message, { variant: "success" });
        handleClose(true);
      })
      .catch((err) => {
        setLoading(false);
        enqueueSnackbar(err.message, { variant: "error" });
        console.log(err);
      });
  };

  const handleSelectedFileChange = (files) => {
    setFiles(files);
  };
  return (
    <EnhencedModal
      sx={{ minWidth: "700px", maxWidth: "700px" }}
      open={open}
      loading={loading}
      handleClose={handleClose}
    >
      <LoadingOverlay loading={loading} />
      <form onSubmit={handleFormSubmit}>
        <Stack gap={2} p={2} px={3}>
          <TextEnhenced
            component="h1"
            variant="h5"
            text="Add new attachements"
          />
          <TextField
            multiline
            maxRows={15}
            minRows={2}
            value={description}
            onChange={(e) => setDescription(e.currentTarget.value)}
            label="Description"
          />

          <FilesGraber onFilesSelectedChanged={handleSelectedFileChange} />
          <Button type="submit" variant="contained">
            submite
          </Button>
        </Stack>
      </form>
    </EnhencedModal>
  );
};

const FilesGraber = ({ maxFileSize, onFilesSelectedChanged }) => {
  const [files, setFiles] = useState([]);

  const handleAddingFiles = (files) => {
    if (!files) return;

    setFiles((p) => [...p, ...files]);
  };
  const handleFileDeletion = (fileToDelete) => {
    if (!fileToDelete) return;
    setFiles((p) => p.filter((file) => file !== fileToDelete));
  };

  useEffect(() => {
    onFilesSelectedChanged(files);
  }, [files]);
  return (
    <Container maxWidth="100%">
      <TextEnhenced
        component="h1"
        variant="h5"
        text={`Files (${files.length})`}
      />
      <Box display="flex" gap="15px" overflow="auto" maxWidth="100%" py={2}>
        {files.map((file) => (
          <Item key={file.name} file={file} onDeleteFile={handleFileDeletion} />
        ))}
        <AddItemButton
          maxFileSize={maxFileSize}
          handleFilesSelected={handleAddingFiles}
        />
      </Box>
    </Container>
  );
};

const Item = ({ file, onDeleteFile }) => {
  if (!file) return;

  const type = getFileType(file);

  let preview = null;
  switch (type) {
    case "image":
      preview = (
        <img
          src={URL.createObjectURL(file)}
          style={{ maxWidth: "100%", maxHeight: "100%" }}
        />
      );
      break;

    default:
      preview = <Typography>No preview</Typography>;
      break;
  }

  return (
    <div
      style={{ display: "inline-block", position: "relative", width: "100px" }}
    >
      <Tooltip title={file.name}>
        <div>
          <IconButton
            sx={{
              position: "absolute",
              top: 0,
              right: 0,
              zIndex: 2,
            }}
            onClick={() => onDeleteFile(file)}
          >
            <CloseIcon />
          </IconButton>
          <Box
            variant="contained"
            color="secondary"
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              p: 1,
              width: 100,
              height: 100,
            }}
          >
            {preview}
          </Box>
          <Box maxWidth="100%" textOverflow="ellipsis">
            <TextEnhenced noWrap text={file.name} />
          </Box>
        </div>
      </Tooltip>
    </div>
  );
};

const AddItemButton = ({ maxFileSize = 5242880, handleFilesSelected }) => {
  const elRef = useRef(null);
  const triggerInputClick = () => {
    elRef.current.click();
  };

  const handleSelectingFile = (e) => {
    const files = [...e.target.files];
    files.forEach((file) => {
      if (file.size > maxFileSize) {
        alert(
          `file size is bigger than ${Number(maxFileSize / 1024).toFixed(2)} KB`
        );
      }
    });
    handleFilesSelected(files);
  };

  return (
    <div style={{ display: "inline-block" }}>
      <Button
        variant="contained"
        color="secondary"
        onClick={triggerInputClick}
        sx={{
          alignItems: "center",
          justifyContent: "center",
          p: 1,
          width: 100,
          height: 100,
        }}
      >
        <AddCircleIcon />

        <input
          ref={elRef}
          multiple
          type="file"
          style={{ display: "none" }}
          onChange={handleSelectingFile}
        />
      </Button>
    </div>
  );
};

export default AttachementFormModal;
