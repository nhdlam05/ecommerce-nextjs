import { useMutation } from '@apollo/client';
import InputText from 'atoms/InputText/InputText';
import Section from 'atoms/Section/Section';
import SelectInput from 'atoms/SelectInput/SelectInput';
import { FormContainer } from 'components/form';
import { PASSWORD_MAX_LENGTH } from 'constants/common';
import { BookingFunnelContext } from 'context/bookingFunnel';
import { GET_MY_ACCOUNT, REDEEM_CODE } from 'gql/account';
import { MY_BALANCE } from 'gql/booking';
import { useMyBalance, useRegister, useTranslationWithContext } from 'hooks';
import { useCallback, useContext, useEffect, useMemo } from 'react';
import { getAgeList } from 'util/globalHelpers';
import * as yup from 'yup';
import BookingSessionActionFooter from './BookingSessionActionFooter';

interface Props {
    isLoggedIn?: boolean;
    defaultValues?: Record<string, unknown>;
    onNextButtonClick: VoidFunction;
    onPrivacyClick: VoidFunction;
    isPhoneNumberRequired: boolean;
}

interface BookingSignUpFormData {
    email: string;
    password: string;
    age: string;
    firstName: string;
    lastName: string;
    phoneNumber: string;
}

interface ValidateFormData {
    email?: string | undefined;
    lastName?: string | undefined;
    firstName?: string | undefined;
    password?: string | undefined;
    phoneNumber?: string | undefined;
}

const PHONE_REGEX =
    /^(?:(?:|0{1,2}|\+{0,2}){1,4}(?:|\(0\))|0)([1-9]{2})(\d{3})(\d{3})(\d*)$/;

