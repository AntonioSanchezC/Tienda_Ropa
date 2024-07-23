import React, { useState } from 'react';
import UserInfo from '../components/UserInfo';
import OrdersView from '../components/OrdersView';

export default function UserView() {
    const [showOrders, setShowOrders] = useState(false);

    return (
        <div className="w-full p-8 bg-slate-400 ">
            <UserInfo onShowOrders={() => setShowOrders(!showOrders)} />
            {showOrders && <OrdersView />}
        </div>
    );
}
