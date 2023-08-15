import { useRouter } from "next/router";
import { useState } from "react";
import { Plan } from "global-types";
import { CheckIcon } from "@chakra-ui/icons";
import { InputGroup, InputRightAddon, Input } from "@chakra-ui/react";

type NewPlan = Omit<Plan, "id">;

export default function Plan() {
    const router = useRouter();
    const { planId } = router.query;
    const [plan, setPlan] = useState({} as NewPlan);
    const [editName, setEditName] = useState(!plan.name);

    return (
        <div className="flex flex-col items-center gap-8">
            {editName || !plan.name || true ? (
                <div>
                    <InputGroup>
                        <Input type="text" className="focus: input w-full max-w-xs" placeholder="Title" />
                        <InputRightAddon>
                            <button className="">
                                <CheckIcon />
                            </button>
                        </InputRightAddon>
                    </InputGroup>
                </div>
            ) : (
                <h1 className="text-2xl font-bold text-stone-800">{plan.name}</h1>
            )}

            <h1>Plan {planId}</h1>
        </div>
    );
}
