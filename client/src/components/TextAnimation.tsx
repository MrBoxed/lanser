import { motion, MotionProps } from 'motion/react';
import React from 'react';

// SplitText props type
interface TextProps {
    text: string;
    type?: 'chars' | 'words' | 'lines'; // The type of split (characters, words, or lines)
    animationProps?: MotionProps; // Motion props for animations (from Framer Motion)
    className?: string; // Optional className for styling
}

const TextAnimaation: React.FC<TextProps> = ({
    text,
    type = 'chars',
    animationProps,
    className }) => {


    // Split the text based on type (characters, words, or lines)
    const splitText = () => {

        if (type === 'chars') {

            return text.split('').map((char, index) => (

                <motion.span
                    key={index}
                    className={className}
                    initial={{ filter: "blur(10px)", opacity: 0, y: 12 }}
                    animate={{ filter: "blur(0)", opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: 0.05 * index }}
                >
                    {char === ' ' ? ' ' : char} {/* Rendering space as non-breaking space */}

                </motion.span>
            ));


        } else if (type === 'words') {

            return text.split(" ").map((word, index) => (
                <motion.span
                    initial={{ filter: "blur(10px)", opacity: 0, y: 12 }}
                    animate={{ filter: "blur(0)", opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.1 * index }}
                    key={index}
                    className={className}
                >
                    {word}{' '}
                </motion.span>
            ));

        } else if (type === 'lines') {
            return text.split('\n').map((line, index) => (
                <motion.div
                    key={index}
                    className={className}
                    initial={{ filter: "blur(10px)", opacity: 0, y: 12 }}
                    animate={{ filter: "blur(0)", opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 * index }}
                    {...animationProps}
                >
                    {line}
                </motion.div>
            ));
        }
    };

    return <>{splitText()}</>;
};

export default TextAnimaation;
