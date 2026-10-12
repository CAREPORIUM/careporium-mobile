export type SignupDraft = {
  fullName: string;
  email: string;
  phoneNumber: string;
  location: string;
  password: string;
};

let draft: SignupDraft | null = null;

export const setSignupDraft = (d: SignupDraft) => {
  draft = d;
};
export const getSignupDraft = () => draft;
export const clearSignupDraft = () => {
  draft = null;
};