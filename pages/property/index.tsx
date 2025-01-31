import { useMutation, useQuery } from '@apollo/client';
import KeyboardArrowDownRoundedIcon from '@mui/icons-material/KeyboardArrowDownRounded';
import { Box, Button, Menu, MenuItem, Pagination, Stack, Typography } from '@mui/material';
import { NextPage } from 'next';
import { serverSideTranslations } from 'next-i18next/serverSideTranslations';
import { useRouter } from 'next/router';
import React, { ChangeEvent, MouseEvent, useEffect, useState } from 'react';
import { LIKE_TARGET_PROPERTY } from '../../apollo/user/mutation';
import { GET_PROPERTIES } from '../../apollo/user/query';
import withLayoutBasic from '../../libs/components/layout/LayoutBasic';
import Filter from '../../libs/components/property/Filter';
import PropertyCard from '../../libs/components/property/PropertyCard';
import { Direction, Message } from '../../libs/enums/common.enum';
import useDeviceDetect from '../../libs/hooks/useDeviceDetect';
import { sweetTopSmallSuccessAlert, sweetMixinErrorAlert } from '../../libs/sweetAlert';
import { T } from '../../libs/types/common';
import { Property } from '../../libs/types/property/property';
import { PropertiesInquiry } from '../../libs/types/property/property.input';

export const getStaticProps = async ({ locale }: any) => ({
  props: {
    ...(await serverSideTranslations(locale, ['common'])),
  },
});

