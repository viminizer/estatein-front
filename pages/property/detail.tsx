import { useMutation, useQuery, useReactiveVar } from "@apollo/client";
import EastIcon from "@mui/icons-material/East";
import FavoriteIcon from "@mui/icons-material/Favorite";
import FavoriteBorderIcon from "@mui/icons-material/FavoriteBorder";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import WestIcon from "@mui/icons-material/West";
import {
  Box,
  Button,
  CircularProgress,
  Pagination as MuiPagination,
  Stack,
  Typography,
} from "@mui/material";
import moment from "moment";
import { NextPage } from "next";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { ChangeEvent, useEffect, useState } from "react";
import SwiperCore, { Autoplay, Navigation, Pagination } from "swiper";
import "swiper/css";
import "swiper/css/pagination";
import { Swiper, SwiperSlide } from "swiper/react";
import { userVar } from "../../apollo/store";
import {
  CREATE_COMMENT,
  LIKE_TARGET_PROPERTY,
} from "../../apollo/user/mutation";
import {
  GET_COMMENTS,
  GET_PROPERTIES,
  GET_PROPERTY,
} from "../../apollo/user/query";
import PropertyBigCard from "../../libs/components/common/PropertyBigCard";
import withLayoutFull from "../../libs/components/layout/LayoutFull";
import Review from "../../libs/components/property/Review";
import { REACT_APP_API_URL } from "../../libs/config";
import { CommentGroup } from "../../libs/enums/comment.enum";
import { Direction, Message } from "../../libs/enums/common.enum";
import useDeviceDetect from "../../libs/hooks/useDeviceDetect";
import {
  sweetErrorHandling,
  sweetMixinErrorAlert,
  sweetTopSmallSuccessAlert,
} from "../../libs/sweetAlert";
import { Comment } from "../../libs/types/comment/comment";
import {
  CommentInput,
  CommentsInquiry,
} from "../../libs/types/comment/comment.input";
import { T } from "../../libs/types/common";
import { Property } from "../../libs/types/property/property";
import { formatterStr } from "../../libs/utils";

SwiperCore.use([Autoplay, Navigation, Pagination]);

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ["common"])),
  },
});

