import Checkbox from 'atoms/Checkbox/Checkbox';
import Section from 'atoms/Section/Section';
import Text from 'atoms/Text/Text';
import { ChapterType, FunnelQuoteType } from 'generated/graphql';
import { useTranslationWithContext } from 'hooks';
import {
    UserDisorderKey,
    UserFunnelItem,
    UserInfluenceKey,
    allDisorders,
    allInfulences,
} from 'model/funnel';
import { ALL_SYMPTOMS } from 'model/funnel/symptoms';
import { useEffect, useMemo, useRef, useState } from 'react';
import Title from 'atoms/Title/Title';
import { Grid } from '@mui/material';
import Button from 'atoms/Button/Button';
import { logFirebaseEvent } from 'service/auth';
import {
    getDisHasNoSubByChapterType,
    getDisHasSubByChapterType,
    getInfByChapterType,
    getSubDisByChapterType,
} from 'pages/MatchPage/components/MatchingFunnel/funnelHelpers';
import { first, get, isEmpty } from 'lodash';

const checkDisabledByQuoteType = (item: any, quoteTypes: any): boolean => {
    if (quoteTypes.length === 2) return false;
    if (
        quoteTypes.includes(FunnelQuoteType.Coaching) &&
        item.forTherapy &&
        !item.forCoaching
    ) {
        return true;
    }
    if (
        quoteTypes.includes(FunnelQuoteType.Therapy) &&
        item.forCoaching &&
        !item.forTherapy
    ) {
        return true;
    }
    return false;
};

const disableByQuoteType = (
    list: UserFunnelItem<UserDisorderKey | UserInfluenceKey>[],
    quoteTypes: FunnelQuoteType[]
) => {
    return list.map((item: any) => {
        return {
            ...item,
            disabled: checkDisabledByQuoteType(item, quoteTypes),
        };
    });
};

interface Props {
    chapterType: ChapterType;
    isDiagnosis: boolean;
    quoteTypes: FunnelQuoteType[];
    disorderValues: string[];
    influenceValues: string[];
    symptomsValues: string[];
    onChange: (data: any) => void;
}

