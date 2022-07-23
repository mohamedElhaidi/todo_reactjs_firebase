import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import {
  Chip,
  Collapse,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { collection, doc, onSnapshot } from "firebase/firestore";
import { useState } from "react";
import { useEffect } from "react";
import { firestoreInstance } from "../../../js/services/firebase/firestore";
import { timeSince } from "../../../js/utils";
import { EnhencedTableModified } from "../../components/EnhencedTableModified";

const HistoryTable = ({ firestorePath }) => {
  const [historyRecords, setHistoryRecords] = useState([]);
  useEffect(() => {
    const docRef = collection(firestoreInstance, firestorePath);

    const unsub = onSnapshot(docRef, (snap) => {
      snap.docChanges().forEach((docChange) => {
        switch (docChange.type) {
          case "added":
            setHistoryRecords((prev) => [
              ...prev,
              { id: docChange.doc.id, ...docChange.doc.data() },
            ]);
            break;
          case "modified":
            setHistoryRecords((prev) =>
              prev.map((hR) =>
                hR !== docChange.doc.id
                  ? hR
                  : { id: docChange.doc.id, ...docChange.doc.data() }
              )
            );
            break;
          case "removed":
            setHistoryRecords((prev) =>
              prev.filter((hR) => hR !== docChange.doc.id)
            );
            break;

          default:
            break;
        }
      });
    });

    return () => {
      unsub();
    };
  }, [firestorePath]);

  return (
    <List component="nav" disablePadding>
      {historyRecords.map((hR) => (
        <CollabsableListItem
          key={hR.id}
          title={`changes:${hR.fieldsChanged.length} - ${timeSince(
            hR.createdAt
          )}`}
        >
          {hR.fieldsChanged.map((fc, index) => (
            <ListItemButton key={index} sx={{ pl: 4 }} dense disableRipple>
              <ListItemText primary={String(fc.name)} />
              <ListItemText
                primary={`after: ${String(fc.after)}`}
                secondary={`before: ${String(fc.before)}`}
              />
            </ListItemButton>
          ))}
        </CollabsableListItem>
      ))}
    </List>
  );
};

const CollabsableListItem = ({ title, children }) => {
  const [open, setOpen] = useState(false);
  return (
    <>
      <ListItemButton onClick={() => setOpen((p) => !p)}>
        <ListItemIcon></ListItemIcon>
        <ListItemText primary={title} />
        {open ? <ExpandLess /> : <ExpandMore />}
      </ListItemButton>
      <Collapse in={open} timeout="auto" unmountOnExit>
        <List component="div" disablePadding>
          {children}
        </List>
      </Collapse>
    </>
  );
};

export default HistoryTable;