const PropertyDetail: NextPage = ({ initialComment, ...props }: any) => {
  const device = useDeviceDetect();
  const router = useRouter();
  const user = useReactiveVar(userVar);
  const [propertyId, setPropertyId] = useState<string | null>(null);
  const [property, setProperty] = useState<Property | null>(null);
  const [slideImage, setSlideImage] = useState<string>("");
  const [destinationProperties, setDestinationProperties] = useState<
    Property[]
  >([]);
  const [commentInquiry, setCommentInquiry] =
    useState<CommentsInquiry>(initialComment);
  const [propertyComments, setPropertyComments] = useState<Comment[]>([]);
  const [commentTotal, setCommentTotal] = useState<number>(0);
  const [insertCommentData, setInsertCommentData] = useState<CommentInput>({
    commentGroup: CommentGroup.PROPERTY,
    commentContent: "",
    commentRefId: "",
  });

  /** APOLLO REQUESTS **/
  const [likeTargetProperty] = useMutation(LIKE_TARGET_PROPERTY);
  const [createComment] = useMutation(CREATE_COMMENT);

  const {
    loading: getPropertyLoading,
    data: getPropertyData,
    error: getPropertyError,
    refetch: getPropertyRefetch,
  } = useQuery(GET_PROPERTY, {
    fetchPolicy: "cache-and-network",
    variables: { input: propertyId },
    skip: !propertyId,
    notifyOnNetworkStatusChange: true,
    onCompleted: (data: T) => {
      if (data?.getProperty) {
        setProperty(data.getProperty);
        setSlideImage(data.getProperty?.propertyImages[0]);
      }
    },
  });

  const {
    loading: getPropertiesLoading,
    data: getPropertiesData,
    error: getPropertiesError,
    refetch: getPropertiesRefetch,
  } = useQuery(GET_PROPERTIES, {
    fetchPolicy: "cache-and-network",
    variables: {
      input: {
        page: 1,
        limit: 4,
        sort: "createdAt",
        direction: Direction.DESC,
        search: {
          locationList: property?.propertyLocation
            ? [property?.propertyLocation]
            : [],
        },
      },
    },
    skip: !propertyId && !property,
    notifyOnNetworkStatusChange: true,
    onCompleted: (data: T) => {
      if (data?.getProperties?.list)
        setDestinationProperties(data?.getProperties.list);
    },
  });

  const {
    loading: getCommentsLoading,
    data: getCommentsData,
    error: getCommentsError,
    refetch: getCommentsRefetch,
  } = useQuery(GET_COMMENTS, {
    fetchPolicy: "cache-and-network",
    variables: {
      input: commentInquiry,
    },
    skip: !commentInquiry.search.commentRefId,
    notifyOnNetworkStatusChange: true,
    onCompleted: (data: T) => {
      if (data?.getComments?.list) setPropertyComments(data?.getComments?.list);
      setCommentTotal(data?.getComments?.metaCounter[0]?.total ?? 0);
    },
  });

  /** LIFECYCLES **/
  useEffect(() => {
    if (router.query.id) {
      setPropertyId(router.query.id as string);
      setCommentInquiry({
        ...commentInquiry,
        search: {
          commentRefId: router.query.id as string,
        },
      });
      setInsertCommentData({
        ...insertCommentData,
        commentRefId: router.query.id as string,
      });
    }
  }, [router]);

  useEffect(() => {
    if (commentInquiry.search.commentRefId) {
      getCommentsRefetch({ input: commentInquiry });
    }
  }, [commentInquiry]);

  /** HANDLERS **/

  const viewListingsHander = async (id: string | undefined) => {
    if (!id) return;
    router.push(`/agent/detail?agentId=${id}`);
  };

  const likePropertyHandler = async (user: T, id: string) => {
    try {
      if (!id) return;
      if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);
      await likeTargetProperty({ variables: { input: id } });
      await getPropertyRefetch({ input: id });
      await getPropertiesRefetch({
        input: {
          page: 1,
          limit: 4,
          sort: "createdAt",
          direction: Direction.DESC,
          search: {
            locationList: [property?.propertyLocation],
          },
        },
      });
      await sweetTopSmallSuccessAlert("success", 800);
    } catch (err: any) {
      console.log("ERROR: likePropertyHandler", err.message);
      sweetMixinErrorAlert(Message.NOT_AUTHENTICATED).then();
    }
  };

  const createCommentHandler = async () => {
    try {
      if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);
      await createComment({
        variables: {
          input: insertCommentData,
        },
      });
      setInsertCommentData({ ...insertCommentData, commentContent: "" });
      getCommentsRefetch({ input: commentInquiry });
    } catch (err) {
      await sweetErrorHandling(err);
    }
  };

  const changeImageHandler = (image: string) => {
    setSlideImage(image);
  };

  const commentPaginationChangeHandler = async (
    event: ChangeEvent<unknown>,
    value: number
  ) => {
    commentInquiry.page = value;
    setCommentInquiry({ ...commentInquiry });
  };

  if (getPropertyLoading) {
    return (
      <Stack
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "100%",
          height: "1080px",
          background: "#141414",
        }}
      >
        <CircularProgress size={"4rem"} />
      </Stack>
    );
  }

  if (device === "mobile") {
    return <div>PROPERTY DETAIL PAGE</div>;
  } else {
    return (
      <div id={"property-detail-page"}>
        <div className={"container"}>
          <Stack className={"property-detail-config"}>
            <Stack className={"property-info-config"}>
              <Stack className={"info"}>
                <Stack className={"left-box"}>
                  <Typography className={"title-main"}>
                    {property?.propertyTitle}
                  </Typography>
                  <Stack className={"top-box"}>
                    <Typography className={"city"}>
                      {property?.propertyLocation}
                    </Typography>
                    <Stack className={"divider"}></Stack>
                    <img src="/img/icons/clock-outline.svg" />
                    <Typography className={"date"}>
                      {moment().diff(property?.createdAt, "days")} days ago
                    </Typography>
                  </Stack>
                  <Stack className={"bottom-box"}>
                    <Stack className="option">
                      <img src="/img/icons/bedroom.svg" alt="" />{" "}
                      <Typography>{property?.propertyBeds} bed</Typography>
                    </Stack>
                    <Stack className="option">
                      <img src="/img/icons/bathroom.svg" alt="" />{" "}
                      <Typography>{property?.propertyRooms} room</Typography>
                    </Stack>
                    <Stack className="option">
                      <img src="/img/icons/hotel-type.svg" alt="" />{" "}
                      <Typography>{property?.propertySquare} m2</Typography>
                    </Stack>
                  </Stack>
                </Stack>
                <Stack className={"right-box"}>
                  <Stack className="buttons">
                    <Stack className="button-box">
                      <RemoveRedEyeIcon
                        fontSize="medium"
                        sx={{ color: "white" }}
                      />
                      <Typography>{property?.propertyViews}</Typography>
                    </Stack>
                    <Stack className="button-box">
                      {property?.meLiked && property?.meLiked[0]?.myFavorite ? (
                        <FavoriteIcon
                          color="primary"
                          fontSize={"medium"}
                          onClick={() =>
                            likePropertyHandler(user, property?._id)
                          }
                        />
                      ) : (
                        <FavoriteBorderIcon
                          fontSize={"medium"}
                          sx={{ color: "white" }}
                          // @ts-ignore
                          onClick={() =>
                            // @ts-ignore
                            likePropertyHandler(user, property?._id)
                          }
                        />
                      )}
                      <Typography>{property?.propertyLikes}</Typography>
                    </Stack>
                  </Stack>
                  <Typography>
                    ${formatterStr(property?.propertyPrice)}
                  </Typography>
                </Stack>
              </Stack>
              <Stack className={"images"}>
                <Stack className={"main-image"}>
                  <img
                    src={
                      slideImage
                        ? `${REACT_APP_API_URL}/${slideImage}`
                        : "/img/property/bigImage.png"
                    }
                    alt={"main-image"}
                  />
                </Stack>
                <Stack className={"sub-images"}>
                  {property?.propertyImages.map((subImg: string) => {
                    const imagePath: string = `${REACT_APP_API_URL}/${subImg}`;
                    return (
                      <Stack
                        className={"sub-img-box"}
                        onClick={() => changeImageHandler(subImg)}
                        key={subImg}
                      >
                        <img src={imagePath} alt={"sub-image"} />
                      </Stack>
                    );
                  })}
                </Stack>
              </Stack>
            </Stack>
            <Stack className={"property-desc-config"}>
              <Stack className={"left-config"}>
                <Stack className={"options-config"}>
                  <Stack className={"option"}>
                    <Stack className={"svg-box"}>
                      <img src="/img/icons/bedroom.svg" alt="" />{" "}
                    </Stack>
                    <Stack className={"option-includes"}>
                      <Typography className={"title"}>Bedroom</Typography>
                      <Typography className={"option-data"}>
                        {property?.propertyBeds}
                      </Typography>
                    </Stack>
                  </Stack>
                  <Stack className={"option"}>
                    <Stack className={"svg-box"}>
                      <img src={"/img/icons/bathroom.svg"} />
                    </Stack>
                    <Stack className={"option-includes"}>
                      <Typography className={"title"}>Rooms</Typography>
                      <Typography className={"option-data"}>
                        {property?.propertyRooms}
                      </Typography>
                    </Stack>
                  </Stack>
                  <Stack className={"option"}>
                    <Stack className={"svg-box"}>
                      <img src={"/img/icons/clock-outline.svg"} />
                    </Stack>
                    <Stack className={"option-includes"}>
                      <Typography className={"title"}>Year Build</Typography>
                      <Typography className={"option-data"}>
                        {moment(property?.createdAt).format("YYYY")}
                      </Typography>
                    </Stack>
                  </Stack>
                  <Stack className={"option"}>
                    <Stack className={"svg-box"}>
                      <img src={"/img/icons/hotel-type.svg"} />
                    </Stack>
                    <Stack className={"option-includes"}>
                      <Typography className={"title"}>Size</Typography>
                      <Typography className={"option-data"}>
                        {property?.propertySquare} m2
                      </Typography>
                    </Stack>
                  </Stack>
                  <Stack className={"option"}>
                    <Stack className={"svg-box"}>
                      <img src={"/img/icons/lib-outline.svg"} />
                    </Stack>
                    <Stack className={"option-includes"}>
                      <Typography className={"title"}>Property Type</Typography>
                      <Typography className={"option-data"}>
                        {property?.propertyType}
                      </Typography>
                    </Stack>
                  </Stack>
                </Stack>
                <Stack className={"prop-desc-config"}>
                  <Stack className={"top"}>
                    <Typography className={"title"}>
                      Property Description
                    </Typography>
                    <Typography className={"desc"}>
                      {property?.propertyDesc ?? "No Description!"}
                    </Typography>
                  </Stack>
                  <Stack className={"bottom"}>
                    <Typography className={"title"}>
                      Property Details
                    </Typography>
                    <Stack className={"info-box"}>
                      <Stack className={"left"}>
                        <Box component={"div"} className={"info"}>
                          <Typography className={"title"}>Price</Typography>
                          <Typography className={"data"}>
                            ${formatterStr(property?.propertyPrice)}
                          </Typography>
                        </Box>
                        <Box component={"div"} className={"info"}>
                          <Typography className={"title"}>
                            Property Size
                          </Typography>
                          <Typography className={"data"}>
                            {property?.propertySquare} m2
                          </Typography>
                        </Box>
                        <Box component={"div"} className={"info"}>
                          <Typography className={"title"}>Rooms</Typography>
                          <Typography className={"data"}>
                            {property?.propertyRooms}
                          </Typography>
                        </Box>
                        <Box component={"div"} className={"info"}>
                          <Typography className={"title"}>Bedrooms</Typography>
                          <Typography className={"data"}>
                            {property?.propertyBeds}
                          </Typography>
                        </Box>
                      </Stack>
                      <Stack className={"right"}>
                        <Box component={"div"} className={"info"}>
                          <Typography className={"title"}>
                            Year Built
                          </Typography>
                          <Typography className={"data"}>
                            {moment(property?.createdAt).format("YYYY")}
                          </Typography>
                        </Box>
                        <Box component={"div"} className={"info"}>
                          <Typography className={"title"}>
                            Property Type
                          </Typography>
                          <Typography className={"data"}>
                            {property?.propertyType}
                          </Typography>
                        </Box>
                        <Box component={"div"} className={"info"}>
                          <Typography className={"title"}>
                            Property Options
                          </Typography>
                          <Typography className={"data"}>
                            For {property?.propertyBarter && "Barter"}{" "}
                            {property?.propertyRent && "Rent"}
                          </Typography>
                        </Box>
                      </Stack>
                    </Stack>
                  </Stack>
                </Stack>
                <Stack className={"floor-plans-config"}>
                  <Typography className={"title"}>Floor Plans</Typography>
                  <Stack className={"image-box"}>
                    <img src={"/img/property/floorPlan.png"} alt={"image"} />
                  </Stack>
                </Stack>
                <Stack className={"address-config"}>
                  <Typography className={"title"}>Address</Typography>
                  <Stack className={"map-box"}>
                    <iframe
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d25867.098915951767!2d128.68632810247993!3d35.86402299180927!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x35660bba427bf179%3A0x1fc02da732b9072f!2sGeumhogangbyeon-ro%2C%20Dong-gu%2C%20Daegu!5e0!3m2!1suz!2skr!4v1695537640704!5m2!1suz!2skr"
                      width="100%"
                      height="100%"
                      style={{ border: 0 }}
                      allowFullScreen={true}
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    ></iframe>
                  </Stack>
                </Stack>
                {commentTotal !== 0 && (
                  <Stack className={"reviews-config"}>
                    <Stack className={"filter-box"}>
                      <Stack className={"review-cnt"}>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="12"
                          viewBox="0 0 16 12"
                          fill="none"
                        >
                          <g clipPath="url(#clip0_6507_7309)">
                            <path
                              d="M15.7183 4.60288C15.6171 4.3599 15.3413 4.18787 15.0162 4.16489L10.5822 3.8504L8.82988 0.64527C8.7005 0.409792 8.40612 0.257812 8.07846 0.257812C7.7508 0.257812 7.4563 0.409792 7.32774 0.64527L5.57541 3.8504L1.14072 4.16489C0.815641 4.18832 0.540363 4.36035 0.438643 4.60288C0.337508 4.84586 0.430908 5.11238 0.676772 5.28084L4.02851 7.57692L3.04025 10.9774C2.96794 11.2275 3.09216 11.486 3.35771 11.636C3.50045 11.717 3.66815 11.7575 3.83643 11.7575C3.98105 11.7575 4.12577 11.7274 4.25503 11.667L8.07846 9.88098L11.9012 11.667C12.1816 11.7979 12.5342 11.7859 12.7992 11.636C13.0648 11.486 13.189 11.2275 13.1167 10.9774L12.1284 7.57692L15.4801 5.28084C15.7259 5.11238 15.8194 4.84641 15.7183 4.60288Z"
                              fill="#181A20"
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_6507_7309">
                              <rect
                                width="15.36"
                                height="12"
                                fill="white"
                                transform="translate(0.398438)"
                              />
                            </clipPath>
                          </defs>
                        </svg>
                        <Typography className={"reviews"}>
                          {commentTotal} reviews
                        </Typography>
                      </Stack>
                    </Stack>
                    <Stack className={"review-list"}>
                      {propertyComments?.map((comment: Comment) => {
                        return <Review comment={comment} key={comment?._id} />;
                      })}
                      <Box component={"div"} className={"pagination-box"}>
                        <MuiPagination
                          page={commentInquiry.page}
                          count={Math.ceil(commentTotal / commentInquiry.limit)}
                          onChange={commentPaginationChangeHandler}
                          shape="circular"
                          color="primary"
                          sx={{
                            ".MuiPaginationItem-root": {
                              color: "red", // Change number color
                            },
                            ".Mui-selected": {
                              color: "white", // Selected number color
                              backgroundColor: "red", // Selected background color
                            },
                            ".MuiPaginationItem-icon": {
                              color: "#703bf7",
                            },
                          }}
                        />
                      </Box>
                    </Stack>
                  </Stack>
                )}
                <Stack className={"leave-review-config"}>
                  <Typography className={"main-title"}>
                    Leave A Review
                  </Typography>
                  <Typography className={"review-title"}>Review</Typography>
                  <textarea
                    onChange={({ target: { value } }: any) => {
                      setInsertCommentData({
                        ...insertCommentData,
                        commentContent: value,
                      });
                    }}
                    value={insertCommentData.commentContent}
                    placeholder="Leave a review"
                  ></textarea>
                  <Box className={"submit-btn"} component={"div"}>
                    <Button
                      className={"submit-review"}
                      disabled={
                        insertCommentData.commentContent === "" ||
                        user?._id === ""
                      }
                      onClick={createCommentHandler}
                    >
                      <Typography className={"title"}>Submit Review</Typography>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        width="17"
                        height="17"
                        viewBox="0 0 17 17"
                        fill="none"
                      >
                        <g clipPath="url(#clip0_6975_3642)">
                          <path
                            d="M16.1571 0.5H6.37936C6.1337 0.5 5.93491 0.698792 5.93491 0.944458C5.93491 1.19012 6.1337 1.38892 6.37936 1.38892H15.0842L0.731781 15.7413C0.558156 15.915 0.558156 16.1962 0.731781 16.3698C0.818573 16.4566 0.932323 16.5 1.04603 16.5C1.15974 16.5 1.27345 16.4566 1.36028 16.3698L15.7127 2.01737V10.7222C15.7127 10.9679 15.9115 11.1667 16.1572 11.1667C16.4028 11.1667 16.6016 10.9679 16.6016 10.7222V0.944458C16.6016 0.698792 16.4028 0.5 16.1571 0.5Z"
                            fill="#fff"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_6975_3642">
                            <rect
                              width="16"
                              height="16"
                              fill="white"
                              transform="translate(0.601562 0.5)"
                            />
                          </clipPath>
                        </defs>
                      </svg>
                    </Button>
                  </Box>
                </Stack>
              </Stack>
              <Stack className={"right-config"}>
                <Stack className={"info-box"}>
                  <Typography className={"main-title"}>
                    Get More Information
                  </Typography>
                  <Stack className={"image-info"}>
                    <img
                      className={"member-image"}
                      src={
                        property?.memberData?.memberImage
                          ? `${REACT_APP_API_URL}/${property?.memberData?.memberImage}`
                          : "/img/profile/defaultUser.svg"
                      }
                    />
                    <Stack className={"name-phone-listings"}>
                      <Link
                        href={`/member?memberId=${property?.memberData?._id}`}
                      >
                        <Typography className={"name"}>
                          {property?.memberData?.memberNick}
                        </Typography>
                      </Link>
                      <Stack className={"phone-number"}>
                        <img src="/img/icons/phone-outline.svg" alt="" />
                        <Typography className={"number"}>
                          {property?.memberData?.memberPhone}
                        </Typography>
                      </Stack>
                      <Typography
                        className={"listings"}
                        onClick={() =>
                          viewListingsHander(property?.memberData?._id)
                        }
                      >
                        View Listings
                      </Typography>
                    </Stack>
                  </Stack>
                </Stack>
                <Stack className={"info-box"}>
                  <Typography className={"sub-title"}>Name</Typography>
                  <input type={"text"} placeholder={"Enter your name"} />
                </Stack>
                <Stack className={"info-box"}>
                  <Typography className={"sub-title"}>Phone</Typography>
                  <input type={"text"} placeholder={"Enter your phone"} />
                </Stack>
                <Stack className={"info-box"}>
                  <Typography className={"sub-title"}>Email</Typography>
                  <input type={"text"} placeholder={"creativelayers088"} />
                </Stack>
                <Stack className={"info-box"}>
                  <Typography className={"sub-title"}>Message</Typography>
                  <textarea
                    placeholder={
                      "Hello, I am interested in \n" +
                      "[Renovated property at  floor]"
                    }
                  ></textarea>
                </Stack>
                <Stack className={"info-box"}>
                  <Button className={"send-message"}>
                    <Typography className={"title"}>Send Message</Typography>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="17"
                      height="17"
                      viewBox="0 0 17 17"
                      fill="none"
                    >
                      <g clipPath="url(#clip0_6975_593)">
                        <path
                          d="M16.0556 0.5H6.2778C6.03214 0.5 5.83334 0.698792 5.83334 0.944458C5.83334 1.19012 6.03214 1.38892 6.2778 1.38892H14.9827L0.630219 15.7413C0.456594 15.915 0.456594 16.1962 0.630219 16.3698C0.71701 16.4566 0.83076 16.5 0.944469 16.5C1.05818 16.5 1.17189 16.4566 1.25872 16.3698L15.6111 2.01737V10.7222C15.6111 10.9679 15.8099 11.1667 16.0556 11.1667C16.3013 11.1667 16.5001 10.9679 16.5001 10.7222V0.944458C16.5 0.698792 16.3012 0.5 16.0556 0.5Z"
                          fill="white"
                        />
                      </g>
                      <defs>
                        <clipPath id="clip0_6975_593">
                          <rect
                            width="16"
                            height="16"
                            fill="white"
                            transform="translate(0.5 0.5)"
                          />
                        </clipPath>
                      </defs>
                    </svg>
                  </Button>
                </Stack>
              </Stack>
            </Stack>
            {destinationProperties.length !== 0 && (
              <Stack className={"similar-properties-config"}>
                <Stack className={"title-pagination-box"}>
                  <Stack className={"title-box"}>
                    <Typography className={"main-title"}>
                      Similar Properties
                    </Typography>
                    <Typography className={"sub-title"}>
                      Similar properties from the same destination
                    </Typography>
                  </Stack>
                  <Stack className={"pagination-box"}>
                    <WestIcon
                      className={"swiper-similar-prev"}
                      sx={{ color: "#703bf7" }}
                    />
                    <div className={"swiper-similar-pagination"}></div>
                    <EastIcon
                      className={"swiper-similar-next"}
                      sx={{ color: "#703bf7" }}
                    />
                  </Stack>
                </Stack>
                <Stack className={"cards-box"}>
                  <Swiper
                    className={"similar-homes-swiper"}
                    slidesPerView={"auto"}
                    spaceBetween={35}
                    modules={[Autoplay, Navigation, Pagination]}
                    navigation={{
                      nextEl: ".swiper-similar-next",
                      prevEl: ".swiper-similar-prev",
                    }}
                    pagination={{
                      el: ".swiper-similar-pagination",
                    }}
                  >
                    {destinationProperties.map((property: Property) => {
                      return (
                        <SwiperSlide
                          className={"similar-homes-slide"}
                          key={property.propertyTitle}
                        >
                          <PropertyBigCard
                            likePropertyHandler={likePropertyHandler}
                            property={property}
                            key={property?._id}
                          />
                        </SwiperSlide>
                      );
                    })}
                  </Swiper>
                </Stack>
              </Stack>
            )}
          </Stack>
        </div>
      </div>
    );
  }
};

PropertyDetail.defaultProps = {
  initialComment: {
    page: 1,
    limit: 5,
    sort: "createdAt",
    direction: "DESC",
    search: {
      commentRefId: "",
    },
  },
};

export default withLayoutFull(PropertyDetail);
