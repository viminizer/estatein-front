import React from "react";
import { useRouter } from "next/router";
import { Stack, Typography, Box, List, ListItem } from "@mui/material";
import useDeviceDetect from "../../hooks/useDeviceDetect";
import Link from "next/link";
import { useReactiveVar } from "@apollo/client";
import { userVar } from "../../../apollo/store";
import PortraitIcon from "@mui/icons-material/Portrait";
import IconButton from "@mui/material/IconButton";
import { REACT_APP_API_URL } from "../../config";
import { logOut } from "../../auth";
import { sweetConfirmAlert, sweetMixinErrorAlert } from "../../sweetAlert";

const MyMenu = () => {
  const device = useDeviceDetect();
  const router = useRouter();
  const pathname = router.query.category ?? "myProfile";
  const category: any = router.query?.category ?? "myProfile";
  const user = useReactiveVar(userVar);

  /** HANDLERS **/
  const logoutHandler = async () => {
    try {
      if (await sweetConfirmAlert("Do you want to logout?")) logOut();
    } catch (err: any) {
      console.log("ERROR, logoutHandler:", err.message);
    }
  };

  if (device === "mobile") {
    return <div>MY MENU</div>;
  } else {
    return (
      <Stack width={"100%"} padding={"30px 24px"}>
        <Stack className={"profile"}>
          <Box component={"div"} className={"profile-img"}>
            <img
              src={
                user?.memberImage
                  ? `${REACT_APP_API_URL}/${user?.memberImage}`
                  : "/img/profile/defaultUser.svg"
              }
              alt={"member-photo"}
            />
          </Box>
          <Stack className={"user-info"}>
            <Typography className={"user-name"}>{user?.memberNick}</Typography>
            <Box component={"div"} className={"user-phone"}>
              <img src={"/img/icons/call.svg"} alt={"icon"} />
              <Typography className={"p-number"}>
                {user?.memberPhone}
              </Typography>
            </Box>
            {user?.memberType === "ADMIN" ? (
              <a href="/_admin/users" target={"_blank"}>
                <Typography className={"view-list"}>
                  {user?.memberType}
                </Typography>
              </a>
            ) : (
              <Typography className={"view-list"}>
                {user?.memberType}
              </Typography>
            )}
          </Stack>
        </Stack>
        <Stack className={"sections"}>
          <Stack
            className={"section"}
            style={{ height: user.memberType === "AGENT" ? "228px" : "153px" }}
          >
            <Typography className="title" variant={"h5"}>
              MANAGE LISTINGS
            </Typography>
            <List className={"sub-section"}>
              {user.memberType === "AGENT" && (
                <>
                  <ListItem
                    className={pathname === "addProperty" ? "focus" : ""}
                  >
                    <Link
                      href={{
                        pathname: "/mypage",
                        query: { category: "addProperty" },
                      }}
                      scroll={false}
                    >
                      <div className={"flex-box"}>
                        {category === "addProperty" ? (
                          <img
                            className={"com-icon"}
                            src={"/img/icons/folder-plus-filled.svg"}
                            alt={"com-icon"}
                          />
                        ) : (
                          <img
                            className={"com-icon"}
                            src={"/img/icons/folder-plus-outline.svg"}
                            alt={"com_icon"}
                          />
                        )}
                        <Typography
                          className={"sub-title"}
                          variant={"subtitle1"}
                          component={"p"}
                        >
                          Add Property
                        </Typography>
                        <IconButton
                          aria-label="delete"
                          sx={{ ml: "40px", color: "white" }}
                        >
                          <PortraitIcon
                            style={{ color: "#703bf7" }}
                            sx={{ color: "white" }}
                          />
                        </IconButton>
                      </div>
                    </Link>
                  </ListItem>
                  <ListItem
                    className={pathname === "myProperties" ? "focus" : ""}
                  >
                    <Link
                      href={{
                        pathname: "/mypage",
                        query: { category: "myProperties" },
                      }}
                      scroll={false}
                    >
                      <div className={"flex-box"}>
                        {category === "myProperties" ? (
                          <img
                            className={"com-icon"}
                            src={"/img/icons/lib-filled.svg"}
                            alt={"com-icon"}
                          />
                        ) : (
                          <img
                            className={"com-icon"}
                            src={"/img/icons/lib-outline.svg"}
                            alt={"com-icon"}
                          />
                        )}
                        <Typography
                          className={"sub-title"}
                          variant={"subtitle1"}
                          component={"p"}
                        >
                          My Properties
                        </Typography>
                        <IconButton aria-label="delete" sx={{ ml: "36px" }}>
                          <PortraitIcon style={{ color: "#703bf7" }} />
                        </IconButton>
                      </div>
                    </Link>
                  </ListItem>
                </>
              )}
              <ListItem className={pathname === "myFavorites" ? "focus" : ""}>
                <Link
                  href={{
                    pathname: "/mypage",
                    query: { category: "myFavorites" },
                  }}
                  scroll={false}
                >
                  <div className={"flex-box"}>
                    {category === "myFavorites" ? (
                      <img
                        className={"com-icon"}
                        src={"/img/icons/heart-filled.svg"}
                        alt={"com-icon"}
                      />
                    ) : (
                      <img
                        className={"com-icon"}
                        src={"/img/icons/heart-outline.svg"}
                        alt={"com-icon"}
                      />
                    )}

                    <Typography
                      className={"sub-title"}
                      variant={"subtitle1"}
                      component={"p"}
                    >
                      My Favorites
                    </Typography>
                  </div>
                </Link>
              </ListItem>
              <ListItem
                className={pathname === "recentlyVisited" ? "focus" : ""}
              >
                <Link
                  href={{
                    pathname: "/mypage",
                    query: { category: "recentlyVisited" },
                  }}
                  scroll={false}
                >
                  <div className={"flex-box"}>
                    {category === "recentlyVisited" ? (
                      <img
                        className={"com-icon"}
                        src={"/img/icons/eye-filled.svg"}
                        alt={"com-icon"}
                      />
                    ) : (
                      <img
                        className={"com-icon"}
                        src={"/img/icons/eye-outline.svg"}
                        alt={"com-icon"}
                      />
                    )}

                    <Typography
                      className={"sub-title"}
                      variant={"subtitle1"}
                      component={"p"}
                    >
                      Recently Visited
                    </Typography>
                  </div>
                </Link>
              </ListItem>
              <ListItem className={pathname === "followers" ? "focus" : ""}>
                <Link
                  href={{
                    pathname: "/mypage",
                    query: { category: "followers" },
                  }}
                  scroll={false}
                >
                  <div className={"flex-box"}>
                    {category === "followers" ? (
                      <img
                        className={"com-icon"}
                        src={"/img/icons/followers-filled.svg"}
                        alt={"com-icon"}
                      />
                    ) : (
                      <img
                        className={"com-icon"}
                        src={"/img/icons/followers-outline.svg"}
                        alt={"com-icon"}
                      />
                    )}
                    <Typography
                      className={"sub-title"}
                      variant={"subtitle1"}
                      component={"p"}
                    >
                      My Followers
                    </Typography>
                  </div>
                </Link>
              </ListItem>
              <ListItem className={pathname === "followings" ? "focus" : ""}>
                <Link
                  href={{
                    pathname: "/mypage",
                    query: { category: "followings" },
                  }}
                  scroll={false}
                >
                  <div className={"flex-box"}>
                    {category === "followers" ? (
                      <img
                        className={"com-icon"}
                        src={"/img/icons/users-filled.svg"}
                        alt={"com-icon"}
                      />
                    ) : (
                      <img
                        className={"com-icon"}
                        src={"/img/icons/users-outline.svg"}
                        alt={"com-icon"}
                      />
                    )}
                    <Typography
                      className={"sub-title"}
                      variant={"subtitle1"}
                      component={"p"}
                    >
                      My Followings
                    </Typography>
                  </div>
                </Link>
              </ListItem>
            </List>
          </Stack>
          <Stack className={"section"} sx={{ marginTop: "10px" }}>
            <div>
              <Typography className="title" variant={"h5"}>
                Community
              </Typography>
              <List className={"sub-section"}>
                <ListItem className={pathname === "myArticles" ? "focus" : ""}>
                  <Link
                    href={{
                      pathname: "/mypage",
                      query: { category: "myArticles" },
                    }}
                    scroll={false}
                  >
                    <div className={"flex-box"}>
                      {category === "myArticles" ? (
                        <img
                          className={"com-icon"}
                          src={"/img/icons/doc-list-filled.svg"}
                          alt={"com-icon"}
                        />
                      ) : (
                        <img
                          className={"com-icon"}
                          src={"/img/icons/doc-list-outline.svg"}
                          alt={"com-icon"}
                        />
                      )}

                      <Typography
                        className={"sub-title"}
                        variant={"subtitle1"}
                        component={"p"}
                      >
                        Articles
                      </Typography>
                    </div>
                  </Link>
                </ListItem>
                <ListItem
                  className={pathname === "writeArticle" ? "focus" : ""}
                >
                  <Link
                    href={{
                      pathname: "/mypage",
                      query: { category: "writeArticle" },
                    }}
                    scroll={false}
                  >
                    <div className={"flex-box"}>
                      {category === "writeArticle" ? (
                        <img
                          className={"com-icon"}
                          src={"/img/icons/doc-plus-filled.svg"}
                          alt={"com-icon"}
                        />
                      ) : (
                        <img
                          className={"com-icon"}
                          src={"/img/icons/doc-plus-outline.svg"}
                          alt={"com_icon"}
                        />
                      )}
                      <Typography
                        className={"sub-title"}
                        variant={"subtitle1"}
                        component={"p"}
                      >
                        Write Article
                      </Typography>
                    </div>
                  </Link>
                </ListItem>
              </List>
            </div>
          </Stack>
          <Stack className={"section"} sx={{ marginTop: "30px" }}>
            <Typography className="title" variant={"h5"}>
              MANAGE ACCOUNT
            </Typography>
            <List className={"sub-section"}>
              <ListItem className={pathname === "myProfile" ? "focus" : ""}>
                <Link
                  href={{
                    pathname: "/mypage",
                    query: { category: "myProfile" },
                  }}
                  scroll={false}
                >
                  <div className={"flex-box"}>
                    {category === "myProfile" ? (
                      <img
                        className={"com-icon"}
                        src={"/img/icons/user-filled.svg"}
                        alt={"com-icon"}
                      />
                    ) : (
                      <img
                        className={"com-icon"}
                        src={"/img/icons/user-outline.svg"}
                        alt={"com-icon"}
                      />
                    )}
                    <Typography
                      className={"sub-title"}
                      variant={"subtitle1"}
                      component={"p"}
                    >
                      My Profile
                    </Typography>
                  </div>
                </Link>
              </ListItem>
              <ListItem onClick={logoutHandler}>
                <div className={"flex-box"}>
                  <img
                    className={"com-icon"}
                    src={"/img/icons/logout-outline.svg"}
                    alt={"com-icon"}
                  />
                  <Typography
                    className={"sub-title"}
                    variant={"subtitle1"}
                    component={"p"}
                  >
                    Logout
                  </Typography>
                </div>
              </ListItem>
            </List>
          </Stack>
        </Stack>
      </Stack>
    );
  }
};

export default MyMenu;
