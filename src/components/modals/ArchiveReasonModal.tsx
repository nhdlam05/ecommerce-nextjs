import Button from 'atoms/Button/Button';
import Checkbox from 'atoms/Checkbox/Checkbox';
import {
    DialogContent,
    DialogFooterWithKeyboard,
    DialogFullHeader,
} from 'atoms/Dialog';
import HeroIcon from 'atoms/HeroIcon/HeroIcon';
import Section from 'atoms/Section/Section';
import SingleCheckbox from 'atoms/SingleCheckbox/SingleCheckbox';
import Text from 'atoms/Text/Text';
import Textarea from 'atoms/Textarea/Textarea';
import Title from 'atoms/Title/Title';
import { FormContainer } from 'components/form';
import { ARCHIVE_REASONS } from 'constants/common';
import {
    CustomerStatus,
    ProviderUserStatus,
    UserFullInfo,
} from 'generated/graphql';
import { useTranslationWithContext } from 'hooks';
import { ArchiveReason } from 'hooks/useArchive';
import { Optional } from 'model/common';
import { buildUserName } from 'model/user';
import { useMemo, useRef, useState } from 'react';
import { Trans } from 'react-i18next';
import * as yup from 'yup';

const INTRO_SESSION_REASONS: ArchiveReason[] = [
    {
        id: 1,
        value: 'Intro hat nicht stattgefunden (Klient/in war nicht verfügbar)',
        label: 'archive.reason.intro.session.question1',
    },
    {
        id: 2,
        value: 'Dachte Versicherung übernimmt mehr der Kosten / war zu teuer',
        label: 'archive.reason.intro.session.question2',
    },
    {
        id: 3,
        value: 'Methode / Behandlung passte nicht zum Anliegen',
        label: 'archive.reason.intro.session.question3',
    },
    {
        id: 4,
        value: 'Chemie hat nicht gestimmt',
        label: 'archive.reason.intro.session.question4',
    },
    {
        id: 5,
        value: 'Terminangebot hat nicht gepasst (z.B. Wartezeit zu lange)',
        label: 'archive.reason.intro.session.question5',
    },
    {
        id: 6,
        value: 'other',
        label: 'archive.reason.question3',
    },
];

interface Props {
    onMoveCustomerToBaseInsuranceDone: VoidFunction;
    onMoveCustomerToBaseInsurance: VoidFunction;
    onSubmit: (input: any) => void;
    onClose: VoidFunction;
    providerUserStatus?: Optional<ProviderUserStatus>;
    user: UserFullInfo;
}

enum VIEW {
    REASON = 'REASON',
    BASE_INSURANCE_CONFIRM = 'BASE_INSURANCE_CONFIRM',
    BASE_INSURANCE_SUCCESS = 'BASE_INSURANCE_SUCCESS',
}

