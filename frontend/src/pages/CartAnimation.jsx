import { motion } from 'framer-motion';
import React from 'react';

const CartAnimation = ({ items, onComplete }) => {
  const animations = items.map((_, index) => ({
    initial: { opacity: 1, x: 0 },
    animate: { opacity: 0, x: 100 },
    transition: {
      delay: index * 0.3,
      duration: 0.5,
      ease: 'easeInOut',
    },
  }));

  return (
    <div className="fixed top-0 left-0 w-full h-full flex items-center justify-center z-50">
      <div className="absolute top-0 left-0 w-full h-full bg-black opacity-30"></div>
      <motion.div
        className="relative flex items-center justify-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {items.map((item, index) => (
          <motion.div
            key={index}
            className="absolute w-12 h-12 bg-gray-600 rounded-full flex justify-center items-center"
            style={{
              top: 'calc(50% - 2rem)',
              left: 'calc(50% - 2rem)',
              transition: 'transform 0.5s ease',
            }}
            {...animations[index]}
          >
            <img
              src={item.image}
              alt={item.name}
              className="w-8 h-8 object-cover rounded-full"
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default CartAnimation;
