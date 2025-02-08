/* eslint-disable react/prop-types */
import type { RootState } from 'src/redux/store';

import React from 'react';
import { useSelector } from 'react-redux';

import { Box, Avatar, Divider, Typography } from '@mui/material';

import { fNumber } from 'src/utils/format-number'

const ReviewStepForm = ({
  service,
  orderItems,
  category,
  user,
  deliveryFee,
  grandTotal,
  deliveryType,
}: any) => {
  const { services } = useSelector((state: RootState) => state.service);

  const totalAmount = orderItems.reduce(
    (sum: number, item: { price: number; quantity: number }) => sum + item.price * item.quantity,
    0
  );

  return (
    <Box p={2}>
      <Box p={4} />
      <Typography>Selected User</Typography>
      {user && (
        <Box display="flex" flexDirection="row" justifyContent="start" alignItems="center">
          <Avatar variant="rounded">{`${user?.first_name.toString().substring(0, 1)}${user?.last_name?.toString().substring(0, 1)}`}</Avatar>
          <Box p={1} />
          <Box display="flex" flexDirection="column" justifyContent="start" alignItems="start">
            <Typography>{`${user?.first_name} ${user?.last_name}`}</Typography>
            <Typography fontSize={12}>{`${user?.email_address}`}</Typography>
            <Typography fontSize={12}>{`${user?.phone_number}`}</Typography>
          </Box>
        </Box>
      )}
      <Box p={1} />
      <Divider />
      <Box p={1} />
      <Typography>Selected Category</Typography>
      <Typography>{category}</Typography>
      <Box p={1} />
      <Divider />
      <Box p={1} />
      <Typography>Selected service</Typography>
      <Box
        p={2}
        mx={1}
        display="flex"
        flexDirection="row"
        justifyContent="start"
        alignItems="center"
        borderRadius={2}
      >
        <Avatar variant="rounded" src={service?.icon_url} />
        <Box p={1} />
        <Box display="flex" flexDirection="column" justifyContent="start" alignItems="start">
          <Typography>{service?.title}</Typography>
          <Typography fontSize={12}>{service?.description}</Typography>
        </Box>
      </Box>
      <Box p={1} />
      <Divider />
      <Box p={1} />
      <Typography variant="h6">Order Summary</Typography>
      {orderItems.map((item: any, index: number) => (
        <Box key={index} p={1} display="flex" justifyContent="space-between">
          <Typography>{item.name}</Typography>
          <Typography>{`₦${fNumber(item.price)} x ${
            item.quantity
          } = ₦${fNumber(item.price * item.quantity)}`}</Typography>
        </Box>
      ))}
      <Box p={1} />
      <Divider />
      <Box p={1} />
      <Box display="flex" justifyContent="space-between">
        <Typography>Delivery Type</Typography>
        <Typography>{`${deliveryType}`.replaceAll('_', ' ')}</Typography>
      </Box>
      <Box display="flex" justifyContent="space-between">
        <Typography>Sub Total</Typography>
        <Typography>{`₦${fNumber(totalAmount)}`}</Typography>
      </Box>
      {(`${deliveryType}`.toLowerCase() === 'delivery' ||
        `${deliveryType}`.toLowerCase() === 'pickup & delivery' ||
        `${deliveryType}`.toLowerCase() === 'pickup') && (
        <Box display="flex" justifyContent="space-between">
          <Typography>
            {`${deliveryType}`.toLowerCase() === 'pickup' ? 'Pickup Fee' : 'Delivery Fee'}
          </Typography>
          <Typography>{`₦${fNumber(deliveryFee)}`}</Typography>
        </Box>
      )}
      <Box display="flex" justifyContent="space-between">
        <Typography>Grand Total</Typography>
        <Typography>{`₦${fNumber(grandTotal)}`}</Typography>
      </Box>
    </Box>
  );
};

export default ReviewStepForm;
