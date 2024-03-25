import { IonSlides } from '@ionic/react';
import { BookingFunnelContext } from 'context/bookingFunnel';
import React, { useContext, useRef } from 'react';
import './BookingSliderWrapper.scss';

interface slideActionParams {
    skip?: boolean;
}

interface Ref {
    slideNext: (params: slideActionParams) => void;
    slidePrev: (params: slideActionParams) => void;
    getActiveIndex: () => void;
}

interface Props {
    key?: string;
    children: React.ReactNode;
    className?: string;
    showPager?: boolean;
    onWillChange?: (swiper: any) => void;
    onDidChange?: (swiper: any) => void;
    onDidLoad?: (swiper: any) => void;
}

// const BookingSliderWrapper: React.FC<Props> = ({ key, sliderRef, className, children, onDidChange, showPager = false }) => {
const BookingSliderWrapper = React.forwardRef<Ref, Props>(
    (
        {
            key,
            className,
            children,
            onWillChange,
            onDidChange,
            onDidLoad,
            showPager = false,
        },
        ref
    ) => {
        const { generalFunnelInfo, setGeneralFunnelInfo } =
            useContext(BookingFunnelContext);

        const modClass = [
            'BookingSliderWrapper',
            className !== undefined && className,
        ]
            .join(' ')
            .replace(/\s{2,}/g, ' ');

        const sliderRef = useRef<any>(null);

        const slideOpts = {
            speed: 220,
            noSwiping: false,
            autoHeight: true,
            spaceBetween: 50,
            preventClicks: false,
            preventClicksPropagation: false,
        };

        function enableSwiping(isEnabled: boolean) {
            if (!sliderRef) {
                return;
            }

            const swiper = sliderRef.current;
            if (isEnabled) {
                swiper?.lockSwipes(false);
            } else {
                swiper?.lockSwipes(true);
            }
        }

        // function slideNext() {
        //     if (!sliderRefTMP) {
        //         return;
        //     }

        //     const swiper = sliderRefTMP.current;

        //     enableSwiping(true);
        //     swiper?.slideNext();
        //     enableSwiping(false);

        // }

        // function slidePrev() {
        //     const swiper = sliderRef.current;

        //     enableSwiping(true);
        //     swiper?.slidePrev();
        //     enableSwiping(false);
        // }

        React.useImperativeHandle(ref, () => ({
            slideNext(params: slideActionParams) {
                if (!sliderRef) {
                    return;
                }

                const swiper = sliderRef.current;

                enableSwiping(true);
                swiper?.slideNext();
                if (params?.skip) swiper?.slideNext();
                enableSwiping(false);
            },
            slidePrev(params: slideActionParams) {
                if (!sliderRef) {
                    return;
                }

                const swiper = sliderRef.current;

                enableSwiping(true);
                swiper?.slidePrev();

                if (params?.skip) swiper?.slidePrev();
                enableSwiping(false);
            },
            slideTo(index: number) {
                if (!sliderRef) {
                    return;
                }

                const swiper = sliderRef.current;

                enableSwiping(true);
                swiper?.slideTo(index);
                enableSwiping(false);
            },
            async getActiveIndex() {
                // TODO: fix. doesn't work yet.
                if (!sliderRef) {
                    return;
                }
                const swiper = sliderRef.current;
                return swiper.getActiveIndex();
            },
        }));

        function setIsInFocus(swiper: any) {
            if (swiper) {
                setGeneralFunnelInfo({
                    ...generalFunnelInfo,
                    isInFocus: swiper.activeIndex > 0,
                });
            }
        }

        // On Slide change
        async function handleSlideWillChange() {
            const swiper = await sliderRef.current?.getSwiper();

            setIsInFocus(swiper);

            onWillChange && onWillChange(swiper);
        }

        async function handleSlideDidChange() {
            const swiper = await sliderRef.current?.getSwiper();
            onDidChange && onDidChange(swiper);

            // swiper.update();
            swiper.updateAutoHeight();
        }

        async function handleSlidesLoad() {
            const swiperObj = await sliderRef.current;
            const swiper = await sliderRef.current?.getSwiper();
            setIsInFocus(swiper);

            onDidLoad && onDidLoad(swiper);
            // Prevent swipes and slides!
            swiperObj?.lockSwipes(true);
        }

        return (
            <IonSlides
                mode="ios"
                className={modClass}
                options={slideOpts}
                ref={sliderRef}
                pager={showPager}
                onIonSlideWillChange={handleSlideWillChange}
                onIonSlideDidChange={handleSlideDidChange}
                onIonSlidesDidLoad={() => handleSlidesLoad()}
            >
                {children}
            </IonSlides>
        );
    }
);

export default BookingSliderWrapper;
