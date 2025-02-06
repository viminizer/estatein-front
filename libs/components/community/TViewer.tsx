import React, { useEffect, useRef, useState } from "react";
import "@toast-ui/editor/dist/toastui-editor.css";
import { Viewer } from "@toast-ui/react-editor";
import { Box, Stack, CircularProgress } from "@mui/material";

const TViewer = (props: any) => {
  const [editorLoaded, setEditorLoaded] = useState(false);
  const viewerRef = useRef<any>(null);

  /** LIFECYCLES **/
  useEffect(() => {
    if (props.markdown) {
      setEditorLoaded(true);
    } else {
      setEditorLoaded(false);
    }

    if (viewerRef.current) {
      viewerRef.current.style.color = "white";
    }
  }, [props.markdown]);

  return (
    <Stack
      sx={{
        background: "#141414",
        mt: "30px",
        borderRadius: "10px",
      }}
    >
      <Box component={"div"} sx={{ m: "40px" }}>
        {editorLoaded ? (
          <Viewer
            ref={viewerRef}
            initialValue={props.markdown}
            customHTMLRenderer={{
              htmlBlock: {
                iframe(node: any) {
                  return [
                    {
                      type: "openTag",
                      tagName: "iframe",
                      outerNewLine: true,
                      attributes: node.attrs,
                    },
                    { type: "html", content: node.childrenHTML ?? "" },
                    { type: "closeTag", tagName: "iframe", outerNewLine: true },
                  ];
                },
                div(node: any) {
                  return [
                    {
                      type: "openTag",
                      tagName: "div",
                      outerNewLine: true,
                      attributes: node.attrs,
                    },
                    { type: "html", content: node.childrenHTML ?? "" },
                    { type: "closeTag", tagName: "div", outerNewLine: true },
                  ];
                },
              },
              htmlInline: {
                big(node: any, { entering }: any) {
                  return entering
                    ? {
                      type: "openTag",
                      tagName: "big",
                      attributes: node.attrs,
                    }
                    : { type: "closeTag", tagName: "big" };
                },
              },
            }}
          />
        ) : (
          <CircularProgress />
        )}
      </Box>
    </Stack>
  );
};

export default TViewer;
