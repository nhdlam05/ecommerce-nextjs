import { useQuery } from '@apollo/client';
import {
    IonContent,
    IonSlide,
    IonSlides,
    useIonViewWillEnter,
} from '@ionic/react';
import Button from 'atoms/Button/Button';
import Divider from 'atoms/Divider/Divider';
import Section from 'atoms/Section/Section';
import Text from 'atoms/Text/Text';
import Title from 'atoms/Title/Title';
import { getDurationFromDurationType } from 'constants/common';
import {
    AvailabilityDurationType,
    DailyAvailabilityInterval,
} from 'generated/graphql';
import { GET_AVAILABILITY_INTERVALS } from 'gql/schedule';
import { useTranslationWithContext } from 'hooks';
import React, { useEffect, useRef, useState } from 'react';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';
import { logFirebaseEvent } from 'service/auth';
import { renderFriendlyTimestampWithDurationString } from 'util/time/formatTime';
import BookingSessionActionFooter from './BookingSessionActionFooter';
import './BookingTimePicker.scss';
import BookingTimePickerDay from './BookingTimePickerDay';
import { DialogFooter } from 'atoms/Dialog';

export interface BookingTimePickerProps {
    providerId: string;
    sessionTime?: string;
    duration: AvailabilityDurationType;
    handleSessionTimeChosen: (s: string) => void;
    onNextButtonClick?: VoidFunction;
    markLiveChat?: VoidFunction;
    skipButtonLabel?: string;
    otherWayOfBookingCta?: any;
}

const STARTING_NUM_DAYS = 8;
const NEW_FETCH_NUM_DAYS = 8;

