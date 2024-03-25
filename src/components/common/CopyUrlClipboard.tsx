import Button from 'atoms/Button/Button';
import Title from 'atoms/Title/Title';
import { Maybe, Scalars } from 'generated/graphql';
import { useToast, useTranslationWithContext } from 'hooks';
import { Optional } from 'model/common';
import React, { useRef } from 'react';
import { IoCopyOutline } from 'react-icons/io5';
import './CopyUrlClipboard.scss';

interface Props {
    url?: Maybe<Scalars['String']>;
    onCopy?: () => void;
    successMessage?: Optional<string>;
}

const CopyUrlClipboard: React.FC<Props> = ({ url, onCopy, successMessage }) => {
    const inputRef = useRef<HTMLInputElement>(null);
    const textRef = useRef<HTMLDivElement>(null);
    const { showToast } = useToast();
    const { translate } = useTranslationWithContext();

    const handleCopy = () => {
        if (
            textRef &&
            textRef.current &&
            inputRef &&
            inputRef.current &&
            !!document
        ) {
            inputRef.current.inputMode = 'none';
            inputRef.current.value = textRef.current.innerText;
            inputRef.current.select();
            document.execCommand('copy');
        }

        if (onCopy) {
            onCopy();
        }

        showToast({
            message: successMessage || translate('generic.link.copied'),
            position: 'bottom',
        });
    };

    return (
        <div className="CopyUrlClipboard">
            <div className="CopyUrlClipboard--inner">
                <div
                    className="CopyUrlClipboard--field"
                    ref={textRef}
                    onClick={handleCopy}
                >
                    <Title size="m" theme="soft">
                        {url}
                    </Title>
                </div>

                <div className="CopyUrlClipboard--button">
                    <Button
                        align="center"
                        startIcon={<IoCopyOutline />}
                        onClick={handleCopy}
                    />
                </div>
            </div>

            <input ref={inputRef} className="CopyUrlClipboard--input" />
        </div>
    );
};

export default CopyUrlClipboard;
