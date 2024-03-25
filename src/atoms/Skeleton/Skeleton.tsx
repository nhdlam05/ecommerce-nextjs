import { IonAvatar, IonItem, IonLabel, IonSkeletonText } from '@ionic/react';
import './Skeleton.scss';

const Skeleton = () => (
    <IonItem>
        <IonAvatar slot="start">
            <IonSkeletonText animated />
        </IonAvatar>
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
    </IonItem>
);

export default Skeleton;
