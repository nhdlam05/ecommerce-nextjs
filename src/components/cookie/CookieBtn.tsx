import CookieImg from 'assets/img/cookie.svg';
import Button from 'atoms/Button/Button';
import Image from 'atoms/Image/Image';
import Title from 'atoms/Title/Title';
import { useLocalStorage, useTranslationWithContext } from 'hooks';
import { useEffect, useRef } from 'react';
import { COOKIE_ACCEPTED } from './constants';
import './CookieBtn.scss';

const CookieBtn = () => {
    const { translate } = useTranslationWithContext();
    const myBlock = useRef<HTMLDivElement>(null);
    const timeout = useRef<any>();
    const { setStorageKey } = useLocalStorage();

    const handleAccept = () => {
        setStorageKey(COOKIE_ACCEPTED, 'true');

        if (myBlock.current) myBlock.current.classList.remove('is-visible');
    };

    useEffect(() => {
        timeout.current = setTimeout(() => {
            if (myBlock.current) myBlock.current.classList.add('is-visible');
        }, 400);
        return () => clearTimeout(timeout.current);
    }, []);

    return (
        <div className="CookieBtn" ref={myBlock}>
            <div className="CookieBtn--inner">
                <div className="CookieBtn--item">
                    <Image src={CookieImg} alt="Aepsy-Cookie" />
                </div>
                <div className="CookieBtn--item">
                    <Title size="xxs">{translate('cookie.warning')}</Title>

                    <a href="https://aepsy.com/cookie-policy" target="_blank">
                        {translate('generic.learnMore')}
                    </a>
                </div>
            </div>

            <div>
                <Button
                    align="center"
                    variant="outlined"
                    size="s"
                    label={translate('generic.close')}
                    onClick={handleAccept}
                />
            </div>
        </div>
    );
};

export default CookieBtn;
