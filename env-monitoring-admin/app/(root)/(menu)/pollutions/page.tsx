import { getPollutions } from "@/actions/pollutionsActions"
import PollutionLogics from "./PollutionLogics"
import { PollutionType } from "@/types";
import { getRfcFactors } from "@/actions/rfcFactorsActions";


const Pollutions = async () => {
    const pollutionsArray = await getPollutions();
    const rfcFactors = await getRfcFactors();

    const rfcFactorsNames = rfcFactors.map(rfcFactor => rfcFactor.factor_Name)

    const pollutionsWithRfcFactors = pollutionsArray.map(pollution => ({
        ...pollution,
        rfc_factor_name: rfcFactors.find((rfcFactor) => rfcFactor.id === pollution.rfc_factor_id).factor_Name
    }))


    return (
        <PollutionLogics
            pollutions={pollutionsArray as PollutionType[]}
            pollsWithRfcFactorsNames={pollutionsWithRfcFactors}
            rfcFactorsNames={rfcFactorsNames}
            rfcFactors={rfcFactors}
        />
    )
}

export default Pollutions