const TopicFilter: React.FC<Props> = ({
    chapterType,
    isDiagnosis,
    quoteTypes,
    disorderValues,
    influenceValues,
    symptomsValues,
    onChange,
}) => {
    const { translate } = useTranslationWithContext();
    const [disorders, setDisorders] = useState<string[]>(disorderValues);
    const [influences, setInfluences] = useState<string[]>(influenceValues);
    const [symptoms, setSymtoms] = useState<string[]>(symptomsValues);
    const [viewAll, setViewAll] = useState(false);

    const { influenceList, disorderList, subDisorderList, subDisorderTitle } =
        useMemo(() => {
            if (isDiagnosis) {
                return {
                    influenceList: [],
                    disorderList: [],
                    subDisorderList: [],
                    subDisorderTitle: '',
                };
            }

            const influenceList = getInfByChapterType(
                chapterType,
                allInfulences
            );
            const disorderList = getDisHasNoSubByChapterType(
                chapterType,
                allDisorders
            );

            if (chapterType === ChapterType.Individual) {
                return {
                    influenceList: disableByQuoteType(
                        influenceList,
                        quoteTypes
                    ),
                    disorderList: disableByQuoteType(disorderList, quoteTypes),
                    subDisorderList: [],
                    subDisorderTitle: '',
                };
            }

            const firstParentHasSubDisorder = first(
                getDisHasSubByChapterType(chapterType, allDisorders)
            );

            return {
                influenceList,
                disorderList,
                subDisorderList: getSubDisByChapterType(
                    chapterType,
                    allDisorders
                ),
                subDisorderTitle: firstParentHasSubDisorder
                    ? get(firstParentHasSubDisorder, 'label', '')
                    : '',
            };
        }, [chapterType, isDiagnosis, quoteTypes]);

    const handleDisorderChange = (e: any) => {
        const {
            target: { value, checked },
        } = e;

        const newDisorders = checked
            ? [...disorders, value]
            : [...disorders].filter((item: string) => item !== value);

        setDisorders(newDisorders);
        onChange({ disorders: newDisorders });
        logFirebaseEvent('disorder_filter_choice_clicked', {
            choices: newDisorders,
        });
    };

    const handleInfluenceChange = (e: any) => {
        const {
            target: { value, checked },
        } = e;

        const newInfluences = checked
            ? [...influences, value]
            : [...influences].filter((item: string) => item !== value);
        setInfluences(newInfluences);
        onChange({ influences: newInfluences });
        logFirebaseEvent('influences_filter_choice_clicked', {
            choices: newInfluences,
        });
    };

    const handleSymptomChange = (e: any) => {
        const {
            target: { value, checked },
        } = e;

        const newSymptoms = checked
            ? [...symptoms, value]
            : [...symptoms].filter((item: string) => item !== value);
        setSymtoms(newSymptoms);
        onChange({ symptoms: newSymptoms });
        logFirebaseEvent('symptoms_filter_choice_clicked', {
            choices: newSymptoms,
        });
    };

    const onToggleViewAll = () => setViewAll(!viewAll);

    const renderCount = () => {
        let count = 0;
        count += disorders.length > 0 ? disorders.length : 0;
        count += influences.length > 0 ? influences.length : 0;
        count += symptoms.length > 0 ? symptoms.length : 0;
        return count;
    };

    useEffect(() => {
        if (disorderValues) setDisorders(disorderValues);
        if (influenceValues) setInfluences(influenceValues);
        if (symptomsValues) setSymtoms(symptomsValues);
    }, [influenceValues, disorderValues, symptomsValues]);

    return (
        <>
            <div className="FilterSelectionDetail--title">
                <Title size="m">
                    {translate('provider.search.filter.topic.title')}{' '}
                    {`(${renderCount()})`}
                </Title>
            </div>
            <div className="FilterSelection--multiChoice-wrapper">
                {isDiagnosis ? (
                    <Section spacingBottom="s">
                        <Grid container>
                            {ALL_SYMPTOMS.map((item: any) => (
                                <Grid
                                    item
                                    xs={12}
                                    sm={12}
                                    md={6}
                                    lg={6}
                                    key={item.label}
                                >
                                    <Checkbox
                                        id={item.label}
                                        value={item.key}
                                        type="checkbox"
                                        variant="inline"
                                        align="left"
                                        name={item.label}
                                        checked={symptoms.includes(item.key)}
                                        onChange={handleSymptomChange}
                                    >
                                        {translate(item.label)}
                                    </Checkbox>
                                </Grid>
                            ))}
                        </Grid>
                    </Section>
                ) : (
                    <>
                        <Section>
                            <Section spacingBottom="xs">
                                <Text size="s">
                                    {translate(
                                        'provider.search.filter.topic.influence.title'
                                    )}
                                </Text>
                            </Section>
                            <Grid
                                container
                                className={`FilterSelection--toggle ${
                                    viewAll ? 'view-all' : ''
                                }`}
                            >
                                {influenceList.map(
                                    (
                                        item: UserFunnelItem<UserInfluenceKey>
                                    ) => (
                                        <Grid
                                            item
                                            xs={12}
                                            sm={12}
                                            md={6}
                                            lg={6}
                                            key={item.label as string}
                                        >
                                            <Checkbox
                                                id={item.label}
                                                value={item.key}
                                                type="checkbox"
                                                variant="inline"
                                                align="left"
                                                name={item.label}
                                                checked={influences.includes(
                                                    item.key
                                                )}
                                                onChange={handleInfluenceChange}
                                            >
                                                {translate(item.label)}
                                            </Checkbox>
                                        </Grid>
                                    )
                                )}
                            </Grid>
                        </Section>

                        {viewAll && (
                            <>
                                <Section spacingTop="s">
                                    <Section spacingBottom="xs">
                                        <Text size="s">
                                            {translate(
                                                'provider.search.filter.topic.disorder.title'
                                            )}
                                        </Text>
                                    </Section>
                                    <Grid container>
                                        {disorderList.map(
                                            (
                                                item: UserFunnelItem<UserDisorderKey>
                                            ) => (
                                                <Grid
                                                    item
                                                    xs={12}
                                                    sm={12}
                                                    md={6}
                                                    lg={6}
                                                    key={item.label as string}
                                                >
                                                    <Checkbox
                                                        id={item.label}
                                                        value={item.key}
                                                        type="checkbox"
                                                        variant="inline"
                                                        align="left"
                                                        name={item.label}
                                                        checked={disorders.includes(
                                                            item.key
                                                        )}
                                                        onChange={
                                                            handleDisorderChange
                                                        }
                                                        disabled={item.disabled}
                                                    >
                                                        {translate(item.label)}
                                                    </Checkbox>
                                                </Grid>
                                            )
                                        )}
                                    </Grid>
                                </Section>
                                {!isEmpty(subDisorderList) && (
                                    <Section spacingTop="s">
                                        <Section spacingBottom="xs">
                                            <Text size="s">
                                                {translate(subDisorderTitle)}
                                            </Text>
                                        </Section>
                                        <Grid container>
                                            {subDisorderList.map(
                                                (
                                                    item: UserFunnelItem<UserDisorderKey>
                                                ) => (
                                                    <Grid
                                                        item
                                                        xs={12}
                                                        sm={12}
                                                        md={6}
                                                        lg={6}
                                                        key={
                                                            item.label as string
                                                        }
                                                    >
                                                        <Checkbox
                                                            id={item.label}
                                                            value={item.key}
                                                            type="checkbox"
                                                            variant="inline"
                                                            align="left"
                                                            name={item.label}
                                                            checked={disorders.includes(
                                                                item.key
                                                            )}
                                                            onChange={
                                                                handleDisorderChange
                                                            }
                                                            disabled={
                                                                item.disabled
                                                            }
                                                        >
                                                            {translate(
                                                                item.label
                                                            )}
                                                        </Checkbox>
                                                    </Grid>
                                                )
                                            )}
                                        </Grid>
                                    </Section>
                                )}
                            </>
                        )}
                        <Section spacingBottom="s">
                            <Button
                                variant="inline"
                                label={translate(
                                    viewAll
                                        ? 'generic.showLess'
                                        : 'generic.showMore'
                                )}
                                onClick={onToggleViewAll}
                            />
                        </Section>
                    </>
                )}
            </div>
        </>
    );
};

export default TopicFilter;
