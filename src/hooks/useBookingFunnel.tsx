import { FunnelQuoteType } from 'generated/graphql';
import {
    ALL_INFLUENCES,
    COACH_DISORDERS,
    mappingSymptom,
    THERAPY_DISORDERS,
} from 'model/funnel';
import { ALL_SYMPTOMS } from 'model/funnel/symptoms';
import { useEffect, useState } from 'react';
import { useQueryString } from 'use-route-as-state';

export const useBookingFunnel = ({
    quoteType,
}: {
    quoteType: FunnelQuoteType;
}) => {
    const [params] = useQueryString();

    const [expertisesChoosen, setExpertisesChoosen] = useState<any>([]);

    useEffect(() => {
        const { influences, disorders, symptoms } = params;
        const allInfulences = influences
            ? mappingSymptom(ALL_INFLUENCES, influences.split(','))
            : [];
        const allDisorders = disorders
            ? mappingSymptom(
                  quoteType === FunnelQuoteType.Coaching
                      ? COACH_DISORDERS
                      : THERAPY_DISORDERS,
                  disorders.split(',')
              )
            : [];
        const allSymptoms = symptoms
            ? mappingSymptom(ALL_SYMPTOMS, symptoms.split(','))
            : [];

        setExpertisesChoosen([
            ...allInfulences,
            ...allDisorders,
            ...allSymptoms,
        ]);
    }, [params]);

    return { expertisesChoosen };
};
