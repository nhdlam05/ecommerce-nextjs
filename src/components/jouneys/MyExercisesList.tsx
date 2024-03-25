import { useQuery } from '@apollo/client';
import Button from 'atoms/Button/Button';
import Loader from 'atoms/Loader/Loader';
import Section from 'atoms/Section/Section';
import { ContentPiece } from 'generated/graphql';
import { MY_EXERCISES } from 'gql/self-care';
import { useTranslationWithContext } from 'hooks';
import { useState } from 'react';
import JourneyItemExtended from './JourneyItemExtended';

const LOAD_MORE_STEP = 3;
const PAGINATION_OPTIONS = {
    first: 3,
    idNotIn: [],
};

const MyExercisesList: React.FC = () => {
    const [hasMoreItems, setHasMoreItems] = useState(true);
    const { translate } = useTranslationWithContext();
    const { data, loading, fetchMore } = useQuery<{
        myExerciseContentPieces: ContentPiece[];
    }>(MY_EXERCISES, {
        variables: { input: PAGINATION_OPTIONS },
        fetchPolicy: 'cache-and-network',
        nextFetchPolicy: 'cache-first',
    });

    const exercises = data?.myExerciseContentPieces;

    if (loading) return <Loader />;

    if (!exercises) return null;

    async function loadMore() {
        await fetchMore({
            variables: {
                input: {
                    first: LOAD_MORE_STEP,
                    idNotIn: exercises?.map((item) => item.id) || [],
                },
            },
            updateQuery: (prev: any, { fetchMoreResult }) => {
                if (!fetchMoreResult) {
                    setHasMoreItems(false);
                    return prev;
                }

                const fetchedItems = fetchMoreResult.myExerciseContentPieces;

                if (fetchedItems.length < LOAD_MORE_STEP) {
                    setHasMoreItems(false);
                }

                return {
                    myExerciseContentPieces:
                        prev.myExerciseContentPieces.concat(fetchedItems),
                };
            },
        });
    }

    return (
        <>
            {exercises.map((item) => {
                return <JourneyItemExtended key={item.id} item={item} />;
            })}

            {hasMoreItems && (
                <Section spacing="s">
                    <Button
                        onClick={() => loadMore()}
                        variant="inline"
                        align="center"
                        label={translate('generic.showMore')}
                    />
                </Section>
            )}
        </>
    );
};

export default MyExercisesList;
