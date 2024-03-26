import Button from 'atoms/Button/Button';
import { DialogContent, DialogFooter, DialogFullHeader } from 'atoms/Dialog';
import Divider from 'atoms/Divider/Divider';
import {
    ChapterType,
    FunnelQuoteType,
    FunnelSearchSource,
    ProviderSearchPurpose,
} from 'generated/graphql';
import './FilterSelectionDetail.scss';
import Section from 'atoms/Section/Section';
import { FilterConfigType } from './FilterSelection';
import GenderFilter from './GenderFilter';
import QuoteTypesFilter from './QuoteTypesFilter';
import InsuranceCoverFilter from './InsuranceCoverFilter';
import AvailabilityFilter from './AvailabilityFilter';
import LanguagesFilter from './LanguagesFilter';
import TopicFilter from './TopicFilter';
import LocationFilter from './LocationFilter';
import { useQuery } from '@apollo/client';
import { useEffect, useState } from 'react';
import { COUNT_SEARCH_PROVIDER } from 'gql/provider';
import { useDebounce, useTranslationWithContext } from 'hooks';
import { first } from 'lodash';
import { generateSearchInputBySearchParams } from 'util/searchHelpers';
import { Device } from '@capacitor/device';
import { useQueryString } from 'use-route-as-state';
import SymptomsFilter from './SymptomsFilter';
import Text from 'atoms/Text/Text';
import ChapterTypeFilter from './ChapterTypeFilter';

interface Props {
    onClose: VoidFunction;
    searchValue: any;
    filterConfig: FilterConfigType;
    updateSearch: (input: any) => void;
    onClearSearchValue: VoidFunction;
    preferredQuoteType: FunnelQuoteType;
    searchSource: FunnelSearchSource;
}

