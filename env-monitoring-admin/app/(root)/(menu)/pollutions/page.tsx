import { getPollutions } from "@/actions/pollutionsActions"
import PollutionLogics from "./PollutionLogics"
import { PollutionType } from "@/types";


const Pollutions = async () => {
    const pollutionsArray = await getPollutions();

    return (
        <PollutionLogics pollutions={pollutionsArray as PollutionType[]} />
    )
}

export default Pollutions