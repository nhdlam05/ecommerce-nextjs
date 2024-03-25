import Text from 'atoms/Text/Text';
import { useTranslationWithContext } from 'hooks';
import { useState } from 'react';
import { logFirebaseEvent } from 'service/auth';
import './TruncateText.scss';

TruncateText.defaultProps = {
    char: 60,
    align: 'left',
    size: 's',
    moreLabel: 'generic.showMore',
    lessLabel: 'generic.showLess',
};

export default function TruncateText(props) {
    const { translate } = useTranslationWithContext();
    const [aboutOpen, setAboutOpen] = useState(false);

    function truncate(str) {
        return str.length > props.char
            ? str.substring(0, props.char - 3) + '...'
            : str;
    }

    function handleToggle() {
        if (!aboutOpen) {
            logFirebaseEvent('more_text_toggle', {
                text_content: props.children,
            });
        }

        setAboutOpen(!aboutOpen);
    }

    return (
        <div className="TruncateText" onClick={() => handleToggle()}>
            <Text tag="div" align={props.align} size={props.size}>
                {aboutOpen ? props.children : truncate(props.children)}{' '}
                <span className="is-link" onClick={() => handleToggle()}>
                    {aboutOpen
                        ? translate(props.lessLabel)
                        : translate(props.moreLabel)}
                </span>
            </Text>
        </div>
    );
}
