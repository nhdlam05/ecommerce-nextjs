import Module from 'atoms/Module/Module';
import ModuleGroup from 'atoms/ModuleGroup';
import Section from 'atoms/Section/Section';
import { InteractiveBubbleGrowth } from 'components/interactive-motion';
import { Maybe } from 'generated/graphql';
import { useTranslationWithContext } from 'hooks';

export type UserReviewBookingFormData = {
    overallScore: number | null;
    goalScore: number | null;
    relationshipScore: number | null;
    approachScore: number | null;
    comment?: Maybe<string>;
    agreeToProvideFeedback: boolean;
    allowShareOnProviderPage?: Maybe<boolean>;
};

interface Props {
    formData: UserReviewBookingFormData;
    onScoreChange?: (value: number, name: string) => void;
    readOnly?: boolean;
}

const UserReviewBookingForm: React.FC<Props> = ({
    formData,
    onScoreChange,
    readOnly = false,
}) => {
    const { translate } = useTranslationWithContext();

    const handleScoreChange = (value: number, name: string) => {
        onScoreChange && onScoreChange(value, name);
    };

    return (
        <>
            <Section spacingBottom="m">
                <ModuleGroup
                    title={translate('user.review.booking.relationship.title')}
                >
                    <Module
                        highlighted={!readOnly}
                        variant={readOnly ? 'modal' : ''}
                        radius="l"
                    >
                        <InteractiveBubbleGrowth
                            disabled={readOnly}
                            value={formData.relationshipScore}
                            setValue={(value: number) =>
                                handleScoreChange(value, 'relationshipScore')
                            }
                            hideVisual
                            name="relationshipScore"
                            labels={[
                                translate(
                                    'user.review.booking.relationship.min'
                                ),
                                '',
                                '',
                                '',
                                '',
                                translate(
                                    'user.review.booking.relationship.max'
                                ),
                            ]}
                        />
                    </Module>
                </ModuleGroup>
            </Section>

            <Section spacing="m">
                <ModuleGroup
                    title={translate('user.review.booking.goal.title')}
                >
                    <Module
                        highlighted={!readOnly}
                        variant={readOnly ? 'modal' : ''}
                        radius="l"
                    >
                        <InteractiveBubbleGrowth
                            disabled={readOnly}
                            value={formData.goalScore}
                            setValue={(value: number) =>
                                handleScoreChange(value, 'goalScore')
                            }
                            hideVisual
                            name="goalScore"
                            labels={[
                                translate('user.review.booking.goal.min'),
                                '',
                                '',
                                '',
                                '',
                                translate('user.review.booking.goal.max'),
                            ]}
                        />
                    </Module>
                </ModuleGroup>
            </Section>

            <Section spacing="m">
                <ModuleGroup
                    title={translate('user.review.booking.approach.title')}
                >
                    <Module
                        highlighted={!readOnly}
                        variant={readOnly ? 'modal' : ''}
                        radius="l"
                    >
                        <InteractiveBubbleGrowth
                            disabled={readOnly}
                            value={formData.approachScore}
                            setValue={(value: number) =>
                                handleScoreChange(value, 'approachScore')
                            }
                            hideVisual
                            name="approachScore"
                            labels={[
                                translate('user.review.booking.approach.min'),
                                '',
                                '',
                                '',
                                '',
                                translate('user.review.booking.approach.max'),
                            ]}
                        />
                    </Module>
                </ModuleGroup>
            </Section>

            <Section spacing="m">
                <ModuleGroup
                    title={translate('user.review.booking.overall.title')}
                >
                    <Module
                        highlighted={!readOnly}
                        variant={readOnly ? 'modal' : ''}
                        radius="l"
                    >
                        <InteractiveBubbleGrowth
                            disabled={readOnly}
                            value={formData.overallScore}
                            setValue={(value: number) =>
                                handleScoreChange(value, 'overallScore')
                            }
                            hideVisual
                            name="overallScore"
                            labels={[
                                translate('user.review.booking.overall.min'),
                                '',
                                '',
                                '',
                                '',
                                translate('user.review.booking.overall.max'),
                            ]}
                        />
                    </Module>
                </ModuleGroup>
            </Section>
        </>
    );
};

export default UserReviewBookingForm;
