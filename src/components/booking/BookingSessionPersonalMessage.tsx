import Button from 'atoms/Button/Button';
import Checkbox from 'atoms/Checkbox/Checkbox';
import Divider from 'atoms/Divider/Divider';
import Section from 'atoms/Section/Section';
import Text from 'atoms/Text/Text';
import Textarea from 'atoms/Textarea/Textarea';
import { FormContainer } from 'components/form';
import {
    ChapterType,
    FunnelQuoteType,
    Provider,
    ProviderChapterStatus,
} from 'generated/graphql';
import {
    useBookingFunnel,
    usePlatform,
    useTracking,
    useTranslationWithContext,
} from 'hooks';
import { groupBy, isEmpty, take } from 'lodash';
import {
    allDisorders,
    allInfulences,
    FUNNEL_QUOTE_TYPE_QUERY_PARAM,
    mappingSymptom,
} from 'model/funnel';
import { ALL_SYMPTOMS } from 'model/funnel/symptoms';
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { logFirebaseEvent } from 'service/auth';
import { useQueryString, useQueryStringKey } from 'use-route-as-state';
import { Bagde, getNumberOfBadgesShouldBeRendered } from 'util/common';
import * as yup from 'yup';
import BookingSessionActionFooter from './BookingSessionActionFooter';
import {
    filterDisByQuoteType,
    getDisByChapterType,
    getInfByChapterType,
    getSubDisByChapterType,
} from 'pages/MatchPage/components/MatchingFunnel/funnelHelpers';
import { CHAPTER_TYPE_ORDER } from 'constants/chapter';

interface Props {
    provider: Provider;
    chapterType: ChapterType;
    showSymptomsChoices?: boolean;
    showPersonalNote?: boolean;
    personalNote?: string | null;
    handlePersonalNoteChange?: (value: string) => void;
    selectedSymptoms?: string[];
    handleSymptomsChosen?: (selected: string[]) => void;
    onNextButtonClick: (data: PersonalMessageFormData) => void;
    onPrivacyClick?: VoidFunction;
    personalMessagePlaceholder?: string;
    buttonHelperText?: string;
    required?: boolean;
    setChapterType: (chapterType: ChapterType) => void;
}

export interface PersonalMessageFormData {
    personalNote?: string | undefined;
}

