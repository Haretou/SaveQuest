export interface StepConfig {
    id: string;
    title: string;
    placeholder: string;
    key: string;
    keyboardType?: string;
    autoCapitalize?: string;
    secure?: boolean;
    prefix?: string;
    suffix?: string;
    optional?: boolean;
}

export const REGISTER_STEPS: StepConfig[] = [
    { id: "email", title: "Quelle est votre adresse email ?", placeholder: "exemple@email.com", key: "email", keyboardType: "email-address", autoCapitalize: "none" },
    { id: "password", title: "Créez un mot de passe", placeholder: "•••••••••••", key: "password", secure: true },
    { id: "confirmPassword", title: "Confirmez votre mot de passe", placeholder: "•••••••••••", key: "confirmPassword", secure: true },
    { id: "username", title: "Choisissez un nom d'utilisateur", placeholder: "utilisateur", key: "username", prefix: "@", autoCapitalize: "none" },
    { id: "firstname", title: "Quel est votre prénom ?", placeholder: "Prénom", key: "firstName" },
    { id: "lastname", title: "Quel est votre nom ?", placeholder: "Nom de famille", key: "lastName" },
    { id: "age", title: "Quel âge avez-vous ?", placeholder: "25", key: "age", keyboardType: "numeric", optional: true },
    { id: "city", title: "Où habitez-vous ?", placeholder: "Paris", key: "city", optional: true },
    { id: "monthlyIncome", title: "Votre revenu mensuel ?", placeholder: "2500", key: "monthlyIncome", suffix: "€", keyboardType: "numeric", optional: true },
];
