import { defineStore } from 'pinia';

export const useFormStore = defineStore('form', {
    state: () => ({
        forms: [] as Form[],
        currentForm: null as Form | null,
        responses: {} as Record<string, Record<string, number>>,
        formSubmitted: false as boolean,
        errorCode: 0 as Number,
    }),
    actions: {
        resetFormSubmission() {
            this.errorCode = 1;
        },
        async fetchForms(ownerId: number) {
            try {
                const data = await $fetch<Form[]>(`/api/forms`, {
                    headers: {
                        'x-user-id': ownerId.toString(),
                    },
                });
                this.forms = data || [];
                this.currentForm = null;
                return true;
            } catch (error) {
                console.error('Failed to fetch forms:', error);
                return false;
            }
        },

        async submitResponse(
            response: Omit<FormResponse, '_id' | 'created_at'>
        ) {
            try {
                const data = await $fetch('/api/responses', {
                    method: 'POST',
                    body: JSON.stringify(response),
                });
                if (data.success) {
                    this.errorCode = 2;
                }
                return data;
            } catch (error) {
                console.error('Failed to submit response:', error);
            }
        },

        async fetchResponses(formId: string, ownerId: number) {
            try {
                const data = await $fetch(`/api/responses/${formId}`, {
                    headers: {
                        'x-user-id': ownerId.toString(),
                    },
                });
                this.responses = data || {};
                return true;
            } catch (error) {
                console.error('Failed to fetch responses:', error);
                return false;
            }
        },

        async fetchFormById(
            formId: string,
            userId: number,
            owner: boolean = false
        ) {
            if (this.forms.length) {
                this.currentForm =
                    this.forms.find(form => form._id === formId) || null;
                return true;
            }
            try {
                const headers = {
                    'x-user-id': userId.toString(),
                    'x-owner': owner.toString(),
                };
                const data = await $fetch<Form>(`/api/forms/${formId}`, {
                    headers,
                });
                this.currentForm = data || null;
                return 1;
            } catch (error) {
                console.error('Failed to fetch form:', error);
                return error.statusCode;
            }
        },

        async createForm(
            form: Omit<Form, 'owner_id' | '_id' | 'created_at'>,
            ownerId: number
        ) {
            try {
                const data = await $fetch<string>('/api/forms', {
                    method: 'POST',
                    body: JSON.stringify(form),
                    headers: {
                        'x-user-id': ownerId.toString(),
                    },
                });
                this.forms.push({
                    ...form,
                    _id: data,
                    owner_id: ownerId,
                    created_at: new Date().getTime(),
                });
                return data;
            } catch (error) {
                console.error('Failed to create form:', error);
            }
        },

        async updateForm(form: Form, ownerId: number) {
            try {
                const data = await $fetch<Form>(`/api/forms/${form._id}`, {
                    method: 'PUT',
                    body: JSON.stringify(form),
                    headers: {
                        'x-user-id': ownerId.toString(),
                    },
                });
                if (data) {
                    const index = this.forms.findIndex(f => f._id === form._id);
                    if (index !== -1) {
                        this.forms[index] = data;
                    }
                }
            } catch (error) {
                console.error('Failed to update form:', error);
            }
        },

        async deleteForm(formId: string, ownerId: number) {
            try {
                await useFetch(`/api/forms/${formId}`, {
                    method: 'DELETE',
                    headers: {
                        'x-user-id': ownerId.toString(),
                    },
                });
                this.forms = this.forms.filter(form => form._id !== formId);
            } catch (error) {
                console.error('Failed to delete form:', error);
            }
        },

        addElement(element: FormElement) {
            if (this.currentForm) {
                return this.currentForm.elements.push(element) - 1;
            }
        },

        updateElement(elementId: number, element: FormElement) {
            if (this.currentForm) {
                this.currentForm.elements[elementId] = element;
            }
        },

        deleteElement(elementId: number) {
            if (this.currentForm) {
                this.currentForm.elements.splice(elementId, 1);
            }
        },
    },
});
