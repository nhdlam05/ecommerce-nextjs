import { IonSkeletonText } from '@ionic/react';
import { Box } from '@mui/material';
import Section from '../Section/Section';
import './Skeleton.scss';

const SkeletonFilterCard = () => {
    return (
        <div className="SkeletonFilterCard">
            <div className="SkeletonFilterCard--wrapper">
                <>
                    {Array.from(Array(4).keys()).map((index) => (
                        <Section spacingBottom="m" key={index}>
                            <IonSkeletonText
                                animated
                                style={{ width: '35%' }}
                            />
                            <Section spacing="xs">
                                <Box display="flex">
                                    {Array.from(Array(4).keys()).map(
                                        (index) => (
                                            <IonSkeletonText
                                                key={index}
                                                animated
                                                className="SkeletonFilterCard--badge"
                                            />
                                        )
                                    )}
                                </Box>
                            </Section>
                        </Section>
                    ))}
                </>
            </div>
        </div>
    );
};

export default SkeletonFilterCard;
