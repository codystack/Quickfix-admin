/* eslint-disable react/prop-types */
import type { RootState } from 'src/redux/store';

import React, { useState } from 'react';
import { useSelector } from 'react-redux';

import { Box , Grid ,
  Avatar,
  Divider,
  InputLabel,
  Typography,
  FormControl,
  NativeSelect,
  OutlinedInput,
  CardActionArea,
} from '@mui/material';

const categories = [
  {
    label: 'Car Wash',
    value: 'car_wash',
  },
  {
    label: 'Cleaning',
    value: 'cleaning',
  },
  {
    label: 'Laundry',
    value: 'laundry',
  },
];

const ServiceStepForm = ({
  service,
  setService,
  category,
  setCategory,
  location,
  setLocation,
}: any) => {
  const { services } = useSelector((state: RootState) => state.service);
  const { locationList } = useSelector((state: RootState) => state.location);
  const [serviceList, setServiceList] = useState([]);
  const [clickIndex, setClickIndex] = useState(-1);

  return (
    <Box p={2}>
      <Box p={4} />
      <Typography>Choose Category</Typography>
      <Grid container spacing={2} display="flex" flexDirection="row" alignItems="center">
        {categories?.map((item, index: number) => (
          <Grid key={index} item xs={12} md={5}>
            <CardActionArea
              onClick={() => {
                setCategory(item?.value);
                const filtered = services?.filter((elem: any) => elem?.category === item?.value);
                setServiceList(filtered);
                setClickIndex(-1);
              }}
              sx={(theme) => ({
                bgcolor: theme.palette.primary.main,
                borderRadius: 2,
                color: 'white',
              })}
            >
              <Box
                sx={(theme) => ({
                  bgcolor: theme.palette.primary.main,
                  borderRadius: 2,
                  color: 'white',
                })}
                p={2}
              >
                <Typography>{item?.label}</Typography>
              </Box>
            </CardActionArea>
          </Grid>
        ))}
      </Grid>
      <Box p={2} />
      <Divider />
      <Box p={2} />
      {category && (
        <>
          <Typography>Choose a service</Typography>
          <Box p={1} />
          <Grid container spacing={2}>
            {serviceList?.map((lst: any, index: number) => (
              <Grid
                key={index}
                item
                xs={12}
                md={6}
                lg={4}
                component={CardActionArea}
                p={2}
                m={1}
                display="flex"
                sx={(theme) => ({
                  bgcolor: clickIndex === index ? theme.palette.primary.lighter : 'transparent',
                })}
                flexDirection="row"
                justifyContent="start"
                alignItems="center"
                borderRadius={2}
                onClick={() => {
                  setService(lst);
                  setClickIndex(index);
                }}
              >
                <Avatar variant="rounded" src={lst?.icon_url} />
                <Box p={1} />
                <Box
                  display="flex"
                  flexDirection="column"
                  justifyContent="start"
                  alignItems="start"
                >
                  <Typography>{lst?.title}</Typography>
                  <Typography fontSize={12}>{lst?.description}</Typography>
                </Box>
              </Grid>
            ))}
          </Grid>
        </>
      )}
      <Box p={2} />
      <Divider />
      <Box p={2} />
      {locationList && (
        <FormControl fullWidth variant="outlined">
          <InputLabel variant="outlined" htmlFor="ids">
            Ordering Location
          </InputLabel>
          <NativeSelect
            input={
              <OutlinedInput
                label=" Ordering Location"
                value={location}
                onChange={(e) => {
                  setLocation(e.target?.value);
                }}
              />
            }
          >
            <option disabled>Select admin type</option>
            {locationList?.map((elem: any) => (
              <option key={elem.id ?? elem?._id} value={elem.id ?? elem?._id}>
                {`${elem?.region}, ${elem?.city}`}
              </option>
            ))}
          </NativeSelect>
        </FormControl>
      )}
    </Box>
  );
};

export default ServiceStepForm;
