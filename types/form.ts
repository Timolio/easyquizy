export interface FormElement {
    id: string;
    type: string;
    title: string;
    description: string;
    required: boolean;
    options: string[];
}

export interface Form {
    _id: string;
    title: string;
    description: string;
    created_at?: number;
    owner_id?: number;
    onetime: boolean;
    open: boolean;
    elements: FormElement[];
}

export interface FormResponse {
    _id?: string;
    form_id: string;
    owner_id: number;
    created_at: number;
    answers: {
        value: string;
    }[];
}
