declare module "global-types" {
    interface ExerciseType {
        id?: number;
        name: string;
        bodypart: string;
    }

    interface Set {
        id: number;
        reps: number | string;
        weight: number | string;
        orderNumber: number;
    }

    interface ItemInterface {
        title: string;
        href: string;
        dropdownItems?: ItemInterface[];
        className?: string;
    }
}
