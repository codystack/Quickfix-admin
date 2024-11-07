import type { RootState } from 'src/redux/store';

import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import React, { useState, useCallback } from 'react';

import Box from '@mui/material/Box';
import { Button } from '@mui/material';
import Grid from '@mui/material/Unstable_Grid2';
import Pagination from '@mui/material/Pagination';
import Typography from '@mui/material/Typography';

import { DashboardContent } from 'src/layouts/dashboard';

import { Iconify } from 'src/components/iconify';

import { ProductItem } from '../product-item';
import { ProductSort } from '../product-sort';
import { ProductFilters } from '../product-filters';

import type { FiltersProps } from '../product-filters';



// ----------------------------------------------------------------------

const GENDER_OPTIONS = [
  { value: 'men', label: 'Men' },
  { value: 'women', label: 'Women' },
  { value: 'kids', label: 'Kids' },
];

const CATEGORY_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'shose', label: 'Shose' },
  { value: 'apparel', label: 'Apparel' },
  { value: 'accessories', label: 'Accessories' },
];

const RATING_OPTIONS = ['up4Star', 'up3Star', 'up2Star', 'up1Star'];

const PRICE_OPTIONS = [
  { value: 'below', label: 'Below $25' },
  { value: 'between', label: 'Between $25 - $75' },
  { value: 'above', label: 'Above $75' },
];

// const COLOR_OPTIONS = [
//   '#00AB55',
//   '#000000',
//   '#FFFFFF',
//   '#FFC0CB',
//   '#FF4842',
//   '#1890FF',
//   '#94D82D',
//   '#FFC107',
// ];

const defaultFilters = {
  price: '',
  // gender: [GENDER_OPTIONS[0].value],
  // colors: [COLOR_OPTIONS[4]],
  // rating: RATING_OPTIONS[0],
  // category: CATEGORY_OPTIONS[0].value,
};

export function ProductsView() {
  const navigate = useNavigate();
  const { products } = useSelector((state: RootState) => state.product)
  const [sortBy, setSortBy] = useState('featured');
  const [openFilter, setOpenFilter] = useState(false);
  const [filters, setFilters] = useState<FiltersProps>(defaultFilters);

  const handleOpenFilter = useCallback(() => {
    setOpenFilter(true);
  }, []);

  const handleCloseFilter = useCallback(() => {
    setOpenFilter(false);
  }, []);

  const handleSort = useCallback((newSort: string) => {
    setSortBy(newSort);
  }, []);

  const handleSetFilters = useCallback((updateState: Partial<FiltersProps>) => {
    setFilters((prevValue) => ({ ...prevValue, ...updateState }));
  }, []);

  const canReset = Object.keys(filters).some(
    (key) => filters[key as keyof FiltersProps] !== defaultFilters[key as keyof FiltersProps]
  );

  return (
    <DashboardContent>

      <Box display="flex" alignItems="center" mb={5}>
        <Typography variant="h4" flexGrow={1}>
        Market Place
        </Typography>
        <Button
          variant="contained"
          color="inherit"
          onClick={() => navigate('/dashboard/product/new')}
          startIcon={<Iconify icon="mingcute:add-line" />}
        >
          Add Item
        </Button>
      </Box>

      {/* <CartIcon totalItems={8} /> */}

      <Box
        display="flex"
        alignItems="center"
        flexWrap="wrap-reverse"
        justifyContent="flex-end"
        sx={{ mb: 5 }}
      >
        <Box gap={1} display="flex" flexShrink={0} sx={{ my: 1 }}>
          <ProductFilters
            canReset={canReset}
            filters={filters}
            onSetFilters={handleSetFilters}
            openFilter={openFilter}
            onOpenFilter={handleOpenFilter}
            onCloseFilter={handleCloseFilter}
            onResetFilter={() => setFilters(defaultFilters)}
            options={{
              price: PRICE_OPTIONS,
            }}
          />

          <ProductSort
            sortBy={sortBy}
            onSort={handleSort}
            options={[
              { value: 'featured', label: 'Featured' },
              { value: 'newest', label: 'Newest' },
              { value: 'priceDesc', label: 'Price: High-Low' },
              { value: 'priceAsc', label: 'Price: Low-High' },
            ]}
          />
        </Box>
      </Box>

      <Grid container spacing={3}>
        {products?.data.map((product: any) => (
          <Grid key={product._id} xs={12} sm={6} md={3}>
            <ProductItem product={product} />
          </Grid>
        ))}
      </Grid>

      <Pagination count={10} color="primary" sx={{ mt: 8, mx: 'auto' }} />
    </DashboardContent>
  );
}
