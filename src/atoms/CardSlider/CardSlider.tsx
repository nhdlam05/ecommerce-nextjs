import { Children, isValidElement, useEffect, useRef, useState } from 'react';
import { MdKeyboardArrowLeft, MdKeyboardArrowRight } from 'react-icons/md';
import SwiperCore, { Navigation, Pagination } from 'swiper';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/swiper-bundle.min.css';
import type SwiperClass from 'swiper/types/swiper-class';
import Button from '../Button/Button';
import ModuleGroup from '../ModuleGroup';
import Title from '../Title/Title';
import './CardSlider.scss';

interface Props {
    title?: string;
    theme?: 'white' | 'dark';
    arrowTheme?: any;
    arrowPosition?: 'start' | 'end';
    children: React.ReactNode;
    hideControls?: boolean;
    hideOverflow?: boolean;
    defaultOption?: any;
    className?: string;
    handleSlideChange?: (index?: number) => void;
    resetButton?: any;
}

SwiperCore.use([Navigation, Pagination]);

const SLIDE_OPTION = {
    autoHeight: true,
    slidesPerView: 1.15,
    spaceBetween: 10,
    threshold: 5,
    observer: true,
    observeParents: true,
    slideToClickedSlide: true,
    breakpoints: {
        // when window width is >= 750px
        750: {
            spaceBetween: 20,
        },
    },
};

const DESKTOP_BREAKPOINT = '600';

const CardSlider: React.FC<Props> = ({
    title,
    theme,
    arrowTheme = 'white',
    children,
    hideControls = false,
    hideOverflow = false,
    defaultOption,
    arrowPosition = 'end',
    handleSlideChange,
    className,
    resetButton,
}) => {
    const timeout = useRef<any>();
    const cards = Children.toArray(children).filter((child) =>
        isValidElement(child)
    ) as React.ReactElement[];

    const [swiper, setSwiper] = useState<SwiperClass | null>(null);
    const [nextDisabled, setNextDisabled] = useState(false);
    const [prevDisabled, setPrevDisabled] = useState(false);
    const slideOption = {
        ...SLIDE_OPTION,
        ...defaultOption,
    };

    const slidesPerView = Math.floor(
        slideOption.breakpoints[DESKTOP_BREAKPOINT]?.slidesPerView ||
            slideOption.slidesPerView
    );

    const handleSwiperClick = () => {
        if (swiper) {
            timeout.current = setTimeout(() => {
                swiper.updateAutoHeight(200);
            }, 200);
        }
    };

    function setSliderNavigationDisabledState() {
        const realIndex = swiper?.realIndex;
        handleSlideChange && handleSlideChange(realIndex);
        if (realIndex === 0) {
            setPrevDisabled(true);
        } else {
            setPrevDisabled(false);
        }
        if (realIndex === cards.length - slidesPerView) {
            setNextDisabled(true);
        } else {
            setNextDisabled(false);
        }
    }

    function onSlideChange() {
        setSliderNavigationDisabledState();
    }

    function getSwiperInstance(swiper: SwiperClass) {
        setSwiper(swiper);
    }

    function onObserverUpdate() {
        setSliderNavigationDisabledState();
    }

    function renderSliderNavigation() {
        if (hideControls) return null;

        return (
            <div className="CardSwiper--controls">
                <Button
                    disabled={prevDisabled}
                    label={<MdKeyboardArrowLeft size="22" />}
                    size="s"
                    theme={arrowTheme}
                    onClick={() => swiper?.slidePrev()}
                />
                <Button
                    disabled={nextDisabled}
                    label={<MdKeyboardArrowRight size="22" />}
                    size="s"
                    theme={arrowTheme}
                    onClick={() => swiper?.slideNext()}
                />
            </div>
        );
    }

    function renderStartSliderNavigation() {
        return (
            <div className="CardSwiper--startControls">
                {renderSliderNavigation()}
                <Title size="l">{title}</Title>
            </div>
        );
    }

    const classNames = `CardSlider ${
        hideControls ? 'CardSlider--hideControls' : ''
    } ${hideOverflow ? 'CardSlider--hideOverflow' : ''} ${
        className ? className : ''
    }`;

    const onReset = () => {
        console.log('onReset');
        if (swiper) {
            swiper.slideTo(1);
        }
    };

    useEffect(() => {
        return () => clearTimeout(timeout.current);
    }, []);

    if (!cards?.length) return null;

    // if only one slide is provided render just the card element
    if (cards.length <= 1)
        return (
            <div className={classNames}>
                <ModuleGroup theme={theme} title={title}>
                    {cards[0]}
                </ModuleGroup>
            </div>
        );

    const moduleGroupProps =
        arrowPosition === 'end'
            ? {
                  title,
                  endSlot: renderSliderNavigation(),
              }
            : {
                  startSlot: renderStartSliderNavigation(),
              };

    return (
        <div className={classNames}>
            <ModuleGroup theme={theme} {...moduleGroupProps}>
                {resetButton && (
                    <div>
                        <Button
                            {...resetButton}
                            onClick={() => {
                                resetButton.onClick &&
                                    resetButton.onClick(swiper);
                            }}
                        />
                    </div>
                )}
                <Swiper
                    {...slideOption}
                    onSlideChange={onSlideChange}
                    onObserverUpdate={onObserverUpdate}
                    onSwiper={getSwiperInstance}
                    onClick={handleSwiperClick}
                >
                    {cards.map((card) => (
                        <SwiperSlide key={card.key}>{card}</SwiperSlide>
                    ))}
                </Swiper>
            </ModuleGroup>
        </div>
    );
};

export default CardSlider;
