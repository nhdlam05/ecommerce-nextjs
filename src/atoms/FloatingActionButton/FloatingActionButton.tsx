import { IonFab, IonFabButton } from '@ionic/react';
import React from 'react';
import './FloatingActionButton.scss';

interface Props {
    icon: React.ReactNode;
    onClick: () => void;
}

const FloatingActionButton: React.FC<Props> = ({ icon, onClick }) => {
    const className = ['FloatingActionButton']
        .join(' ')
        .replace(/\s{2,}/g, ' ');

    return (
        <div className={className}>
            {/*-- fab placed to the (vertical) center and start --*/}
            <IonFab vertical="bottom" horizontal="end" slot="fixed">
                <IonFabButton onClick={onClick}>{icon}</IonFabButton>
            </IonFab>
        </div>
    );
};

export default FloatingActionButton;
