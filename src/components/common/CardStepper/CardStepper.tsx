import Avatar from 'atoms/Avatar/Avatar';
import Button from 'atoms/Button/Button';
import Section from 'atoms/Section/Section';
import Text from 'atoms/Text/Text';
import Title from 'atoms/Title/Title';
import React, { useEffect, useRef, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import './CardStepper.scss';

interface Props {
    list: any[];
}

const Stepper: React.FC<Props> = ({ list }) => {
    const [swiperObject, setSwiperObject] = useState<any>(null);
    const timeout = useRef<any>();

    const sliderOption = {
        autoHeight: true,
        observer: true,
        observeParents: true,
        slideToClickedSlide: true,
        initialSlide: 0,
        slidesPerView: 1.3,
        breakpoints: {
            601: {
                slidesPerView: 2.3,
                spaceBetween: 16,
            },
            901: {
                slidesPerView: 3.3,
            },
            1101: {
                slidesPerView: 4.3,
            },
        },
    };

    useEffect(() => {
        timeout.current = setTimeout(() => {
            if (swiperObject && swiperObject.visibleSlides) {
                swiperObject.updateAutoHeight();
                swiperObject.update();
            }
        }, 1000);

        return () => clearTimeout(timeout.current);
    }, [swiperObject]);

    return (
        <div className="CardStepper">
            <Swiper {...sliderOption}>
                {list.map((item: any, index: number) => (
                    <SwiperSlide key={index}>
                        <div className="CardStepper--item">
                            {index !== list.length - 1 && (
                                <div className="CardStepper--bg"></div>
                            )}
                            {item.icon && (
                                <Section spacingBottom="xs">
                                    <Avatar icon={item.icon} size="xs" />
                                </Section>
                            )}
                            {item.title && (
                                <Title size="s" noMargin>
                                    {item.title}
                                </Title>
                            )}
                            {item.subtitle && (
                                <Text size="s" align="center">
                                    {item.subtitle}
                                </Text>
                            )}
                            {item.buttonLabel && (
                                <a href={item.url}>
                                    <Button
                                        variant="naked"
                                        label={item.buttonLabel}
                                    />
                                </a>
                            )}
                        </div>
                    </SwiperSlide>
                ))}
            </Swiper>
        </div>
    );
};

export default Stepper;