const BookingSessionPersonalMessage: React.FC<Props> = ({
    provider,
    chapterType,
    showSymptomsChoices = true,
    handleSymptomsChosen,
    personalNote,
    showPersonalNote = true,
    handlePersonalNoteChange,
    selectedSymptoms,
    onPrivacyClick,
    onNextButtonClick,
    personalMessagePlaceholder,
    buttonHelperText,
    required = true,
    setChapterType,
}) => {
    const [params] = useQueryString();
    const firstTime = useRef(true);
    const topListAlreadySet = useRef(false);
    const [funnelQuoteTypeQueryParam] = useQueryStringKey(
        FUNNEL_QUOTE_TYPE_QUERY_PARAM
    );
    const [isDiagnosis] = useQueryStringKey('isDiagnosis');
    const chapterTypes =
        provider?.chapterInfo?.applicationStates?.filter(
            ({ applicationStatus }) =>
                applicationStatus === ProviderChapterStatus.Verified
        ) || [];
    const sortedChapterTypes = chapterTypes.sort(
        (a, b) =>
            CHAPTER_TYPE_ORDER[a.chapterType] -
            CHAPTER_TYPE_ORDER[b.chapterType]
    );
    const quoteType = funnelQuoteTypeQueryParam
        ? ((
              funnelQuoteTypeQueryParam as 'coaching' | 'therapy'
          ).toUpperCase() as FunnelQuoteType)
        : FunnelQuoteType.Therapy;

    const symptomsList = useMemo(() => {
        if (Number(isDiagnosis)) {
            return ALL_SYMPTOMS.filter(({ chapterTypes }) =>
                chapterTypes.includes(chapterType)
            );
        }

        const influenceList = getInfByChapterType(chapterType, allInfulences);
        const disorderList = getDisByChapterType(chapterType, allDisorders);

        const subDisorderList = getSubDisByChapterType(
            chapterType,
            allDisorders
        );

        if (chapterType === ChapterType.Individual) {
            return [
                ...influenceList,
                ...filterDisByQuoteType(disorderList, [quoteType]),
                ...subDisorderList,
            ];
        }

        return [...influenceList, ...disorderList, ...subDisorderList];
    }, [chapterType, quoteType, isDiagnosis]);

    const expertisesChoosen = useMemo(() => {
        const { influences, disorders, symptoms } = params;
        return mappingSymptom(symptomsList, [
            ...(influences ? influences.split(',') : []),
            ...(disorders ? disorders.split(',') : []),
            ...(symptoms ? symptoms.split(',') : []),
        ]);
    }, [symptomsList, params]);

    const { isDesktop } = usePlatform();
    const [showMore, setShowMore] = useState(false);

    const [topList, setTopList] = useState<any>([]);
    const [list, setList] = useState<any>([]);

    const sortedSymptomsList = useMemo(() => {
        const sortedList = symptomsList
            ? [...symptomsList]?.sort((item: any) =>
                  topList.includes(item.label) ? -1 : 1
              )
            : [];
        return sortedList;
    }, [topList, symptomsList]);

    const numberOfBadgesShouldBeRendered = useMemo(() => {
        if (!sortedSymptomsList) return 0;
        return getNumberOfBadgesShouldBeRendered(
            sortedSymptomsList as Bagde[],
            {
                perfectViewLine: 3,
                charPerLine: isDesktop ? 60 : 20,
                longChars: 30,
            }
        );
    }, [sortedSymptomsList, isDesktop]);

    const className = ['BookingSessionPersonalMessage']
        .join(' ')
        .replace(/\s{2,}/g, ' ');

    const { translate } = useTranslationWithContext();

    const personalMessageSchema: yup.SchemaOf<PersonalMessageFormData> =
        useMemo(
            () =>
                yup.object().shape({
                    personalNote: required
                        ? yup
                              .string()
                              .trim()
                              .nullable()
                              .required(
                                  translate({
                                      key: 'error.field.is.required',
                                      context: {
                                          fieldName: translate(
                                              'generic.personal.message'
                                          ),
                                      },
                                  })
                              )
                        : yup.mixed().nullable().notRequired(),
                }),
            [translate, required]
        );

    const handleCheckbox = (e: any) => {
        if (!symptomsList || !handleSymptomsChosen || !selectedSymptoms) {
            return;
        }

        logFirebaseEvent(
            e.target.checked
                ? 'booking_funnel_personal_message_sympton_chosen'
                : 'booking_funnel_personal_message_sympton_unchosen',
            {
                symptom: e.target.value,
            }
        );

        const selectedList = e.target.checked
            ? [...selectedSymptoms, e.target.value]
            : selectedSymptoms.filter((s) => s !== e.target.value);

        handleSymptomsChosen(selectedList);
    };

    const onChapterTypeChanged = (e: any) => {
        setChapterType(e.target.value);
    };

    const handleSubmit = (formData: PersonalMessageFormData) => {
        if (
            handleSymptomsChosen &&
            selectedSymptoms &&
            !isEmpty(selectedSymptoms)
        ) {
            const groupByLabel = groupBy(list, 'label');
            handleSymptomsChosen(
                selectedSymptoms.filter((label) => groupByLabel[label])
            );
        }
        if (handlePersonalNoteChange) {
            handlePersonalNoteChange(formData.personalNote || '');
        }

        onNextButtonClick(formData);
    };

    function renderSymptomsList() {
        return (
            <>
                {list?.map((element: any, index: number) => (
                    <Checkbox
                        key={element.label + ' ' + index}
                        id={'id_' + element.label}
                        value={element.label}
                        type="checkbox"
                        name="BookingSessionPersonalMessage_symptoms"
                        size={'s'}
                        onChange={handleCheckbox}
                        checked={selectedSymptoms?.includes(element.label)}
                    >
                        {translate(element.label)}
                    </Checkbox>
                ))}

                <Button
                    size="xs"
                    label={
                        showMore
                            ? translate('generic.less')
                            : translate('generic.show.all')
                    }
                    variant="outlined"
                    onClick={toggleShowMore}
                />
            </>
        );
    }

    const toggleShowMore = () => {
        if (showMore) {
            setList(take(sortedSymptomsList, numberOfBadgesShouldBeRendered));
            setShowMore(false);
        } else {
            setList(sortedSymptomsList);
            setShowMore(true);
        }
    };

    const renderChapterList = () => {
        if (sortedChapterTypes.length === 1) return <></>;
        return (
            <Section spacingBottom="s">
                <Section spacingBottom="xs">
                    <Text size="s">
                        {translate('booking.funnel.personal.chapter.title')}
                    </Text>
                </Section>

                <div className="g_text_left">
                    {sortedChapterTypes.map((element: any, index: number) => (
                        <Checkbox
                            key={element.chapterType + ' ' + index}
                            id={'id_' + element.chapterType}
                            value={element.chapterType}
                            type="checkbox"
                            name="BookingSessionPersonalMessage_chapters"
                            size="s"
                            onChange={onChapterTypeChanged}
                            checked={chapterType === element.chapterType}
                        >
                            {translate(
                                `chapter.type.${element.chapterType}`.toLowerCase()
                            )}
                        </Checkbox>
                    ))}
                </div>
            </Section>
        );
    };

    function renderPersonalNote() {
        return (
            <>
                <FormContainer
                    inputs={[
                        {
                            name: 'personalNote',
                            ele: (props: any) => (
                                <Textarea
                                    {...props}
                                    maxlength="500"
                                    placeholder={personalMessagePlaceholder}
                                    rows="6"
                                />
                            ),
                            col: 12,
                        },
                    ]}
                    schema={personalMessageSchema}
                    onSubmit={handleSubmit}
                    formOption={{
                        defaultValues: {
                            personalNote,
                        },
                    }}
                    actionButton={(props: any) => (
                        <BookingSessionActionFooter
                            {...props}
                            onMainActionClick={() => {}}
                            onPrivacyClick={onPrivacyClick}
                            type="submit"
                        />
                    )}
                />
                {buttonHelperText && (
                    <Text size="xs" align="center">
                        {buttonHelperText}
                    </Text>
                )}
            </>
        );
    }

    // in case param query ?chapterType=COUPLE/FAMILY/INVALID_VALUE but provider dont support them, so set chapter type = INDIVIDUAL
    useEffect(() => {
        const groupByChapterType = groupBy(chapterTypes, 'chapterType');
        const notFoundChapterTypeData = !groupByChapterType[chapterType];

        if (
            notFoundChapterTypeData &&
            groupByChapterType[ChapterType.Individual]
        ) {
            setChapterType(ChapterType.Individual);
        }
    }, []);

    useEffect(() => {
        // if there is expertisesChoosen
        if (
            handleSymptomsChosen &&
            isEmpty(topList) &&
            !isEmpty(expertisesChoosen) &&
            firstTime.current
        ) {
            firstTime.current = false;

            const res = symptomsList
                .filter((item: any) =>
                    expertisesChoosen.includes(item.value.join(','))
                )
                .map((item: any) => item.label);

            if (res.length) {
                setTopList(res);
                handleSymptomsChosen(res);
            } else {
                setList(take(symptomsList, numberOfBadgesShouldBeRendered));
            }
        }
    }, [expertisesChoosen, symptomsList, chapterType]);

    useEffect(() => {
        // if there is no expertisesChoosen
        if (isEmpty(expertisesChoosen) && isEmpty(list)) {
            setList(take(symptomsList, numberOfBadgesShouldBeRendered));
        }
    }, [expertisesChoosen, list, symptomsList, chapterType]);

    useEffect(() => {
        // waiting for sorting and get numberOfBadgesShouldBeRendered done
        if (
            !isEmpty(topList) &&
            !isEmpty(sortedSymptomsList) &&
            !topListAlreadySet.current
        ) {
            topListAlreadySet.current = true;
            setList(take(sortedSymptomsList, numberOfBadgesShouldBeRendered));
        }
    }, [
        numberOfBadgesShouldBeRendered,
        sortedSymptomsList,
        topList,
        list,
        chapterType,
    ]);

    useEffect(() => {
        const newList = take(
            sortedSymptomsList,
            numberOfBadgesShouldBeRendered
        );
        setList(newList);
        setShowMore(false);
    }, [sortedSymptomsList, numberOfBadgesShouldBeRendered, chapterType]);

    return (
        <div className={className}>
            {renderChapterList()}

            {sortedSymptomsList && showSymptomsChoices && (
                <div className="g_text_left">
                    <Section spacingBottom="xs">
                        <Text size="s">
                            {translate(
                                'booking.funnel.personal.symptoms.title'
                            )}
                        </Text>
                    </Section>
                    {renderSymptomsList()}
                </div>
            )}

            <Divider spacing="xxxs" invisible />

            {showPersonalNote && renderPersonalNote()}
        </div>
    );
};

export default BookingSessionPersonalMessage;
