import { Box, Grid } from '@mui/material';
import GetStartedStep1 from 'assets/img/01-step1.mp4';
import GetStartedStep2 from 'assets/img/02-step2.mp4';
import GetStartedStep3 from 'assets/img/03-step3.mp4';
import GetStartedStep4 from 'assets/img/04-step4.mp4';
import Section from 'atoms/Section/Section';
import TitleGroup from 'atoms/TitleGroup/TitleGroup';
import { useTranslationWithContext } from 'hooks';
import React from 'react';
import { TranslationKey } from 'translation';
import Button from '../../atoms/Button/Button';
import Module from '../../atoms/Module/Module';
import Text from '../../atoms/Text/Text';
import Title from '../../atoms/Title/Title';

import './GetStartedSteps.scss';

type StepType = {
    title: TranslationKey;
    text: TranslationKey;
    button?: TranslationKey;
    videoUrl: string;
    href?: string;
};

interface Props {
    matchUrl: string;
}

const GetStartedSteps: React.FC<Props> = ({ matchUrl }) => {
    const { translate } = useTranslationWithContext();
    const steps: StepType[] = [
        {
            title: 'get.started.step.one.title',
            text: 'get.started.step.one.subtitle',
            button: 'generic.getStarted',
            videoUrl: GetStartedStep1,
            href: matchUrl,
        },
        {
            title: 'get.started.step.two.title',
            text: 'get.started.step.two.subtitle',
            videoUrl: GetStartedStep2,
        },
        {
            title: 'get.started.step.three.title',
            text: 'get.started.step.three.subtitle',
            videoUrl: GetStartedStep3,
        },
        {
            title: 'get.started.step.four.title',
            text: 'get.started.step.four.subtitle',
            videoUrl: GetStartedStep4,
        },
    ];
    return (
        <>
            <Section container="large" spacingTop="m">
                <TitleGroup
                    title={translate('get.started.section.title')}
                    subtitle={translate('get.started.section.subtitle')}
                    align="desktopCenter"
                />
            </Section>
            <Section container="short">
                <div className="GetStartedSteps">
                    <Grid container spacing={4}>
                        {steps.map((item: any, index: number) => (
                            <Grid item xs={12} sm={6} key={index}>
                                <div
                                    className={`GetStartedSteps--card card-${
                                        index + 1
                                    }`}
                                >
                                    <div className="GetStartedSteps--title">
                                        <Title
                                            theme="grey"
                                            size="giant"
                                            tag="span"
                                            font="alt"
                                        >
                                            {index + 1}
                                        </Title>
                                    </div>
                                    <Module radius="giant">
                                        <Box
                                            display="flex"
                                            justifyContent="center"
                                            sx={{ mb: 3 }}
                                        >
                                            <div className="GetStartedSteps--video">
                                                <video
                                                    playsInline
                                                    autoPlay
                                                    muted
                                                    loop
                                                >
                                                    <source
                                                        src={item.videoUrl}
                                                        type="video/mp4"
                                                    />
                                                </video>
                                            </div>
                                        </Box>

                                        <div style={{ textAlign: 'center' }}>
                                            <Title size="m" tag="span">
                                                {translate(item.title)}
                                            </Title>
                                            <Text size="m" tag="span">
                                                {translate(item.text)}
                                            </Text>
                                        </div>

                                        {item.button && (
                                            <a href={item.href}>
                                                <Button
                                                    variant="naked"
                                                    align="center"
                                                    label={translate(
                                                        item.button
                                                    )}
                                                />
                                            </a>
                                        )}
                                    </Module>
                                </div>
                            </Grid>
                        ))}
                    </Grid>
                </div>
            </Section>
        </>
    );
};

export default GetStartedSteps;