const BookingTimePicker: React.FC<BookingTimePickerProps> = ({
    providerId,
    duration,
    sessionTime,
    handleSessionTimeChosen,
    onNextButtonClick,
    markLiveChat,
    skipButtonLabel,
    otherWayOfBookingCta,
}) => {
    const sliderRef = useRef<HTMLIonSlidesElement>(null);

    // Nav state
    const [disablePrevBtn, setDisablePrevBtn] = useState(true);
    const [disableNextBtn, setDisableNextBtn] = useState(false);

    const [allAvailableSlots, setAllAvailableSlots] = useState<
        DailyAvailabilityInterval[]
    >([]);

    const { translate } = useTranslationWithContext();

    const {
        data: availableSlotsData,
        loading,
        fetchMore,
    } = useQuery<{ availabilityIntervals: DailyAvailabilityInterval[] }>(
        GET_AVAILABILITY_INTERVALS,
        {
            variables: {
                input: {
                    providerId,
                    duration,
                    numDays: STARTING_NUM_DAYS,
                    afterDate: null,
                },
            },
            fetchPolicy: 'network-only',
        }
    );

    useEffect(() => {
        if (availableSlotsData?.availabilityIntervals) {
            const availableSlots = availableSlotsData?.availabilityIntervals;
            setAllAvailableSlots(availableSlots);
        }

        if (
            !availableSlotsData ||
            !availableSlotsData.availabilityIntervals.length
        ) {
            setDisableNextBtn(true);
        } else {
            setDisableNextBtn(false);
        }

        return () => {
            setAllAvailableSlots([]);
        };
    }, [loading, availableSlotsData, setDisableNextBtn]);

    useIonViewWillEnter(() => {
        // isPlatform
        if (window && window.innerWidth >= 750) {
            // Lock swipe?
        }
    });

    const slideOpts = {
        speed: 400,
        preventClicks: false,
        preventClicksPropagation: false,
        allowTouchMove: false,
        noSwiping: false,
        breakpoints: {
            100: {
                slidesPerView: 1,
                spaceBetween: 30,
            },
            600: {
                slidesPerView: 3,
                spaceBetween: 30,
            },
        },
    };

    async function handleSlideNext() {
        const swiper = await sliderRef.current?.getSwiper();
        swiper.slideNext();
    }
    async function handleSlidePrev() {
        const swiper = await sliderRef.current?.getSwiper();
        swiper.slidePrev();
    }

    // On slider load
    async function handleOnLoad(slider: any) {
        await sliderRef.current?.getSwiper();
    }

    // On Slide change
    async function handleSlideDidChange() {
        const swiper = await sliderRef.current?.getSwiper();

        setDisablePrevBtn(swiper.isBeginning);

        if (
            allAvailableSlots &&
            (swiper.activeIndex ===
                allAvailableSlots.length - NEW_FETCH_NUM_DAYS / 2 ||
                swiper.isEnd)
        ) {
            const { data } = await fetchMore({
                variables: {
                    input: {
                        providerId,
                        duration,
                        numDays: NEW_FETCH_NUM_DAYS,
                        afterDate:
                            allAvailableSlots[allAvailableSlots?.length - 1]
                                .date,
                    },
                },
            });

            if (data?.availabilityIntervals) {
                setAllAvailableSlots([
                    ...allAvailableSlots,
                    ...data.availabilityIntervals,
                ]);
            } else {
                setDisableNextBtn(swiper.isEnd);
            }
        }
    }

    function skipTimeDueToNoAvailableSlot() {
        logFirebaseEvent('booking_funnel_time_picker_skip_no_slot', {
            providerId,
        });

        if (markLiveChat) {
            markLiveChat();
        }
    }

    function skipTime() {
        logFirebaseEvent('booking_funnel_time_picker_skip', {
            providerId,
        });

        if (markLiveChat) {
            markLiveChat();
        }
    }

    if (loading || !availableSlotsData) return <></>;

    return (
        <>
            {allAvailableSlots && allAvailableSlots.length > 0 ? (
                <>
                    <div className="BookingTimePicker">
                        <div className="BookingTimePicker--nav is-prev">
                            <button
                                className="BookingTimePicker--nav--item"
                                onClick={async () => {
                                    await handleSlidePrev();
                                }}
                                disabled={disablePrevBtn || loading}
                            >
                                <MdKeyboardArrowLeft />
                            </button>
                        </div>
                        <div className="BookingTimePicker--content">
                            <IonContent>
                                <IonSlides
                                    key={providerId + duration}
                                    mode="ios"
                                    className="BookingTimePicker--slider"
                                    options={slideOpts}
                                    ref={sliderRef}
                                    onIonSlidesDidLoad={handleOnLoad}
                                    onIonSlideDidChange={handleSlideDidChange}
                                >
                                    {allAvailableSlots.map((element) => {
                                        return (
                                            <IonSlide
                                                key={element.date}
                                                className="BookingTimePicker--slide"
                                            >
                                                <BookingTimePickerDay
                                                    availableSlots={element}
                                                    sessionTime={sessionTime}
                                                    handleSessionTimeChosen={
                                                        handleSessionTimeChosen
                                                    }
                                                />
                                            </IonSlide>
                                        );
                                    })}
                                </IonSlides>
                            </IonContent>
                        </div>

                        <div className="BookingTimePicker--nav is-next">
                            <button
                                className="BookingTimePicker--nav--item"
                                onClick={async () => {
                                    await handleSlideNext();
                                }}
                                disabled={disableNextBtn || loading}
                            >
                                <MdKeyboardArrowRight />
                            </button>
                        </div>
                    </div>

                    {onNextButtonClick && (
                        <BookingSessionActionFooter
                            mainActionDisabled={!sessionTime}
                            onMainActionClick={onNextButtonClick}
                            additionContent={
                                <>
                                    <Text size="xs" align="center">
                                        {sessionTime
                                            ? renderFriendlyTimestampWithDurationString(
                                                  sessionTime,
                                                  getDurationFromDurationType(
                                                      duration
                                                  )
                                              )
                                            : translate(
                                                  'booking.funnel.time.picker.button.subtitle'
                                              )}
                                    </Text>
                                    <Divider invisible spacing="xs" />
                                    {markLiveChat && (
                                        <>
                                            <Divider />
                                            <Divider invisible spacing="xs" />

                                            <Title
                                                align="center"
                                                size="s"
                                                noMargin
                                            >
                                                {translate(
                                                    'booking.funnel.time.picker.skip.time.text'
                                                )}
                                            </Title>
                                            <Title
                                                align="center"
                                                size="s"
                                                noMargin
                                            >
                                                {' '}
                                                <a
                                                    href=""
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        skipTime();
                                                    }}
                                                >
                                                    {skipButtonLabel ||
                                                        translate(
                                                            'booking.funnel.time.picker.skip.time.button'
                                                        )}
                                                </a>
                                            </Title>
                                        </>
                                    )}
                                    {otherWayOfBookingCta &&
                                        otherWayOfBookingCta}
                                </>
                            }
                        />
                    )}
                </>
            ) : (
                <>
                    <Section spacing="l">
                        <Title align="center" size="l">
                            {'⏳'}
                        </Title>
                        <Title align="center" size="l">
                            {translate(
                                'booking.funnel.time.picker.no.available.slots'
                            )}
                        </Title>
                        <Button
                            onClick={skipTimeDueToNoAvailableSlot}
                            align="center"
                            label={translate(
                                'booking.funnel.time.picker.write.a.message'
                            )}
                        />
                    </Section>
                </>
            )}
        </>
    );
};

export default BookingTimePicker;
