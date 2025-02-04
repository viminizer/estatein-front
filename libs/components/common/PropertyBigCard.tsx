import React from "react";
import { Stack, Box, Divider, Typography, Button } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import useDeviceDetect from "../../hooks/useDeviceDetect";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Property } from "../../types/property/property";
import { REACT_APP_API_URL, topPropertyRank } from "../../config";
import { formatterStr } from "../../utils";
import { useReactiveVar } from "@apollo/client";
import { userVar } from "../../../apollo/store";
import { useRouter } from "next/router";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";

interface PropertyBigCardProps {
  likePropertyHandler?: any;
  property: Property;
}

const PropertyBigCard = (props: PropertyBigCardProps) => {
  const { property, likePropertyHandler } = props;
  const device = useDeviceDetect();
  const user = useReactiveVar(userVar);
  const router = useRouter();

  /** HANDLERS **/
  const goPropertyDetatilPage = (propertyId: string) => {
    router.push(`/property/detail?id=${propertyId}`);
  };

  const pushDetailHandler = async (propertyId: string) => {
    await router.push({
      pathname: "/property/detail",
      query: { id: propertyId },
    });
  };

  if (device === "mobile") {
    return <div>APARTMEND BIG CARD</div>;
  } else {
    return (
      <Stack className="property-big-card-box">
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

export default PropertyBigCard;