const PropertyList: NextPage = ({ initialInput, ...props }: any) => {
  const device = useDeviceDetect();
  const router = useRouter();
  const [searchFilter, setSearchFilter] = useState<PropertiesInquiry>(
    router?.query?.input ? JSON.parse(router?.query?.input as string) : initialInput,
  );
  const [properties, setProperties] = useState<Property[]>([]);
  const [total, setTotal] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [sortingOpen, setSortingOpen] = useState(false);
  const [filterSortName, setFilterSortName] = useState('New');

  /** APOLLO REQUESTS **/
  const [likeTargetProperty] = useMutation(LIKE_TARGET_PROPERTY);

  const {
    loading: getPropertiesLoading,
    data: getPropertiesData,
    error: getPropertiesError,
    refetch: getPropertiesRefetch,
  } = useQuery(GET_PROPERTIES, {
    fetchPolicy: 'network-only',
    variables: { input: searchFilter },
    notifyOnNetworkStatusChange: true,
    onCompleted: (data: T) => {
      setProperties(data?.getProperties?.list);
      setTotal(data?.getProperties?.metaCounter[0]?.total ?? 0);
    },
  });

  /** LIFECYCLES **/
  useEffect(() => {
    if (router.query.input) {
      const inputObj = JSON.parse(router?.query?.input as string);
      setSearchFilter(inputObj);
    }

    setCurrentPage(searchFilter.page === undefined ? 1 : searchFilter.page);
  }, [router]);

  useEffect(() => {
    //NOTE: BACKEND REFETCH
    console.log('searchFilter', searchFilter);
  }, [searchFilter]);

  /** HANDLERS **/
  const likePropertyHandler = async (user: T, id: string) => {
    try {
      if (!id) return;
      if (!user._id) throw new Error(Message.NOT_AUTHENTICATED);
      await likeTargetProperty({ variables: { input: id } });
      await getPropertiesRefetch({ input: initialInput });
      await sweetTopSmallSuccessAlert('success', 800);
    } catch (err: any) {
      console.log('ERROR: likePropertyHandler', err.message);
      sweetMixinErrorAlert(Message.NOT_AUTHENTICATED).then();
    }
  };

  const handlePaginationChange = async (event: ChangeEvent<unknown>, value: number) => {
    searchFilter.page = value;
    await router.push(
      `/property?input=${JSON.stringify(searchFilter)}`,
      `/property?input=${JSON.stringify(searchFilter)}`,
      {
        scroll: false,
      },
    );
    setCurrentPage(value);
  };

  const sortingClickHandler = (e: MouseEvent<HTMLElement>) => {
    setAnchorEl(e.currentTarget);
    setSortingOpen(true);
  };

  const sortingCloseHandler = () => {
    setSortingOpen(false);
    setAnchorEl(null);
  };

  const sortingHandler = (e: React.MouseEvent<HTMLLIElement>) => {
    switch (e.currentTarget.id) {
      case 'new':
        setSearchFilter({ ...searchFilter, sort: 'createdAt', direction: Direction.ASC });
        router
          .push(
            `/property?input=${JSON.stringify({
              ...searchFilter,
              sort: 'createdAt',
              direction: Direction.ASC,
            })}`,
          )
          .then();
        setFilterSortName('New');
        break;
      case 'lowest':
        setSearchFilter({ ...searchFilter, sort: 'propertyPrice', direction: Direction.ASC });
        router
          .push(
            `/property?input=${JSON.stringify({
              ...searchFilter,
              sort: 'propertyPrice',
              direction: Direction.ASC,
            })}`,
          )
          .then();
        setFilterSortName('Lowest Price');
        break;
      case 'highest':
        setSearchFilter({ ...searchFilter, sort: 'propertyPrice', direction: Direction.DESC });
        router
          .push(
            `/property?input=${JSON.stringify({
              ...searchFilter,
              sort: 'propertyPrice',
              direction: Direction.DESC,
            })}`,
          )
          .then();
        setFilterSortName('Highest Price');
    }
    setSortingOpen(false);
    setAnchorEl(null);
  };

  if (device === 'mobile') {
    return <h1>PROPERTIES MOBILE</h1>;
  } else {
    return (
      <div id="property-list-page" style={{ position: 'relative' }}>
        <div className="container">
          <Box component={'div'} className={'right'}>
            <span>Sort by</span>
            <div>
              <Button onClick={sortingClickHandler} endIcon={<KeyboardArrowDownRoundedIcon />}>
                {filterSortName}
              </Button>
              <Menu anchorEl={anchorEl} open={sortingOpen} onClose={sortingCloseHandler} sx={{ paddingTop: '5px' }}>
                <MenuItem
                  onClick={sortingHandler}
                  id={'new'}
                  disableRipple
                  sx={{ boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px' }}
                >
                  New
                </MenuItem>
                <MenuItem
                  onClick={sortingHandler}
                  id={'lowest'}
                  disableRipple
                  sx={{ boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px' }}
                >
                  Lowest Price
                </MenuItem>
                <MenuItem
                  onClick={sortingHandler}
                  id={'highest'}
                  disableRipple
                  sx={{ boxShadow: 'rgba(149, 157, 165, 0.2) 0px 8px 24px' }}
                >
                  Highest Price
                </MenuItem>
              </Menu>
            </div>
          </Box>
          <Stack className={'property-page'}>
            <Stack className={'filter-config'}>
              {/* @ts-ignore */}
              <Filter searchFilter={searchFilter} setSearchFilter={setSearchFilter} initialInput={initialInput} />
            </Stack>
            <Stack className="main-config" mb={'76px'}>
              <Stack className={'list-config'}>
                {properties?.length === 0 ? (
                  <div className={'no-data'}>
                    <img src="/img/icons/icoAlert.svg" alt="" />
                    <p>No Properties found!</p>
                  </div>
                ) : (
                  properties.map((property: Property) => {
                    return (
                      <PropertyCard likePropertyHandler={likePropertyHandler} property={property} key={property?._id} />
                    );
                  })
                )}
              </Stack>
              <Stack className="pagination-config">
                {properties.length !== 0 && (
                  <Stack className="pagination-box">
                    <Pagination
                      page={currentPage}
                      count={Math.ceil(total / searchFilter.limit)}
                      onChange={handlePaginationChange}
                      shape="circular"
                      color="primary"
                    />
                  </Stack>
                )}

                {properties.length !== 0 && (
                  <Stack className="total-result">
                    <Typography>
                      Total {total} propert{total > 1 ? 'ies' : 'y'} available
                    </Typography>
                  </Stack>
                )}
              </Stack>
            </Stack>
          </Stack>
        </div>
      </div>
    );
  }
};

PropertyList.defaultProps = {
  initialInput: {
    page: 1,
    limit: 9,
    sort: 'createdAt',
    direction: 'DESC',
    search: {
      squaresRange: {
        start: 0,
        end: 500,
      },
      pricesRange: {
        start: 0,
        end: 2000000,
      },
    },
  },
};

export default withLayoutBasic(PropertyList);
