import * as Linking from "expo-linking";

/**
 * Retourne l'URL de redirect correcte selon l'environnement :
 * - Dnev / Expo Go  → exp://192.168.x.x:8081/--/confirm <- disfonctionnel pour le moment
 * faut voir pour mettre en dev build mais besoin du developer apple acount
 * - Production     → savequest://confirm
 */
export function getConfirmRedirectUrl(): string {
    const url = Linking.createURL("confirm");
    console.log("[deeplink] redirect URL:", url);
    return url;
}
