import { Box } from '@mui/material';
import Icon, { IconCheck, IconClose, IconDot } from 'atoms/Icon';
import Text from 'atoms/Text/Text';
import { InsuranceCoverageConditionOutputType } from 'generated/graphql';
import { useMemo } from 'react';

interface Props {
    output?: InsuranceCoverageConditionOutputType;
    text: string;
}

const ProviderInsuranceCheckerResultDetail: React.FC<Props> = ({
    output = InsuranceCoverageConditionOutputType.Unsure,
    text,
}) => {
    const { iconProps, textProps }: { iconProps: any; textProps: any } =
        useMemo(() => {
            switch (output) {
                case InsuranceCoverageConditionOutputType.Passed:
                    return {
                        iconProps: {
                            theme: 'success',
                            icon: <IconCheck />,
                        },
                        textProps: {
                            theme: 'dark',
                        },
                    };
                case InsuranceCoverageConditionOutputType.Failed:
                    return {
                        iconProps: {
                            theme: 'danger',
                            icon: <IconClose />,
                        },
                        textProps: {
                            theme: 'danger',
                        },
                    };
                case InsuranceCoverageConditionOutputType.NotChecked:
                    return {
                        iconProps: {
                            theme: 'grey-out',
                            icon: <IconDot />,
                        },
                        textProps: {
                            theme: 'grey-out',
                        },
                    };
                case InsuranceCoverageConditionOutputType.Unsure:
                default:
                    return {
                        iconProps: {
                            theme: 'dark',
                            icon: <IconDot />,
                        },
                        textProps: {
                            theme: 'dark',
                        },
                    };
            }
        }, [output]);
    return (
        <Box display="flex" alignItems="center">
            <Box sx={{ mr: 1 }}>
                <Icon size="xxs" {...iconProps} />
            </Box>

            <Text size="xs" {...textProps}>
                {text}
            </Text>
        </Box>
    );
};
export default ProviderInsuranceCheckerResultDetail;
