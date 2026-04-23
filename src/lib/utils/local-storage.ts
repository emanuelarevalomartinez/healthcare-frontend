
export enum LOCAL_STORAGE {
    TOKEN = "token",
 }


export const getTokenLocalStore = (): boolean => {

    if (typeof window === 'undefined' || typeof localStorage === 'undefined') {
        return false;
      }

    const currentTokenStatus = localStorage.getItem(LOCAL_STORAGE.TOKEN);
   
    if(currentTokenStatus){
      const parseCurrentDarkMode: boolean = JSON.parse(currentTokenStatus);
      return parseCurrentDarkMode;
    } else {
       return false;
    }
 }
 
 export const setTokenLocalStore = (newStatus: string) => {
     localStorage.setItem(LOCAL_STORAGE.TOKEN, newStatus);
 }
 
 export const deleteTokenLocalStorage = () => {
     localStorage.removeItem(LOCAL_STORAGE.TOKEN);
 }