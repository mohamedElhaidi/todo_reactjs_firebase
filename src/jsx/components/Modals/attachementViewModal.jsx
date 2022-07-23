import {
  Box,
  Card,
  CardMedia,
  ImageListItem,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
} from "@mui/material";
import {
  convertBytesSizeToMB,
  getFileExtension,
  openInNewTab,
} from "../../../js/utils";
import EnhencedModal from "../EnhencedModal";
import TextEnhenced from "../TextEnhenced";

const AttachementViewModal = ({ attachement, open, handleClose }) => {
  if (!attachement) return;
  return (
    <EnhencedModal open={open} handleClose={handleClose}>
      <Box p={2} maxWidth="100%">
        <TextEnhenced text="Preview" />
        <TextEnhenced component="body" text={attachement.description} />
        <AttachementFilesList>
          {attachement.files.map((file) => (
            <AttachementFileItem key={file.name} file={file} />
          ))}
        </AttachementFilesList>
      </Box>
    </EnhencedModal>
  );
};

const AttachementFilesList = ({ children }) => {
  return <List>{children}</List>;
};
const AttachementFileItem = ({ file }) => {
  const sizeInMB = convertBytesSizeToMB(file.size);
  const nameLengthLimit = 55;
  const name =
    file.name.length > nameLengthLimit
      ? file.name.slice(0, nameLengthLimit) + "..." + getFileExtension(file)
      : file.name;
  const type = file.contentType.split("/")[0];
  let previewElement = null;
  switch (type) {
    case "image":
      previewElement = (
        <img src={file.url} style={{ maxHeight: "50px", maxWidth: "50px" }} />
      );
      break;

    default:
      break;
  }
  console.log(type);
  return (
    <ListItemButton dense>
      {previewElement}
      <ListItemText
        sx={{ pl: 1 }}
        primary={name}
        secondary={`size: ${sizeInMB}`}
        onClick={() => openInNewTab(file.url)}
      />
    </ListItemButton>
  );
};

export default AttachementViewModal;
