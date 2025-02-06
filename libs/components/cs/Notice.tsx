import React, { useState } from "react";
import { Stack, Box } from "@mui/material";
import useDeviceDetect from "../../hooks/useDeviceDetect";
import { useQuery } from "@apollo/client";
import { GET_NOTICES } from "../../../apollo/admin/query";
import Moment from "react-moment";

const data = [
  {
    no: 1,
    event: true,
    title: "Register to use and get discounts",
    date: "01.03.2024",
  },
  {
    no: 2,
    title: "It's absolutely free to upload and trade properties",
    date: "31.03.2024",
  },
];

const Notice = () => {
  const device = useDeviceDetect();
  const [notices, setNotices] = useState<any>([]);
  /** APOLLO REQUESTS **/

  const { } = useQuery(GET_NOTICES, {
    fetchPolicy: "cache-and-network",
    notifyOnNetworkStatusChange: true,
    onCompleted: (data) => {
      setNotices(data.getNotices?.list);
    },
  });

  /** LIFECYCLES **/
  /** HANDLERS **/
  console.log("NOTIDCES", notices);

  if (device === "mobile") {
    return <div>NOTICE MOBILE</div>;
  } else {
    return (
      <Stack className={"notice-content"}>
        <span className={"title"}>Notice</span>
        <Stack className={"main"}>
          <Box component={"div"} className={"top"}>
            <span>number</span>
            <span>title</span>
            <span>date</span>
          </Box>
          <Stack className={"bottom"}>
            {notices.map((ele: any, index: number) => (
              <div
                className={`notice-card ${ele?.event && "event"}`}
                key={ele.noticeTitle}
              >
                {ele?.event ? (
                  <div>event</div>
                ) : (
                  <span className={"notice-number"}>{index + 1}</span>
                )}
                <span className={"notice-title"}>{ele.noticeTitle}</span>
                <span className={"notice-date"}>
                  <Moment className={"time-added"} format={"DD.MM.YY"}>
                    {ele?.createdAt}
                  </Moment>
                </span>
              </div>
            ))}
          </Stack>
        </Stack>
      </Stack>
    );
  }
};

export default Notice;
