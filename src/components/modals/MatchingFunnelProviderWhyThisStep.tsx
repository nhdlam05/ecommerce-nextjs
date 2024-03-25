import Loader from 'atoms/Loader/Loader';
import MarkdownText from 'atoms/MarkdownText';
import { MarkdownContentKey } from 'constants/common';
import { useFetchMarkdownData } from 'hooks';
import React from 'react';

const MatchingFunnelProviderWhyThisStep: React.FC = () => {
    const { content } = useFetchMarkdownData({
        key: MarkdownContentKey.MatchingFunnelProviderWhyThisStep,
    });

    return content ? <MarkdownText content={content} /> : <Loader />;
};

export default MatchingFunnelProviderWhyThisStep;
