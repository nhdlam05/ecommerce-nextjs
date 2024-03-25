import { useQuery } from '@apollo/client';
import Checkbox from 'atoms/Checkbox/Checkbox';
import { DiscountAmount } from 'components/common';
import { getDurationFromDurationType } from 'constants/common';
import {
    ChapterType,
    FunnelQuoteType,
    Maybe,
    ProviderPricing,
} from 'generated/graphql';
import { GET_PROVIDER_CHAPTER_PRICING } from 'gql/provider';
import React from 'react';

interface Props {
    handleSessionDurationChosen: (session: SessionDuration) => void;
    format?: 'h' | 'v';
    size?: 's' | 'm' | 'l' | 'xl';
    providerId: string;
    quoteType?: FunnelQuoteType;
    chapterType?: Maybe<ChapterType>;
}

export interface SessionDuration {
    value: number;
    label: string;
    price: number;
}

const BookingSessionLength: React.FC<Props> = ({
    handleSessionDurationChosen,
    format = 'h',
    size = 'm',
    providerId,
    quoteType,
    chapterType,
}) => {
    const className = ['gf gf_h_center', format === 'v' ? 'gf_v' : 'gf_gap_s']
        .join(' ')
        .replace(/\s{2,}/g, ' ');

    const defaultChapterType = chapterType || ChapterType.Individual;

    const { data: providerChapterPricingRes } = useQuery<{
        providerChapterPricing: ProviderPricing[];
    }>(GET_PROVIDER_CHAPTER_PRICING, {
        variables: {
            input: {
                providerId,
                quoteTypes:
                    defaultChapterType === ChapterType.Individual
                        ? [quoteType || FunnelQuoteType.Coaching]
                        : [],
                chapterTypes: [defaultChapterType],
            },
        },
    });

    function handleRadio(el: SessionDuration) {
        handleSessionDurationChosen(el);
    }

    if (!providerChapterPricingRes) return <></>;

    const { providerChapterPricing } = providerChapterPricingRes;

    const sessionDurationData: SessionDuration[] = providerChapterPricing.map(
        (item: ProviderPricing) => {
            const duration = getDurationFromDurationType(item.durationType);
            return {
                value: duration,
                price: item.price,
                label: `${duration} min`,
            };
        }
    );

    return (
        <div className={className}>
            {sessionDurationData.map((element, index) => {
                return (
                    <div key={index} className="gfItem_stretch">
                        <Checkbox
                            fullsize
                            id={element.value}
                            value={element.value}
                            type="radio"
                            name="session_length"
                            size={size}
                            align="center"
                            onClick={() => handleRadio(element)}
                        >
                            <strong>{element.label}</strong>
                            <span className="gf gf_h_center">
                                <DiscountAmount
                                    bookingPrice={element.price}
                                    wrapperEle={(props: any) => (
                                        <em
                                            className={
                                                props.className + ' is-block'
                                            }
                                        >
                                            {props.children}
                                        </em>
                                    )}
                                />
                            </span>
                        </Checkbox>
                    </div>
                );
            })}
        </div>
    );
};

export default BookingSessionLength;
