import React from "react";
import { Stack, Typography, Box, Button } from "@mui/material";
import useDeviceDetect from "../../hooks/useDeviceDetect";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import { Property } from "../../types/property/property";
import Link from "next/link";
import { formatterStr } from "../../utils";
import { REACT_APP_API_URL, topPropertyRank } from "../../config";
import { useReactiveVar } from "@apollo/client";
import { userVar } from "../../../apollo/store";
import IconButton from "@mui/material/IconButton";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import { useRouter } from "next/router";

interface PropertyCardType {
  property: Property;
  likePropertyHandler?: any;
  myFavorites?: boolean;
  recentlyVisited?: boolean;
}

const PropertyCard = (props: PropertyCardType) => {
  const { property, likePropertyHandler, myFavorites, recentlyVisited } = props;
  const device = useDeviceDetect();
  const user = useReactiveVar(userVar);
  const router = useRouter();
  const imagePath: string = property?.propertyImages[0]
    ? `${REACT_APP_API_URL}/${property?.propertyImages[0]}`
    : "/img/banner/header1.svg";

  // Handlers
  const pushDetailHandler = async (propertyId: string) => {
    console.log("propertyId", propertyId);
    await router.push({
      pathname: "/property/detail",
      query: { id: propertyId },
    });
  };

  if (device === "mobile") {
    return <div>PROPERTY CARD</div>;
  } else {
    return (
      <Stack className="card-config">
        <Stack className="top">
          <Link
            href={{
              pathname: "/property/detail",
              query: { id: property?._id },
            }}
          >
            <img src={imagePath} alt="" />
          </Link>
          {property && property?.propertyRank > topPropertyRank && (
            <Box component={"div"} className={"top-badge"}>
              <img src="/img/icons/electricity.svg" alt="" />
              <Typography>TOP</Typography>
            </Box>
          )}
          <Box component={"div"} className={"price-box"}>
            <Typography>${formatterStr(property?.propertyPrice)}</Typography>
          </Box>
        </Stack>
        <Stack className="bottom">
          <Stack className="name-address">
            <Stack className="name">
              <Link
                href={{
                  pathname: "/property/detail",
                  query: { id: property?._id },
                }}
              >
                <Typography>{property.propertyTitle}</Typography>
              </Link>
            </Stack>
            <Stack className="address">
              <Typography>
                {property.propertyAddress}, {property.propertyLocation}
              </Typography>
            </Stack>
          </Stack>
          <Stack className="options">
            <Stack className="option">
              <img src="/img/icons/bedroom.svg" alt="" />{" "}
              <p>{property.propertyBeds} bed</p>
            </Stack>
            <Stack className="option">
              <img src="/img/icons/bathroom.svg" alt="" />{" "}
              <p>{property.propertyRooms} room</p>
            </Stack>
            <Stack className="option">
              <img src="/img/icons/hotel-type.svg" alt="" />{" "}
              <p>{property.propertySquare} m2</p>
            </Stack>
          </Stack>
          <Stack className="type-buttons">
            {!recentlyVisited && (
              <Stack className="buttons">
                <IconButton sx={{ color: "#ffffff" }}>
                  <RemoveRedEyeIcon />
                </IconButton>
                <Typography className="view-cnt">
                  {property?.propertyViews}
                </Typography>
                <IconButton
                  onClick={() => likePropertyHandler(user, property?._id)}
                >
                  {myFavorites ? (
                    <FavoriteIcon sx={{ color: "red" }} />
                  ) : property?.meLiked && property?.meLiked[0]?.myFavorite ? (
                    <FavoriteIcon sx={{ color: "red" }} />
                  ) : (
                    <FavoriteBorderIcon sx={{ color: "white" }} />
                  )}
                </IconButton>
                <Typography className="view-cnt">
                  {property?.propertyLikes}
                </Typography>
              </Stack>
            )}

            <Button
              onClick={() => pushDetailHandler(property._id)}
              className="bott-btn"
            >
              View Property Details
            </Button>
          </Stack>
        </Stack>
      </Stack>
    );
  }
};

export default PropertyCard;
