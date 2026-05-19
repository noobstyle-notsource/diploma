import { motion } from 'motion/react';
import { ReactNode, useRef } from 'react';

interface PageTransitionProps {
  children: ReactNode;
}

export default function PageTransition({ children }: PageTransitionProps) {
  const ref = useRef<HTMLDivElement>(null);
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20, filter: 'blur(10px)' }}
      animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
      exit={{ opacity: 0, y: -20, filter: 'blur(10px)' }}
      transition={{ 
        duration: 0.6, 
        ease: [0.23, 1, 0.32, 1] // Custom "Elite" Cubic Bezier
      }}
      onAnimationComplete={() => {
        if (ref.current) {
          ref.current.style.transform = '';
          ref.current.style.filter = '';
        }
      }}
    >
      {children}
    </motion.div>
  );
}
