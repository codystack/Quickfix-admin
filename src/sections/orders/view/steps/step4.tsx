/* eslint-disable react/prop-types */
import type { RootState } from 'src/redux/store';

import React from 'react';
import { useSelector } from 'react-redux';

import { Box, Avatar, Divider, Typography } from '@mui/material';

import { fNumber } from 'src/utils/format-number';

const ReviewStepForm = ({
  service,
  orderItems,
  category,
  user,
  deliveryFee,
  grandTotal,
  deliveryType,
  expressCharge,
  expressFee,
  discount,
  onDiscountChange
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
      <Typography>Selected Service</Typography>
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
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Order Summary</Typography>
        <Box>
          <select 
            value={discount} 
            onChange={(e) => onDiscountChange(Number(e.target.value))}
            style={{
              padding: '8px 12px',
              borderRadius: '4px',
              border: '1px solid #ccc',
              backgroundColor: 'white',
              cursor: 'pointer',
              fontSize: '14px',
              outline: 'none'
            }}
          >
            <option value={0}>No Discount</option>
            <option value={30}>Apply 30% Discount</option>
            <option value={50}>Apply 50% Discount</option>
          </select>
        </Box>
      </Box>
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
      {expressCharge && (
        <>
          <Box display="flex" justifyContent="space-between">
            <Typography>Express Timeline</Typography>
            <Typography>{`${expressFee?.name}`}</Typography>
          </Box>
          <Box display="flex" justifyContent="space-between">
            <Typography>Express Charge</Typography>
            <Typography>{`₦${fNumber(expressCharge)}`}</Typography>
          </Box>
        </>
      )}
      {discount > 0 && (
        <Box display="flex" justifyContent="space-between" color="error.main">
          <Typography>Discount ({discount}%)</Typography>
          <Typography>-₦{fNumber((grandTotal * discount) / 100)}</Typography>
        </Box>
      )}
      <Box display="flex" justifyContent="space-between" sx={{ fontWeight: 'bold', fontSize: '1.1rem' }}>
        <Typography>Grand Total</Typography>
        <Typography>
          ₦{fNumber(discount > 0 ? grandTotal * (1 - discount / 100) : grandTotal)}
        </Typography>
      </Box>
    </Box>
  );
};

export default ReviewStepForm;
