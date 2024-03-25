import { IonImg } from '@ionic/react';
import React, { useState } from 'react';
import Loader from '../Loader/Loader';
import './Image.scss';

interface Props {
    src: string;
    alt?: string;
    size?: 'xxs' | 'xs' | 's' | 'm' | 'l' | 'xl' | 'auto';
    align?: 'left' | 'center' | 'right';
    direction?: 'vertical' | 'horizontal';
    objectFit?: 'contain' | 'cover';
    className?: string;
    defaultLoading?: boolean;
}

const Image: React.FC<Props> = ({
    src,
    size = 'auto',
    align = 'center',
    alt,
    direction,
    objectFit = 'contain',
    className: customClassName = '',
    defaultLoading = true,
}) => {
    const [isLoading, setIsLoading] = useState(defaultLoading);
    const image_src = src;

    const className = [
        'Image',
        customClassName,
        direction ? 'direction-' + direction : '',
        size ? 'size-' + size : '',
        align ? 'align-' + align : '',
    ]
        .join(' ')
        .replace(/\s{2,}/g, ' ');

    return (
        <div className={className}>
            {isLoading && (
                <div className="Image-Loader">
                    <Loader />
                </div>
            )}
            <IonImg
                className={`Image--inner ${isLoading ? 'is-loading' : ''} ${
                    'object-fit-' + objectFit
                }`}
                src={image_src}
                alt={alt}
                onIonImgWillLoad={() => setIsLoading(true)}
                onIonImgDidLoad={() => setIsLoading(false)}
            />
        </div>
    );
};

export default Image;
