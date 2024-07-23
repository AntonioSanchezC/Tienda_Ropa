import {createBrowserRouter} from 'react-router-dom'
import Layout from './layouts/Layout'
import AuthLayout from './layouts/AuthLayout'
import Login from './views/Login'
import Register from './views/Register'
import AdminLayout from './layouts/AdminLayout'
import IneraccionesAdmin from './views/IneraccionesAdmin'
import Products from './views/Products'
import AdminUsers from './views/AdminUsers'
import InsertProducts from './views/InsertProducts'
import SubirImagen from './views/SubirImagen'
import DetailsProductCustomer from './views/DetailsProductCustomer'
import Verify from './views/Verify'
import Code from './views/Code'
import ProductsList from './views/ProductsList'
import InsertPromotion from './views/InsertPromotion'
import PromotionProduct from './views/PromotionProduct'
import InitialA from './components/InitialA'
import DetailsProductAdmin from './views/DetailsProductAdmin'
import DetailsUsersAdmin from './views/DetailsUsersAdmin'
import DetailsOrder from './views/DetailsOrder'
import Orders from './views/Orders'
import Trolley from './views/Trolley'
import Checkout from './views/Checkout'
import UserView from './views/UserView'
import PromotionSeasson from './views/PromotionSeasson'
import PromotionSaleView from './views/PromotionSaleView'
import InitialGender from './views/InitialGender'
import AboutOus from './views/AboutOus'
import ContactUs from './views/ContactUs'
import UserLayout from './layouts/UserLayout'

const router = createBrowserRouter([
    {
        path:'/',
        element: <Layout />,
        children:[{
            path: '/productsList',
            element:<ProductsList/>
        },{
            path: '/',
            element:<InitialA />
        },  
        {
            path: '/details',
            element: <DetailsProductCustomer />
        },   
        {
            path: '/trolley',
            element: <Trolley />
        },    {
            path: '/checkout',
            element: <Checkout />
        },     {
            path: '/user',
            element: <UserView />
        },     {
            path: '/register',
            element: <Register />
        },   {
            path: '/verify',
            element: <Verify />
        },      {
            path: '/code',
            element: <Code />
        }, {
            path: '/login',
            element: <Login />
        }, {
            path: '/PromotionSeasson',
            element: <PromotionSeasson />
        },{
            path: '/PromotionSaleView',
            element: <PromotionSaleView />
        },{
            path: '/aboutUs',
            element: <AboutOus />
        },{
            path: '/auth/contactUs',
            element: <ContactUs />
        },
    ]
     },
     {
        path:'/auth',
        element:<UserLayout />,
        children:[
            {
                path: '/auth/login',
                element: <Login />
            },     {
                path: '/auth/register',
                element: <Register />
            },     {
                path: '/auth/verify',
                element: <Verify />
            },     {
                path: '/auth/code',
                element: <Code />
            },  

        ]
     },
     {
        path:'/public',
        element:<AuthLayout />,
        children:[
            {
                path: '/public/details',
                element: <DetailsProductCustomer />
            },      {
                path: '/public/ini',
                element: <InitialGender />
            }, 

        ]
     },
     {
        path:'/admin',
        element: <AdminLayout />,
        children:[
            {
                path: '/admin',
                element: <IneraccionesAdmin />
            }, 
            {
                path: '/admin/Orders',
                element: <Orders />
            },    
            {
                path: '/admin/products',
                element: <Products />
            },     {
                path: '/admin/users',
                element: <AdminUsers />
            },     {
                path: '/admin/insertproduct',
                element: <InsertProducts/>
            },     {
                path: '/admin/subirImg',
                element: <SubirImagen />
            },     {
                path: '/admin/promotion',
                element: <InsertPromotion />
            },     {
                path: '/admin/promoProduct',
                element: <PromotionProduct />
            },     {
                path: '/admin/detailsProduct',
                element: <DetailsProductAdmin />
            },        {
                path: '/admin/detailsOrder',
                element: <DetailsOrder />
            },     {
                path: '/admin/detailsUsers',
                element: <DetailsUsersAdmin />
            }
 

        ]
        
     }

])
export default router