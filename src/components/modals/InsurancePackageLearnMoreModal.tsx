import Divider from 'atoms/Divider/Divider';
import Loader from 'atoms/Loader/Loader';
import MarkdownText from 'atoms/MarkdownText';
import { MarkdownContentKey } from 'constants/common';
import { useFetchMarkdownData } from 'hooks';

const InsurancePackageLearnMoreModal = () => {
    const { content } = useFetchMarkdownData({
        key: MarkdownContentKey.InsurancePackageLearnMore,
    });

    return (
        <>
            <Divider spacing="xs" invisible />
            {content ? <MarkdownText content={content} /> : <Loader />}
        </>
    );
};
export default InsurancePackageLearnMoreModal;
