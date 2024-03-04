import { useEffect } from 'react';
import { Route, BrowserRouter, Routes } from 'react-router-dom';
import Nav from './Nav';
import { ToastContainer } from 'react-toastify';
import { observer } from 'mobx-react-lite';
import GenericDocSearch from '../../features/genericDocSearch/genericDocSearch';

export default observer(function App() {
  return (
    <>
      <BrowserRouter>
        <>
          {/* <Nav /> */}
          <div className={`container p-3 lg:w-[90%] md:w-[87%] sm:w-[90%]`}>
            <Routes>
              <Route path='/' element={<GenericDocSearch />} />
            </Routes>
          </div>
          <ToastContainer />
        </>
      </BrowserRouter>
    </>
  );
});
