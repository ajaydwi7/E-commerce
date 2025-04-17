// MainLayout.jsx (with header/footer)
import { Outlet } from 'react-router-dom';
import ScrollToTop from '../components/ScrollToTop/ScrollToTop';
import ScrollToTopButton from '../components/GlobalComponents/ScrollToTopButton/ScrollToTopButton';
import NavBar2 from '../components/NavBar/NavBar2';
import ShopFooter from '../components/Footer/ShopFooter';

const MainLayout = () => {
  return (
    <div className="app">
      <ScrollToTopButton />
      <header>
        <NavBar2 />
      </header>
      <ScrollToTop />
      <main>
        <Outlet />
      </main>
      <footer>
        <ShopFooter />
      </footer>
    </div >
  );
};

export default MainLayout;