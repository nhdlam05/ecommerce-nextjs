import { IonContent, IonSlide, IonSlides } from '@ionic/react';
import React from 'react';
import Loader from '../Loader/Loader';
import './Slider.scss';

export interface SlideProps {
    id: string | number;
    children: React.ReactNode;
}

export interface SliderProps {
    slides: SlideProps[];
    showPagination?: boolean;
    loading?: boolean;
}

const slideOpts = {
    initialSlide: 1,
    speed: 400,
};

const Slider: React.FC<SliderProps> = ({
    slides,
    showPagination = false,
    loading = false,
}) => {
    function renderSlide(slide: SlideProps) {
        return (
            <IonSlide key={slide.id}>
                <IonContent className="Slider--Slide">
                    {slide.children}
                </IonContent>
            </IonSlide>
        );
    }

    if (loading) {
        return <Loader fullscreen />;
    }

    return (
        <IonSlides pager={showPagination} className="Slider">
            {slides && slides.map((slide) => renderSlide(slide))}
        </IonSlides>
    );
};

export default Slider;
