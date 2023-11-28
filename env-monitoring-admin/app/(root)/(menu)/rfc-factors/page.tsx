import { getRfcFactors } from "@/actions/rfcFactorsActions"
import RfcFactorsLogics from "./RfcFactorsLogics"


const page = async () => {
    const rfcFactors = await getRfcFactors();

    return (
        <RfcFactorsLogics
            rfcFactors={rfcFactors}
        />
    )
}

export default page