import Divider from 'atoms/Divider/Divider';
import MarkdownText from 'atoms/MarkdownText';

const generatePromoteVoucherModalContent = (amount: number) => `
So funktioniert's:

1. Psycholog:in wählen 
2. Intro / 30min Erstsitzung buchen
3. CHF ${amount} Gutschein wird bei nächster Bezahlung abgezogen*


*Einlösung des Gutscheins nur für den Empfänger dieser Seite, nicht für Psychotherapien mit Krankheitswert / Diagnose einlösbar. Kann nicht mit anderen Aktionen kombiniert werden. Keine Auszahlungen.
`;

const PromoteVoucherModal: React.FC<{ amount: number }> = ({ amount }) => {
    return (
        <>
            <Divider spacing="xs" invisible />
            <MarkdownText
                content={generatePromoteVoucherModalContent(amount)}
            />
        </>
    );
};

export default PromoteVoucherModal;
