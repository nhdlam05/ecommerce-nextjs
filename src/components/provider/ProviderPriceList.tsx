import { Box, Grid } from '@mui/material';
import Icon, { IconCheck } from 'atoms/Icon';
import Module from 'atoms/Module/Module';
import ModuleGroup from 'atoms/ModuleGroup';
import Section from 'atoms/Section/Section';
import Typography from 'atoms/Typography';
import { useTranslationWithContext } from 'hooks';
import './ProviderPriceList.scss';

const PLANS = [
    {
        title: 'provider.price.list.first.plan',
        requirements: [
            {
                label: 'psychotherapist',
                required: true,
            },
            {
                label: 'cantonal.licence',
                required: true,
            },
            {
                label: 'practice.location',
                required: true,
            },
        ],
    },
    {
        title: 'provider.price.list.second.plan',
        requirements: [
            {
                label: 'other.case',
                required: true,
            },
        ],
    },
];

const ProviderPriceList = () => {
    const { translate } = useTranslationWithContext();

    return (
        <div className="ProviderPriceList">
            <ModuleGroup
                title={translate('provider.price.list.title')}
                subtitle={translate('provider.price.list.subtitle')}
            >
                <Grid container spacing={4}>
                    {PLANS.map((item) => (
                        <Grid item xs={12} sm={12} md={6}>
                            <Module
                                padding="s"
                                radius="xl"
                                highlightedShort
                                className="ProviderPriceList--block"
                            >
                                <div>
                                    <Typography variant="h4">
                                        {translate(item.title)}
                                    </Typography>
                                    <Section spacingTop="xs" spacingBottom="s">
                                        <Section spacingBottom="xs">
                                            <Typography
                                                variant="body2"
                                                text="secondary"
                                            >
                                                {translate(
                                                    'provider.price.list.if.you.have'
                                                )}
                                            </Typography>
                                        </Section>
                                        {item.requirements.map((r) => (
                                            <Section spacingBottom="xs">
                                                <Box
                                                    display="flex"
                                                    alignItems="center"
                                                    sx={{
                                                        opacity: r.required
                                                            ? 1
                                                            : 0.3,
                                                    }}
                                                >
                                                    <Box sx={{ mr: 2 }}>
                                                        <Icon
                                                            size="xs"
                                                            icon={<IconCheck />}
                                                            theme="success"
                                                        />
                                                    </Box>

                                                    <Typography variant="body1">
                                                        {translate(
                                                            `provider.price.list.${r.label}`
                                                        )}
                                                    </Typography>
                                                </Box>
                                            </Section>
                                        ))}
                                    </Section>
                                </div>
                                <Grid container spacing={2}>
                                    <Grid item xs={6}>
                                        <div className="ProviderPriceList--offering">
                                            <Typography variant="h4">
                                                +0%
                                            </Typography>
                                            <Section spacingTop="m">
                                                <Typography text="secondary">
                                                    {translate(
                                                        'provider.price.list.offering.therapy'
                                                    )}
                                                </Typography>
                                            </Section>
                                        </div>
                                    </Grid>
                                    <Grid item xs={6}>
                                        <div className="ProviderPriceList--offering">
                                            <Typography variant="h4">
                                                +4%
                                            </Typography>
                                            <Section spacingTop="m">
                                                <Typography text="secondary">
                                                    {translate(
                                                        'provider.price.list.offering.other'
                                                    )}
                                                </Typography>
                                            </Section>
                                        </div>
                                    </Grid>
                                </Grid>
                            </Module>
                        </Grid>
                    ))}
                </Grid>
            </ModuleGroup>
            <Section spacingTop="m">
                <Typography text="secondary">
                    {translate('provider.price.list.note1')}
                </Typography>
                <Typography text="secondary">
                    {translate('provider.price.list.note2')}
                </Typography>
            </Section>
        </div>
    );
};

export default ProviderPriceList;
