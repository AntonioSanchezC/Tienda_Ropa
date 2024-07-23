import {Outlet} from 'react-router-dom'

export default function AuthLayout() {


  return (
    <main >
        <div>
            <Outlet />
        </div>
    </main>
  )
}