const ArchiveReasonModal: React.FC<Props> = ({
    onMoveCustomerToBaseInsuranceDone,
    onMoveCustomerToBaseInsurance,
    onSubmit,
    onClose,
    providerUserStatus,
    user,
}) => {
    const userStatus = providerUserStatus?.status;
    const mainContentRef = useRef<HTMLIonContentElement | null>(null);
    const archivedReasons =
        userStatus && userStatus === CustomerStatus.InIntroSession
            ? INTRO_SESSION_REASONS
            : ARCHIVE_REASONS;
    const { translate } = useTranslationWithContext();

    const [reasons, setReasons] = useState<string[]>([]);
    const [view, setView] = useState<VIEW>(VIEW.REASON);
    const [baseInsuranceAgree, setBaseInsuranceAgree] = useState(false);
    const [baseInsuranceShown, setBaseInsuranceShown] = useState(false);
    const [additionalReasonInputShown, setAdditionalReasonInputShown] =
        useState(false);

    const formSchema: yup.SchemaOf<{ additionalReason: string }> = useMemo(
        () =>
            yup.object().shape({
                additionalReason: additionalReasonInputShown
                    ? yup
                          .string()
                          .trim()
                          .nullable()
                          .required(
                              translate({
                                  key: 'error.field.is.required',
                                  context: {
                                      fieldName: translate(
                                          'generic.personal.message'
                                      ),
                                  },
                              })
                          )
                    : yup.mixed().nullable().notRequired(),
            }),
        [translate, additionalReasonInputShown]
    );

    const onReasonChange = (e: any, reason: any) => {
        const {
            target: { checked },
        } = e;

        if (reason.value === 'other') {
            setAdditionalReasonInputShown(checked);
        }

        if (checked) {
            setReasons(reasons.concat(reason.value));
        } else {
            setReasons(reasons.filter((item: any) => item !== reason.value));
        }
    };

    const onBaseInsuranceChecked = (e: any) => {
        const {
            target: { checked },
        } = e;
        setBaseInsuranceShown(checked);
        if (checked) {
            setReasons([]);
            setAdditionalReasonInputShown(false);
        }
    };

    const handleClick = ({
        additionalReason,
    }: {
        additionalReason: string;
    }) => {
        if (baseInsuranceShown) {
            setView(VIEW.BASE_INSURANCE_CONFIRM);
        } else {
            onSubmit({
                reasons: reasons,
                additionalReason: reasons.includes('other')
                    ? additionalReason
                    : '',
            });
        }
    };

    const backToReasonView = () => setView(VIEW.REASON);

    const baseInsuranceAgreeChange = (e: any) =>
        setBaseInsuranceAgree(e.target.checked);

    const handleBaseInsuranceClick = () => {
        onMoveCustomerToBaseInsurance();
        setView(VIEW.BASE_INSURANCE_SUCCESS);
    };

    return (
        <>
            <DialogFullHeader
                title={translate(
                    view === VIEW.REASON
                        ? 'archive.client.title'
                        : 'base.insurance.title'
                )}
                onCloseButtonClick={onClose}
                onBackButtonClick={
                    view === VIEW.BASE_INSURANCE_CONFIRM
                        ? backToReasonView
                        : undefined
                }
            />

            <DialogContent ref={mainContentRef}>
                {view === VIEW.REASON && (
                    <Section
                        spacing="m"
                        className={`ArchiveReasonModal ${
                            view === VIEW.REASON ? 'is-shown' : ''
                        } `}
                    >
                        <FormContainer
                            inputs={[
                                {
                                    name: 'reasons',
                                    plainEle: (
                                        <>
                                            <Section spacingBottom="s">
                                                <Title size="m" noMargin>
                                                    {translate(
                                                        userStatus !==
                                                            CustomerStatus.InIntroSession
                                                            ? 'archive.client.reasons.modal.header'
                                                            : 'archive.client.intro.phase.reasons.title'
                                                    )}
                                                </Title>
                                                {userStatus ===
                                                    CustomerStatus.InIntroSession && (
                                                    <Text size="s">
                                                        {translate(
                                                            'archive.client.intro.phase.reasons.subtitle'
                                                        )}
                                                    </Text>
                                                )}
                                            </Section>
                                            {archivedReasons.map(
                                                (reason: any) => (
                                                    <Checkbox
                                                        variant="tile"
                                                        align="left"
                                                        fullsize
                                                        id={reason.id}
                                                        value={reason.value}
                                                        checked={reasons.includes(
                                                            reason.value
                                                        )}
                                                        type="checkbox"
                                                        name={reason.id}
                                                        onClick={(e) =>
                                                            onReasonChange(
                                                                e,
                                                                reason
                                                            )
                                                        }
                                                        disabled={
                                                            baseInsuranceShown
                                                        }
                                                    >
                                                        <strong>
                                                            {translate(
                                                                reason.label
                                                            )}
                                                        </strong>
                                                    </Checkbox>
                                                )
                                            )}
                                        </>
                                    ),
                                },
                                {
                                    name: 'additionalReason',
                                    ele: (props: any) => (
                                        <Textarea
                                            {...props}
                                            placeholder={translate(
                                                'generic.input.placeholder'
                                            )}
                                        />
                                    ),
                                    isHidden: !additionalReasonInputShown,
                                },
                                {
                                    name: 'baseInsurance',
                                    plainEle: (
                                        <>
                                            <Section
                                                spacingTop="m"
                                                spacingBottom="s"
                                            >
                                                <Title size="m" noMargin>
                                                    {translate(
                                                        'archive.client.base.insurance.title'
                                                    )}
                                                </Title>
                                            </Section>
                                            <Checkbox
                                                variant="tile"
                                                align="left"
                                                fullsize
                                                id="baseInsurance"
                                                value={baseInsuranceShown}
                                                checked={baseInsuranceShown}
                                                type="checkbox"
                                                name="baseInsurance"
                                                onClick={onBaseInsuranceChecked}
                                            >
                                                <strong>
                                                    {translate(
                                                        'archive.client.base.insurance.option'
                                                    )}
                                                </strong>
                                            </Checkbox>
                                        </>
                                    ),
                                },
                            ]}
                            spacing={1}
                            onSubmit={handleClick}
                            schema={formSchema}
                            actionButton={(props: any) => (
                                <DialogFooterWithKeyboard
                                    dialogContentRef={mainContentRef}
                                >
                                    <Section spacingBottom="xs">
                                        {baseInsuranceShown ? (
                                            <Button
                                                {...props}
                                                type="submit"
                                                align="center"
                                                label={translate(
                                                    'generic.next'
                                                )}
                                            />
                                        ) : (
                                            <Button
                                                {...props}
                                                type="submit"
                                                align="center"
                                                label={translate(
                                                    'archive.client.title'
                                                )}
                                                disabled={
                                                    !props.isValid ||
                                                    reasons.length === 0
                                                }
                                            />
                                        )}
                                    </Section>
                                    <Button
                                        align="center"
                                        variant="inline"
                                        label={translate('generic.close')}
                                        onClick={onClose}
                                    />
                                </DialogFooterWithKeyboard>
                            )}
                        />

                        <Section spacing="s">
                            <Text align="center" size="xs">
                                {translate(
                                    baseInsuranceShown
                                        ? 'archive.client.base.insurance.note'
                                        : 'archive.client.reasons.modal.subtitle'
                                )}
                            </Text>
                        </Section>
                    </Section>
                )}

                {/* BASE_INSURANCE_CONFIRM */}
                {view === VIEW.BASE_INSURANCE_CONFIRM && (
                    <>
                        <Section spacingTop="s" spacingBottom="s">
                            <Title size="m">
                                {translate('base.insurance.title')}
                            </Title>
                            <Text size="s">
                                {translate('base.insurance.subtitle')}
                            </Text>
                            <Section spacing="s">
                                <Text size="s">
                                    {translate('base.insurance.step1')}
                                </Text>
                                <Text size="s">
                                    {translate('base.insurance.step2')}
                                </Text>
                                <Text size="s">
                                    <Trans
                                        i18nKey={'base.insurance.step3'}
                                        components={{
                                            strikethrough: (
                                                <Title
                                                    size="m"
                                                    theme="soft"
                                                    strikethrough
                                                    tag="span"
                                                    children={<></>}
                                                />
                                            ),
                                            danger: (
                                                <Title
                                                    size="m"
                                                    theme="danger"
                                                    tag="span"
                                                    children={<></>}
                                                />
                                            ),
                                        }}
                                    />
                                </Text>
                            </Section>
                            <SingleCheckbox
                                checked={baseInsuranceAgree}
                                name="baseInsuranceAgree"
                                onChange={baseInsuranceAgreeChange}
                            >
                                {translate('base.insurance.agreement')}
                            </SingleCheckbox>
                        </Section>
                        <DialogFooterWithKeyboard
                            dialogContentRef={mainContentRef}
                        >
                            <Section spacingBottom="xs">
                                <Button
                                    label={translate('base.insurance.cta')}
                                    disabled={!baseInsuranceAgree}
                                    onClick={handleBaseInsuranceClick}
                                />
                            </Section>
                            <Text align="center" size="s">
                                <Trans i18nKey="contact.care.link">
                                    <a href="mailto:care@aepsy.com" />
                                </Trans>
                            </Text>
                        </DialogFooterWithKeyboard>
                    </>
                )}

                {/* BASE_INSURANCE_SUCCESS */}
                {view === VIEW.BASE_INSURANCE_SUCCESS && (
                    <>
                        <Section spacing="s">
                            <HeroIcon theme="success" align="center" size="s">
                                ✅
                            </HeroIcon>
                        </Section>
                        <Title size="m">
                            {translate('base.insurance.success.title')}
                        </Title>
                        <Section spacingBottom="s">
                            <Text size="s">
                                {translate('base.insurance.success.list')}
                            </Text>
                        </Section>
                        <Section spacingBottom="s">
                            <Text size="s">{translate('generic.name')}</Text>
                            <Title size="s">{buildUserName(user)}</Title>
                        </Section>
                        <Section spacingBottom="s">
                            <Text size="s">{translate('generic.email')}</Text>
                            <Title size="s">
                                {user.contactInfo.email || '-'}
                            </Title>
                        </Section>
                        <Section spacingBottom="s">
                            <Text size="s">
                                {translate('generic.phoneNumber')}
                            </Text>
                            <Title size="s">
                                {user.contactInfo.phoneNumber || '-'}
                            </Title>
                        </Section>
                        <DialogFooterWithKeyboard
                            dialogContentRef={mainContentRef}
                        >
                            <Section spacingBottom="xs">
                                <Button
                                    label={translate('generic.close')}
                                    onClick={onMoveCustomerToBaseInsuranceDone}
                                />
                            </Section>
                            <Text align="center" size="s">
                                <Trans i18nKey="contact.care.link">
                                    <a href="mailto:care@aepsy.com" />
                                </Trans>
                            </Text>
                        </DialogFooterWithKeyboard>
                    </>
                )}
            </DialogContent>
        </>
    );
};

export default ArchiveReasonModal;
