import { useQuery } from '@apollo/client';
import Button from 'atoms/Button/Button';
import Loader from 'atoms/Loader/Loader';
import Section from 'atoms/Section/Section';
import { DiscoveryCard } from 'components/cards';
import { Journey } from 'generated/graphql';
import { GET_JOURNEYS } from 'gql/self-care';
import { useTranslationWithContext } from 'hooks';
import { useState } from 'react';

interface Props {
    initiallyVisibleItems?: number;
}

const JourneyList: React.FC<Props> = ({ initiallyVisibleItems = Infinity }) => {
    const [showAll, setShowAll] = useState(false);
    const { translate } = useTranslationWithContext();
    const { data: journeysData, loading: journeysLoading } =
        useQuery<{ journeys: Journey[] }>(GET_JOURNEYS);

    const { journeys } = journeysData || {};

    if (journeysLoading) return <Loader />;

    if (!journeys) return null;

    return (
        <>
            {journeys
                .slice(0, showAll ? journeys.length : initiallyVisibleItems)
                .map((journey) => (
                    <Section key={journey.id} spacingBottom="s">
                        <DiscoveryCard
                            path={`journeys/${journey.id}`}
                            name={journey.name}
                            picture={journey.picture}
                            description={journey.subtitle}
                        />
                    </Section>
                ))}

            {journeys.length > initiallyVisibleItems && (
                <Section spacing="s">
                    <Button
                        onClick={() => setShowAll(!showAll)}
                        variant="inline"
                        align="center"
                        label={
                            showAll
                                ? translate('generic.showLess')
                                : translate('generic.showMore')
                        }
                    />
                </Section>
            )}
        </>
    );
};

export default JourneyList;
