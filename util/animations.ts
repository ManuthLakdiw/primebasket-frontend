import { Variants } from "motion/react";

export const formAnimationVariant: Variants = {
    hidden: {
        opacity: 0,
        y: 40,
        scale: 0.95
    },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            type: "spring",
            stiffness: 250,
            damping: 25,
            duration: 0.5,
        }
    },
};


export const headerAnimationVariant: Variants = {
    hidden: {
        opacity: 0,
        y: -20,
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 300,
            damping: 24,
            duration: 0.5,
            delay: 0.1
        }
    }
}


export const tabAnimationVariant: Variants = {
    hidden: {
        opacity: 0,
        y: 10
    },
    visible: {
        opacity: 1,
        y: 0,
        transition: {
            duration:
                0.2
        }
    },
    exit: {
        opacity: 0,
        y: -10,
        transition: {
            duration: 0.2
        }
    }
};


export const overlayAnimationVariant: Variants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
    exit: { opacity: 0 }
};

export const modalAnimationVariant: Variants = {
    hidden: {
        opacity: 0,
        scale: 0.95,
        y: 20
    },
    visible: {
        opacity: 1,
        scale: 1,
        y: 0,
        transition: {
            type: "spring",
            stiffness: 300,
            damping: 25,
            duration: 0.3
        }
    },
    exit: {
        opacity: 0,
        scale: 0.95,
        y: -20,
        transition: {
            duration: 0.2
        }
    }
};

