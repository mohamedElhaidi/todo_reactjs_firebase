import React from "react";
import Comments from "../../components/comments";
import { COMMENT_TYPE_TICKET } from "../../../js/services/comments/types";
import { submitComment } from "../../../js/services/comments/comments";
import { useSnackbar } from "notistack";

const TicketComments = ({ projectId, ticketId, onCommentCountChanged }) => {
  const { enqueueSnackbar, closeSnackbar } = useSnackbar();
  const handleSubmittingComment = (content, onSubmitted, onFailed) => {
    const options = {
      projectId,
      ticketId,
    };
    submitComment({ content, type: COMMENT_TYPE_TICKET, options })
      .then(({ data }) => {
        onSubmitted();
        enqueueSnackbar(data.message, { variant: "success" });
        console.log(data);
      })
      .catch((err) => {
        onFailed();
        enqueueSnackbar(err.message, { variant: "error" });
        console.log(err);
      });
  };
  return (
    <Comments
      onCommentCountChanged={onCommentCountChanged}
      firestorePath={`/projects/${projectId}/tickets/${ticketId}/comments`}
      handleSubmittingComment={handleSubmittingComment}
    />
  );
};

export default TicketComments;
