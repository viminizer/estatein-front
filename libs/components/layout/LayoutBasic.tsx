import React, { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/router";
import useDeviceDetect from "../../hooks/useDeviceDetect";
import Head from "next/head";
import Top from "../Top";
import Footer from "../Footer";
import { Stack } from "@mui/material";
import { getJwtToken, updateUserInfo } from "../../auth";
import Chat from "../Chat";
import { useReactiveVar } from "@apollo/client";
import { userVar } from "../../../apollo/store";
import { useTranslation } from "next-i18next";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const withLayoutBasic = (Component: any) => {
  return (props: any) => {
    const router = useRouter();
    const { t, i18n } = useTranslation("common");
    const device = useDeviceDetect();
    const [authHeader, setAuthHeader] = useState<boolean>(false);
    const user = useReactiveVar(userVar);

    const memoizedValues = useMemo(() => {
      let title = "",
        desc = "",
        bgImage = "";

      switch (router.pathname) {
        case "/property":
          title = "Find Your Dream Property";
          desc =
            "Welcome to Estatein, where your dream property awaits in every corner of our beautiful world. Explore our curated selection of properties, each offering a unique story and a chance to redefine your life. With categories to suit every dreamer, your journey ";
          bgImage = "linear-gradient(to right, #262626, #141414 30%)";
          break;
        case "/agent":
          title = "Meet the Estatein Agents";
          desc =
            "At Estatein, our success is driven by the dedication and expertise of our agents. Get to know the people behind our mission to make your real estate dreams a reality.";
          bgImage = "linear-gradient(to right, #262626, #141414 30%)";
          break;
        case "/agent/detail":
          title = "Agent Page";
          desc = "Home / For Rent";
          bgImage = "linear-gradient(to right, #262626, #141414 30%)";
          break;
        case "/mypage":
          title = "my page";
          desc = "Home / For Rent";
          bgImage = "linear-gradient(to right, #262626, #141414 30%)";
          break;
        case "/community":
          title = "Community";
          desc =
            "Explore a variety of insightful articles shared by our community, covering everything from helpful tips to trending topics. Join the conversation and contribute your own knowledge!";
          bgImage = "linear-gradient(to right, #262626, #141414 30%)";
          break;
        case "/community/detail":
          title = "Community Detail";
          desc = "Home / For Rent";
          bgImage = "linear-gradient(to right, #262626, #141414 30%)";
          break;
        case "/cs":
          title = "CS";
          desc = "We are glad to see you again!";
          bgImage = "linear-gradient(to right, #262626, #141414 30%)";
          break;
        case "/account/join":
          title = "Login/Signup";
          desc = "Authentication Process";
          bgImage = "linear-gradient(to right, #262626, #141414 30%)";
          setAuthHeader(true);
          break;
        case "/member":
          title = "Member Page";
          desc = "Home / For Rent";
          bgImage = "linear-gradient(to right, #262626, #141414 30%)";
          break;
        default:
          break;
      }

      return { title, desc, bgImage };
    }, [router.pathname]);

    /** LIFECYCLES **/
    useEffect(() => {
      const jwt = getJwtToken();
      if (jwt) updateUserInfo(jwt);
    }, []);

    /** HANDLERS **/

    if (device == "mobile") {
      return (
        <>
          <Head>
            <title>Estatein</title>
            <meta name={"title"} content={`Nestar`} />
          </Head>
          <Stack id="mobile-wrap">
            <Stack id={"top"}>
              <Top />
            </Stack>

            <Stack id={"main"}>
              <Component {...props} />
            </Stack>

            <Stack id={"footer"}>
              <Footer />
            </Stack>
          </Stack>
        </>
      );
    } else {
      return (
        <>
          <Head>
            <title>Estatein</title>
            <meta name={"title"} content={`Estatein`} />
          </Head>
          <Stack id="pc-wrap">
            <Stack id={"top"}>
              <Top />
            </Stack>

            <Stack
              className={`header-basic ${authHeader && "auth"}`}
              style={{
                background: memoizedValues.bgImage,
              }}
            >
              <Stack className={"container"}>
                <strong>{t(memoizedValues.title)}</strong>
                <span>{t(memoizedValues.desc)}</span>
              </Stack>
            </Stack>

            <Stack id={"main"}>
              <Component {...props} />
            </Stack>

            <Chat />

            <Stack id={"footer"}>
              <Footer />
            </Stack>
          </Stack>
        </>
      );
    }
  };
};

export default withLayoutBasic;
