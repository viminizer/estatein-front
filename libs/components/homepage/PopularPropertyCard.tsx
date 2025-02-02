import React from "react";
import { Stack, Box, Divider, Typography, Button } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import useDeviceDetect from "../../hooks/useDeviceDetect";
import { Property } from "../../types/property/property";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { REACT_APP_API_URL, topPropertyRank } from "../../config";
import { useRouter } from "next/router";
import { useReactiveVar } from "@apollo/client";
import { userVar } from "../../../apollo/store";

interface PopularPropertyCardProps {
  property: Property;
}

const PopularPropertyCard = (props: PopularPropertyCardProps) => {
  const { property } = props;
  const device = useDeviceDetect();
  const router = useRouter();
  const user = useReactiveVar(userVar);

  /** HANDLERS **/
  const pushDetailHandler = async (propertyId: string) => {
    console.log("propertyId", propertyId);
    await router.push({
      pathname: "/property/detail",
      query: { id: propertyId },
    });
  };

  if (device === "mobile") {
    return (
      <Stack className="popular-card-box">
        <Box
          component={"div"}
          className={"card-img"}
          style={{
            backgroundImage: `url(${REACT_APP_API_URL}/${property?.propertyImages[0]})`,
          }}
          onClick={() => pushDetailHandler(property._id)}
        >
          {property?.propertyRank &&
            property?.propertyRank >= topPropertyRank ? (
            <div className={"status"}>
              <img src="/img/icons/electricity.svg" alt="" />
              <span>top</span>
            </div>
          ) : (
            ""
          )}

          <div className={"price"}>${property.propertyPrice}</div>
        </Box>
        <Box component={"div"} className={"info"}>
          <strong
            onClick={() => pushDetailHandler(property._id)}
            className={"title"}
          >
            {property.propertyTitle}
          </strong>
          <p className={"desc"}>{property.propertyAddress}</p>
          <div className={"options"}>
            <div>
              <img src="/img/icons/bed.svg" alt="" />
              <span>{property?.propertyBeds} bed</span>
            </div>
            <div>
              <img src="/img/icons/room.svg" alt="" />
              <span>{property?.propertyRooms} rooms</span>
            </div>
            <div>
              <img src="/img/icons/expand.svg" alt="" />
              <span>{property?.propertySquare} m2</span>
            </div>
          </div>
          <div className={"bott"}>
            <p>{property?.propertyRent ? "rent" : "sale"}</p>
            <div className="view-like-box">
              <IconButton color={"default"}>
                <RemoveRedEyeIcon />
              </IconButton>
              <Typography className="view-cnt">
                {property?.propertyViews}
              </Typography>
            </div>
          </div>
        </Box>
      </Stack>
    );
  } else {
    return (
      <Stack className="popular-card-box">
        <Box
          component={"div"}
          className={"card-img"}
          style={{
            backgroundImage: `url(${REACT_APP_API_URL}/${property?.propertyImages[0]})`,
          }}
          onClick={() => pushDetailHandler(property._id)}
        >
          {property?.propertyRank &&
            property?.propertyRank >= topPropertyRank ? (
            <div className={"status"}>
              <img src="/img/icons/electricity.svg" alt="" />
              <span>top</span>
            </div>
          ) : (
            ""
          )}

          <div className={"price"}>${property.propertyPrice}</div>
        </Box>
        <Box component={"div"} className={"info"}>
          <strong
            onClick={() => pushDetailHandler(property._id)}
            className={"title"}
          >
            {property.propertyTitle}
          </strong>
          <p className={"desc"}>{property.propertyAddress}</p>
          <div className={"options"}>
            <div>
              <img src="/img/icons/bedroom.svg" alt="" />
              <span>{property?.propertyBeds} bed</span>
            </div>
            <div>
              <img src="/img/icons/bathroom.svg" alt="" />
              <span>{property?.propertyRooms} rooms</span>
            </div>
            <div>
              <img src="/img/icons/hotel-type.svg" alt="" />
              <span>{property?.propertySquare} m2</span>
            </div>
          </div>
          <div className={"bott"}>
            <div className="view-like-box">
              <IconButton style={{ color: "#ffffff" }}>
                <RemoveRedEyeIcon />
              </IconButton>
              <Typography className="view-cnt">
                {property?.propertyViews}
              </Typography>
            </div>
            <Button
              onClick={() => pushDetailHandler(property._id)}
              className="bott-btn"
            >
              View Property Details
            </Button>
          </div>
        </Box>
      </Stack>
    );
  }
};

export default PopularPropertyCard;
