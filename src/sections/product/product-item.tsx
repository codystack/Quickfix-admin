
import { useNavigate } from 'react-router-dom';

import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Card from '@mui/material/Card';
import Stack from '@mui/material/Stack';
import { CardActionArea } from '@mui/material';
import Typography from '@mui/material/Typography';

import { fCurrency } from 'src/utils/format-number';

import { Label } from 'src/components/label';

// ----------------------------------------------------------------------

// export type ProductItemProps = {
//   id: string;
//   name: string;
//   price: number;
//   status: string;
//   coverUrl: string;
//   colors: string[];
//   priceSale: number | null;
// };

export function ProductItem({ product }: any) {
  const navigate = useNavigate();

  const renderImg = (
    <Box
      component="img"
      alt={product.name}
      src={product?.images[0]}
      sx={{
        top: 0,
        width: 1,
        height: 1,
        objectFit: 'cover',
        position: 'absolute',
      }}
    />
  );

  const renderPrice = (
    <Typography variant="subtitle1">
      <Typography
        component="span"
        variant="body1"
        sx={{
          color: 'text.disabled',
          textDecoration: 'line-through',
        }}
      >
        {/* {fCurrency(product.amount)} */}
      </Typography>
      &nbsp;
      {fCurrency(product.amount)}
    </Typography>
  );

  return (
    <Card component={CardActionArea}  onClick={() => {
      console.log("PRODUCT ITEM CLICKED ::: ", product);
      navigate(`/dashboard/market-place/product/${product?._id}`, { state: { data: product } })
      
    }} >
      <Box sx={{ pt: '100%', position: 'relative' }}>
        {/* {product.status && renderStatus} */}

        {renderImg}
      </Box>

      <Stack spacing={2} sx={{ p: 1 }}>
        <Link color="inherit" underline="hover" variant="subtitle2" noWrap>
          {product.title}
        </Link>

        <Box display="flex" alignItems="center" justifyContent="space-between">
          {renderPrice}
        </Box>
      </Stack>
    </Card>
  );
}
