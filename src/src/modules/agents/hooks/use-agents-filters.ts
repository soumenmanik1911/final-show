import { useQueryStates } from "nuqs"
import { parseAsString } from "nuqs"
import { parseAsInteger } from "nuqs"
import { DEFAULT_PAGE } from "@/constants"



export const useAgentsFilters =()=> {
    return useQueryStates({
        search: parseAsString.withDefault("").withOptions({clearOnDefault: true}),
        page: parseAsInteger.withDefault(DEFAULT_PAGE).withOptions({clearOnDefault: true}),
    })
}