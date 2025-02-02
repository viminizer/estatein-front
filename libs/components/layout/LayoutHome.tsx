import React, { useEffect } from "react";
import useDeviceDetect from "../../hooks/useDeviceDetect";
import Head from "next/head";
import Top from "../Top";
import Footer from "../Footer";
import { Box, Button, Stack, Typography } from "@mui/material";
import FiberContainer from "../common/FiberContainer";
import HeaderFilter from "../homepage/HeaderFilter";
import { userVar } from "../../../apollo/store";
import { useReactiveVar } from "@apollo/client";
import { getJwtToken, updateUserInfo } from "../../auth";
import Chat from "../Chat";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

const withLayoutMain = (Component: any) => {
  return (props: any) => {
    const device = useDeviceDetect();
    const user = useReactiveVar(userVar);

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
            <meta name={"title"} content={`Nestar`} />
          </Head>
          <Stack id="pc-wrap">
            <Stack id={"top"}>
              {" "}
              <Top />{" "}
            </Stack>

            <Stack className={"header-main"}>
              <Stack className="container">
                <Stack className="left">
                  <Typography className="heading">
                    Discover Your Dream Property With Estatein
                  </Typography>
                  <p className="desc">
                    Your journey to finding the perfect property begins here.
                    Explore our listings to find the home that matches your
                    dreams.
                  </p>
                  <Stack className="buttons">
                    <Button className="learn-more">Learn More</Button>
                    <Button className="browse-hotels">Browse Properties</Button>
                  </Stack>
                  <Stack className="cards">
                    <Stack className="card">
                      <Typography className="card-text">200+</Typography>
                      <p className="card-desc">Happy Customers</p>
                    </Stack>
                    <Stack className="card">
                      <Typography className="card-text">10k+</Typography>
                      <p className="card-desc">Hotels For Clients</p>
                    </Stack>
                    <Stack className="card">
                      <Typography className="card-text">16+</Typography>
                      <p className="card-desc">Years of Experience</p>
                    </Stack>
                  </Stack>
                </Stack>
                <Stack className="right">
                  <img src="/img/banner/building.png" alt="building" />
                </Stack>
              </Stack>
              <Stack className="bottom">
                <Stack className="cards">
                  <Stack className="card">
                    <img src="/img/banner/first-card-icon.png" alt="" />
                    <p>Find Your Dream Hotel</p>
                  </Stack>
                  <Stack className="card">
                    <img src="/img/banner/second-card-icon.png" alt="" />
                    <p>Unlock Property Value</p>
                  </Stack>
                  <Stack className="card">
                    <img src="/img/banner/third-card-icon.png" alt="" />
                    <p>Effortless Property Management</p>
                  </Stack>
                  <Stack className="card">
                    <img src="/img/banner/fourth-card-icon.png" alt="" />
                    <p>Smart Inverstments</p>
                  </Stack>
                </Stack>
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

export default withLayoutMain;
