import { IonAvatar, IonLabel, IonSkeletonText } from '@ionic/react';
import Section from '../Section/Section';
import './Skeleton.scss';

const SkeletonInfoCard = () => (
    <>
        <IonSkeletonText animated style={{ width: '60%' }} />
        <Section spacing="m">
            <div className="g_center g_1_3" style={{ width: 150, height: 150 }}>
                <IonAvatar style={{ width: '100%', height: '100%' }}>
                    <IonSkeletonText animated />
                </IonAvatar>
            </div>
        </Section>
        <h3>
            <IonSkeletonText animated style={{ width: '80%' }} />
        </h3>

        <Section spacing="s">
            <IonLabel>
                <h3>
                    <IonSkeletonText animated style={{ width: '40%' }} />
                </h3>
                <p>
                    <IonSkeletonText animated style={{ width: '100%' }} />
                </p>
                <p>
                    <IonSkeletonText animated style={{ width: '70%' }} />
                </p>
            </IonLabel>
        </Section>
        <IonLabel>
            <h3>
                <IonSkeletonText animated style={{ width: '50%' }} />
            </h3>
            <p>
                <IonSkeletonText animated style={{ width: '80%' }} />
            </p>
            <p>
                <IonSkeletonText animated style={{ width: '60%' }} />
            </p>
        </IonLabel>
    </>
);

export default SkeletonInfoCard;
