import {
  collection,
  doc,
  getDoc,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { stringAvatar, timeSince } from "../../js/utils";
import { firestoreInstance } from "../../js/services/firebase/firestore";
import {
  Box,
  Card,
  Typography,
  List,
  ListItem,
  ListItemText,
  Stack,
  TextField,
  Button,
  ListItemAvatar,
  Avatar,
} from "@mui/material";

import SendIcon from "@mui/icons-material/Send";
import React, { useEffect, useRef, useState } from "react";

import { useParams } from "react-router-dom";

const Comments = ({
  firestorePath,
  handleSubmittingComment,
  sx,
  onCommentCountChanged,
  ...props
}) => {
  const [ticketCommentsColRef, setTicketCommentsColRef] = React.useState(null);
  const [comments, setComments] = React.useState([]);
  const [content, setContent] = useState("");
  const [sending, setSending] = useState(false);
  const listElementRef = useRef(null);
  const params = useParams();
  const chatTextFieldEl = useRef(null);

  useEffect(() => {
    if (!ticketCommentsColRef) return;
    // listen to comments collection changes
    const q = query(ticketCommentsColRef, orderBy("createdAt", "asc"));
    const unsub = onSnapshot(q, async (snap) => {
      snap.docChanges().forEach((change) => {
        if (change.type === "added") {
          setComments((prev) => [
            ...prev,
            { id: change.doc.id, ...change.doc.data() },
          ]);
        }
      });
    });

    return () => {
      unsub();
    };
  }, [ticketCommentsColRef]);
  useEffect(() => {
    setTicketCommentsColRef(collection(firestoreInstance, firestorePath));
  }, []);

  useEffect(() => {
    // auto scroll down when new item added
    listElementRef.current.scroll(0, listElementRef.current.scrollHeight);
    // notify parent
    if (onCommentCountChanged) onCommentCountChanged(comments.length);
  }, [comments]);

  const handleContentChange = (event) => {
    const c = event.target.value;
    if (c.length > 150) {
      console.error("comment can not be longer than 150 character");
      return;
    }
    setContent(c);
  };
  const handleSubmitting = () => {
    setSending(true);
    handleSubmittingComment(content, onSubmitted, onFailed);
    chatTextFieldEl.current.focus();
  };

  const onSubmitted = () => {
    setSending(false);
    eraseContentText();
  };

  const onFailed = () => {
    setSending(false);
  };

  const eraseContentText = () => {
    setContent("");
  };

  return (
    <Card variant="outlined" sx={{ padding: 1 }}>
      <Typography component="h2" variant="h6">
        {`Comments (${comments.length})`}
      </Typography>
      <List
        ref={listElementRef}
        dense={true}
        sx={{ height: 300, overflow: "auto", ...sx }}
        {...props}
      >
        {comments.map((comment) => (
          <Comment key={comment.id} comment={comment} />
        ))}
      </List>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "1fr auto",
          alignItems: "center",
          gap: 2,
        }}
      >
        <Box sx={{ gridColumn: "1" }}>
          <TextField
            sx={{ width: "100%" }}
            ref={chatTextFieldEl}
            label="type your comment"
            variant="outlined"
            size="small"
            value={content}
            onChange={handleContentChange}
            onKeyDown={(e) => {
              if (e.key === "Enter") handleSubmitting();
            }}
            disabled={sending}
          />
        </Box>
        <Box sx={{ gridColumn: "2" }}>
          <Button
            onClick={handleSubmitting}
            variant="contained"
            endIcon={<SendIcon />}
            disabled={sending}
          >
            Send
          </Button>
        </Box>
      </Box>
    </Card>
  );
};

// comment component
const Comment = ({ comment }) => {
  const [submitter, setSubmitter] = React.useState({});
  const getSubmitterInfo = async () => {
    setSubmitter(comment.submitter);
  };

  React.useEffect(() => {
    getSubmitterInfo();
  }, []);

  return (
    <ListItem>
      <ListItemAvatar>
        <Avatar alt={submitter.name} src={submitter.pfp}>
          {submitter.name && submitter.name.length >= 1
            ? submitter.name[0].toUpperCase()
            : null}
        </Avatar>
      </ListItemAvatar>
      <Card variant="outlined" sx={{ width: "100%", padding: 1 }}>
        <ListItemText
          primary={comment.content}
          secondary={`${timeSince(comment.createdAt)} by ${submitter.name}`}
        />
      </Card>
    </ListItem>
  );
};

export default Comments;
