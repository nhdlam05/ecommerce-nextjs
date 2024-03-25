import Icon, { IconPaperLess, IconPrescription } from 'atoms/Icon';
import Text from 'atoms/Text/Text';
import Tile from 'atoms/Tile';
import { useTranslationWithContext } from 'hooks';
import { RequireDoctorNoteStatus } from 'util/insuranceCheckerHelpers';

interface Props {
    requireDoctorNoteStatus: RequireDoctorNoteStatus;
}

const DoctorNote: React.FC<Props> = ({ requireDoctorNoteStatus }) => {
    const { translate } = useTranslationWithContext();

    if (requireDoctorNoteStatus === RequireDoctorNoteStatus.Required) {
        return (
            <Tile
                startSlot={<Icon icon={<IconPrescription />} />}
                title={translate('doctor.note.require.title')}
                additionInfo={
                    <Text size="s" tag="span">
                        {translate('doctor.note.require.subtitle')}
                    </Text>
                }
                variant="info"
                noMargin
            />
        );
    }

    if (requireDoctorNoteStatus === RequireDoctorNoteStatus.NotRequired) {
        return (
            <Tile
                startSlot={<Icon icon={<IconPaperLess />} />}
                title={translate('doctor.note.no.require.title')}
                additionInfo={
                    <Text size="s" tag="span">
                        {translate('doctor.note.no.require.subtitle')}
                    </Text>
                }
                variant="info"
                noMargin
            />
        );
    }

    return (
        <Tile
            startSlot={<Icon icon={<IconPrescription />} />}
            title={translate('doctor.note.may.require.title')}
            additionInfo={
                <Text size="s" tag="span">
                    {translate('doctor.note.may.require.subtitle')}
                </Text>
            }
            variant="info"
            noMargin
        />
    );
};

export default DoctorNote;
