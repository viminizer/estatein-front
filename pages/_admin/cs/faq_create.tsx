import React from "react";
import { NextPage } from "next";
import { Stack, Typography } from "@mui/material";
import dynamic from "next/dynamic";
const TuiEditor = dynamic(
  () => import("../../../libs/components/community/Teditor"),
  { ssr: false }
);
const FaqCreate: NextPage = () => {
  return (
    <div id="write-notice-page">
      <Stack className="main-title-box">
        <Stack className="right-box">
          <Typography className="main-title">Create a Notice</Typography>
        </Stack>
      </Stack>
      <TuiEditor />
    </div>
  );
};

export default FaqCreate;
