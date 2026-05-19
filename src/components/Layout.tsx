import { ReactNode, useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import { useLocation } from 'react-router-dom';
import { motion, useScroll, useSpring } from 'motion/react';
import { AIChat } from './AIChat';

export default function Layout({ children }: { children: ReactNode }) {
  const location = useLocation();
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  const authPaths = ['/login', '/register', '/forgot-password'];
  const isAuthPage = authPaths.includes(location.pathname);
  
  const noFooterPaths = [...authPaths, '/messages'];
  const hideFooter = noFooterPaths.includes(location.pathname);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex flex-col">
      <motion.div 
        className="fixed top-0 left-0 right-0 h-1 bg-primary z-[100] origin-left shadow-[0_0_15px_rgba(129,212,220,0.8)]"
        style={{ scaleX }}
      />
      {!isAuthPage && <Navbar />}
      <main className={!isAuthPage ? "flex-grow pt-20" : "flex-grow"}>
        {children}
      </main>
      {!hideFooter && <Footer />}
      {!isAuthPage && <AIChat />}
    </div>
  );
}
