import Button from 'atoms/Button/Button';
import Module from 'atoms/Module/Module';
import Section from 'atoms/Section/Section';
import Text from 'atoms/Text/Text';
import Title from 'atoms/Title/Title';
import { useTranslationWithContext } from 'hooks';
import { useEffect } from 'react';
import { logFirebaseEvent } from 'service/auth';
import NewLetterForm from './NewLetterForm';
import './NoSearchResult.scss';

interface Props {
    clearFilter: VoidFunction;
    onRequest: (formData: {
        email: string;
        personalNote?: string;
    }) => Promise<void>;
    requestId: string | null;
}

const NoSearchResult: React.FC<Props> = ({
    clearFilter,
    requestId,
    onRequest,
}) => {
    const { translate } = useTranslationWithContext();

    useEffect(() => {
        logFirebaseEvent('provider_select_no_result_search', {
            quoteId: requestId,
        });
    }, []);

    return (
        <Section container="tiny">
            <Module>
                <div className="NoSearchResult">
                    <Title size="l" noMargin>
                        {translate('no.search.result.title')}
                    </Title>
                    <Text size="s">
                        {translate('no.search.result.subtitle')}
                    </Text>
                    <Section spacingTop="xs">
                        <Button
                            label={translate(
                                'no.search.result.remove.all.filter'
                            )}
                            onClick={clearFilter}
                            isMobileFullsize
                        />
                    </Section>
                    {/* <Section spacingTop="m">
                        <NewLetterForm
                            onRequest={onRequest}
                            requestId={requestId}
                        />
                    </Section> */}
                </div>
            </Module>
        </Section>
    );
};

export default NoSearchResult;