const FilterSelectionDetail: React.FC<Props> = ({
    onClose,
    searchValue,
    filterConfig,
    updateSearch,
    onClearSearchValue,
    preferredQuoteType,
    searchSource,
}) => {
    const { translate } = useTranslationWithContext();
    const { refetch: executeFilterData } = useQuery(COUNT_SEARCH_PROVIDER, {
        skip: true,
    });

    const [params] = useQueryString();
    const [loading, setLoading] = useState(false);
    const [resultCount, setResultCount] = useState(0);
    const [searchParams, setSearchParams] = useState(searchValue);
    const debounceSearchParams = useDebounce(searchParams, 1000);

    const getFilterData = async (newSearch: any) => {
        try {
            setLoading(true);
            const { identifier: deviceId } = await Device.getId();
            const newInput = generateSearchInputBySearchParams({
                type: params?.type,
                newSearch,
                deviceId,
                preferredQuoteType,
                isDiagnosis: searchValue.isDiagnosis,
            });

            const res = await executeFilterData({
                input: {
                    ...newInput,
                    hasZsrNumber: params.hasZsrNumber,
                    searchPurpose: ProviderSearchPurpose.FilterCount,
                    searchSource,
                },
            });

            if (!res) return;

            const {
                data: {
                    searchProviders: { providers },
                },
            } = res;

            setResultCount(providers.providers.length);
            setLoading(false);
        } catch (e: any) {
            setLoading(false);
            console.log(e?.message);
        }
    };

    const onChange = (newData: any) => {
        setSearchParams({ ...searchParams, ...newData });
    };

    const onSubmit = () => {
        const {
            chapterType,
            languages,
            availability,
            disorders,
            influences,
            insuranceCoverTypes,
            providerAreas,
            quoteTypes,
            symptoms,
            locationType,
            gender,
        } = searchParams;
        updateSearch({
            chapterType,
            languages,
            availability,
            disorders,
            influences,
            insuranceCoverTypes,
            providerAreas,
            quoteTypes,
            symptoms,
            locationType,
            gender,
        });
    };

    useEffect(() => {
        getFilterData(debounceSearchParams);
    }, [debounceSearchParams]);

    return (
        <>
            <DialogFullHeader
                title={translate('filter.selection.title')}
                onCloseButtonClick={onClose}
            />
            <DialogContent hasFooter>
                <Section spacingTop="s" spacingBottom="xl">
                    {/* {filterConfig.chapterType && (
                        <Section spacingBottom="s">
                            <ChapterTypeFilter
                                defaultValue={searchValue.chapterType}
                                onChange={onChange}
                            />
                        </Section>
                    )} */}

                    {filterConfig.languages && (
                        <Section spacingBottom="s">
                            <LanguagesFilter
                                defaultValues={searchValue.languages}
                                onChange={onChange}
                            />
                        </Section>
                    )}

                    {filterConfig.gender && (
                        <Section spacingBottom="s">
                            <GenderFilter
                                defaultValue={searchValue.gender}
                                onChange={onChange}
                            />
                        </Section>
                    )}

                    {filterConfig.topic && (
                        <Section spacingBottom="s">
                            <TopicFilter
                                chapterType={searchParams?.chapterType}
                                isDiagnosis={searchValue.isDiagnosis}
                                quoteTypes={searchParams?.quoteTypes}
                                disorderValues={searchValue.disorders}
                                influenceValues={searchValue.influences}
                                symptomsValues={searchValue.symptoms}
                                onChange={onChange}
                            />
                        </Section>
                    )}

                    {filterConfig.symptoms && (
                        <Section spacingBottom="s">
                            <SymptomsFilter
                                defaultValues={searchValue.symptoms}
                                onChange={onChange}
                            />
                        </Section>
                    )}

                    {filterConfig.quoteTypes &&
                    searchParams.chapterType === ChapterType.Individual ? (
                        <Section spacingBottom="s">
                            <QuoteTypesFilter
                                defaultValue={
                                    first(searchValue.quoteTypes) || null
                                }
                                onChange={onChange}
                            />
                        </Section>
                    ) : (
                        <></>
                    )}
                    {filterConfig.insurances && (
                        <Section spacingBottom="s">
                            <InsuranceCoverFilter
                                defaultValues={
                                    first(searchValue.insuranceCoverTypes) ||
                                    null
                                }
                                showBaseInsuranceChoice={
                                    filterConfig.basicInsuranceCoverageChoice ||
                                    false
                                }
                                onChange={onChange}
                            />
                        </Section>
                    )}
                    {filterConfig.availability && (
                        <Section spacingBottom="s">
                            <AvailabilityFilter
                                defaultValue={searchValue.availability}
                                onChange={onChange}
                            />
                        </Section>
                    )}
                    {filterConfig.location && (
                        <div className="FilterBar--item">
                            <LocationFilter
                                defaultLocationType={searchValue.locationType}
                                defaultValues={searchValue.providerAreas}
                                onChange={onChange}
                            />
                        </div>
                    )}
                </Section>
            </DialogContent>
            <DialogFooter backgroundTransparent={false}>
                <Divider spacing="s" />
                <div className="FilterSelection--footerAction">
                    <Button
                        variant="inline"
                        label={translate('filter.selection.reset.all')}
                        onClick={onClearSearchValue}
                        classes="FilterSelection--resetCta"
                    />
                    <div className="FilterSelection--primaryCtaWrapper">
                        {resultCount === 0 && (
                            <div className="FilterSelection--noMatchText">
                                <Text size="xs" align="center">
                                    {translate(
                                        'filter.selection.no.exact.match'
                                    )}
                                </Text>
                            </div>
                        )}
                        <Button
                            label={
                                resultCount === 0
                                    ? translate(
                                          'filter.selection.show.zero.results'
                                      )
                                    : translate({
                                          key: 'filter.selection.show.results',
                                          context: {
                                              resultCount,
                                          },
                                      })
                            }
                            onClick={onSubmit}
                            isLoading={loading}
                        />
                    </div>
                </div>
            </DialogFooter>
        </>
    );
};
export default FilterSelectionDetail;
