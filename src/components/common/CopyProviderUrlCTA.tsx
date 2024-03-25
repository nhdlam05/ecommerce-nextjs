import Button from 'atoms/Button/Button';
import { FunnelSearchSource } from 'generated/graphql';
import { useToast, useTranslationWithContext } from 'hooks';
import { Optional } from 'model/common';
import { SOURCE_QUERY_PARAM } from 'model/funnel';
import React, { useRef } from 'react';
import { BsLink45Deg } from 'react-icons/bs';
import './CopyProviderUrlCTA.scss';

interface Props {
    slug: string;
    source?: Optional<string>;
    searchId?: Optional<string>;
}

const CopyProviderUrlCTA: React.FC<Props> = ({ slug, source, searchId }) => {
    const inputRef = useRef<HTMLInputElement>(null);

    const { showToast } = useToast();
    const { translate } = useTranslationWithContext();

    const handleCopy = () => {
        if (inputRef && inputRef.current && !!document) {
            inputRef.current.inputMode = 'none';

            inputRef.current.select();
            document.execCommand('copy');
        }
        showToast({
            message: translate('generic.link.copied'),
            position: 'bottom',
        });
    };

    const getProviderLink = () => {
        let url = `${window.location.origin}/t/${slug}?${SOURCE_QUERY_PARAM}=${FunnelSearchSource.ProviderBrowsePage}`;

        if (source) {
            url = url + `&apy_src=${source}`;
        }

        if (searchId) {
            url = url + `&searchId=${searchId}`;
        }
        return url;
    };

    return (
        <div className="CopyProviderUrlCTA">
            <Button
                theme="ghosted"
                label={translate('provider.search.copy.link')}
                align="center"
                size="s"
                icon={<BsLink45Deg />}
                onClick={handleCopy}
            />

            <input
                ref={inputRef}
                className="CopyProviderUrlCTA--input"
                value={getProviderLink()}
                readOnly
            />
        </div>
    );
};
export default CopyProviderUrlCTA;
