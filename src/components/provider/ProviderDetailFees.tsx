import Divider from 'atoms/Divider/Divider';
import Table from 'atoms/Table/Table';
import TableItem from 'atoms/Table/TableItem';
import Text from 'atoms/Text/Text';
import { AnchorLink } from 'components/common';
import { FunnelQuoteType, Maybe } from 'generated/graphql';
import { useTranslationWithContext } from 'hooks';
import { isEmpty } from 'lodash';
import React from 'react';
import { isCoaching } from 'util/globalHelpers';
import './ProviderDetailFees.scss';
import Section from 'atoms/Section/Section';
import ModuleGroup from 'atoms/ModuleGroup';
import Module from 'atoms/Module/Module';

interface Props {
    anchorId?: string;
    title?: string;
    pricings: {
        title: string;
        duration?: string;
        price: string;
        discountPrice?: string;
        isFree: boolean;
    }[];
    quoteType: FunnelQuoteType;
    variant?: 'modal' | null;
    maxAmount?: Maybe<number>;
    noInsuranceCovered?: boolean;
}

const ProviderDetailFees: React.FC<Props> = ({
    anchorId,
    title,
    pricings,
    quoteType,
    variant,
    maxAmount,
    noInsuranceCovered,
}) => {
    const { translate } = useTranslationWithContext();
    if (isEmpty(pricings)) return <></>;

    return (
        <div className="ProviderDetailContentModule" id={anchorId}>
            <Section spacingTop="xxs">
                <ModuleGroup title={title || undefined}>
                    <Module
                        padding={variant === 'modal' ? 's' : 'm'}
                        variant={variant}
                    >
                        <Table>
                            {pricings.map((element, index) => {
                                return (
                                    <TableItem key={index}>
                                        <strong className="flex-hero">
                                            {element.title}
                                        </strong>
                                        <span className="flex-subs ProviderDetailFees--duration">
                                            {element.duration}
                                        </span>
                                        <span
                                            className={`flex-subs ProviderDetailFees--priceWrapper ${
                                                !noInsuranceCovered &&
                                                element.isFree
                                                    ? 'strikethrough'
                                                    : ''
                                            }`}
                                        >
                                            <span>{element.price}</span>{' '}
                                            {!noInsuranceCovered &&
                                                element.discountPrice && (
                                                    <strong className="theme-purple">
                                                        {element.discountPrice}
                                                    </strong>
                                                )}
                                        </span>
                                    </TableItem>
                                );
                            })}
                        </Table>
                        {!noInsuranceCovered && maxAmount ? (
                            <Text theme="purple" size="s">
                                <strong>
                                    {translate({
                                        key: 'providerContent.generic.insurance.note',
                                        context: {
                                            amount: maxAmount,
                                        },
                                    })}
                                </strong>
                            </Text>
                        ) : (
                            <></>
                        )}

                        {isCoaching(quoteType) && (
                            <>
                                <Divider spacing="xxs" invisible />

                                <Text size="s">
                                    {translate(
                                        'providerContent.generic.free.intro.available'
                                    )}
                                </Text>
                            </>
                        )}

                        {!isCoaching(quoteType) && !noInsuranceCovered && (
                            <>
                                <Divider spacing="xxs" invisible />
                                <Text size="s">
                                    {translate(
                                        'providerContent.generic.basic.insurance.no.covered'
                                    )}
                                </Text>
                            </>
                        )}

                        <Divider spacing="xxs" invisible />
                        {variant !== 'modal' && (
                            <AnchorLink href="#book">
                                {isCoaching(quoteType)
                                    ? translate(
                                          'providerContent.generic.bookSession.label'
                                      )
                                    : translate(
                                          'providerContent.generic.bookInfoCall.label'
                                      )}
                            </AnchorLink>
                        )}
                    </Module>
                </ModuleGroup>
            </Section>
        </div>
    );
};

export default ProviderDetailFees;
