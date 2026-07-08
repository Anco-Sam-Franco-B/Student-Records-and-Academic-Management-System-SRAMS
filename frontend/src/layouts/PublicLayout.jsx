import React from 'react'
import { Outlet } from 'react-router-dom';

function PublicLayout() {
  return (
    <div>
        <main className="flex-1 relative">
                <Outlet />
        </main>
    </div>
  )
}

export default PublicLayout