import { getPollutions } from "@/actions/pollutionsActions"
import PollutionLogics from "./PollutionLogics"
import { PollutionType } from "@/types";
import { getRfcFactors } from "@/actions/rfcFactorsActions";


const Pollutions = async () => {
    const pollutionsArray = await getPollutions();
    const rfcFactors = await getRfcFactors();

    const rfcFactorsNames = rfcFactors.map(rfcFactor => rfcFactor.name)

    const pollutionsWithRfcFactors = pollutionsArray.map(pollution => ({
        ...pollution,
        pollutant_name: rfcFactors.find((rfcFactor) => rfcFactor.id === pollution.pollutant_id)?.name
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