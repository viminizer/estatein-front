import React, { useEffect, useMemo, useRef, useState } from "react";
import {
  Box,
  Button,
  FormControl,
  MenuItem,
  Stack,
  Typography,
  Select,
  TextField,
} from "@mui/material";
import { BoardArticleCategory } from "../../enums/board-article.enum";
import { Editor } from "@toast-ui/react-editor";
import { getJwtToken } from "../../auth";
import { REACT_APP_API_URL } from "../../config";
import { useRouter } from "next/router";
import axios from "axios";
import { T } from "../../types/common";
import "@toast-ui/editor/dist/toastui-editor.css";
import { useMutation } from "@apollo/client";
import { CREATE_BOARD_ARTICLE } from "../../../apollo/user/mutation";
import { sweetErrorHandling, sweetTopSuccessAlert } from "../../sweetAlert";
import { Message } from "../../enums/common.enum";

const TuiEditor = () => {
  const editorRef = useRef<Editor>(null),
    token = getJwtToken(),
    router = useRouter();
  const [articleCategory, setArticleCategory] = useState<BoardArticleCategory>(
    BoardArticleCategory.FREE
  );

  /** APOLLO REQUESTS **/
  const [createBoardArticle] = useMutation(CREATE_BOARD_ARTICLE);

  const memoizedValues = useMemo(() => {
    const articleTitle = "",
      articleContent = "",
      articleImage = "";

    return { articleTitle, articleContent, articleImage };
  }, []);

  // LIFECYCLE

  /** HANDLERS **/
  const uploadImage = async (image: any) => {
    try {
      const formData = new FormData();
      formData.append(
        "operations",
        JSON.stringify({
          query: `mutation ImageUploader($file: Upload!, $target: String!) {
						imageUploader(file: $file, target: $target) 
				  }`,
          variables: {
            file: null,
            target: "article",
          },
        })
      );
      formData.append(
        "map",
        JSON.stringify({
          "0": ["variables.file"],
        })
      );
      formData.append("0", image);

      const response = await axios.post(
        `${process.env.REACT_APP_API_GRAPHQL_URL}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            "apollo-require-preflight": true,
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const responseImage = response.data.data.imageUploader;
      console.log("=responseImage: ", responseImage);
      memoizedValues.articleImage = responseImage;

      return `${REACT_APP_API_URL}/${responseImage}`;
    } catch (err) {
      console.log("Error, uploadImage:", err);
    }
  };

  const changeCategoryHandler = (e: any) => {
    setArticleCategory(e.target.value);
  };

  const articleTitleHandler = (e: T) => {
    console.log(e.target.value);
    memoizedValues.articleTitle = e.target.value;
  };

  const handleRegisterButton = async () => {
    try {
      const editor = editorRef.current;
      const articleContent = editor?.getInstance().getHTML() as string;
      memoizedValues.articleContent = articleContent;

      if (
        memoizedValues.articleContent === "" &&
        memoizedValues.articleTitle === ""
      ) {
        throw new Error(Message.INSERT_ALL_INPUTS);
      }

      await createBoardArticle({
        variables: {
          input: { ...memoizedValues, articleCategory },
        },
      });

      await sweetTopSuccessAlert("Article is created successfully", 700);
      await router.push({
        pathname: "/mypage",
        query: {
          category: "myArticles",
        },
      });
    } catch (err: any) {
      console.log(err);
      sweetErrorHandling(new Error(Message.INSERT_ALL_INPUTS)).then();
    }
  };

  const doDisabledCheck = () => {
    if (
      memoizedValues.articleContent === "" ||
      memoizedValues.articleTitle === ""
    ) {
      return true;
    }
  };

  return (
    <Stack>
      <Stack
        direction="row"
        style={{ margin: "40px" }}
        justifyContent="space-evenly"
      >
        <Box
          component={"div"}
          className={"form_row"}
          style={{ width: "300px" }}
        >
          <Typography style={{ color: "#999999", margin: "10px" }} variant="h3">
            Category
          </Typography>
          <FormControl sx={{ width: "100%", background: "#141414" }}>
            <Select
              value={articleCategory}
              onChange={changeCategoryHandler}
              displayEmpty
              sx={{
                backgroundColor: "#141414", // Background of the Select field
                color: "white", // Text color
                ".MuiOutlinedInput-notchedOutline": {
                  borderColor: "#262626",
                },
                "&:hover .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#262626",
                },
                "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                  borderColor: "#262626",
                },
                ".MuiSvgIcon-root": {
                  color: "white", // Dropdown arrow color
                },
              }}
              inputProps={{ "aria-label": "Without label" }}
              MenuProps={{
                PaperProps: {
                  sx: {
                    backgroundColor: "#141414", // Menu background
                  },
                },
              }}
            >
              <MenuItem
                value={BoardArticleCategory.FREE}
                sx={{
                  backgroundColor: "#141414",
                  color: "white",
                  "&:hover": { backgroundColor: "#1a1a1a" },
                  "&.Mui-selected": { backgroundColor: "#1a1a1a !important" },
                  "&.Mui-selected:hover": { backgroundColor: "#1a1a1a" },
                }}
              >
                <span>Free</span>
              </MenuItem>
              <MenuItem
                sx={{
                  backgroundColor: "#141414",
                  color: "white",
                  "&:hover": { backgroundColor: "#1a1a1a" },
                  "&.Mui-selected": { backgroundColor: "#1a1a1a !important" },
                  "&.Mui-selected:hover": { backgroundColor: "#1a1a1a" },
                }}
                value={BoardArticleCategory.HUMOR}
              >
                Humor
              </MenuItem>
              <MenuItem
                value={BoardArticleCategory.NEWS}
                sx={{
                  backgroundColor: "#141414",
                  color: "white",
                  "&:hover": { backgroundColor: "#1a1a1a" },
                  "&.Mui-selected": { backgroundColor: "#1a1a1a !important" },
                  "&.Mui-selected:hover": { backgroundColor: "#1a1a1a" },
                }}
              >
                News
              </MenuItem>
              <MenuItem
                value={BoardArticleCategory.RECOMMEND}
                sx={{
                  backgroundColor: "#141414",
                  color: "white",
                  "&:hover": { backgroundColor: "#1a1a1a" },
                  "&.Mui-selected": { backgroundColor: "#1a1a1a !important" },
                  "&.Mui-selected:hover": { backgroundColor: "#1a1a1a" },
                }}
              >
                Recommendation
              </MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box
          component={"div"}
          style={{ width: "300px", flexDirection: "column" }}
        >
          <Typography style={{ color: "#999999", margin: "10px" }} variant="h3">
            Title
          </Typography>
          <TextField
            onChange={articleTitleHandler}
            id="filled-basic"
            InputProps={{
              disableUnderline: true, // Removes the underline
              sx: {
                outline: "none",
                border: "none",

                backgroundColor: "#141414", // Background color
                color: "white", // Text color
                padding: "10px", // Adds padding
              },
            }}
            sx={{
              backgroundColor: "#141414",
              color: "white",
              borderRadius: "4px",
              "& .MuiFilledInput-root": {
                backgroundColor: "#141414", // Background color
                boxShadow: "none", // Remove shadow
                border: "1px solid #262626 ", // Remove border
              },
              "& .MuiFilledInput-root:hover": {
                backgroundColor: "#1a1a1a", // Slight hover effect
              },
              "& .MuiFilledInput-root:before, & .MuiFilledInput-root:after": {
                content: "none", // Removes the default focus outline
              },
              "& .MuiInputBase-input": {
                color: "white", // Text color
              },
              "& .Mui-focused": {
                backgroundColor: "#141414 !important", // Ensures no background change on focus
                boxShadow: "none !important", // Remove focus shadow
                outline: "none !important", // Remove focus outline
                border: "1px solid #262626 ", // Ensure no border
              },
              "& .MuiOutlinedInput-notchedOutline": {
                border: "1px solid #262626 ", // Removes the default border
              },
              "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline":
              {
                border: "1px solid #262626 ", // Remove focus border
              },
            }}
          />
        </Box>
      </Stack>

      <Editor
        theme="dark"
        initialValue={"Type here"}
        placeholder={"Type here"}
        previewStyle={"vertical"}
        height={"640px"}
        // @ts-ignore
        initialEditType={"WYSIWYG"}
        toolbarItems={[
          ["heading", "bold", "italic", "strike"],
          ["image", "table", "link"],
          ["ul", "ol", "task"],
        ]}
        ref={editorRef}
        hooks={{
          addImageBlobHook: async (image: any, callback: any) => {
            const uploadedImageURL = await uploadImage(image);
            callback(uploadedImageURL);
            return false;
          },
        }}
        events={{
          load: function (param: any) { },
        }}
      />

      <Stack direction="row" justifyContent="center">
        <Button
          variant="contained"
          style={{
            margin: "30px",
            width: "250px",
            height: "45px",
            backgroundColor: "#703fb7",
            color: "#ffffff",
          }}
          onClick={handleRegisterButton}
        >
          Register
        </Button>
      </Stack>
    </Stack>
  );
};

export default TuiEditor;
