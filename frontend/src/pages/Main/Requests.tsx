import React from 'react';
import Sidebar from '../../features/Main/components/Sidebar';
import RequestCardList from '../../features/Main/section/Request/component/RequestCardList';

const Requests = () => {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="flex-1 pt-16 md:pt-5 md:pl-60 pb-20 md:pb-5">
        <div className='flex flex-col items-center justify-center gap-1 mb-5'>
          <p className='font-semibold text-3xl'>Travel Requests</p>
          <p className='text-lg text-gray-600'>Review Travel Requests from other users.</p>
        </div>
        <RequestCardList />
      </main>
    </div>
  );
};

export default Requests;
