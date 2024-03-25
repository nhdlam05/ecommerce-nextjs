import {
    AvailabilityData,
    SUPPORTED_AVAILABILITY_DATA,
} from 'constants/common';
import {
    FunnelQuoteType,
    FunnelSearchSource,
    ProviderSearchPurpose,
} from 'generated/graphql';
import { omit } from 'lodash';
import {
    ALL_DISORDERS,
    ALL_INFLUENCES,
    COACH_DISORDERS,
    THERAPY_DISORDERS,
    mappingSymptom,
} from 'model/funnel';
import { ALL_SYMPTOMS } from 'model/funnel/symptoms';

const getDisordersListByQuoteType = (quoteTypes: FunnelQuoteType[]) => {
    if (quoteTypes.length === 2) return ALL_DISORDERS;
    if (quoteTypes.includes(FunnelQuoteType.Coaching)) return COACH_DISORDERS;
    return THERAPY_DISORDERS;
};

const getDisordersListByScore = (total: number) => {
    switch (true) {
        case total < 5:
            return COACH_DISORDERS;
        case total >= 5 && total <= 8:
            return ALL_DISORDERS;
        case total > 8:
            return THERAPY_DISORDERS;
    }
};

const getDisordersList = ({
    painFrequencyScore,
    painIntensityScore,
    quoteTypes,
    type,
}: {
    painFrequencyScore: number | null;
    painIntensityScore: number | null;
    quoteTypes: FunnelQuoteType[];
    type: FunnelQuoteType[] | null;
}) => {
    if (painFrequencyScore && painIntensityScore) {
        return getDisordersListByScore(painFrequencyScore + painIntensityScore);
    }
    if (quoteTypes.length) {
        return getDisordersListByQuoteType(quoteTypes);
    }
    if (type) {
        return getDisordersListByQuoteType(type);
    }
    return null;
};

export const generateSearchInputBySearchParams = ({
    type,
    newSearch,
    deviceId,
    preferredQuoteType,
    isDiagnosis,
}: {
    type: any;
    newSearch: any;
    deviceId: string;
    preferredQuoteType: FunnelQuoteType;
    isDiagnosis: boolean;
}) => {
    const {
        availability,
        influences,
        disorders,
        symptoms,
        painFrequencyScore,
        painIntensityScore,
        quoteTypes,
        locationType,
    } = newSearch;

    const foundAvailability = availability
        ? SUPPORTED_AVAILABILITY_DATA.find(
              (item: AvailabilityData) => item.key === availability
          )
        : null;
    const availabilityInput = foundAvailability
        ? {
              availability: {
                  endDate: foundAvailability.value.format('YYYY-MM-DD'),
              },
          }
        : {};
    const input = {
        ...omit(newSearch, ['availability', 'isDiagnosis']),
        ...availabilityInput,
        influences: mappingSymptom(ALL_INFLUENCES, influences),
        disorders: mappingSymptom(
            getDisordersList({
                painFrequencyScore,
                painIntensityScore,
                quoteTypes,
                type: type
                    ? type
                          .split(',')
                          .map(
                              (item: string) =>
                                  item.toUpperCase() as FunnelQuoteType
                          )
                    : [preferredQuoteType],
            }),
            disorders
        ),
        symptoms: isDiagnosis
            ? mappingSymptom(ALL_SYMPTOMS, symptoms)
            : symptoms,
        deviceId,
        searchSource: FunnelSearchSource.SelectPage,
        searchPurpose: ProviderSearchPurpose.ProviderResult,
        rawInfluences: influences,
        rawDisorders: disorders,
        rawSymptoms: symptoms,
    };
    return input;
};
