import { useEffect} from 'react';


const OrderDetails = () => {
  return (
    <div>
        <h2 className="font-bold text-[var(--primary-color-1)] text-2xl capitalize my-2">
        order details
        </h2>
        <hr className='w-full h-0.5 border-none bg-gray-400'/>
        <div className='w-full sm:p-2 lg:p-4'>
            <h4 className="font-bold text-[var(--primary-color-1)] capitalize">user details</h4>
            <div className='w-full grid lg:grid-cols-4 sm:grid-cols-2 gap-3'>
                <div>
                    <h6 className='text-[var(--primary-color-1)] capitalize'>first name</h6>
                    {/* <h4 className='text-gray-600 font-bold text-sm capitalize'>{order.first_name}</h4> */}
                </div>
            </div>
        </div>
    </div>
  )
}

export default OrderDetails