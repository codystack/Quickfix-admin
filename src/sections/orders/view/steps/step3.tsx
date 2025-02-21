/* eslint-disable react/prop-types */
import type { RootState } from 'src/redux/store';

import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

import {
  Box,
  Grid,
  Avatar,
  Button,
  Divider,
  Accordion,
  TextField,
  Typography,
  FormControl,
  NativeSelect,
  OutlinedInput,
  AccordionSummary,
  AccordionDetails,
} from '@mui/material';

import { fNumber } from 'src/utils/format-number';

import { Iconify } from 'src/components/iconify';

import type { OrderItem } from '../../add_order';

const deliveries = [
  {
    label: 'Delivery Only',
    value: 'delivery',
  },
  {
    label: 'Pickup & Delivery',
    value: 'pickup & delivery',
  },
  {
    label: 'Pickup Only',
    value: 'pickup',
  },
  {
    label: 'Shop Pickup',
    value: 'shop_pickup',
  },
];

const OrderStepForm = ({
  service,
  orderItems,
  setOrderItems,
  deliveryType,
  setDeliveryType,
  deliveryAddress,
  setDeliveryAddress,
  landmark,
  setLandmark,
  expressFee,
  setExpressFee,
  deliveryFee,
  setDeliveryFee,
  setGrandTotal,
  grandTotal,
  setExpressCharge,
  expressCharge,
}: any) => {
  const { expressList } = useSelector((state: RootState) => state.express);
  const { settings } = useSelector((state: RootState) => state.loader);

  // Handle increasing the quantity
  const handleIncrease = (item: OrderItem) => {
    setOrderItems((prev: any) => {
      const existingItem = prev.find((i: any) => i?.name === item?.name);
      if (existingItem) {
        return prev.map((i: any) =>
          i?.name === item?.name ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  // Handle decreasing the quantity
  const handleDecrease = (item: OrderItem) => {
    setOrderItems((prev: any) =>
      prev
        .map((i: any) => (i?.name === item?.name ? { ...i, quantity: i.quantity - 1 } : i))
        .filter((i: any) => i.quantity > 0)
    );
  };

  const totalAmount = orderItems.reduce(
    (sum: number, item: { price: number; quantity: number }) => sum + item.price * item.quantity,
    0
  );

  useEffect(() => {
    setGrandTotal(parseFloat(`${totalAmount}`))
  }, [totalAmount])
  

  return (
    <Box p={3}>
      <Box p={2} />
      <Box display="flex" flexDirection="row" justifyContent="space-between" alignItems="start">
        <Box display="flex" flexDirection="row" justifyContent="start" alignItems="center">
          <Avatar variant="rounded" src={service?.icon_url} />
          <Box p={1} />
          <Box display="flex" flexDirection="column" justifyContent="start" alignItems="start">
            <Typography>{service?.title}</Typography>
            <Typography fontSize={12}>{service?.description}</Typography>
          </Box>
        </Box>
        <Box p={2} />
        <Accordion>
          <AccordionSummary
            expandIcon={<Iconify icon="si:expand-more-fill" />}
            aria-controls="panel1-content"
            id="panel1-header"
          >
            <Typography component="a">View Price List</Typography>
          </AccordionSummary>
          <AccordionDetails>
          <Box>
            {service?.items
              ?.slice() // Prevents mutation of the original array
              .sort((a: any, b: any) => a.name.localeCompare(b.name)) // Sort alphabetically by name
              .map((elem: any, index: number) => (
                <Box
                  key={index}
                  display="flex"
                  flexDirection="row"
                  justifyContent="space-between"
                  alignItems="center"
                >
                  <Typography fontSize={13}>{elem?.name}</Typography>
                  <Box p={1} />
                  <Typography fontSize={13}>{`₦${fNumber(elem?.price)}`}</Typography>
                </Box>
              ))}
          </Box>

          </AccordionDetails>
        </Accordion>
      </Box>

      <Box p={2} />
      <Divider />
      <Box p={2} />
      <Box>
        {service?.items
          ?.slice() // Create a shallow copy to avoid mutating the original array
          .sort((a: any, b: any) => a.name.localeCompare(b.name)) // Sort alphabetically by name
          .map((elem: any, index: number) => (
            <Box
              p={1}
              key={elem?.name}
              display="flex"
              flexDirection="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography fontSize={13}>{`${elem?.name} ₦${fNumber(elem?.price)} / unit`}</Typography>
              <Box p={1} />
              <Box display="flex" flexDirection="row" justifyContent="end" alignItems="center">
                <Button variant="contained" size="small" onClick={() => handleDecrease(elem)}>
                  -
                </Button>
                <Typography px={1}>
                  {orderItems.find((item: any) => item.name === elem.name)?.quantity || 0}
                </Typography>
                <Button variant="contained" size="small" onClick={() => handleIncrease(elem)}>
                  +
                </Button>
              </Box>
            </Box>
          ))}
      </Box>


      {/* Render the cart summary */}
      <Box mt={3}>
        <Typography variant="h6">Cart Summary</Typography>
        {orderItems.map((item: any, index: number) => (
          <Box key={index} p={1} display="flex" justifyContent="space-between">
            <Typography>{item.name}</Typography>
            <Typography>{`₦${fNumber(item.price)} x ${
              item.quantity
            } = ₦${fNumber(item.price * item.quantity)}`}</Typography>
          </Box>
        ))}
        <Box p={1} />
        <Box display="flex" justifyContent="space-between">
          <Typography variant="h6">Sub Total</Typography>
          <Typography>{`₦${fNumber(totalAmount)}`}</Typography>
        </Box>
      </Box>
      <Box p={2} />
      <Divider />
      <Box p={2} />
      <Typography variant="h6">Delivery Summary</Typography>
      <Box pt={1} />
      <Grid container spacing={2}>
        <Grid item xs={12} md={6} xl={4}>
          <FormControl fullWidth variant="outlined">
            <NativeSelect
              input={
                <OutlinedInput
                  value={deliveryType}
                  onChange={(e) => {
                    setDeliveryType(e.target.value);
                    console.log('SELECTED :: ', e.target.value);
                    if (
                      e.target.value === 'pickup' ||
                      e.target.value === 'delivery' ||
                      e.target.value === 'pickup & delivery'
                    ) {
                      // Get delivery costs from settings
                      const subTotal = parseFloat(`${totalAmount}`);
                      if (e.target.value.toLowerCase() === 'pickup') {
                        setDeliveryFee(settings[0]?.pickup_fee);
                        setGrandTotal(
                          parseFloat(settings[0]?.pickup_fee) +
                            subTotal +
                            parseFloat(`${expressCharge}`)
                        );
                      } else if (e.target.value.toLowerCase() === 'pickup & delivery') {
                        setDeliveryFee(settings[0]?.pickup_n_delivery);
                        setGrandTotal(
                          parseFloat(settings[0]?.pickup_n_delivery) +
                            subTotal +
                            parseFloat(`${expressCharge}`)
                        );
                      } else if (e.target.value.toLowerCase() === 'delivery') {
                        setDeliveryFee(settings[0]?.delivery_fee);
                        setGrandTotal(
                          parseFloat(settings[0]?.delivery_fee) +
                            subTotal +
                            parseFloat(`${expressCharge}`)
                        );
                      }
                    } else {
                      const subTotal = parseFloat(`${totalAmount}`);
                      setDeliveryFee(0.0);
                      setGrandTotal(subTotal);
                    }
                  }}
                />
              }
            >
              <option>Select Delivery</option>
              {deliveries?.map((elem) => (
                <option key={elem?.value} value={elem.value}>
                  {elem.label}
                </option>
              ))}
            </NativeSelect>
          </FormControl>
        </Grid>
        {(`${deliveryType}`.toLowerCase() === 'delivery' ||
          `${deliveryType}`.toLowerCase() === 'pickup & delivery' ||
          `${deliveryType}`.toLowerCase() === 'pickup') && (
          <>
            <Grid item xs={12} md={6} xl={4}>
              <TextField
                variant="outlined"
                fullWidth
                required
                placeholder="Delivery Address"
                value={deliveryAddress}
                onChange={(e) => {
                  setDeliveryAddress(e.target.value);
                }}
              />
            </Grid>
            <Grid item xs={12} md={6} xl={4}>
              <TextField
                variant="outlined"
                fullWidth
                required
                placeholder="Landmark"
                value={landmark}
                onChange={(e) => {
                  setLandmark(e.target.value);
                }}
              />
            </Grid>
          </>
        )}
      </Grid>
      <Box p={1} />
      {service?.category === 'laundry' && (
        <>
          <Typography py={1} fontSize={17} fontWeight={600}>
            Express Timeline
          </Typography>
          <FormControl fullWidth variant="outlined">
            <NativeSelect
              input={
                <OutlinedInput
                  value={expressFee}
                  onChange={(e) => {
                    console.log('SELECTED :: ', e.target.value);
                    // Override delivery fee here
                    const filtered = expressList.filter(
                      (elem: any) => (elem?.id ?? elem?._id) === e.target.value
                    );
                    const item = filtered[0];
                    setExpressFee(item);
                    // Compute fee here
                    const subTotal = parseFloat(`${totalAmount}`);
                    const percentage = parseInt(item?.fee, 10) / 100;
                    const res = percentage * subTotal;
                    const result = res + subTotal;
                    setExpressCharge(res);
                    setGrandTotal(result + parseFloat(`${deliveryFee}`));
                  }}
                />
              }
            >
              <option>Select Express (optional)</option>
              {expressList?.map((elem: any, index: number) => (
                <option key={index} value={elem?.id ?? elem?._id}>
                  {elem?.name}
                </option>
              ))}
            </NativeSelect>
          </FormControl>
          <Box p={2} />
        </>
      )}
      {(`${deliveryType}`.toLowerCase() === 'delivery' ||
        `${deliveryType}`.toLowerCase() === 'pickup & delivery' ||
        `${deliveryType}`.toLowerCase() === 'pickup') && (
        <Box display="flex" justifyContent="space-between">
          <Typography variant="h6">
            {`${deliveryType}`.toLowerCase() === 'pickup' ? 'Pickup Fee' : 'Delivery Fee'}
          </Typography>
          <Typography>{`₦${fNumber(deliveryFee)}`}</Typography>
        </Box>
      )}
      {expressFee && (
        <Box display="flex" justifyContent="space-between">
          <Typography variant="h6">Express Charge</Typography>
          <Typography>{`₦${fNumber(expressCharge)}`}</Typography>
        </Box>
      )}

      <Box display="flex" justifyContent="space-between">
        <Typography variant="h6">Grand Total</Typography>
        <Typography>{`₦${fNumber(grandTotal)}`}</Typography>
      </Box>
    </Box>
  );
};

export default OrderStepForm;
