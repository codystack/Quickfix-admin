import React from 'react';
import { mutate } from 'swr';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import {
  Box,
  Card,
  Step,
  Button,
  Stepper,
  Toolbar,
  StepLabel,
  IconButton,
  Typography,
} from '@mui/material';

import generateRandomCode from 'src/utils/code_generator';

import APIService from 'src/service/api.service';
import { setLoading } from 'src/redux/reducers/loader';
import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';

import UserStepForm from './view/steps/step1';
import OrderStepForm from './view/steps/step3';
import ReviewStepForm from './view/steps/step4';
import ServiceStepForm from './view/steps/step2';

const steps = ['Select User', 'Service', 'Order', 'Review'];
export type OrderItem = {
  name: string;
  price: number;
  quantity: number;
};

const AddOrderView = ({ setOpen }: any) => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [category, setCategory] = React.useState('');
  const [activeStep, setActiveStep] = React.useState(0);

  const [selectedUser, setSelectedUser] = React.useState<any>(null);
  const [deliveryType, setDeliveryType] = React.useState('delivery');
  const [selectedLocation, setSelectedLocation] = React.useState(null);
  const [deliveryAddress, setDeliveryAddress] = React.useState('');
  const [landmark, setLandmark] = React.useState('');
  const [grandTotal, setGrandTotal] = React.useState(0);
  const [deliveryFee, setDeliveryFee] = React.useState(0);
  const [expressCharge, setExpressCharge] = React.useState(0);
  const [selectedService, setSelectedService] = React.useState<any>();
  const [selectedExpress, setSelectedExpress] = React.useState<any>(null);
  const [orderItems, setOrderItems] = React.useState<OrderItem[]>([]);


  const submitForm = async () => {
    try {
      dispatch(setLoading(true));
      let payload;
      console.log("SELECTEDD USER ::: ", selectedUser);
      

      // PICKUP = 'pickup',
      // DELIVERY = 'delivery',
      // PICKUP_DELIVERY = 'pickup_delivery',
      // SHOP_PICKUP = 'shop_pickup',
      // Now make a trip to create a new product here
      if (deliveryType === 'shop_pickup') {
        payload = {
          amount: grandTotal,
          service: selectedService?._id ?? selectedService?.id,
          location: selectedLocation,
          delivery_type: 'shop_pickup',
          items: orderItems,
          express: selectedExpress?.id ?? selectedExpress?._id,
          userId: selectedUser?.id ?? selectedUser?._id
        };
      } else if (deliveryType === 'delivery') {
        payload = {
          amount: grandTotal,
          service: selectedService?._id ?? selectedService?.id,
          location: selectedLocation,
          delivery_type: 'delivery',
          delivery_fee: deliveryFee,
          address: deliveryAddress,
          landmark,
          items: orderItems,
          express: selectedExpress?.id ?? selectedExpress?._id,
          userId: selectedUser?.id ?? selectedUser?._id
        };
      }
      else if (deliveryType === 'pickup & delivery') {
        payload = {
          amount: grandTotal,
          service: selectedService?._id ?? selectedService?.id,
          location: selectedLocation,
          delivery_type: 'pickup_delivery',
          delivery_fee: deliveryFee,
          address: deliveryAddress,
          landmark,
          items: orderItems,
          express: selectedExpress?.id ?? selectedExpress?._id,
          userId: selectedUser?.id ?? selectedUser?._id,
        };
      }
      else if (deliveryType === 'pickup') {
        payload = {
          amount: grandTotal,
          service: selectedService?._id ?? selectedService?.id,
          location: selectedLocation,
          delivery_type: 'pickup',
          delivery_fee: deliveryFee,
          address: deliveryAddress,
          landmark,
          items: orderItems,
          express: selectedExpress?.id ?? selectedExpress?._id,
          userId: selectedUser?.id ?? selectedUser?._id
        };
      }

      console.log("GRAND TOTAL ;; ", grandTotal);
      

      const response = APIService.createOrder(payload, `MO-${generateRandomCode('QUICKFIX', 10)}`);
      toast.promise(response, {
        pending: {
          render() {
            return 'Loading. Please wait...';
          },
          icon: false,
        },
        success: {
          render({ data }) {
            dispatch(setLoading(false));
            mutate('/orders/all')
            navigate(-1)
            const res = data?.data?.message || 'New order placed successfully';
            return `${res}`;
          },
        },
        error: {
          render({ data }: any) {
            dispatch(setLoading(false));
            console.log('ERRO ON TOAST HERE :: ', data?.response?.data?.message);
            const errorMsg = data?.response?.data?.message || data?.message || '';
            // When the promise reject, data will contains the error
            return `${errorMsg ?? 'An error occurred!'}`;
          },
        },
      });
    } catch (error) {
      dispatch(setLoading(false));
      console.log('SOCIAL ERR :: ', error);
    }
  };

  const handleNext = () => {
    if (activeStep === 0) {
      if (selectedUser) {
        // Can now go to next step
        setActiveStep(1);
      } else {
        setActiveStep(0);
        toast.error('User not selected or created!');
      }
    } else if (activeStep === 1) {
      if (category && selectedService && selectedLocation) {
        setActiveStep(2);
      } else {
        setActiveStep(1);
        if (!category) {
          toast.error('Category not selected!');
        }
        if (!selectedService) {
          toast.error('Service not selected!');
        }
        if (!selectedLocation) {
          toast.error('Location not selected!');
        }
      }
    } else if (activeStep === 2) {
      if (orderItems?.length > 0) {
        if (
          (deliveryType === 'delivery' || deliveryType === 'pickup & delivery') &&
          deliveryAddress
        ) {
          setActiveStep(3);
        } else if (deliveryType === 'pickup' || deliveryType === 'shop_pickup') {
          setActiveStep(3);
        } else if (
          (deliveryType === 'delivery' || deliveryType === 'pickup & delivery') &&
          !deliveryAddress
        ) {
          setActiveStep(2);
          toast.error('Delivery addresss is required!');
        }
      } else {
        setActiveStep(2);
        toast.error('No item selected!');
      }
    } else if (activeStep === 3) {
      submitForm();
    }
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  return (
    <DashboardContent>
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="space-between"
        alignItems="center"
        mb={5}
        width="100%"
      >
        <Box display="flex" flexDirection="row" alignItems="center" justifyContent="start">
          <IconButton onClick={() => navigate(-1)}>
            <Iconify icon="eva:arrow-back-fill" />
          </IconButton>
          <Typography variant="h4" flexGrow={1}>
            Create Order
          </Typography>
        </Box>
      </Box>

      <Box p={1} />
      <Card sx={{ p: 1 }}>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>
        <Box>
          {activeStep === 0 ? (
            <UserStepForm setUser={setSelectedUser} user={selectedUser} />
          ) : activeStep === 1 ? (
            <ServiceStepForm
              service={selectedService}
              setService={setSelectedService}
              category={category}
              setCategory={setCategory}
              setLocation={setSelectedLocation}
              location={selectedLocation}
            />
          ) : activeStep === 2 ? (
            <OrderStepForm
              service={selectedService}
              orderItems={orderItems}
              setOrderItems={setOrderItems}
              deliveryType={deliveryType}
              setDeliveryType={setDeliveryType}
              deliveryAddress={deliveryAddress}
              setDeliveryAddress={setDeliveryAddress}
              landmark={landmark}
              setLandmark={setLandmark}
              expressFee={selectedExpress}
              setExpressFee={setSelectedExpress}
              setGrandTotal={setGrandTotal}
              grandTotal={grandTotal}
              deliveryFee={deliveryFee}
              setDeliveryFee={setDeliveryFee}
              expressCharge={expressCharge}
              setExpressCharge={setExpressCharge}
            />
          ) : (
            <ReviewStepForm
              service={selectedService}
              orderItems={orderItems}
              user={selectedUser}
              grandTotal={grandTotal}
              deliveryFee={deliveryFee}
              deliveryType={deliveryType}
              expressCharge={expressCharge}
              expressFee={selectedExpress}
              category={selectedService?.category}
            />
          )}
        </Box>
        <Toolbar />
        <Box p={2} display="flex" flexDirection="row" justifyContent="end" alignItems="center">
          <Button
            variant="contained"
            sx={{ px: 4 }}
            disabled={activeStep === 0}
            onClick={() => handleBack()}
          >
            Back
          </Button>
          <Box p={0.75} />
          <Button variant="contained" sx={{ px: 4 }} onClick={() => handleNext()}>
            {activeStep === 3 ? 'Confirm Order' : 'Next'}
          </Button>
        </Box>
      </Card>
    </DashboardContent>
  );
};

export default AddOrderView;
