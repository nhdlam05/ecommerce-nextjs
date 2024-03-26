import Loader from 'atoms/Loader/Loader';
import MarkdownText from 'atoms/MarkdownText';
import { MarkdownContentKey } from 'constants/common';
import { useFetchMarkdownData } from 'hooks';
import React from 'react';

const WhatIsCoachingInformation: React.FC = () => {
    const { content } = useFetchMarkdownData({
        key: MarkdownContentKey.WhatIsCoachingInformation,
    });

    return content ? <MarkdownText content={content} /> : <Loader />;
};

export default WhatIsCoachingInformation;