const BookingAccountForm: React.FC<Props> = ({
    isLoggedIn = false,
    defaultValues = {},
    onNextButtonClick,
    onPrivacyClick,
    isPhoneNumberRequired,
}) => {
    const { translate } = useTranslationWithContext();
    const { contactInfo, setContactInfo } = useContext(BookingFunnelContext);

    const bookingSignupFormSchema: yup.SchemaOf<ValidateFormData> =
        useMemo(() => {
            return yup.object().shape({
                firstName: yup
                    .string()
                    .trim()
                    .required(
                        translate({
                            key: 'error.field.is.required',
                            context: {
                                fieldName: translate('generic.first.name'),
                            },
                        })
                    ),
                lastName: yup
                    .string()
                    .trim()
                    .required(
                        translate({
                            key: 'error.field.is.required',
                            context: {
                                fieldName: translate('generic.last.name'),
                            },
                        })
                    ),
                password: isLoggedIn
                    ? yup.mixed().nullable().notRequired()
                    : yup
                          .string()
                          .min(
                              PASSWORD_MAX_LENGTH,
                              translate(
                                  'signup.inputField.password.error.security'
                              )
                          )
                          .required(
                              translate({
                                  key: 'error.field.is.required',
                                  context: {
                                      fieldName: translate('generic.password'),
                                  },
                              })
                          ),
                email: isLoggedIn
                    ? yup.mixed().nullable().notRequired()
                    : yup
                          .string()
                          .trim()
                          .email(translate('error.email.invalid'))
                          .required(
                              translate({
                                  key: 'error.field.is.required',
                                  context: {
                                      fieldName: translate('generic.email'),
                                  },
                              })
                          ),
                phoneNumber: isPhoneNumberRequired
                    ? yup
                          .mixed()
                          .required(
                              translate({
                                  key: 'error.field.is.required',
                                  context: {
                                      fieldName: translate(
                                          'generic.phoneNumber'
                                      ),
                                  },
                              })
                          )
                          .test(
                              'phone',
                              translate('error.phone.invalid'),
                              (value) =>
                                  Boolean(
                                      value
                                          .replace(/\s/g, '')
                                          .match(PHONE_REGEX)
                                  )
                          )
                    : yup
                          .mixed()
                          .notRequired()
                          .test(
                              'phone',
                              translate('error.phone.invalid'),
                              (value) =>
                                  !value ||
                                  Boolean(
                                      value
                                          .replace(/\s/g, '')
                                          .match(PHONE_REGEX)
                                  )
                          )
                          .nullable(),
            });
        }, [translate, isLoggedIn, isPhoneNumberRequired]);

    const {
        onRegister,
        registerLoading,
        registerSucceed,
        registerErrorMessage,
    } = useRegister();

    const handleSubmit = async (formData: BookingSignUpFormData) => {
        const { email, password, phoneNumber } = formData;
        const phone = phoneNumber ? phoneNumber.replace(/\s/g, '') : '';

        setContactInfo({
            ...contactInfo,
            ...formData,
            phoneNumber: phone,
        });
        if (isLoggedIn) {
            onNextButtonClick();
        } else {
            await onRegister({
                email,
                password,
                firstName: formData.firstName,
                lastName: formData.lastName,
                phoneNumber: phone,
            });
        }
    };

    const [redeemCode] = useMutation(REDEEM_CODE, {
        awaitRefetchQueries: true,
        refetchQueries: [{ query: MY_BALANCE }, { query: GET_MY_ACCOUNT }],
    });

    const { codeStored, cleanStorageCode } = useMyBalance();

    const redeemCodeFromStorage = useCallback(async () => {
        try {
            await redeemCode({ variables: { code: codeStored } });
            cleanStorageCode();
        } catch (e: any) {
            // Sentry.captureException(e);
        }
    }, [codeStored, redeemCode]);

    useEffect(() => {
        // after user register successfully, redeemCode then move to next step
        if (registerSucceed) {
            if (codeStored) redeemCodeFromStorage();
            onNextButtonClick();
        }
    }, [registerSucceed, codeStored, redeemCodeFromStorage]);

    useEffect(() => {
        // existing users redeem code
        if (isLoggedIn && codeStored) {
            redeemCodeFromStorage();
        }
    }, [isLoggedIn, codeStored]);

    return (
        <>
            <FormContainer
                inputs={[
                    {
                        name: 'firstName',
                        ele: (props: any) => (
                            <InputText
                                {...props}
                                label={translate('generic.first.name')}
                            />
                        ),
                        col: 6,
                    },
                    {
                        name: 'lastName',
                        ele: (props: any) => (
                            <InputText
                                {...props}
                                label={translate('generic.last.name')}
                            />
                        ),
                        col: 6,
                    },
                    {
                        name: 'phoneNumber',
                        ele: (props: any) => (
                            <InputText
                                {...props}
                                helperText={
                                    props.helperText ||
                                    translate(
                                        'booking.account.phone.number.placeholder'
                                    )
                                }
                                label={translate(
                                    'booking.account.phone.number.label'
                                )}
                            />
                        ),
                        col: 6,
                    },
                    {
                        name: 'age',
                        ele: (props: any) => (
                            <SelectInput
                                {...props}
                                items={getAgeList()}
                                label={translate('generic.age')}
                                helperText={translate(
                                    'booking.account.age.helper.text'
                                )}
                            />
                        ),
                        col: 6,
                    },
                    {
                        name: 'email',
                        ele: (props: any) => (
                            <InputText
                                {...props}
                                helperText={
                                    props.helperText ||
                                    translate('provider.sign.up.email.hint')
                                }
                                label={translate('generic.email')}
                            />
                        ),
                        col: 6,
                        isHidden: isLoggedIn,
                    },
                    {
                        name: 'password',
                        ele: (props: any) => (
                            <Section spacingBottom="m">
                                <InputText
                                    {...props}
                                    helperText={
                                        props.helperText ||
                                        translate(
                                            'provider.sign.up.password.hint'
                                        )
                                    }
                                    type="password"
                                    label={translate('generic.password')}
                                />
                            </Section>
                        ),
                        col: 6,
                        isHidden: isLoggedIn,
                    },
                ]}
                schema={bookingSignupFormSchema}
                onSubmit={async (formData) => {
                    await handleSubmit(formData);
                }}
                formOption={{
                    defaultValues: {
                        phoneNumber: '',
                        ...defaultValues,
                    },
                }}
                errorMessage={registerErrorMessage}
                actionButton={(props: any) => (
                    <BookingSessionActionFooter
                        {...props}
                        type="submit"
                        isLoading={registerLoading}
                        onMainActionClick={() => {}}
                        onPrivacyClick={onPrivacyClick}
                    />
                )}
            />
        </>
    );
};

export default BookingAccountForm;
