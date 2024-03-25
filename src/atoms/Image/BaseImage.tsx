import React, { useEffect, useRef, useState } from 'react';
import Loader from '../Loader/Loader';
import './Image.scss';

interface Props {
    src: string;
    alt?: string;
    size?: 's' | 'm' | 'l' | 'auto';
    align?: 'left' | 'center' | 'right';
    direction?: 'vertical' | 'horizontal';
    objectFit?: 'contain' | 'cover';
    classes?: string;
    hasLoader?: false;
}

const BaseImage: React.FC<Props> = ({
    src,
    size = 'auto',
    align = 'center',
    alt,
    direction,
    classes = '',
    hasLoader = true,
    objectFit = 'cover',
}) => {
    const ref = useRef<HTMLImageElement>(null);
    const image_src = src;

    const [isLoading, setIsLoading] = useState(hasLoader);

    const className = [
        'Image BaseImage',
        classes,
        direction ? 'direction-' + direction : '',
        size ? 'size-' + size : '',
        align ? 'align-' + align : '',
    ]
        .join(' ')
        .replace(/\s{2,}/g, ' ');

    useEffect(() => {
        if (ref && ref.current) {
            if (!ref.current.complete) {
                ref.current.onload = () => {
                    setIsLoading(false);
                };
            } else {
                setIsLoading(false);
            }
        }
    }, [ref]);

    return (
        <div className={className}>
            {isLoading && (
                <div className="Image-Loader">
                    <Loader />
                </div>
            )}
            <img
                style={{ opacity: isLoading ? 0 : 1 }}
                ref={ref}
                className={`Image--inner ${'object-fit-' + objectFit}`}
                src={image_src}
                alt={alt}
            />
        </div>
    );
};

export default BaseImage;
