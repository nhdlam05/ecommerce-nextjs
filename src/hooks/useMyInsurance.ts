import { useMutation } from '@apollo/client';
import { UPDATE_MY_INSURANCE_INFO } from 'gql/insurance';
import { useQueryString } from 'use-route-as-state';

const useMyInsurace = () => {
    const [params] = useQueryString();
    const [updateMyInsuranceInfo] = useMutation(UPDATE_MY_INSURANCE_INFO);
    const updateMyInsurance = () => {
        if (params.insuranceCompanyId) {
            updateMyInsuranceInfo({
                variables: {
                    input: {
                        insuranceCompanyId: params.insuranceCompanyId,
                        insurancePackageId: params.packageId,
                    },
                },
            });
        }
    };

    return { updateMyInsurance };
};

export default useMyInsurace;
