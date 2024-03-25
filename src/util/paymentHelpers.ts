import { loadStripe } from '@stripe/stripe-js';

const { REACT_APP_STRIPE_KEY } = process.env;

export const loadStripePayment = () => {
    return new Promise((resolve, reject) => {
        const stripePromise = loadStripe(REACT_APP_STRIPE_KEY as string);
        if (stripePromise) {
            resolve(stripePromise);
        } else {
            reject('Can not load stripe!!!');
        }
    });
};
