import { Button } from "@chakra-ui/react";
import { useBoolean } from "@chakra-ui/hooks";
import {
  format,
  differenceInDays,
  intervalToDuration,
  formatDuration,
} from "date-fns";
import { useRouter } from "next/router";
import { stopTraining } from "@/services/axiosInstance";

export interface TrainingItemInterface {
  id: number;
  startDateTime: Date;
  endDateTime: Date;
}

export default function TrainingItem(
  props: TrainingItemInterface & { reloadItems: () => void }
) {
  const router = useRouter();
  const [loading, setLoading] = useBoolean();

  const start: Date = new Date(props.startDateTime);
  const end: Date | null = props.endDateTime
    ? new Date(props.endDateTime)
    : null;
  const active = !end;

  // TODO: Add Icons for records
  // TODO: Add delete and edit button
  // TODO: Handle mutliple days differently
  // TODO: Highlight Trainings which are not completed. And add complete-Button to them

  const getStartDateString = (): string => {
    return format(start, "eeee, MMM do yyyy");
  };

  const getDurationString = (): string => {
    if (!end) return "";

    let d = intervalToDuration({
      start: start,
      end: end,
    });

    return formatDuration(d, { format: ["hours", "minutes"] });
  };

  const getTimeFromTo = (): string => {
    if (!end) {
      return format(start, "HH:mm");
    }
    if (differenceInDays(end, start) > 1) {
      return (
        format(start, "HH:mm") +
        " to " +
        format(end, "HH:mm '(different day: ' dd.MM.yyyy')'")
      );
    }
    return format(start, "HH:mm") + " to " + format(end, "HH:mm");
  };

  const onClick = () => {
    console.log("Clicked on TrainingItem"); // TODO: Remove this
    router.push("trainings/" + props.id);
  };

  const stopThisTraining = (e: React.MouseEvent<any>) => {
    setLoading.on();
    e.stopPropagation();
    stopTraining(props.id).then(() => props.reloadItems());
    setLoading.off();
  };

  return (
      <div
        onClick={onClick}
        className={
          "flex justify-center w-5/6 border-4 border-accent-muted px-16 py-4 rounded-xl hover:cursor-pointer hover:shadow-lg hover:border-accent"
        }
      >
        <div className={"flex justify-between w-full"}>
          <div className="flex">
            <div
              className={
                "relative -left-4 w-2 rounded-md " +
                (active ? "bg-primary" : "bg-accent")
              }
            ></div>
            <div className={"flex flex-col"}>
              <div className={"flex items-center pb-1"}>
                <h2 className={"font-bold pr-10"}>{getStartDateString()}</h2>
                <h2>{getDurationString()}</h2>
              </div>
              <div className="pb-6">
                <div>{getTimeFromTo()}</div>
              </div>
              <div>Icons for records</div>
            </div>
          </div>

          <div className={"flex flex-col justify-around"}>
            {active ? (
              // ! This button doesnt work yet
              <Button
                className={
                  "py-2 px-4 rounded bg-abort hover:bg-abort-muted font-medium"
                }
                css={
                  "py-2 px-4 rounded bg-abort hover:bg-abort-muted font-medium"
                }
                onClick={stopThisTraining}
                disabled={loading}
              >
                Stop this training
              </Button>
            ) : (
              <></>
            )}
          </div>
        </div>
      </div>
  );
}
